import "server-only";

import { requireActiveAdmin } from "@/lib/internal/auth";

function safeSearch(value?: string) {
  return (
    value
      ?.trim()
      .replace(/[,%()]/g, " ")
      .slice(0, 100) ?? ""
  );
}

export async function getPlanner(params: {
  studentId?: string;
  classId?: string;
  from?: string;
  to?: string;
  q?: string;
}) {
  const { supabase } = await requireActiveAdmin();
  let query = supabase
    .from("lesson_records")
    .select(
      "*,students(id,full_name),classes(id,name),lesson_student_notes(*,students(id,full_name))",
    )
    .is("archived_at", null)
    .order("lesson_date", { ascending: false })
    .limit(100);
  if (params.studentId) query = query.eq("student_id", params.studentId);
  if (params.classId) query = query.eq("class_id", params.classId);
  if (params.from) query = query.gte("lesson_date", params.from);
  if (params.to) query = query.lte("lesson_date", params.to);
  const search = safeSearch(params.q);
  if (search) {
    query = query.or(
      `lesson_name.ilike.%${search}%,content.ilike.%${search}%,observations.ilike.%${search}%,lesson_report.ilike.%${search}%,homework.ilike.%${search}%`,
    );
  }
  const [records, students, classes] = await Promise.all([
    query,
    supabase
      .from("students")
      .select("id,full_name")
      .eq("status", "active")
      .order("full_name"),
    supabase
      .from("classes")
      .select(
        "id,name,class_memberships(student_id,status,students(id,full_name))",
      )
      .eq("status", "active")
      .order("name"),
  ]);
  if (records.error || students.error || classes.error)
    throw new Error("Não foi possível carregar o Planner.");
  return {
    records: records.data ?? [],
    students: students.data ?? [],
    classes: classes.data ?? [],
  };
}
