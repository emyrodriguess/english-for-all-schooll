import "server-only";

import { requireActiveAdmin } from "@/lib/internal/auth";
import { monthBounds } from "@/lib/internal/format";

function safeSearch(value?: string) {
  return (
    value
      ?.trim()
      .replace(/[,%()]/g, " ")
      .slice(0, 80) ?? ""
  );
}

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function getFinance(params: {
  month?: string;
  status?: string;
  q?: string;
  page?: string;
  dueFrom?: string;
  dueTo?: string;
}) {
  const { supabase } = await requireActiveAdmin();
  const bounds = monthBounds(params.month);
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = 15;
  const search = safeSearch(params.q);

  let studentIds: string[] | null = null;
  if (search) {
    const { data, error } = await supabase
      .from("students")
      .select("id")
      .or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,whatsapp.ilike.%${search}%`,
      )
      .limit(200);
    if (error) throw new Error("Não foi possível pesquisar alunos.");
    studentIds = (data ?? []).map((item) => item.id);
  }

  let query = supabase
    .from("invoices")
    .select(
      "id,student_id,contract_id,reference_month,due_date,amount,status,students(id,full_name,email,whatsapp),contracts(modality),payments(id,amount,payment_date,receipt_storage_key,notes),whatsapp_collection_messages(id,status,created_at,error_message)",
      { count: "exact" },
    )
    .gte("reference_month", bounds.start)
    .lt("reference_month", bounds.next)
    .is("archived_at", null);
  if (
    params.status &&
    ["pending", "overdue", "paid", "cancelled"].includes(params.status)
  )
    query = query.eq(
      "status",
      params.status as "pending" | "overdue" | "paid" | "cancelled",
    );
  if (params.dueFrom) query = query.gte("due_date", params.dueFrom);
  if (params.dueTo) query = query.lte("due_date", params.dueTo);
  if (studentIds) {
    if (!studentIds.length)
      return {
        invoices: [],
        total: 0,
        page,
        pageSize,
        selectedMonth: bounds.month,
        metrics: { expected: 0, received: 0, overdue: 0, pending: 0 },
        series: [],
        delinquentInvoices: [],
        outbox: [],
      };
    query = query.in("student_id", studentIds);
  }

  const yearStart = `${bounds.year}-01-01`;
  const yearEnd = `${bounds.year + 1}-01-01`;
  const [
    invoicesResult,
    allMonthInvoices,
    paymentsResult,
    yearInvoices,
    yearPayments,
    delinquentInvoices,
    outboxResult,
  ] =
    await Promise.all([
      query.order("due_date").range((page - 1) * pageSize, page * pageSize - 1),
      supabase
        .from("invoices")
        .select("amount,status")
        .gte("reference_month", bounds.start)
        .lt("reference_month", bounds.next)
        .is("archived_at", null),
      supabase
        .from("payments")
        .select("amount,payment_date")
        .gte("payment_date", bounds.start)
        .lt("payment_date", bounds.next),
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
      supabase
        .from("invoices")
        .select("id,student_id,reference_month,due_date,amount,students(id,full_name)")
        .eq("status", "overdue")
        .is("archived_at", null)
        .order("due_date")
        .limit(8),
      supabase
        .from("whatsapp_collection_messages")
        .select(
          "id,invoice_id,status,created_at,error_message,invoices(amount,reference_month,students(full_name))",
        )
        .order("created_at", { ascending: false })
        .limit(10),
    ]);
  if (
    invoicesResult.error ||
    allMonthInvoices.error ||
    paymentsResult.error ||
    yearInvoices.error ||
    yearPayments.error ||
    delinquentInvoices.error ||
    outboxResult.error
  )
    throw new Error("Não foi possível carregar o financeiro.");

  const all = allMonthInvoices.data ?? [];
  const series = Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    const key = `${bounds.year}-${month}`;
    const forecast = (yearInvoices.data ?? [])
      .filter(
        (invoice) =>
          invoice.reference_month.startsWith(key) && invoice.status !== "cancelled",
      )
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const received = (yearPayments.data ?? [])
      .filter((payment) => payment.payment_date.startsWith(key))
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    return {
      month: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][index],
      forecast,
      received,
    };
  });
  return {
    invoices: (invoicesResult.data ?? []).map((invoice) => ({
      ...invoice,
      payments: asArray(invoice.payments),
    })),
    total: invoicesResult.count ?? 0,
    page,
    pageSize,
    selectedMonth: bounds.month,
    metrics: {
      expected: all
        .filter((item) => item.status !== "cancelled")
        .reduce((sum, item) => sum + Number(item.amount), 0),
      received: (paymentsResult.data ?? []).reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      ),
      overdue: all
        .filter((item) => item.status === "overdue")
        .reduce((sum, item) => sum + Number(item.amount), 0),
      pending: all
        .filter((item) => item.status === "pending")
        .reduce((sum, item) => sum + Number(item.amount), 0),
    },
    series,
    delinquentInvoices: delinquentInvoices.data ?? [],
    outbox: outboxResult.data ?? [],
  };
}
