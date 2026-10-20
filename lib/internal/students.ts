import "server-only";

import { notFound } from "next/navigation";

import { requireActiveAdmin } from "@/lib/internal/auth";

function safeSearch(value?: string) {
  return (
    value
      ?.trim()
      .replace(/[,%()]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 80) ?? ""
  );
}

export async function getStudents(params: {
  q?: string;
  status?: string;
  classId?: string;
  page?: string;
  order?: string;
}) {
  const { supabase } = await requireActiveAdmin();
  const pageSize = 10;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const search = safeSearch(params.q);

  let classStudentIds: string[] | null = null;
  if (params.classId) {
    const { data, error } = await supabase
      .from("class_memberships")
      .select("student_id")
      .eq("class_id", params.classId)
      .eq("status", "active");
    if (error) throw new Error("Não foi possível aplicar o filtro de turma.");
    classStudentIds = (data ?? []).map((row) => row.student_id);
  }

  let query = supabase
    .from("students")
    .select(
      "id,full_name,email,whatsapp,status,created_at,contracts(id,status,end_date,modality),class_memberships(id,status,classes(id,name)),invoices(id,status,due_date),schedule_assignments(id,active,start_date,end_date,weekly_slots(weekday,start_time))",
      { count: "exact" },
    )
    .is("archived_at", null);

  if (search)
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,whatsapp.ilike.%${search}%`,
    );
  if (
    params.status &&
    ["active", "inactive", "cancelled"].includes(params.status)
  ) {
    query = query.eq(
      "status",
      params.status as "active" | "inactive" | "cancelled",
    );
  }
  if (classStudentIds) {
    if (!classStudentIds.length)
      return {
        students: [],
        total: 0,
        page,
        pageSize,
        classes: await getActiveClasses(),
      };
    query = query.in("id", classStudentIds);
  }

  const ascending = params.order === "oldest";
  const { data, error, count } = await query
    .order(params.order === "name" ? "full_name" : "created_at", {
      ascending: params.order === "name" || ascending,
    })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw new Error("Não foi possível carregar os alunos.");
  return {
    students: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    classes: await getActiveClasses(),
  };
}

export async function getActiveClasses() {
  const { supabase } = await requireActiveAdmin();
  const { data, error } = await supabase
    .from("classes")
    .select("id,name")
    .eq("status", "active")
    .order("name");
  if (error) throw new Error("Não foi possível carregar as turmas.");
  return data ?? [];
}

export async function getStudent(studentId: string) {
  const { supabase } = await requireActiveAdmin();
  const { data, error } = await supabase
    .from("students")
    .select(
      "*,guardians!guardians_student_id_fkey(*),contracts(*),class_memberships(*,classes(id,name)),invoices(*,payments(*)),schedule_assignments(*,weekly_slots(*)),lesson_records(*)",
    )
    .eq("id", studentId)
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar a ficha do aluno.");
  if (!data) notFound();
  return data;
}
