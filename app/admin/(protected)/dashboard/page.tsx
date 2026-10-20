import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BanknoteIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  ClipboardPlusIcon,
  PlusIcon,
  ReceiptTextIcon,
  TriangleAlertIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDashboardData } from "@/lib/internal/dashboard";
import {
  formatDate,
  formatLongDate,
  formatMoney,
  formatTime,
} from "@/lib/internal/format";

export const metadata: Metadata = { title: "Dashboard" };

const metricDefinitions = [
  {
    key: "expected",
    label: "Receita prevista",
    icon: BanknoteIcon,
    tone: "success",
  },
  {
    key: "received",
    label: "Receita recebida",
    icon: ReceiptTextIcon,
    tone: "info",
  },
  {
    key: "delinquentStudents",
    label: "Inadimplentes",
    icon: TriangleAlertIcon,
    tone: "danger",
  },
  {
    key: "activeStudents",
    label: "Alunos ativos",
    icon: UsersRoundIcon,
    tone: "violet",
  },
  {
    key: "overdueAmount",
    label: "Valores em atraso",
    icon: CircleDollarSignIcon,
    tone: "warning",
  },
] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const data = await getDashboardData(month);
  const metricValues = data.metrics;

  return (
    <>
      <PageHeader
        actions={
          <>
            <form action="/admin/dashboard" method="get">
              <label className="sr-only" htmlFor="dashboard-month">
                Mês de referência
              </label>
              <input
                className="admin-control"
                defaultValue={data.selectedMonth}
                id="dashboard-month"
                name="month"
                type="month"
              />
            </form>
            <Button asChild>
              <Link href="/admin/alunos?novo=1">
                <PlusIcon data-icon="inline-start" />
                Novo aluno
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/agenda">
                <CalendarDaysIcon data-icon="inline-start" />
                Ver agenda
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/financeiro">
                <ReceiptTextIcon data-icon="inline-start" />
                Ver financeiro
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/planner">
                <ClipboardPlusIcon data-icon="inline-start" />
                Registrar aula
              </Link>
            </Button>
          </>
        }
        description={formatLongDate()}
        title="Visão geral"
      />

      <section aria-label="Indicadores" className="admin-metrics-grid">
        {metricDefinitions.map((metric) => {
          const value = metricValues[metric.key];
          const money =
            metric.key === "expected" ||
            metric.key === "received" ||
            metric.key === "overdueAmount";
          return (
            <Card className="admin-metric-card" key={metric.key}>
              <CardHeader>
                <span className={`admin-metric-icon tone-${metric.tone}`}>
                  <metric.icon aria-hidden="true" />
                </span>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle>
                  {money ? formatMoney(value) : value.toLocaleString("pt-BR")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  <ArrowUpRightIcon />
                  Atualizado
                </Badge>
                <span>mês selecionado</span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="admin-dashboard-main">
        <Card className="admin-chart-card">
          <CardHeader className="admin-card-header-row">
            <div>
              <CardTitle>Recebido x previsto</CardTitle>
              <CardDescription>
                Visão financeira de {data.selectedMonth.slice(0, 4)}
              </CardDescription>
            </div>
            <Badge variant="outline">Este ano</Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart data={data.series} />
          </CardContent>
        </Card>
        <Card className="admin-agenda-card">
          <CardHeader className="admin-card-header-row">
            <div>
              <CardTitle>Agenda de hoje</CardTitle>
              <CardDescription>
                {data.agenda.length} compromisso(s)
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="link">
              <Link href="/admin/agenda">Ver agenda</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.agenda.length ? (
              <div className="admin-agenda-list">
                {data.agenda.map((item) => (
                  <div className="admin-agenda-row" key={item.id}>
                    <time>{formatTime(item.startTime)}</time>
                    <span className="admin-agenda-icon">
                      {item.kind === "class" ? (
                        <UsersRoundIcon />
                      ) : (
                        <UserRoundCheckIcon />
                      )}
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {item.kind === "class"
                          ? "Aula em turma"
                          : "Aula individual"}
                      </small>
                    </div>
                    <Badge variant="secondary">Confirmada</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Empty className="admin-empty-compact">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarDaysIcon />
                  </EmptyMedia>
                  <EmptyTitle>Nenhuma aula agendada</EmptyTitle>
                  <EmptyDescription>
                    A agenda de hoje está livre.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="admin-dashboard-bottom">
        <Card>
          <CardHeader className="admin-card-header-row">
            <CardTitle>Próximos vencimentos</CardTitle>
            <Button asChild size="sm" variant="link">
              <Link href="/admin/financeiro">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.upcomingInvoices.length ? (
              data.upcomingInvoices.map((invoice) => (
                <div className="admin-list-row" key={invoice.id}>
                  <span className="admin-date-chip">
                    {formatDate(invoice.due_date).slice(0, 5)}
                  </span>
                  <strong>
                    {(invoice.students as { full_name?: string } | null)
                      ?.full_name ?? "Aluno"}
                  </strong>
                  <span>{formatMoney(invoice.amount)}</span>
                  <Badge variant="outline">Pendente</Badge>
                </div>
              ))
            ) : (
              <p className="admin-empty-line">Nenhum vencimento próximo.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="admin-card-header-row">
            <CardTitle>Contratos encerrando em breve</CardTitle>
            <Button asChild size="sm" variant="link">
              <Link href="/admin/alunos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.endingContracts.length ? (
              data.endingContracts.map((contract) => (
                <div className="admin-list-row" key={contract.id}>
                  <span className="admin-date-chip">
                    {formatDate(contract.end_date).slice(0, 5)}
                  </span>
                  <strong>
                    {(contract.students as { full_name?: string } | null)
                      ?.full_name ?? "Aluno"}
                  </strong>
                  <span>{contract.modality}</span>
                  <ArrowDownLeftIcon aria-hidden="true" />
                </div>
              ))
            ) : (
              <p className="admin-empty-line">
                Nenhum contrato encerra nos próximos 30 dias.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
