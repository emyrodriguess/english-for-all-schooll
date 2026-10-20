import type { Metadata } from "next";
import { CalendarDaysIcon } from "lucide-react";

import Link from "next/link";

import { AdminFilterBar } from "@/components/admin/filter-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ScheduleSlotActions } from "@/components/admin/schedule-slot-actions";
import { SearchableEntitySelect } from "@/components/admin/searchable-entity-select";
import { DesignSystemSelect } from "@/components/admin/design-system-select";
import {
  AssignSlotDialog,
  CreateSlotDialog as CreateSlotDialogBase,
} from "@/components/admin/schedule-dialogs";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminButton,
  AdminFilterActions,
  AdminFilterField,
  AdminFilterFields,
} from "@/components/admin/admin-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate, formatTime, saoPauloToday } from "@/lib/internal/format";
import { getSchedule } from "@/lib/internal/schedule";

export const metadata: Metadata = { title: "Agenda" };
const weekdays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
type Params = {
  weekday?: string;
  studentId?: string;
  classId?: string;
  status?: string;
};

function CreateSlotDialog() {
  return <CreateSlotDialogBase />;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const { slots, students, classes } = await getSchedule();
  const today = saoPauloToday();
  const currentWeekday = new Date(`${today}T12:00:00-03:00`).getDay() || 7;
  const filteredWeekday = Number(params.weekday);
  const defaultOpenDay = weekdays[
    filteredWeekday >= 1 && filteredWeekday <= weekdays.length
      ? filteredWeekday - 1
      : currentWeekday - 1
  ];
  const currentAssignment = (slot: (typeof slots)[number]) =>
    slot.schedule_assignments?.find(
      (assignment) =>
        assignment.active &&
        assignment.start_date <= today &&
        (!assignment.end_date || assignment.end_date >= today),
    );
  const visibleSlots = slots.filter((slot) => {
    if (!slot.active) return false;
    const assignment = currentAssignment(slot);
    if (params.weekday && slot.weekday !== Number(params.weekday)) return false;
    if (params.studentId && assignment?.student_id !== params.studentId)
      return false;
    if (params.classId && assignment?.class_id !== params.classId) return false;
    if (params.status === "available" && assignment) return false;
    if (params.status === "occupied" && !assignment) return false;
    return true;
  });
  return (
    <>
      <AdminPageHeader
        actions={<CreateSlotDialog />}
        description="Disponibilidade semanal recorrente"
        title="Agenda"
      />
      <section className="admin-filter-card">
          <AdminFilterBar>
            <AdminFilterFields>
              <AdminFilterField label="Dia da semana">
                <DesignSystemSelect
                  defaultValue={params.weekday ?? ""}
                  emptyLabel="Todos"
                  id="agenda-weekday-filter"
                  name="weekday"
                  options={weekdays.map((label, index) => ({
                    label,
                    value: String(index + 1),
                  }))}
                />
              </AdminFilterField>
              <AdminFilterField label="Aluno">
                <SearchableEntitySelect
                  defaultValue={params.studentId ?? ""}
                  emptyLabel="Todos"
                  id="agenda-student-filter"
                  name="studentId"
                  options={students.map((student) => ({
                    label: student.full_name,
                    value: student.id,
                  }))}
                  placeholder="Buscar aluno"
                />
              </AdminFilterField>
              <AdminFilterField label="Turma">
                <SearchableEntitySelect
                  defaultValue={params.classId ?? ""}
                  emptyLabel="Todas"
                  id="agenda-class-filter"
                  name="classId"
                  options={classes.map((classItem) => ({
                    label: classItem.name,
                    value: classItem.id,
                  }))}
                  placeholder="Buscar turma"
                />
              </AdminFilterField>
              <AdminFilterField label="Situação">
                <DesignSystemSelect
                  defaultValue={params.status ?? ""}
                  emptyLabel="Todas"
                  id="agenda-status-filter"
                  name="status"
                  options={[
                    { label: "Vago", value: "available" },
                    { label: "Ocupado", value: "occupied" },
                  ]}
                />
              </AdminFilterField>
            </AdminFilterFields>
            <AdminFilterActions>
              <AdminButton type="submit">Filtrar</AdminButton>
              <AdminButton asChild variant="link">
                <Link href="/admin/agenda">Limpar</Link>
              </AdminButton>
            </AdminFilterActions>
          </AdminFilterBar>
      </section>
      <Accordion
        className="admin-schedule-accordion"
        defaultValue={[defaultOpenDay]}
        type="multiple"
      >
        {weekdays.map((day, index) => {
          const daySlots = visibleSlots.filter(
            (slot) => slot.weekday === index + 1,
          );
          const configuredSlots = slots.filter(
            (slot) => slot.active && slot.weekday === index + 1,
          );
          const availableCount = daySlots.filter(
            (slot) => !currentAssignment(slot),
          ).length;
          const occupiedCount = daySlots.length - availableCount;
          const hasActiveFilters = Boolean(
            params.weekday || params.studentId || params.classId || params.status,
          );
          return (
            <AccordionItem
              className="admin-day-accordion"
              key={day}
              value={day}
            >
              <AccordionTrigger className="admin-day-accordion-trigger">
                <span className="admin-day-accordion-heading">
                  <strong>{day}</strong>
                  <span className="admin-day-accordion-summary">
                    {daySlots.length
                      ? `${availableCount} vaga(s) · ${occupiedCount} ocupado(s)`
                      : hasActiveFilters && configuredSlots.length
                        ? "Sem horários para estes filtros"
                        : "Sem horários configurados"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="admin-day-accordion-content">
                <div className="admin-schedule-list">
                  {daySlots.length ? (
                    daySlots.map((slot) => {
                      const activeAssignment = currentAssignment(slot);
                      const assignedName =
                        activeAssignment?.assignment_type === "class"
                          ? activeAssignment.classes?.name
                          : activeAssignment?.students?.full_name;
                      return (
                        <div className="admin-slot-row" key={slot.id}>
                          <time>
                            {formatTime(slot.start_time)}
                            <small>{formatTime(slot.end_time)}</small>
                          </time>
                          <div className="admin-slot-details">
                            <div className="admin-slot-title">
                              <strong>{assignedName ?? "Disponível"}</strong>
                              {activeAssignment ? (
                                <StatusBadge status="active" />
                              ) : null}
                            </div>
                            <span>
                              {activeAssignment
                                ? formatDate(activeAssignment.start_date)
                                : "Horário livre"}
                            </span>
                          </div>
                          <div className="admin-slot-meta">
                            {activeAssignment ? (
                              <ScheduleSlotActions
                                assignmentId={activeAssignment.id}
                                slotId={slot.id}
                                today={today}
                              />
                            ) : (
                              <div className="admin-slot-actions">
                                <AssignSlotDialog
                                  classes={classes}
                                  slotId={slot.id}
                                  students={students}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="admin-day-empty">
                      <span className="admin-day-empty-icon">
                        <CalendarDaysIcon aria-hidden="true" />
                      </span>
                      <strong>
                        {hasActiveFilters && configuredSlots.length
                          ? "Nenhum horário corresponde aos filtros."
                          : "Nenhum horário configurado."}
                      </strong>
                      {hasActiveFilters && configuredSlots.length ? (
                        <AdminButton asChild size="sm" variant="outline">
                          <Link href="/admin/agenda">Limpar filtros</Link>
                        </AdminButton>
                      ) : null}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}
