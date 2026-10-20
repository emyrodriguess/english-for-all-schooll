import Link from "next/link";
import type { Metadata } from "next";
import { MoreHorizontalIcon, SearchIcon, UsersIcon } from "lucide-react";

import { CreateClassDialog as CreateClassDialogBase } from "@/components/admin/class-dialogs";
import { AdminDesignSelect } from "@/components/admin/admin-design-select";
import { AdminFilterBar } from "@/components/admin/filter-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminDataTable,
  AdminEmptyState,
  AdminFilterActions,
  AdminFilterField,
  AdminFilterFields,
  AdminInput,
} from "@/components/admin/admin-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClasses } from "@/lib/internal/classes";
import { formatTime, formatWeekday } from "@/lib/internal/format";

export const metadata: Metadata = { title: "Turmas" };

function CreateClassDialog() {
  return <CreateClassDialogBase />;
}

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const classes = await getClasses(params);
  return (
    <>
      <AdminPageHeader
        actions={<CreateClassDialog />}
        description={`${classes.length} turma(s) cadastrada(s)`}
        title="Turmas"
      />
      <AdminCard className="admin-filter-card">
        <AdminCardContent>
          <AdminFilterBar>
            <AdminFilterFields>
              <AdminFilterField>
                <div className="admin-filter-search">
                  <SearchIcon />
                  <AdminInput
                    defaultValue={params.q}
                    name="q"
                    placeholder="Buscar turma"
                  />
                </div>
              </AdminFilterField>
              <AdminFilterField label="Status">
                <AdminDesignSelect
                  defaultValue={params.status ?? ""}
                  id="class-status-filter"
                  name="status"
                  options={[
                    { label: "Todos", value: "" },
                    { label: "Ativas", value: "active" },
                    { label: "Inativas", value: "inactive" },
                  ]}
                  placeholder="Selecionar status"
                />
              </AdminFilterField>
            </AdminFilterFields>
            <AdminFilterActions>
              <AdminButton type="submit">Filtrar</AdminButton>
              <AdminButton asChild variant="link">
                <Link href="/admin/turmas">Limpar</Link>
              </AdminButton>
            </AdminFilterActions>
          </AdminFilterBar>
        </AdminCardContent>
      </AdminCard>
      {classes.length ? (
        <div className="admin-class-list admin-table-wrap">
          <AdminDataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Alunos ativos</TableHead>
                <TableHead>Horários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => {
                const members =
                  classItem.class_memberships?.filter(
                    (item) => item.status === "active",
                  ).length ?? 0;
                const assignments =
                  classItem.schedule_assignments?.filter(
                    (item) => item.active,
                  ) ?? [];
                return (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <Link
                        className="admin-class-table-name"
                        href={`/admin/turmas/${classItem.id}`}
                      >
                        <span className="admin-class-icon">
                          <UsersIcon />
                        </span>
                        <strong>{classItem.name}</strong>
                      </Link>
                    </TableCell>
                    <TableCell>{members} aluno(s)</TableCell>
                    <TableCell>
                      <div className="admin-class-table-schedule">
                        {assignments.length ? (
                          assignments.map((assignment) => (
                            <span key={assignment.id}>
                              {formatWeekday(assignment.weekly_slots?.weekday)}{" "}
                              ·{" "}
                              {formatTime(assignment.weekly_slots?.start_time)}–
                              {formatTime(assignment.weekly_slots?.end_time)}
                            </span>
                          ))
                        ) : (
                          <span>Sem horário definido</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={classItem.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <AdminButton
                            aria-label={`Ações de ${classItem.name}`}
                            size="icon-sm"
                            variant="ghost"
                          >
                            <MoreHorizontalIcon />
                          </AdminButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/turmas/${classItem.id}`}>
                              Abrir turma
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </AdminDataTable>
        </div>
      ) : (
        <AdminEmptyState
          action={<CreateClassDialog />}
          description="Crie uma turma e depois associe alunos e horários."
          icon={<UsersIcon />}
          title="Nenhuma turma cadastrada"
        />
      )}
    </>
  );
}
