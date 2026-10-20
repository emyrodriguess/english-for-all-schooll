import "server-only";

import { requireActiveAdmin } from "@/lib/internal/auth";
import { monthBounds, saoPauloToday } from "@/lib/internal/format";

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export async function getDashboardData(selectedMonth?: string) {
  const { supabase } = await requireActiveAdmin();
  const bounds = monthBounds(selectedMonth);
  const today = saoPauloToday();
  const todayDate = new Date(`${today}T12:00:00Z`);
  const weekday = todayDate.getUTCDay() === 0 ? 7 : todayDate.getUTCDay();
  const endingWindow = new Date(todayDate);
  endingWindow.setUTCDate(endingWindow.getUTCDate() + 30);
  const yearStart = `${bounds.year}-01-01`;
  const yearEnd = `${bounds.year + 1}-01-01`;

  const [
    activeStudents,
    monthInvoices,
    monthPayments,
    slots,
    upcomingInvoices,
    endingContracts,
    yearInvoices,
    yearPayments,
  ] = await Promise.all([
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .is("archived_at", null),
    supabase
      .from("invoices")
      .select("id,student_id,amount,status,due_date,reference_month")
      .gte("reference_month", bounds.start)
      .lt("reference_month", bounds.next)
      .is("archived_at", null),
    supabase
      .from("payments")
      .select("amount,payment_date,invoice_id")
      .gte("payment_date", bounds.start)
      .lt("payment_date", bounds.next),
    supabase
      .from("weekly_slots")
      .select(
        "id,weekday,start_time,end_time,schedule_assignments(id,assignment_type,student_id,class_id,start_date,end_date,active,students(full_name),classes(name))",
      )
      .eq("weekday", weekday)
      .eq("active", true)
      .order("start_time"),
    supabase
      .from("invoices")
      .select("id,due_date,amount,status,students(full_name)")
      .eq("status", "pending")
      .gte("due_date", today)
      .order("due_date")
      .limit(4),
    supabase
      .from("contracts")
      .select("id,end_date,students(full_name),modality")
      .eq("status", "active")
      .not("end_date", "is", null)
      .gte("end_date", today)
      .lte("end_date", endingWindow.toISOString().slice(0, 10))
      .order("end_date")
      .limit(4),
    supabase
      .from("invoices")
      .select("amount,status,reference_month")
      .gte("reference_month", yearStart)
      .lt("reference_month", yearEnd)
      .is("archived_at", null),
    supabase
      .from("payments")
      .select("amount,payment_date")
      .gte("payment_date", yearStart)
      .lt("payment_date", yearEnd),
  ]);

  const errors = [
    monthInvoices.error,
    monthPayments.error,
    slots.error,
    upcomingInvoices.error,
    endingContracts.error,
    yearInvoices.error,
    yearPayments.error,
  ].filter(Boolean);
  if (errors.length)
    throw new Error("Não foi possível carregar todos os dados do Dashboard.");

  const invoices = monthInvoices.data ?? [];
  const validInvoices = invoices.filter(
    (invoice) => invoice.status !== "cancelled",
  );
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "overdue",
  );
  const expected = validInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0,
  );
  const received = (monthPayments.data ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );
  const overdueAmount = overdueInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0,
  );
  const delinquentStudents = new Set(
    overdueInvoices.map((invoice) => invoice.student_id),
  ).size;

  const agenda = (slots.data ?? []).flatMap((slot) => {
    const assignments = Array.isArray(slot.schedule_assignments)
      ? slot.schedule_assignments
      : [];
    return assignments
      .filter(
        (assignment) =>
          assignment.active &&
          assignment.start_date <= today &&
          (!assignment.end_date || assignment.end_date >= today),
      )
      .map((assignment) => ({
        id: assignment.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        kind: assignment.assignment_type,
        name:
          assignment.assignment_type === "class"
            ? ((assignment.classes as { name?: string } | null)?.name ??
              "Turma")
            : ((assignment.students as { full_name?: string } | null)
                ?.full_name ?? "Aluno"),
      }));
  });

  const series = monthLabels.map((label, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");
    const key = `${bounds.year}-${monthNumber}`;
    const forecast = (yearInvoices.data ?? [])
      .filter(
        (invoice) =>
          invoice.reference_month.startsWith(key) &&
          invoice.status !== "cancelled",
      )
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const paid = (yearPayments.data ?? [])
      .filter((payment) => payment.payment_date.startsWith(key))
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    return { month: label, forecast, received: paid };
  });

  return {
    selectedMonth: bounds.month,
    today,
    metrics: {
      activeStudents: activeStudents.count ?? 0,
      delinquentStudents,
      expected,
      received,
      overdueAmount,
    },
    series,
    agenda,
    upcomingInvoices: upcomingInvoices.data ?? [],
    endingContracts: endingContracts.data ?? [],
  };
}
