"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";

const optionalEmail = z.union([z.literal(""), z.email("E-mail inválido.")]);
const optionalDate = z.union([z.literal(""), z.iso.date("Data inválida.")]);

function contractFormValues(formData: FormData) {
  const values = Object.fromEntries(formData);
  for (const field of ["monthly_amount", "first_invoice_amount"] as const) {
    const rawValue = values[field];
    if (typeof rawValue !== "string" || !rawValue) continue;
    const digits = rawValue.replace(/\D/g, "");
    values[field] = digits ? String(Number(digits) / 100) : "";
  }
  return values;
}

const studentSchema = z
  .object({
    full_name: z.string().trim().min(2, "Informe o nome completo.").max(150),
    birth_date: optionalDate,
    email: optionalEmail,
    whatsapp: z.string().trim().min(8, "Informe um WhatsApp válido.").max(30),
    status: z.enum(["active", "inactive"]),
    administrative_notes: z.string().trim().max(3000).optional().default(""),
    financial_contact_type: z.enum(["student", "guardian"]),
    guardian_name: z.string().trim().max(150).optional().default(""),
    guardian_email: optionalEmail.optional().default(""),
    guardian_whatsapp: z.string().trim().max(30).optional().default(""),
    guardian_relationship: z.string().trim().max(80).optional().default(""),
  })
  .superRefine((data, context) => {
    if (data.financial_contact_type === "guardian") {
      if (data.guardian_name.length < 2)
        context.addIssue({
          code: "custom",
          path: ["guardian_name"],
          message: "Informe o nome do responsável.",
        });
      if (data.guardian_whatsapp.length < 8)
        context.addIssue({
          code: "custom",
          path: ["guardian_whatsapp"],
          message: "Informe o WhatsApp do responsável.",
        });
    }
  });

