import Link from "next/link";
import type { Metadata } from "next";
import { BookOpenCheckIcon, SearchIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import {
  AdminFilterAdvanced,
  AdminFilterBar,
} from "@/components/admin/filter-form";
import { PlannerEditDialog } from "@/components/admin/planner-edit-dialog";
import { PlannerDialog as PlannerDialogBase } from "@/components/admin/planner-dialog";
import { SearchableEntitySelect } from "@/components/admin/searchable-entity-select";
import {
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
  AdminDateInput,
  AdminEmptyState,
  AdminFilterActions,
  AdminFilterField,
  AdminFilterFields,
  AdminInput,
} from "@/components/admin/admin-ui";
import { getPlanner } from "@/lib/internal/planner";
import { formatDate } from "@/lib/internal/format";

export const metadata: Metadata = { title: "Planner" };
type Params = {
  studentId?: string;
  classId?: string;
  from?: string;
  to?: string;
  q?: string;
};

function PlannerDialog(props: Parameters<typeof PlannerDialogBase>[0]) {
  return <PlannerDialogBase {...props} />;
}

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const data = await getPlanner(params);
  return (
    <>
      <AdminPageHeader
        actions={
          <PlannerDialog
            classes={
              data.classes as unknown as Parameters<
                typeof PlannerDialog
              >[0]["classes"]
            }
            students={data.students}
          />
        }
        description="Histórico pedagógico individual e de turmas"
        title="Planner"
      />
      <AdminCard className="admin-filter-card admin-planner-filter-card">
        <AdminCardContent>
          <AdminFilterBar className="admin-planner-filter-bar">
            <AdminFilterFields>
              <AdminFilterField>
                <div className="admin-filter-search">
                  <SearchIcon />
                  <AdminInput
                    defaultValue={params.q}
                    name="q"
                    placeholder="Buscar em aulas, conteúdos e relatórios"
                  />
                </div>
              </AdminFilterField>
              <AdminFilterField label="Aluno">
                <SearchableEntitySelect
                  defaultValue={params.studentId ?? ""}
                  emptyLabel="Todos"
                  id="planner-student-filter"
                  name="studentId"
                  options={data.students.map((item) => ({
                    label: item.full_name,
                    value: item.id,
                  }))}
                  placeholder="Buscar aluno"
                />
              </AdminFilterField>
              <AdminFilterField label="Turma">
                <SearchableEntitySelect
                  defaultValue={params.classId ?? ""}
                  emptyLabel="Todas"
                  id="planner-class-filter"
                  name="classId"
                  options={data.classes.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  placeholder="Buscar turma"
                />
              </AdminFilterField>
            </AdminFilterFields>
            <AdminFilterAdvanced defaultOpen={Boolean(params.from || params.to)}>
              <AdminFilterFields>
                <AdminFilterField label="De">
                  <AdminDateInput
                    defaultValue={params.from}
                    name="from"
                    type="date"
                  />
                </AdminFilterField>
                <AdminFilterField label="Até">
                  <AdminDateInput
                    defaultValue={params.to}
                    name="to"
                    type="date"
                  />
                </AdminFilterField>
              </AdminFilterFields>
            </AdminFilterAdvanced>
            <AdminFilterActions>
              <AdminButton type="submit">Filtrar</AdminButton>
              <AdminButton asChild variant="link">
                <Link href="/admin/planner">Limpar</Link>
              </AdminButton>
            </AdminFilterActions>
          </AdminFilterBar>
        </AdminCardContent>
      </AdminCard>
      <div className="admin-planner-results-header">
        <div>
          <h2>Registros pedagógicos</h2>
          <p>
            {data.records.length
              ? `${data.records.length} registro${data.records.length === 1 ? "" : "s"} encontrado${data.records.length === 1 ? "" : "s"}`
              : "Consulte, filtre ou registre uma nova aula."}
          </p>
        </div>
      </div>
      <div className="admin-planner-list">
        {data.records.length ? (
          data.records.map((record) => {
            const subject = record.student_id
              ? record.students?.full_name
              : record.classes?.name;
            return (
              <AdminCard className="admin-planner-record" key={record.id}>
                <AdminCardHeader className="admin-card-header-row">
                  <div>
                    <AdminCardTitle>{record.lesson_name ?? "Aula"}</AdminCardTitle>
                    <AdminCardDescription className="admin-planner-record-meta">
                      {record.student_id ? (
                        <Link
                          className="admin-table-link"
                          href={`/admin/alunos/${record.student_id}`}
                        >
                          {subject ?? "Aluno"}
                        </Link>
                      ) : record.class_id ? (
                        <Link
                          className="admin-table-link"
                          href={`/admin/turmas/${record.class_id}`}
                        >
                          {subject ?? "Turma"}
                        </Link>
                      ) : (
                        "Registro"
                      )}
                      <span aria-hidden="true">•</span>
                      <time dateTime={record.lesson_date}>
                        {formatDate(record.lesson_date)}
                      </time>
                    </AdminCardDescription>
                  </div>
                  <div className="admin-inline-actions">
                    <span className="admin-class-icon">
                      <BookOpenCheckIcon />
                    </span>
                    <PlannerEditDialog record={record} />
                  </div>
                </AdminCardHeader>
                <AdminCardContent>
                  <div className="admin-planner-copy">
                    {record.content ? (
                      <section>
                        <h3>Conteúdo</h3>
                        <p>{record.content}</p>
                      </section>
                    ) : null}
                    {record.lesson_report ? (
                      <section>
                        <h3>Relatório</h3>
                        <p>{record.lesson_report}</p>
                      </section>
                    ) : null}
                    {record.homework ? (
                      <section>
                        <h3>Tarefa</h3>
                        <p>{record.homework}</p>
                      </section>
                    ) : null}
                    {record.observations ? (
                      <section className="admin-planner-observations">
                        <h3>Observações</h3>
                        <p>{record.observations}</p>
                      </section>
                    ) : null}
                  </div>
                  {record.lesson_student_notes?.length ? (
                    <div className="admin-note-grid">
                      {record.lesson_student_notes.map((note) => (
                        <article key={note.id}>
                          <strong>{note.students?.full_name ?? "Aluno"}</strong>
                          <p>
                            {note.individual_report ??
                              "Sem observação individual."}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </AdminCardContent>
              </AdminCard>
            );
          })
        ) : (
          <AdminEmptyState
            icon={<BookOpenCheckIcon />}
            title="Nenhum registro encontrado. Use “Registrar aula” para começar."
          />
        )}
      </div>
    </>
  );
}
