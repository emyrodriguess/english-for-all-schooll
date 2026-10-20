import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeftIcon, CalendarDaysIcon, Trash2Icon } from "lucide-react";

import {
  endClassAction,
  endMembershipAction,
} from "@/app/admin/(protected)/turmas/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import {
  AdminButton,
  AdminDataTable,
  AdminDateInput,
  AdminInput,
} from "@/components/admin/admin-ui";
import {
  EditClassDialog,
  JoinClassDialog,
} from "@/components/admin/class-dialogs";
import { FormField } from "@/components/admin/form-field";
import { PageHeader } from "@/components/admin/page-header";
import { PlannerDialog } from "@/components/admin/planner-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClassDetail } from "@/lib/internal/classes";
import {
  formatDate,
  formatPhone,
  formatTime,
  formatWeekday,
  initials,
  saoPauloToday,
} from "@/lib/internal/format";

export const metadata: Metadata = { title: "Detalhe da turma" };

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { classData, students } = await getClassDetail(id);
  const memberships = [...(classData.class_memberships ?? [])].sort((a, b) =>
    b.joined_at.localeCompare(a.joined_at),
  );
  const lessons = [...(classData.lesson_records ?? [])].sort((a, b) =>
    b.lesson_date.localeCompare(a.lesson_date),
  );
  const activeMemberIds = new Set(
    memberships
      .filter((membership) => membership.status === "active")
      .map((membership) => membership.student_id),
  );
  const availableStudents = students.filter(
    (student) => !activeMemberIds.has(student.id),
  );
  return (
    <>
      <AdminButton
        asChild
        className="admin-back-link"
        size="sm"
        variant="ghost"
      >
        <Link href="/admin/turmas">
          <ArrowLeftIcon data-icon="inline-start" />
          Voltar para turmas
        </Link>
      </AdminButton>
      <PageHeader
        actions={
          <div className="admin-class-detail-actions">
            <JoinClassDialog
              classId={classData.id}
              students={availableStudents}
            />
            <PlannerDialog
              classes={
                [
                  {
                    id: classData.id,
                    name: classData.name,
                    class_memberships: classData.class_memberships,
                  },
                ] as Parameters<typeof PlannerDialog>[0]["classes"]
              }
              initialTarget={classData.id}
              initialType="class"
              students={students}
              triggerLabel="Registrar aula"
            />
            <EditClassDialog
              classItem={{
                id: classData.id,
                name: classData.name,
                notes: classData.notes,
              }}
            />
            {classData.status === "active" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <AdminButton variant="destructive">
                    Encerrar turma
                  </AdminButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Encerrar {classData.name}?</DialogTitle>
                    <DialogDescription>
                      Alunos e horários serão encerrados na data informada; todo
                      o histórico continuará disponível.
                    </DialogDescription>
                  </DialogHeader>
                  <ActionForm
                    action={endClassAction}
                    className="admin-login-form"
                  >
                    <input name="class_id" type="hidden" value={classData.id} />
                    <FormField
                      hint="Os horários e participantes serão encerrados nesta data; o histórico permanece."
                      htmlFor="class-end-date"
                      label="Data efetiva"
                    >
                      <AdminDateInput
                        defaultValue={saoPauloToday()}
                        id="class-end-date"
                        name="effective_date"
                        required
                        type="date"
                      />
                    </FormField>
                    <FormField
                      hint="Digite ENCERRAR para confirmar."
                      htmlFor="class-end-confirmation"
                      label="Confirmação"
                    >
                      <AdminInput
                        id="class-end-confirmation"
                        name="confirmation"
                        placeholder="ENCERRAR"
                        required
                      />
                    </FormField>
                    <SubmitButton variant="destructive">
                      Encerrar turma
                    </SubmitButton>
                  </ActionForm>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        }
        description={
          classData.notes ?? "Gestão de participantes, horários e registros."
        }
        title={classData.name}
      />
      <div className="admin-detail-status">
        <StatusBadge status={classData.status} />
      </div>
      <Tabs defaultValue="students">
        <TabsList className="admin-detail-tabs">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
          <TabsTrigger value="planner">Planner</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card className="admin-class-membership-card">
            <CardHeader>
              <CardTitle>Participantes</CardTitle>
              <CardDescription>
                Entradas e saídas são mantidas no histórico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {memberships.length ? (
                <div className="admin-table-wrap admin-class-membership-table">
                  <AdminDataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberships.map((membership) => (
                        <TableRow key={membership.id}>
                          <TableCell>
                            <Link
                              className="admin-student-cell"
                              href={`/admin/alunos/${membership.student_id}`}
                            >
                              <Avatar>
                                <AvatarFallback>
                                  {initials(
                                    membership.students?.full_name ?? "Aluno",
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                <strong>
                                  {membership.students?.full_name ?? "Aluno"}
                                </strong>
                                <small>
                                  {membership.students?.email ??
                                    formatPhone(membership.students?.whatsapp)}
                                </small>
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            {formatPhone(membership.students?.whatsapp)}
                          </TableCell>
                          <TableCell>
                            {membership.left_at
                              ? `Saída ${formatDate(membership.left_at)}`
                              : `Entrada ${formatDate(membership.joined_at)}`}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={membership.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            {membership.status === "active" ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <AdminButton
                                    aria-label={`Remover ${membership.students?.full_name ?? "aluno"} da turma`}
                                    className="admin-membership-remove"
                                    size="icon-sm"
                                    variant="ghost"
                                  >
                                    <Trash2Icon />
                                  </AdminButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Encerrar participação?
                                    </DialogTitle>
                                    <DialogDescription>
                                      O histórico do aluno nesta turma será
                                      preservado.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ActionForm
                                    action={endMembershipAction}
                                    className="admin-login-form"
                                  >
                                    <input
                                      name="class_id"
                                      type="hidden"
                                      value={classData.id}
                                    />
                                    <input
                                      name="membership_id"
                                      type="hidden"
                                      value={membership.id}
                                    />
                                    <FormField
                                      htmlFor={`left-${membership.id}`}
                                      label="Data de saída"
                                    >
                                      <AdminDateInput
                                        defaultValue={saoPauloToday()}
                                        id={`left-${membership.id}`}
                                        name="left_on"
                                        required
                                        type="date"
                                      />
                                    </FormField>
                                    <SubmitButton>Confirmar saída</SubmitButton>
                                  </ActionForm>
                                </DialogContent>
                              </Dialog>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </AdminDataTable>
                </div>
              ) : (
                <p className="admin-empty-line">Nenhum aluno nesta turma.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule">
          <Card className="admin-class-planner-card">
            <CardHeader>
              <CardTitle>Horários da turma</CardTitle>
              <CardDescription>
                A agenda é a fonte de verdade dos horários.
              </CardDescription>
            </CardHeader>
            <CardContent className="admin-stack-list">
              {(classData.schedule_assignments ?? []).length ? (
                classData.schedule_assignments.map((assignment) => (
                  <div className="admin-class-schedule-row" key={assignment.id}>
                    <span className="admin-class-icon">
                      <CalendarDaysIcon />
                    </span>
                    <div>
                      <strong>
                        {formatWeekday(assignment.weekly_slots?.weekday)}
                      </strong>
                      <span>
                        {formatTime(assignment.weekly_slots?.start_time)}–
                        {formatTime(assignment.weekly_slots?.end_time)}
                      </span>
                    </div>
                    <StatusBadge
                      status={assignment.active ? "active" : "ended"}
                    />
                    <time>{formatDate(assignment.start_date)}</time>
                  </div>
                ))
              ) : (
                <p className="admin-empty-line">
                  Nenhum horário associado. Use a Agenda para ocupar um horário
                  com esta turma.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle>Histórico pedagógico</CardTitle>
              <CardDescription>
                Registros coletivos e observações individuais.
              </CardDescription>
            </CardHeader>
            <CardContent className="admin-class-planner-list">
              {lessons.length ? (
                lessons.map((lesson) => (
                  <article
                    className="admin-class-planner-entry"
                    key={lesson.id}
                  >
                    <header>
                      <time dateTime={lesson.lesson_date}>
                        {formatDate(lesson.lesson_date)}
                      </time>
                      <h3>{lesson.lesson_name ?? "Aula"}</h3>
                    </header>
                    <div>
                      {lesson.content ? (
                        <section>
                          <h4>Conteúdo</h4>
                          <p>{lesson.content}</p>
                        </section>
                      ) : null}
                      {lesson.lesson_report ? (
                        <section>
                          <h4>Relatório</h4>
                          <p>{lesson.lesson_report}</p>
                        </section>
                      ) : null}
                      {lesson.homework ? (
                        <section>
                          <h4>Tarefa</h4>
                          <p>{lesson.homework}</p>
                        </section>
                      ) : null}
                      {lesson.observations ? (
                        <section className="admin-class-planner-observations">
                          <h4>Observações</h4>
                          <p>{lesson.observations}</p>
                        </section>
                      ) : null}
                      {lesson.lesson_student_notes?.length ? (
                        <details className="admin-class-planner-notes">
                          <summary>
                            {lesson.lesson_student_notes.length} observação(ões)
                            individual(is)
                          </summary>
                          {lesson.lesson_student_notes.map((note) => (
                            <section key={note.id}>
                              <h4>{note.students?.full_name ?? "Aluno"}</h4>
                              {note.individual_report ? (
                                <p>{note.individual_report}</p>
                              ) : null}
                              {note.observations ? (
                                <p>{note.observations}</p>
                              ) : null}
                              {note.homework ? <p>{note.homework}</p> : null}
                              {!note.individual_report &&
                              !note.observations &&
                              !note.homework ? (
                                <p>Sem detalhamento individual.</p>
                              ) : null}
                            </section>
                          ))}
                        </details>
                      ) : null}
                    </div>
                  </article>
                ))
              ) : (
                <p className="admin-empty-line">
                  Nenhum registro pedagógico para esta turma.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
