"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";

const plannerSchema = z.object({
  record_type: z.enum(["student", "class"]),
  target_id: z.uuid(),
  lesson_date: z.iso.date(),
  lesson_name: z.string().trim().min(1).max(150),
  content: z.string().trim().max(10000).optional().default(""),
  observations: z.string().trim().max(10000).optional().default(""),
  lesson_report: z.string().trim().max(10000).optional().default(""),
  homework: z.string().trim().max(10000).optional().default(""),
});

export async function createLessonRecordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = plannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do registro.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const { supabase } = await requireAdminForAction();
    const base = {
      lesson_date: parsed.data.lesson_date,
      lesson_name: parsed.data.lesson_name,
      content: parsed.data.content,
      observations: parsed.data.observations,
      lesson_report: parsed.data.lesson_report,
      homework: parsed.data.homework,
    };
    const { error } =
      parsed.data.record_type === "student"
        ? await supabase.rpc("record_individual_lesson", {
            lesson_data: { ...base, student_id: parsed.data.target_id },
          })
        : await supabase.rpc("record_class_lesson", {
            lesson_data: { ...base, class_id: parsed.data.target_id },
            student_notes: Array.from(formData.entries())
              .filter(
                ([key, value]) =>
                  key.startsWith("student_report_") && String(value).trim(),
              )
              .map(([key, value]) => ({
                student_id: key.replace("student_report_", ""),
                individual_report: String(value),
                observations: String(
                  formData.get(
                    `student_observations_${key.replace("student_report_", "")}`,
                  ) ?? "",
                ),
                homework: String(
                  formData.get(
                    `student_homework_${key.replace("student_report_", "")}`,
                  ) ?? "",
                ),
              })),
          });
    if (error) throw error;
    revalidatePath("/admin/planner");
    if (parsed.data.record_type === "student")
      revalidatePath(`/admin/alunos/${parsed.data.target_id}`);
    else revalidatePath(`/admin/turmas/${parsed.data.target_id}`);
    return { status: "success", message: "Registro pedagógico salvo." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function updateLessonRecordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = plannerSchema
    .omit({ record_type: true, target_id: true })
    .extend({ record_id: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os dados do registro.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const { record_id: recordId, ...changes } = parsed.data;
    const notes = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("note_report_"))
      .map(([key, value]) => {
        const noteId = key.replace("note_report_", "");
        return {
          id: noteId,
          individual_report: String(value),
          observations: String(formData.get(`note_observations_${noteId}`) ?? ""),
          homework: String(formData.get(`note_homework_${noteId}`) ?? ""),
        };
      });
    const { error } = await supabase.rpc("update_lesson_record", {
      lesson_data: { record_id: recordId, ...changes },
      student_notes: notes,
    });
    if (error) throw error;
    revalidatePath("/admin/planner");
    return {
      status: "success",
      message: "Registro pedagógico atualizado com auditoria.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
