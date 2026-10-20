"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";

export async function createSlotAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      weekday: z.coerce.number().int().min(1).max(7),
      start_time: z.string().regex(/^\d{2}:\d{2}$/),
      end_time: z.string().regex(/^\d{2}:\d{2}$/),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success || parsed.data.end_time <= parsed.data.start_time)
    return {
      status: "error",
      message: "Informe um intervalo de horário válido.",
    };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.from("weekly_slots").insert(parsed.data);
    if (error) throw error;
    revalidatePath("/admin/agenda");
    return {
      status: "success",
      message: "Horário adicionado à grade semanal.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function assignScheduleAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      slot_id: z.uuid(),
      assignment_type: z.enum(["student", "class"]),
      target_id: z.uuid(),
      start_date: z.iso.date(),
      end_date: z.union([z.literal(""), z.iso.date()]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: "Revise a ocupação do horário." };
  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("assign_schedule", {
      target_slot_id: parsed.data.slot_id,
      target_type: parsed.data.assignment_type,
      target_student_id:
        parsed.data.assignment_type === "student"
          ? parsed.data.target_id
          : null,
      target_class_id:
        parsed.data.assignment_type === "class"
          ? parsed.data.target_id
          : null,
      effective_from: parsed.data.start_date,
      effective_until: parsed.data.end_date || null,
    });
    if (error) {
      console.error("assign_schedule RPC failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });
      if (error.code === "23P01") {
        return {
          status: "error",
          message: "Este horário já está ocupado no período informado.",
        };
      }
      if (error.code === "23514") {
        return {
          status: "error",
          message: "A ocupação precisa ter exatamente um aluno ou uma turma.",
        };
      }
      if (error.message === "Horário não encontrado ou inativo") {
        return { status: "error", message: error.message };
      }
      if (error.message === "Somente alunos ativos podem receber turma ou horário") {
        return { status: "error", message: error.message };
      }
      if (error.message === "Turma não encontrada ou inativa") {
        return { status: "error", message: error.message };
      }
      return {
        status: "error",
        message: error.message || "Não foi possível ocupar o horário. Tente novamente.",
      };
    }
    revalidatePath("/admin/agenda");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/alunos");
    if (parsed.data.assignment_type === "class") {
      revalidatePath(`/admin/turmas/${parsed.data.target_id}`);
    }
    return { status: "success", message: "Horário ocupado com sucesso." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function deactivateSlotAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ slot_id: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Horário inválido." };
  try {
    const { supabase } = await requireAdminForAction();
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
    }).format(new Date());
    const { error } = await supabase.rpc("deactivate_weekly_slot", {
      target_slot_id: parsed.data.slot_id,
      effective_on: today,
    });
    if (error) throw error;
    revalidatePath("/admin/agenda");
    return {
      status: "success",
      message: "Horário removido da disponibilidade; o histórico foi mantido.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function releaseAssignmentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ assignment_id: z.uuid(), effective_on: z.iso.date() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Ocupação inválida." };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const { error } = await supabase.rpc("release_schedule_assignment", {
      target_assignment_id: parsed.data.assignment_id,
      effective_on: parsed.data.effective_on,
    });
    if (error) throw error;
    revalidatePath("/admin/agenda");
    revalidatePath("/admin/dashboard");
    return {
      status: "success",
      message: "Horário liberado; a ocupação anterior permaneceu no histórico.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
