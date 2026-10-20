import "server-only";

import { requireActiveAdmin } from "@/lib/internal/auth";

export async function getSchedule() {
  const { supabase } = await requireActiveAdmin();
  const [slots, students, classes] = await Promise.all([
    supabase
      .from("weekly_slots")
      .select(
        "*,schedule_assignments(*,students(id,full_name),classes(id,name))",
      )
      .is("archived_at", null)
      .order("weekday")
      .order("start_time"),
    supabase
      .from("students")
      .select("id,full_name")
      .eq("status", "active")
      .is("archived_at", null)
      .order("full_name"),
    supabase
      .from("classes")
      .select("id,name")
      .eq("status", "active")
      .is("archived_at", null)
      .order("name"),
  ]);
  if (slots.error || students.error || classes.error)
    throw new Error("Não foi possível carregar a agenda.");
  return {
    slots: slots.data ?? [],
    students: students.data ?? [],
    classes: classes.data ?? [],
  };
}
