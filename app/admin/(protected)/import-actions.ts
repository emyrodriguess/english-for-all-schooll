"use server";

import { revalidatePath } from "next/cache";
import { parse } from "csv-parse/sync";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";
import {
  importModules,
  type ImportModule,
  type ImportPreview,
} from "@/lib/internal/import-definitions";
import type { Json } from "@/lib/supabase/database.types";

type CsvRecord = Record<string, string>;
type JsonObject = { [key: string]: Json | undefined };
type PreparedRow = ImportPreview["rows"][number] & { normalized: JsonObject };

type ImportPreviewPage = {
  page: number;
  pageSize: number;
  rows: ImportPreview["rows"];
};

function normalizeKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizedRecord(record: CsvRecord) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      normalizeKey(key),
      value.trim(),
    ]),
  );
}

function value(record: CsvRecord, ...aliases: string[]) {
  for (const alias of aliases) if (record[alias]) return record[alias];
  return "";
}

function normalizedStatus(input: string, fallback: string) {
  const status = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  if (!status) return fallback;
  const aliases: Record<string, string> = {
    ativo: "active",
    ativa: "active",
    active: "active",
    inativo: "inactive",
    inativa: "inactive",
    inactive: "inactive",
    cancelado: "cancelled",
    cancelada: "cancelled",
    cancelled: "cancelled",
  };
  return aliases[status] ?? status;
}

function dateValue(input: string) {
  if (!input) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : input;
}

function monthValue(input: string) {
  const date = dateValue(input);
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-01`;
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date.slice(0, 7)}-01` : date;
}

