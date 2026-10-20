import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  UsersIcon,
} from "lucide-react";

import { updateStudentAction } from "@/app/admin/(protected)/alunos/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { AdminSelect } from "@/components/admin/admin-ui";
import { FormField } from "@/components/admin/form-field";
import { PageHeader } from "@/components/admin/page-header";
import {
  StudentDetailTabs,
} from "@/components/admin/student-detail-tabs";
import {
  AttachPaymentReceiptDialog,
  PaymentDialog,
} from "@/components/admin/payment-dialog";
import { PhoneInput } from "@/components/admin/phone-input";
import {
  AddGuardianDialog,
  AttachContractDocumentDialog,
  CancelContractDialog,
  CancelStudentDialog,
  CreateContractDialog as CreateContractDialogBase,
  RenewContractDialog,
} from "@/components/admin/student-detail-dialogs";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  formatDate,
  formatMoney,
  formatPhone,
  formatWeekday,
} from "@/lib/internal/format";
import { createSignedFileUrl } from "@/lib/internal/storage";
import { getStudent } from "@/lib/internal/students";
import { isStudentDetailTab } from "@/lib/internal/student-detail-tabs";

export const metadata: Metadata = { title: "Ficha do aluno" };

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function StudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const requestedTab = (await searchParams).tab;
  const activeTab =
    requestedTab === "financeiro"
      ? "finance"
      : isStudentDetailTab(requestedTab)
        ? requestedTab
        : "overview";
  const student = await getStudent(id);
  const contracts = [...(student.contracts ?? [])].sort((a, b) =>
    b.start_date.localeCompare(a.start_date),
  );
  const invoices = [...(student.invoices ?? [])]
    .map((invoice) => ({ ...invoice, payments: asArray(invoice.payments) }))
    .sort((a, b) => b.reference_month.localeCompare(a.reference_month));
  const lessons = [...(student.lesson_records ?? [])].sort((a, b) =>
    b.lesson_date.localeCompare(a.lesson_date),
  );
  const contractUrls = new Map(
    await Promise.all(
      contracts.map(
        async (contract) =>
          [
            contract.id,
            await createSignedFileUrl(
              "contracts",
              contract.document_storage_key,
            ),
          ] as const,
      ),
    ),
  );
  const receiptUrls = new Map(
    await Promise.all(
      invoices.flatMap((invoice) =>
        asArray(invoice.payments).map(
          async (payment) =>
            [
              payment.id,
              await createSignedFileUrl(
                "payment-receipts",
                payment.receipt_storage_key,
              ),
            ] as const,
        ),
      ),
    ),
  );
  const activeGuardians = asArray(student.guardians).filter(
    (guardian) => guardian.active && !guardian.archived_at,
  );
  const hasOverdueInvoice = invoices.some(
    (invoice) => invoice.status === "overdue",
  );

  return (
    <>
      <Button asChild className="admin-back-link" size="sm" variant="ghost">
        <Link href="/admin/alunos">
          <ArrowLeftIcon data-icon="inline-start" />
          Voltar para alunos
        </Link>
      </Button>
      <PageHeader
        actions={
          <>
            <AddGuardianDialog studentId={student.id} />
            <CreateContractDialogBase studentId={student.id} />
            {student.status !== "cancelled" ? (
              <CancelStudentDialog
                studentId={student.id}
                studentName={student.full_name}
              />
            ) : null}
          </>
        }
        description={`Aluno desde ${formatDate(student.created_at)} · ${formatPhone(student.whatsapp)}`}
        title={student.full_name}
      />
      <div className="admin-detail-status">
        <StatusBadge status={student.status} />
        <StatusBadge status={hasOverdueInvoice ? "overdue" : "paid"} />
      </div>
      <StudentDetailTabs initialTab={activeTab}>
        <TabsList className="admin-detail-tabs">
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="classes">Turmas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="admin-detail-grid">
            <Card>
              <CardHeader>
                <CardTitle>Dados gerais</CardTitle>
                <CardDescription>
                  Informações de contato e operação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActionForm
                  action={updateStudentAction}
                  className="admin-form-grid"
                >
                  <input name="student_id" type="hidden" value={student.id} />
                  <FormField
                    className="admin-field-span-2"
                    htmlFor="detail-name"
                    label="Nome completo"
                  >
                    <Input
                      defaultValue={student.full_name}
                      id="detail-name"
                      name="full_name"
                      required
                    />
                  </FormField>
                  <FormField htmlFor="detail-whatsapp" label="WhatsApp">
                    <PhoneInput
                      defaultValue={student.whatsapp}
                      id="detail-whatsapp"
                      name="whatsapp"
                      required
                    />
                  </FormField>
                  <FormField htmlFor="detail-email" label="E-mail">
                    <Input
                      defaultValue={student.email ?? ""}
                      id="detail-email"
                      name="email"
                      type="email"
                    />
                  </FormField>
                  <FormField htmlFor="detail-birth" label="Nascimento">
                    <Input
                      defaultValue={student.birth_date ?? ""}
                      id="detail-birth"
                      name="birth_date"
                      type="date"
                    />
                  </FormField>
                  <FormField htmlFor="detail-status" label="Status">
                    <AdminSelect
                      defaultValue={
                        student.status === "cancelled"
                          ? "inactive"
                          : student.status
                      }
                      disabled={student.status === "cancelled"}
                      id="detail-status"
                      name="status"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </AdminSelect>
                  </FormField>
                  <FormField
                    htmlFor="detail-contact"
                    label="Contato financeiro"
                  >
                    <AdminSelect
                      defaultValue={student.financial_contact_type}
                      id="detail-contact"
                      name="financial_contact_type"
                    >
                      <option value="student">Aluno</option>
                      {activeGuardians.length ? (
                        <option value="guardian">Responsável</option>
                      ) : null}
                    </AdminSelect>
                  </FormField>
                  <FormField
                    htmlFor="detail-guardian"
                    label="Responsável financeiro"
                  >
                    <AdminSelect
                      defaultValue={student.financial_guardian_id ?? ""}
                      id="detail-guardian"
                      name="financial_guardian_id"
                    >
                      <option value="">Nenhum</option>
                      {activeGuardians.map((guardian) => (
                        <option key={guardian.id} value={guardian.id}>
                          {guardian.full_name}
                        </option>
                      ))}
                    </AdminSelect>
                  </FormField>
                  <FormField
                    className="admin-field-span-2"
                    htmlFor="detail-notes"
                    label="Observações"
                  >
                    <Textarea
                      defaultValue={student.administrative_notes ?? ""}
                      id="detail-notes"
                      name="administrative_notes"
                      rows={4}
                    />
                  </FormField>
                  <div className="admin-form-actions admin-field-span-2">
                    <SubmitButton>Salvar alterações</SubmitButton>
                  </div>
                </ActionForm>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Responsáveis</CardTitle>
                <CardDescription>
                  {activeGuardians.length} responsável(is) ativo(s).
                </CardDescription>
              </CardHeader>
              <CardContent className="admin-stack-list">
                {activeGuardians.length ? (
                  activeGuardians.map((guardian) => (
                    <div className="admin-profile-row" key={guardian.id}>
                      <div>
                        <strong>{guardian.full_name}</strong>
                        <span>{guardian.relationship ?? "Responsável"}</span>
                      </div>
                      <div>
                        <span>{formatPhone(guardian.whatsapp)}</span>
                        <small>{guardian.email ?? "Sem e-mail"}</small>
                      </div>
                      {student.financial_guardian_id === guardian.id ? (
                        <StatusBadge status="active" />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="admin-empty-line">
                    Nenhum responsável cadastrado.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="contracts">
          <Card>
            <CardHeader className="admin-card-header-row">
              <div>
                <CardTitle>Histórico de contratos</CardTitle>
                <CardDescription>
                  O contrato ativo é a fonte de valor e vencimento.
                </CardDescription>
              </div>
              <CreateContractDialogBase studentId={student.id} />
            </CardHeader>
            <CardContent className="admin-stack-list">
              {contracts.length ? (
                contracts.map((contract) => (
                  <div className="admin-record-row" key={contract.id}>
                    <div>
                      <strong>
                        {contract.modality} · {contract.contract_type}
                      </strong>
                      <span>
                        {contract.weekly_frequency} aula(s)/semana · vence dia{" "}
                        {contract.due_day}
                      </span>
                    </div>
                    <div>
                      <strong>{formatMoney(contract.monthly_amount)}</strong>
                      <span>
                        {formatDate(contract.start_date)} a{" "}
                        {formatDate(contract.end_date)}
                      </span>
                    </div>
                    <StatusBadge status={contract.status} />
                    <div className="admin-inline-actions">
                      {contractUrls.get(contract.id) ? (
                        <Button asChild size="icon-sm" variant="ghost">
                          <a
                            aria-label="Abrir contrato"
                            href={contractUrls.get(contract.id)!}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </Button>
                      ) : (
                        <AttachContractDocumentDialog
                          contractId={contract.id}
                          studentId={student.id}
                        />
                      )}
                      {contract.status === "active" ? (
                        <>
                          <RenewContractDialog
                            contract={{
                              id: contract.id,
                              student_id: contract.student_id,
                              modality: contract.modality,
                              weekly_frequency: contract.weekly_frequency,
                              contract_type: contract.contract_type,
                              monthly_amount: Number(contract.monthly_amount),
                              due_day: contract.due_day,
                              end_date: contract.end_date,
                            }}
                          />
                          <CancelContractDialog
                            contractId={contract.id}
                            studentId={student.id}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="admin-empty-line">Nenhum contrato cadastrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Cobranças e pagamentos</CardTitle>
              <CardDescription>
                Registre pagamentos e comprovantes diretamente nesta ficha. O
                Financeiro consolida os resultados automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="admin-stack-list">
              {invoices.length ? (
                invoices.map((invoice) => {
                  const payment = invoice.payments?.[0];
                  return (
                    <div className="admin-record-row" key={invoice.id}>
                      <div>
                        <strong>{formatDate(invoice.reference_month)}</strong>
                        <span>Vencimento {formatDate(invoice.due_date)}</span>
                      </div>
                      <div>
                        <strong>{formatMoney(invoice.amount)}</strong>
                        <span>
                          {payment
                            ? `Pago em ${formatDate(payment.payment_date)}`
                            : "Sem pagamento"}
                        </span>
                      </div>
                      <StatusBadge status={invoice.status} />
                      {invoice.status === "pending" ||
                      invoice.status === "overdue" ? (
                        <PaymentDialog
                          invoice={{
                            id: invoice.id,
                            studentId: student.id,
                            studentName: student.full_name,
                            amount: Number(invoice.amount),
                          }}
                        />
                      ) : payment && receiptUrls.get(payment.id) ? (
                        <Button asChild size="icon-sm" variant="ghost">
                          <a
                            aria-label="Abrir comprovante"
                            href={receiptUrls.get(payment.id)!}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </Button>
                      ) : payment ? (
                        <AttachPaymentReceiptDialog
                          paymentId={payment.id}
                          studentId={student.id}
                        />
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <p className="admin-empty-line">Nenhuma cobrança gerada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle>Histórico pedagógico</CardTitle>
              <CardDescription>Registros em ordem cronológica.</CardDescription>
            </CardHeader>
            <CardContent className="admin-timeline">
              {lessons.length ? (
                lessons.map((lesson) => (
                  <article key={lesson.id}>
                    <time>{formatDate(lesson.lesson_date)}</time>
                    <div>
                      <h3>{lesson.lesson_name ?? "Aula"}</h3>
                      {lesson.content ? (
                        <p>
                          <strong>Conteúdo:</strong> {lesson.content}
                        </p>
                      ) : null}
                      {lesson.lesson_report ? (
                        <p>
                          <strong>Relatório:</strong> {lesson.lesson_report}
                        </p>
                      ) : null}
                      {lesson.homework ? (
                        <p>
                          <strong>Tarefa:</strong> {lesson.homework}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))
              ) : (
                <p className="admin-empty-line">Nenhum registro pedagógico.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Turmas e agenda</CardTitle>
              <CardDescription>
                Participações e horários recorrentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="admin-detail-grid">
              {" "}
              <div>
                <h3 className="admin-section-label">
                  <UsersIcon />
                  Turmas
                </h3>
                {(student.class_memberships ?? []).length ? (
                  student.class_memberships.map((membership) => (
                    <div className="admin-list-row" key={membership.id}>
                      <span>{formatDate(membership.joined_at)}</span>
                      <strong>
                        {(membership.classes as { name?: string } | null)
                          ?.name ?? "Turma"}
                      </strong>
                      <span>{formatDate(membership.left_at)}</span>
                      <StatusBadge status={membership.status} />
                    </div>
                  ))
                ) : (
                  <p className="admin-empty-line">Sem histórico de turmas.</p>
                )}
              </div>
              <div>
                <h3 className="admin-section-label">
                  <CalendarDaysIcon />
                  Horários
                </h3>
                {(student.schedule_assignments ?? []).length ? (
                  student.schedule_assignments.map((assignment) => (
                    <div className="admin-list-row" key={assignment.id}>
                      <span>{formatWeekday(assignment.weekly_slots?.weekday)}</span>
                      <strong>
                        {assignment.weekly_slots?.start_time?.slice(0, 5)}–
                        {assignment.weekly_slots?.end_time?.slice(0, 5)}
                      </strong>
                      <span>{formatDate(assignment.start_date)}</span>
                      <StatusBadge
                        status={assignment.active ? "active" : "ended"}
                      />
                    </div>
                  ))
                ) : (
                  <p className="admin-empty-line">Sem horário individual.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </StudentDetailTabs>
    </>
  );
}
