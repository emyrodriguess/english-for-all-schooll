"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";

export async function createClassAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(120),
      notes: z.string().trim().max(3000).optional().default(""),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: "Informe um nome válido para a turma." };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase
      .from("classes")
      .insert({ name: parsed.data.name, notes: parsed.data.notes || null });
    if (error) throw error;
    revalidatePath("/admin/turmas");
    return { status: "success", message: "Turma criada." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function updateClassAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      class_id: z.uuid(),
      name: z.string().trim().min(2).max(120),
      notes: z.string().trim().max(3000).optional().default(""),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revise os dados da turma." };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase
      .from("classes")
      .update({ name: parsed.data.name, notes: parsed.data.notes || null })
      .eq("id", parsed.data.class_id);
    if (error) throw error;
    revalidatePath("/admin/turmas");
    revalidatePath(`/admin/turmas/${parsed.data.class_id}`);
    return { status: "success", message: "Turma atualizada." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function joinClassAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      class_id: z.uuid(),
      student_id: z.uuid(),
      joined_on: z.iso.date(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Selecione o aluno e a data de entrada.",
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("join_class", {
      target_class_id: parsed.data.class_id,
      target_student_id: parsed.data.student_id,
      joined_on: parsed.data.joined_on,
    });
    if (error) {
      if (error.code === "23P01") {
        return {
          status: "error",
          message: "O aluno já possui participação nesta turma no período informado.",
        };
      }
      throw error;
    }
    revalidatePath(`/admin/turmas/${parsed.data.class_id}`);
    revalidatePath("/admin/turmas");
    revalidatePath("/admin/alunos");
    return { status: "success", message: "Aluno adicionado à turma." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function endMembershipAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      class_id: z.uuid(),
      membership_id: z.uuid(),
      left_on: z.iso.date(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Dados inválidos para encerrar a participação.",
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("end_class_membership", {
      target_membership_id: parsed.data.membership_id,
      left_on: parsed.data.left_on,
    });
    if (error) throw error;
    revalidatePath(`/admin/turmas/${parsed.data.class_id}`);
    return {
      status: "success",
      message: "Participação encerrada sem apagar o histórico.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function endClassAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      class_id: z.uuid(),
      effective_date: z.iso.date(),
      confirmation: z.literal("ENCERRAR"),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: "Digite ENCERRAR para confirmar." };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("end_class", {
      target_class_id: parsed.data.class_id,
      effective_date: parsed.data.effective_date,
    });
    if (error) throw error;
    revalidatePath("/admin/turmas");
    revalidatePath(`/admin/turmas/${parsed.data.class_id}`);
    revalidatePath("/admin/agenda");
    return {
      status: "success",
      message: "Turma encerrada com histórico preservado.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