export async function createStudentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = studentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do aluno.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const { supabase } = await requireAdminForAction();
    const data = parsed.data;
    const guardian =
      data.guardian_name || data.guardian_whatsapp
        ? {
            full_name: data.guardian_name,
            email: data.guardian_email,
            whatsapp: data.guardian_whatsapp,
            relationship: data.guardian_relationship,
          }
        : null;
    const { error } = await supabase.rpc("create_student_with_guardian", {
      student_data: {
        full_name: data.full_name,
        birth_date: data.birth_date,
        email: data.email,
        whatsapp: data.whatsapp,
        status: data.status,
        administrative_notes: data.administrative_notes,
        financial_contact_type: data.financial_contact_type,
      },
      guardian_data: guardian,
    });
    if (error) throw error;
    revalidatePath("/admin/alunos");
    revalidatePath("/admin/dashboard");
    return { status: "success", message: "Aluno cadastrado com sucesso." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

const updateStudentSchema = z.object({
  student_id: z.uuid(),
  full_name: z.string().trim().min(2).max(150),
  birth_date: optionalDate,
  email: optionalEmail,
  whatsapp: z.string().trim().min(8).max(30),
  status: z.enum(["active", "inactive"]),
  administrative_notes: z.string().trim().max(3000).optional().default(""),
  financial_contact_type: z.enum(["student", "guardian"]),
  financial_guardian_id: z.union([z.literal(""), z.uuid()]),
});

export async function updateStudentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateStudentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do aluno.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase
      .from("students")
      .update({
        full_name: parsed.data.full_name,
        birth_date: parsed.data.birth_date || null,
        email: parsed.data.email || null,
        whatsapp: parsed.data.whatsapp,
        status: parsed.data.status,
        administrative_notes: parsed.data.administrative_notes || null,
        financial_contact_type: parsed.data.financial_contact_type,
        financial_guardian_id:
          parsed.data.financial_contact_type === "guardian"
            ? parsed.data.financial_guardian_id || null
            : null,
      })
      .eq("id", parsed.data.student_id);
    if (error) throw error;
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    revalidatePath("/admin/alunos");
    return { status: "success", message: "Dados do aluno atualizados." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

const guardianSchema = z.object({
  student_id: z.uuid(),
  full_name: z.string().trim().min(2).max(150),
  email: optionalEmail,
  whatsapp: z.string().trim().min(8).max(30),
  relationship: z.string().trim().max(80).optional().default(""),
  financial: z.enum(["yes", "no"]).default("no"),
});

export async function addGuardianAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = guardianSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do responsável.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { data, error } = await supabase
      .from("guardians")
      .insert({
        student_id: parsed.data.student_id,
        full_name: parsed.data.full_name,
        email: parsed.data.email || null,
        whatsapp: parsed.data.whatsapp,
        relationship: parsed.data.relationship || null,
      })
      .select("id")
      .single();
    if (error) throw error;
    if (parsed.data.financial === "yes") {
      const { error: updateError } = await supabase
        .from("students")
        .update({
          financial_contact_type: "guardian",
          financial_guardian_id: data.id,
        })
        .eq("id", parsed.data.student_id);
      if (updateError) throw updateError;
    }
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    return { status: "success", message: "Responsável adicionado." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

const contractSchema = z.object({
  student_id: z.uuid(),
  modality: z.string().trim().min(1).max(50),
  weekly_frequency: z.coerce.number().int().min(1).max(7),
  contract_type: z.string().trim().min(1).max(50),
  start_date: z.iso.date(),
  billing_start_date: z.iso.date(),
  end_date: optionalDate,
  monthly_amount: z.coerce.number().nonnegative(),
  first_invoice_amount: z.union([
    z.literal(""),
    z.coerce.number().nonnegative(),
  ]),
  due_day: z.coerce.number().int().min(1).max(31),
  notes: z.string().trim().max(3000).optional().default(""),
});

export async function createContractAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contractSchema.safeParse(contractFormValues(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do contrato.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const { supabase } = await requireAdminForAction();
    const file = formData.get("document");
    if (file instanceof File && file.size > 0) {
      if (file.size > 10 * 1024 * 1024)
        return {
          status: "error",
          message: "O contrato deve ter no máximo 10 MB.",
        };
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type))
        return {
          status: "error",
          message: "Envie o contrato em PDF, JPG ou PNG.",
        };
    }
    const { data: contractId, error } = await supabase.rpc(
      "create_contract_with_invoices",
      { contract_data: parsed.data },
    );
    if (error) throw error;
    if (file instanceof File && file.size > 0) {
      const documentStorageKey = `${parsed.data.student_id}/${contractId}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("contracts")
        .upload(documentStorageKey, file, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadError)
        return {
          status: "error",
          message:
            "Contrato criado, mas o documento não foi enviado. Você pode anexá-lo depois.",
        };
      const { error: updateError } = await supabase
        .from("contracts")
        .update({ document_storage_key: documentStorageKey })
        .eq("id", contractId);
      if (updateError)
        return {
          status: "error",
          message:
            "Contrato criado e arquivo salvo, mas o vínculo do documento precisa ser revisado.",
        };
    }
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    return {
      status: "success",
      message: "Contrato criado e cobranças geradas.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function renewContractAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contractSchema
    .extend({ contract_id: z.uuid() })
    .safeParse(contractFormValues(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os dados da renovação.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const file = formData.get("document");
  if (file instanceof File && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return {
        status: "error",
        message: "O contrato deve ter no máximo 10 MB.",
      };
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      return {
        status: "error",
        message: "Envie o contrato em PDF, JPG ou PNG.",
      };
    }
  }

  try {
    const { supabase } = await requireAdminForAction();
    const { contract_id: contractId, ...contractData } = parsed.data;
    const { data: newContractId, error } = await supabase.rpc(
      "renew_contract",
      {
        current_contract_id: contractId,
        contract_data: contractData,
      },
    );
    if (error) throw error;

    if (file instanceof File && file.size > 0) {
      const storageKey = `${parsed.data.student_id}/${newContractId}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("contracts")
        .upload(storageKey, file, { contentType: file.type, upsert: false });
      if (uploadError) {
        return {
          status: "error",
          message: "Renovação criada, mas o documento não foi enviado.",
        };
      }
      const { error: updateError } = await supabase
        .from("contracts")
        .update({ document_storage_key: storageKey })
        .eq("id", newContractId);
      if (updateError) {
        return {
          status: "error",
          message: "Documento salvo, mas o vínculo precisa ser revisado.",
        };
      }
    }

    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    return {
      status: "success",
      message: "Contrato renovado sem sobrescrever o histórico.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function cancelContractAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      contract_id: z.uuid(),
      student_id: z.uuid(),
      effective_date: z.iso.date(),
      confirmation: z.literal("ENCERRAR"),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Digite ENCERRAR e informe a data efetiva.",
    };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("cancel_contract", {
      target_contract_id: parsed.data.contract_id,
      effective_date: parsed.data.effective_date,
    });
    if (error) throw error;
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    return {
      status: "success",
      message: "Contrato encerrado; o histórico financeiro foi preservado.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function attachContractDocumentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ contract_id: z.uuid(), student_id: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  const file = formData.get("document");
  if (!parsed.success || !(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecione um documento válido." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { status: "error", message: "O contrato deve ter no máximo 10 MB." };
  }
  if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
    return { status: "error", message: "Envie o contrato em PDF, JPG ou PNG." };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const storageKey = `${parsed.data.student_id}/${parsed.data.contract_id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("contracts")
      .upload(storageKey, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    const { error } = await supabase
      .from("contracts")
      .update({ document_storage_key: storageKey })
      .eq("id", parsed.data.contract_id)
      .eq("student_id", parsed.data.student_id);
    if (error) throw error;
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    return { status: "success", message: "Documento anexado ao contrato." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function cancelStudentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      student_id: z.uuid(),
      effective_date: z.iso.date(),
      confirmation: z.literal("CANCELAR"),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Confirme digitando CANCELAR e informe a data efetiva.",
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("cancel_student", {
      target_student_id: parsed.data.student_id,
      effective_date: parsed.data.effective_date,
    });
    if (error) throw error;
    revalidatePath("/admin/alunos");
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/financeiro");
    return {
      status: "success",
      message: "Aluno cancelado com histórico preservado.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
