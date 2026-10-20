import Link from "next/link";
import type { Metadata } from "next";
import {
  BanknoteIcon,
  CircleDollarSignIcon,
  ClockAlertIcon,
  SearchIcon,
  TriangleAlertIcon,
  WalletCardsIcon,
} from "lucide-react";

import {
  AdminFilterAdvanced,
  FilterForm,
} from "@/components/admin/filter-form";
import { RevenueChart } from "@/components/admin/revenue-chart";
import {
  FinanceVisibility,
  SensitiveMoney,
} from "@/components/admin/finance-visibility";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
  AdminDataTable,
} from "@/components/admin/admin-ui";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getFinance } from "@/lib/internal/finance";
import { formatDate } from "@/lib/internal/format";

export const metadata: Metadata = { title: "Financeiro" };
type Params = {
  month?: string;
  status?: string;
  q?: string;
  page?: string;
  dueFrom?: string;
  dueTo?: string;
};

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const data = await getFinance(params);
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const pageUrl = (page: number) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") query.set(key, value);
    });
    query.set("page", String(page));
    return `/admin/financeiro?${query.toString()}`;
  };
  const metrics = [
    {
      label: "Receita prevista",
      value: data.metrics.expected,
      icon: BanknoteIcon,
      tone: "success",
    },
    {
      label: "Receita recebida",
      value: data.metrics.received,
      icon: WalletCardsIcon,
      tone: "info",
    },
    {
      label: "A receber",
      value: data.metrics.pending,
      icon: CircleDollarSignIcon,
      tone: "warning",
    },
    {
      label: "Em atraso",
      value: data.metrics.overdue,
      icon: ClockAlertIcon,
      tone: "danger",
    },
  ];
  return (
    <FinanceVisibility>
      <section className="admin-finance-metrics">
        {metrics.map((metric) => (
          <AdminCard key={metric.label}>
            <AdminCardHeader>
              <span className={`admin-metric-icon tone-${metric.tone}`}>
                <metric.icon />
              </span>
              <AdminCardDescription>{metric.label}</AdminCardDescription>
              <AdminCardTitle><SensitiveMoney value={metric.value} /></AdminCardTitle>
            </AdminCardHeader>
          </AdminCard>
        ))}
      </section>
      <section className="admin-finance-insights">
        <AdminCard className="admin-chart-card">
          <AdminCardHeader className="admin-card-header-row">
            <div>
              <AdminCardTitle>Recebido x previsto</AdminCardTitle>
              <AdminCardDescription>
                Acompanhe o ritmo de recebimento ao longo de {data.selectedMonth.slice(0, 4)}.
              </AdminCardDescription>
            </div>
          </AdminCardHeader>
          <AdminCardContent>
            <RevenueChart data={data.series} />
          </AdminCardContent>
        </AdminCard>
        <AdminCard className="admin-finance-attention-card">
          <AdminCardHeader className="admin-card-header-row">
            <div>
              <AdminCardTitle>Precisam de atenção</AdminCardTitle>
              <AdminCardDescription>
                Alunos com pelo menos uma cobrança em atraso.
              </AdminCardDescription>
            </div>
            <TriangleAlertIcon aria-hidden="true" className="admin-finance-attention-icon" />
          </AdminCardHeader>
          <AdminCardContent className="admin-finance-attention-list">
            {data.delinquentInvoices.length ? (
              data.delinquentInvoices.map((invoice) => (
                <Link className="admin-finance-attention-row" href={`/admin/alunos/${invoice.student_id}?tab=finance`} key={invoice.id}>
                  <div>
                    <strong>{(invoice.students as { full_name?: string } | null)?.full_name ?? "Aluno"}</strong>
                    <span>Venceu em {formatDate(invoice.due_date)}</span>
                  </div>
                  <div>
                    <strong><SensitiveMoney value={Number(invoice.amount)} /></strong>
                    <StatusBadge status="overdue" />
                  </div>
                </Link>
              ))
            ) : (
              <p className="admin-empty-line">Nenhuma cobrança em atraso no momento.</p>
            )}
          </AdminCardContent>
        </AdminCard>
      </section>
      <AdminCard className="admin-finance-table-card">
        <AdminCardHeader className="admin-card-header-row">
          <div>
          <AdminCardTitle>Histórico de cobranças</AdminCardTitle>
          <AdminCardDescription>
            Para registrar um pagamento ou anexar um comprovante, abra a ficha do aluno.
          </AdminCardDescription>
          </div>
          <span className="admin-history-count">{data.total} registro(s)</span>
        </AdminCardHeader>
        <AdminCardContent>
          <FilterForm className="admin-filterbar admin-finance-filterbar">
            <div className="admin-filter-search">
              <SearchIcon />
              <Input
                defaultValue={params.q}
                name="q"
                placeholder="Buscar aluno"
              />
            </div>
            <label>
              <span>Competência</span>
              <Input
                defaultValue={data.selectedMonth}
                name="month"
                type="month"
              />
            </label>
            <label>
              <span>Status</span>
              <select
                className="admin-control admin-control-full"
                defaultValue={params.status ?? ""}
                name="status"
              >
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="overdue">Inadimplente</option>
                <option value="paid">Pago</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </label>
            <AdminFilterAdvanced
              defaultOpen={Boolean(params.dueFrom || params.dueTo)}
            >
              <div className="admin-finance-extra-filters">
                <label>
                  <span>Vencimento de</span>
                  <Input
                    defaultValue={params.dueFrom}
                    name="dueFrom"
                    type="date"
                  />
                </label>
                <label>
                  <span>Vencimento até</span>
                  <Input
                    defaultValue={params.dueTo}
                    name="dueTo"
                    type="date"
                  />
                </label>
              </div>
            </AdminFilterAdvanced>
            <AdminButton type="submit">Filtrar</AdminButton>
            <AdminButton asChild variant="link">
              <Link href="/admin/financeiro">Limpar filtros</Link>
            </AdminButton>
          </FilterForm>
          <div className="admin-table-wrap">
            <AdminDataTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Ficha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.invoices.map((invoice) => {
                  const student = invoice.students as {
                    id?: string;
                    full_name?: string;
                  } | null;
                  const payment = invoice.payments?.[0];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Link
                          className="admin-table-link"
                          href={`/admin/alunos/${invoice.student_id}`}
                        >
                          {student?.full_name ?? "Aluno"}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(invoice.reference_month).slice(3)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell><SensitiveMoney value={Number(invoice.amount)} /></TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell>{payment ? formatDate(payment.payment_date) : "—"}</TableCell>
                      <TableCell className="text-right">
                        <AdminButton asChild size="sm" variant="ghost">
                          <Link href={`/admin/alunos/${invoice.student_id}?tab=finance`}>
                            Ver aluno
                          </Link>
                        </AdminButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </AdminDataTable>
          </div>
          {!data.invoices.length ? (
            <p className="admin-empty-line">
              Nenhuma cobrança encontrada para os filtros.
            </p>
          ) : null}
          {data.total > data.pageSize ? (
            <div className="admin-pagination">
              <p>{data.total} cobrança(s) encontrada(s)</p>
              <div>
                <AdminButton
                  asChild
                  disabled={data.page <= 1}
                  size="sm"
                  variant="outline"
                >
                  <Link
                    aria-disabled={data.page <= 1}
                    href={pageUrl(Math.max(1, data.page - 1))}
                  >
                    Anterior
                  </Link>
                </AdminButton>
                <span>
                  Página {data.page} de {totalPages}
                </span>
                <AdminButton
                  asChild
                  disabled={data.page >= totalPages}
                  size="sm"
                  variant="outline"
                >
                  <Link
                    aria-disabled={data.page >= totalPages}
                    href={pageUrl(Math.min(totalPages, data.page + 1))}
                  >
                    Próxima
                  </Link>
                </AdminButton>
              </div>
            </div>
          ) : null}
        </AdminCardContent>
      </AdminCard>
      <AdminCard className="admin-outbox-card">
        <AdminCardHeader>
          <AdminCardTitle>Mensagens de cobrança</AdminCardTitle>
          <AdminCardDescription>
            Outbox preparada para o futuro provedor de WhatsApp. Nenhuma
            mensagem é enviada hoje.
          </AdminCardDescription>
        </AdminCardHeader>
        <AdminCardContent className="admin-stack-list">
          {data.outbox.length ? (
            data.outbox.map((message) => (
              <div className="admin-record-row" key={message.id}>
                <div>
                  <strong>
                    {(
                      message.invoices as {
                        students?: { full_name?: string };
                        reference_month?: string;
                      } | null
                    )?.students?.full_name ?? "Aluno"}
                  </strong>
                  <span>
                    Competência{" "}
                    {formatDate(
                      (message.invoices as { reference_month?: string } | null)
                        ?.reference_month,
                    ).slice(3)}
                  </span>
                </div>
                <span>Aguardando integração</span>
                <StatusBadge status={message.status} />
                <span>{formatDate(message.created_at)}</span>
              </div>
            ))
          ) : (
            <p className="admin-empty-line">
              Nenhuma cobrança aguardando integração.
            </p>
          )}
        </AdminCardContent>
      </AdminCard>
    </FinanceVisibility>
  );
}