function isValidDate(input: Json | undefined) {
  if (typeof input !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input))
    return false;
  const date = new Date(`${input}T12:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === input
  );
}

function moneyValue(input: string) {
  const clean = input
    .trim()
    .replace(/^R\$\s*/, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(clean);
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size)
    chunks.push(items.slice(index, index + size));
  return chunks;
}

function toPreviewRow({
  normalized,
  ...row
}: PreparedRow): ImportPreview["rows"][number] {
  void normalized;
  return row;
}

function stringRecord(value: Json | null): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, String(item ?? "")]),
  );
}

function stringList(value: Json | null): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export async function getImportPreviewPageAction(
  jobId: string,
  requestedPage: number,
): Promise<ActionState<ImportPreviewPage>> {
  const parsed = z.uuid().safeParse(jobId);
  if (!parsed.success)
    return { status: "error", message: "Importação inválida." };

  const pageSize = 20;
  const page = Math.max(1, Math.floor(requestedPage) || 1);
  try {
    const { supabase } = await requireAdminForAction();
    const { data, error } = await supabase
      .from("import_job_rows")
      .select(
        "row_number,status,raw_data,validation_errors,duplicate_candidates",
      )
      .eq("import_job_id", parsed.data)
      .order("row_number")
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (error) throw error;
    return {
      status: "success",
      data: {
        page,
        pageSize,
        rows: (data ?? []).map((row) => ({
          rowNumber: row.row_number,
          status: row.status === "valid" ? "valid" : "invalid",
          values: stringRecord(row.raw_data),
          errors: stringList(row.validation_errors),
          duplicates: stringList(row.duplicate_candidates),
        })),
      },
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function prepareImportAction(
  module: ImportModule,
  _state: ActionState<ImportPreview>,
  formData: FormData,
): Promise<ActionState<ImportPreview>> {
  if (!importModules.includes(module))
    return { status: "error", message: "Módulo de importação inválido." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { status: "error", message: "Selecione um arquivo CSV." };
  if (file.size > 10 * 1024 * 1024)
    return { status: "error", message: "O CSV deve ter no máximo 10 MB." };
  try {
    const { supabase } = await requireAdminForAction();
    const text = await file.text();
    const records = parse(text, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: false,
    }) as CsvRecord[];
    if (!records.length)
      return { status: "error", message: "O CSV não contém linhas de dados." };
    if (records.length > 10_000)
      return {
        status: "error",
        message: "O limite é de 10 mil linhas por arquivo.",
      };
    const detectedColumns = Object.keys(records[0] ?? {}).map(normalizeKey);

    const [
      { data: existingStudents },
      { data: existingClasses },
      { data: existingContracts },
      { data: existingSlots },
      { data: existingInvoices },
      { data: existingLessons },
    ] = await Promise.all([
      supabase.from("students").select("id,full_name,email,whatsapp,status"),
      supabase.from("classes").select("id,name,status"),
      supabase
        .from("contracts")
        .select("id,student_id,start_date,end_date,status"),
      supabase
        .from("weekly_slots")
        .select("id,weekday,start_time,end_time,active"),
      supabase.from("invoices").select("id,contract_id,reference_month"),
      supabase
        .from("lesson_records")
        .select("id,student_id,class_id,lesson_date,lesson_name"),
    ]);
    const studentsByEmail = new Map(
      (existingStudents ?? [])
        .filter((item) => item.email)
        .map((item) => [item.email!.toLowerCase(), item]),
    );
    const studentsByPhone = new Map(
      (existingStudents ?? []).map((item) => [
        item.whatsapp.replace(/\D/g, ""),
        item,
      ]),
    );
    const classesByName = new Map(
      (existingClasses ?? []).map((item) => [item.name.toLowerCase(), item]),
    );
    const seenStudentEmails = new Set<string>();
    const seenStudentPhones = new Set<string>();
    const seenClassNames = new Set<string>();
    const seenSlotRanges: Array<{
      weekday: number;
      start: string;
      end: string;
    }> = [];
    const seenContractRanges: Array<{
      studentId: string;
      start: string;
      end: string;
    }> = [];
    const seenFinance = new Set<string>();
    const seenLessons = new Set<string>();

    const prepared: PreparedRow[] = records.map((source, index) => {
      const row = normalizedRecord(source);
      const errors: string[] = [];
      const duplicates: string[] = [];
      let normalized: JsonObject = {};
      const email = value(
        row,
        "email",
        "e_mail",
        "student_email",
        "email_aluno",
      ).toLowerCase();
      const phone = value(
        row,
        "whatsapp",
        "telefone",
        "phone",
        "student_whatsapp",
        "whatsapp_aluno",
      ).replace(/\D/g, "");
      const matchedStudent =
        (email && studentsByEmail.get(email)) ||
        (phone && studentsByPhone.get(phone)) ||
        undefined;

      if (module === "students") {
        const fullName = value(row, "full_name", "nome_completo", "nome");
        const whatsapp = value(row, "whatsapp", "telefone", "phone");
        if (fullName.length < 2) errors.push("Nome completo é obrigatório.");
        if (whatsapp.replace(/\D/g, "").length < 8)
          errors.push("WhatsApp é obrigatório.");
        if (email && studentsByEmail.has(email))
          duplicates.push(
            `E-mail já pertence a ${studentsByEmail.get(email)!.full_name}.`,
          );
        if (phone && studentsByPhone.has(phone))
          duplicates.push(
            `WhatsApp já pertence a ${studentsByPhone.get(phone)!.full_name}.`,
          );
        if (email && seenStudentEmails.has(email))
          duplicates.push("E-mail repetido no próprio CSV.");
        if (phone && seenStudentPhones.has(phone))
          duplicates.push("WhatsApp repetido no próprio CSV.");
        if (email) seenStudentEmails.add(email);
        if (phone) seenStudentPhones.add(phone);
        const birthDate = dateValue(
          value(row, "birth_date", "data_nascimento"),
        );
        if (birthDate && !isValidDate(birthDate))
          errors.push("Data de nascimento inválida.");
        const status = normalizedStatus(
          value(row, "status", "status_aluno", "status_do_aluno"),
          "active",
        );
        if (!["active", "inactive", "cancelled"].includes(status))
          errors.push("Status do aluno inválido.");
        normalized = {
          full_name: fullName,
          birth_date: birthDate || null,
          email: email || null,
          whatsapp,
          status,
          administrative_notes:
            value(row, "administrative_notes", "observacoes", "notes") || null,
          origin: "import",
        };
      } else if (module === "classes") {
        const name = value(row, "name", "nome", "turma");
        if (name.length < 2) errors.push("Nome da turma é obrigatório.");
        if (classesByName.has(name.toLowerCase()))
          duplicates.push("Já existe turma com este nome.");
        if (seenClassNames.has(name.toLowerCase()))
          duplicates.push("Turma repetida no próprio CSV.");
        seenClassNames.add(name.toLowerCase());
        const status = value(row, "status") || "active";
        if (!["active", "inactive"].includes(status))
          errors.push("Status da turma inválido.");
        normalized = {
          name,
          status,
          notes: value(row, "notes", "observacoes") || null,
        };
      } else if (module === "contracts") {
        if (!matchedStudent)
          errors.push("Aluno não encontrado por e-mail ou WhatsApp exatos.");
        const amount = moneyValue(
          value(row, "monthly_amount", "valor_mensal", "mensalidade"),
        );
        if (!Number.isFinite(amount) || amount < 0)
          errors.push("Valor mensal inválido.");
        const dueDay = Number(value(row, "due_day", "dia_vencimento"));
        if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31)
          errors.push("Dia de vencimento inválido.");
        const weeklyFrequency = Number(
          value(row, "weekly_frequency", "frequencia_semanal") || 1,
        );
        const startDate = dateValue(value(row, "start_date", "data_inicio"));
        const billingStart = dateValue(
          value(row, "billing_start_date", "primeira_competencia"),
        );
        const endDate = dateValue(value(row, "end_date", "data_fim"));
        if (
          !Number.isInteger(weeklyFrequency) ||
          weeklyFrequency < 1 ||
          weeklyFrequency > 7
        )
          errors.push("Frequência semanal inválida.");
        if (
          !isValidDate(startDate) ||
          !isValidDate(billingStart) ||
          (endDate && !isValidDate(endDate))
        )
          errors.push("Datas do contrato inválidas.");
        if (
          isValidDate(startDate) &&
          isValidDate(billingStart) &&
          billingStart < startDate
        )
          errors.push("A primeira competência não pode preceder o início.");
        if (endDate && isValidDate(startDate) && endDate < startDate)
          errors.push("O término não pode preceder o início.");
        if (matchedStudent && isValidDate(startDate)) {
          const overlaps = (existingContracts ?? []).some(
            (contract) =>
              contract.student_id === matchedStudent.id &&
              contract.status === "active" &&
              contract.start_date <= (endDate || "9999-12-31") &&
              (!contract.end_date || contract.end_date >= startDate),
          );
          if (overlaps)
            duplicates.push(
              "O aluno já possui contrato ativo sobreposto a este período.",
            );
          const csvOverlap = seenContractRanges.some(
            (contract) =>
              contract.studentId === matchedStudent.id &&
              contract.start <= (endDate || "9999-12-31") &&
              contract.end >= startDate,
          );
          if (csvOverlap)
            duplicates.push(
              "Contrato sobreposto para o mesmo aluno no próprio CSV.",
            );
          seenContractRanges.push({
            studentId: matchedStudent.id,
            start: startDate,
            end: endDate || "9999-12-31",
          });
        }
        normalized = {
          student_id: matchedStudent?.id ?? null,
          modality: value(row, "modality", "modalidade"),
          weekly_frequency: weeklyFrequency,
          contract_type:
            value(row, "contract_type", "tipo_contrato") || "personalizado",
          start_date: startDate,
          billing_start_date: billingStart,
          end_date: endDate || null,
          monthly_amount: amount,
          first_invoice_amount: value(
            row,
            "first_invoice_amount",
            "valor_primeira_cobranca",
          )
            ? moneyValue(
                value(row, "first_invoice_amount", "valor_primeira_cobranca"),
              )
            : null,
          due_day: dueDay,
          notes: value(row, "notes", "observacoes") || null,
          origin: "import",
        };
        if (
          !normalized.modality ||
          !normalized.start_date ||
          !normalized.billing_start_date
        )
          errors.push(
            "Modalidade, início e primeira competência são obrigatórios.",
          );
      } else if (module === "schedule") {
        const weekday = Number(value(row, "weekday", "dia_semana"));
        const startTime = value(row, "start_time", "inicio");
        const endTime = value(row, "end_time", "fim");
        const type = value(row, "assignment_type", "tipo_ocupacao");
        const className = value(row, "class_name", "turma");
        const matchedClass = className
          ? classesByName.get(className.toLowerCase())
          : undefined;
        if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7)
          errors.push("Dia da semana deve estar entre 1 e 7.");
        if (
          !/^\d{2}:\d{2}$/.test(startTime) ||
          !/^\d{2}:\d{2}$/.test(endTime) ||
          endTime <= startTime
        )
          errors.push("Intervalo de horário inválido.");
        if (type && !["student", "class"].includes(type))
          errors.push("Tipo de ocupação inválido.");
        if (
          seenSlotRanges.some(
            (slot) =>
              slot.weekday === weekday &&
              startTime < slot.end &&
              endTime > slot.start,
          )
        )
          duplicates.push("Horário repetido ou sobreposto no próprio CSV.");
        seenSlotRanges.push({ weekday, start: startTime, end: endTime });
        if (
          (existingSlots ?? []).some(
            (slot) =>
              slot.active &&
              slot.weekday === weekday &&
              startTime < slot.end_time.slice(0, 5) &&
              endTime > slot.start_time.slice(0, 5),
          )
        )
          duplicates.push(
            "O intervalo conflita com um horário já configurado.",
          );
        if (type === "student" && !matchedStudent)
          errors.push("Aluno da ocupação não encontrado.");
        if (type === "class" && !matchedClass)
          errors.push("Turma da ocupação não encontrada.");
        const scheduleStart = dateValue(
          value(row, "start_date", "data_inicio"),
        );
        const scheduleEnd = dateValue(value(row, "end_date", "data_fim"));
        if (type && !isValidDate(scheduleStart))
          errors.push("Data inicial da ocupação inválida.");
        if (scheduleEnd && !isValidDate(scheduleEnd))
          errors.push("Data final da ocupação inválida.");
        normalized = {
          weekday,
          start_time: startTime,
          end_time: endTime,
          assignment_type: type || null,
          target_id:
            type === "student"
              ? (matchedStudent?.id ?? null)
              : type === "class"
                ? (matchedClass?.id ?? null)
                : null,
          start_date: scheduleStart || null,
          end_date: scheduleEnd || null,
        };
      } else if (module === "finance") {
        if (!matchedStudent)
          errors.push("Aluno não encontrado por e-mail ou WhatsApp exatos.");
        const referenceMonth = monthValue(
          value(row, "reference_month", "competencia"),
        );
        const contract = (existingContracts ?? []).find(
          (item) =>
            item.student_id === matchedStudent?.id &&
            isValidDate(referenceMonth) &&
            item.start_date <= referenceMonth &&
            (!item.end_date || item.end_date >= referenceMonth),
        );
        const amount = moneyValue(value(row, "amount", "valor"));
        const status = value(row, "status") || "pending";
        const paymentDate = dateValue(
          value(row, "payment_date", "data_pagamento"),
        );
        if (!contract)
          errors.push(
            "Aluno não possui contrato ativo para vincular a cobrança.",
          );
        if (!Number.isFinite(amount) || amount < 0)
          errors.push("Valor inválido.");
        if (status === "paid" && !paymentDate)
          errors.push("Cobrança paga exige data de pagamento.");
        if (
          !isValidDate(referenceMonth) ||
          !isValidDate(dateValue(value(row, "due_date", "vencimento")))
        )
          errors.push("Competência ou vencimento inválido.");
        if (paymentDate && !isValidDate(paymentDate))
          errors.push("Data de pagamento inválida.");
        if (!["pending", "overdue", "paid", "cancelled"].includes(status))
          errors.push("Status financeiro inválido.");
        const financeKey = `${contract?.id ?? "none"}:${referenceMonth}`;
        if (
          (existingInvoices ?? []).some(
            (invoice) =>
              invoice.contract_id === contract?.id &&
              invoice.reference_month === referenceMonth,
          ) ||
          seenFinance.has(financeKey)
        )
          duplicates.push(
            "Já existe cobrança para este contrato e competência.",
          );
        seenFinance.add(financeKey);
        normalized = {
          student_id: matchedStudent?.id ?? null,
          contract_id: contract?.id ?? null,
          reference_month: referenceMonth,
          due_date: dateValue(value(row, "due_date", "vencimento")),
          amount,
          status: status === "paid" ? "pending" : status,
          payment_date: paymentDate || null,
          notes: value(row, "notes", "observacoes") || null,
          origin: "import",
        };
        if (!normalized.reference_month || !normalized.due_date)
          errors.push("Competência e vencimento são obrigatórios.");
      } else {
        const className = value(row, "class_name", "turma");
        const matchedClass = className
          ? classesByName.get(className.toLowerCase())
          : undefined;
        if (!matchedStudent && !matchedClass)
          errors.push(
            "Informe um aluno ou turma existente por correspondência exata.",
          );
        if (matchedStudent && matchedClass)
          errors.push(
            "A linha deve pertencer a um aluno ou a uma turma, não aos dois.",
          );
        const lessonDate = dateValue(value(row, "lesson_date", "data_aula"));
        const lessonName = value(row, "lesson_name", "nome_aula", "tipo");
        if (!isValidDate(lessonDate)) errors.push("Data da aula inválida.");
        const lessonKey = `${matchedStudent?.id ?? matchedClass?.id ?? "none"}:${lessonDate}:${lessonName.toLowerCase()}`;
        if (
          (existingLessons ?? []).some(
            (lesson) =>
              lesson.lesson_date === lessonDate &&
              (lesson.student_id === matchedStudent?.id ||
                lesson.class_id === matchedClass?.id) &&
              (lesson.lesson_name ?? "").toLowerCase() ===
                lessonName.toLowerCase(),
          ) ||
          seenLessons.has(lessonKey)
        )
          duplicates.push("Registro pedagógico possivelmente duplicado.");
        seenLessons.add(lessonKey);
        normalized = {
          lesson_date: lessonDate,
          student_id: matchedStudent?.id ?? null,
          class_id: matchedClass?.id ?? null,
          lesson_name: lessonName,
          content: value(row, "content", "conteudo") || null,
          observations: value(row, "observations", "observacoes") || null,
          lesson_report: value(row, "lesson_report", "relatorio") || null,
          homework: value(row, "homework", "tarefa") || null,
          origin: "import",
        };
        if (!normalized.lesson_date || !normalized.lesson_name)
          errors.push("Data e nome da aula são obrigatórios.");
      }
      return {
        rowNumber: index + 1,
        status: errors.length || duplicates.length ? "invalid" : "valid",
        values: row,
        normalized,
        errors,
        duplicates,
      };
    });

    const validRows = prepared.filter((row) => row.status === "valid").length;
    const invalidRows = prepared.length - validRows;
    const { data: job, error: jobError } = await supabase
      .from("import_jobs")
      .insert({
        module,
        file_name: file.name,
        status: "processing",
        total_rows: prepared.length,
        valid_rows: validRows,
        invalid_rows: invalidRows,
      })
      .select("id")
      .single();
    if (jobError) throw jobError;
    const storageKey = `${module}/${job.id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("imports")
      .upload(storageKey, file, { contentType: "text/csv", upsert: false });
    if (uploadError) {
      await supabase
        .from("import_jobs")
        .update({ status: "failed" })
        .eq("id", job.id);
      throw uploadError;
    }
    for (const rows of chunk(prepared, 500)) {
      const { error } = await supabase.from("import_job_rows").insert(
        rows.map((row) => ({
          import_job_id: job.id,
          row_number: row.rowNumber,
          status: row.status,
          raw_data: row.values,
          normalized_data: row.normalized,
          validation_errors: row.errors,
          duplicate_candidates: row.duplicates,
        })),
      );
      if (error) throw error;
    }
    await supabase
      .from("import_jobs")
      .update({ status: "awaiting_confirmation", storage_key: storageKey })
      .eq("id", job.id);
    return {
      status: "success",
      message: invalidRows
        ? "Prévia pronta. Corrija as linhas inválidas antes de uma nova tentativa; somente válidas podem ser confirmadas."
        : "Prévia pronta para confirmação.",
      data: {
        jobId: job.id,
        fileName: file.name,
        module,
        totalRows: prepared.length,
        validRows,
        invalidRows,
        detectedColumns,
        rows: prepared.slice(0, 20).map(toPreviewRow),
      },
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

async function loadAllValidRows(
  supabase: Awaited<ReturnType<typeof requireAdminForAction>>["supabase"],
  jobId: string,
) {
  const all: Array<{ id: string; normalized_data: Json }> = [];
  for (let start = 0; ; start += 1000) {
    const { data, error } = await supabase
      .from("import_job_rows")
      .select("id,normalized_data")
      .eq("import_job_id", jobId)
      .eq("status", "valid")
      .order("row_number")
      .range(start, start + 999);
    if (error) throw error;
    all.push(
      ...(data ?? []).filter(
        (row): row is { id: string; normalized_data: Json } =>
          row.normalized_data !== null,
      ),
    );
    if (!data || data.length < 1000) break;
  }
  return all;
}

export async function confirmImportAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ job_id: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: "Importação inválida." };
  try {
    const { supabase } = await requireAdminForAction();
    const { data: job, error: jobError } = await supabase
      .from("import_jobs")
      .select("id,module,status")
      .eq("id", parsed.data.job_id)
      .single();
    if (jobError) throw jobError;
    if (job.status !== "awaiting_confirmation")
      return {
        status: "error",
        message: "Esta importação não está aguardando confirmação.",
      };
    const rows = await loadAllValidRows(supabase, job.id);
    let imported = 0;
    for (const batch of chunk(rows, 10)) {
      const results = await Promise.all(
        batch.map(async (row) => {
          const data =
            row.normalized_data &&
            typeof row.normalized_data === "object" &&
            !Array.isArray(row.normalized_data)
              ? (row.normalized_data as JsonObject)
              : {};
          try {
            if (job.module === "students") {
              const { error } = await supabase.rpc(
                "create_student_with_guardian",
                { student_data: data, guardian_data: null },
              );
              if (error) throw error;
            } else if (job.module === "classes") {
              const { error } = await supabase.from("classes").insert({
                name: String(data.name),
                status: data.status === "inactive" ? "inactive" : "active",
                notes: data.notes ? String(data.notes) : null,
              });
              if (error) throw error;
            } else if (job.module === "contracts") {
              const { error } = await supabase.rpc(
                "create_contract_with_invoices",
                { contract_data: data },
              );
              if (error) throw error;
            } else if (job.module === "schedule") {
              const { error } = await supabase.rpc("import_schedule_row", {
                row_data: data,
              });
              if (error) throw error;
            } else if (job.module === "finance") {
              const { data: invoice, error } = await supabase
                .from("invoices")
                .insert({
                  student_id: String(data.student_id),
                  contract_id: String(data.contract_id),
                  reference_month: String(data.reference_month),
                  due_date: String(data.due_date),
                  amount: Number(data.amount),
                  status: data.status as "pending" | "overdue" | "cancelled",
                  origin: "import",
                })
                .select("id")
                .single();
              if (error) throw error;
              if (data.payment_date) {
                const { error: paymentError } = await supabase.rpc(
                  "register_payment",
                  {
                    target_invoice_id: invoice.id,
                    payment_amount: Number(data.amount),
                    paid_on: String(data.payment_date),
                    payment_notes: data.notes ? String(data.notes) : undefined,
                    payment_origin: "import",
                  },
                );
                if (paymentError) throw paymentError;
              }
            } else {
              const lesson: JsonObject = {
                lesson_date: data.lesson_date,
                lesson_name: data.lesson_name,
                content: data.content,
                observations: data.observations,
                lesson_report: data.lesson_report,
                homework: data.homework,
                origin: "import",
                ...(data.student_id
                  ? { student_id: String(data.student_id) }
                  : { class_id: String(data.class_id) }),
              };
              const { error } = data.student_id
                ? await supabase.rpc("record_individual_lesson", {
                    lesson_data: lesson,
                  })
                : await supabase.rpc("record_class_lesson", {
                    lesson_data: lesson,
                    student_notes: [],
                  });
              if (error) throw error;
            }
            await supabase
              .from("import_job_rows")
              .update({ status: "imported" })
              .eq("id", row.id);
            return true;
          } catch (error) {
            await supabase
              .from("import_job_rows")
              .update({
                status: "invalid",
                validation_errors: [getErrorMessage(error)],
              })
              .eq("id", row.id);
            return false;
          }
        }),
      );
      imported += results.filter(Boolean).length;
    }
    await supabase
      .from("import_jobs")
      .update({
        status: "completed",
        imported_rows: imported,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    revalidatePath("/admin", "layout");
    return {
      status: "success",
      message: `${imported} de ${rows.length} linha(s) importada(s). Linhas não importadas ficaram registradas para revisão.`,
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
