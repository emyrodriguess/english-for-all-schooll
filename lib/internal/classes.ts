import "server-only";

import { notFound } from "next/navigation";

import { requireActiveAdmin } from "@/lib/internal/auth";

export async function getClasses(params: { q?: string; status?: string } = {}) {
  const { supabase } = await requireActiveAdmin();
  let query = supabase
    .from("classes")
    .select(
      "*,class_memberships(id,status,student_id),schedule_assignments(id,active,weekly_slots(weekday,start_time,end_time))",
    )
    .is("archived_at", null);
  const search = params.q
    ?.trim()
    .replace(/[,%()]/g, " ")
    .slice(0, 80);
  if (search) query = query.ilike("name", `%${search}%`);
  if (params.status && ["active", "inactive"].includes(params.status)) {
    query = query.eq("status", params.status as "active" | "inactive");
  }
  const { data, error } = await query.order("name");
  if (error) throw new Error("Não foi possível carregar as turmas.");
  return data ?? [];
}

export async function getClassDetail(classId: string) {
  const { supabase } = await requireActiveAdmin();
  const [classResult, studentsResult] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "*,class_memberships(*,students(id,full_name,email,whatsapp,status)),schedule_assignments(*,weekly_slots(*)),lesson_records(*,lesson_student_notes(*,students(full_name)))",
      )
      .eq("id", classId)
      .maybeSingle(),
    supabase
      .from("students")
      .select("id,full_name")
      .eq("status", "active")
      .is("archived_at", null)
      .order("full_name"),
  ]);
  if (classResult.error || studentsResult.error)
    throw new Error("Não foi possível carregar a turma.");
  if (!classResult.data) notFound();
  return { classData: classResult.data, students: studentsResult.data ?? [] };
}
