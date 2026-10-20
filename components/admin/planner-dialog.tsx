"use client";

import { useState } from "react";
import { ClipboardPlusIcon, ChevronDownIcon } from "lucide-react";

import { createLessonRecordAction } from "@/app/admin/(protected)/planner/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import {
  AdminButton,
  AdminDateInput,
  AdminInput,
} from "@/components/admin/admin-ui";
import { AdminDesignSelect } from "@/components/admin/admin-design-select";
import { FormField } from "@/components/admin/form-field";
import { SearchableEntitySelect } from "@/components/admin/searchable-entity-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { saoPauloToday } from "@/lib/internal/format";

type PlannerClass = {
  id: string;
  name: string;
  class_memberships: Array<{
    student_id: string;
    status: string;
    students: { id?: string; full_name?: string } | null;
  }> | null;
};

export function PlannerDialog({
  students,
  classes,
  initialType = "student",
  initialTarget = "",
  triggerLabel = "Registrar aula",
}: {
  students: Array<{ id: string; full_name: string }>;
  classes: PlannerClass[];
  initialType?: "student" | "class";
  initialTarget?: string;
  triggerLabel?: string;
}) {
  const [type, setType] = useState<"student" | "class">(initialType);
  const [target, setTarget] = useState(initialTarget);
  const [showIndividualNotes, setShowIndividualNotes] = useState(false);
  const selectedClass = classes.find((item) => item.id === target);
  const members =
    selectedClass?.class_memberships?.filter(
      (item) => item.status === "active",
    ) ?? [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AdminButton>
          <ClipboardPlusIcon data-icon="inline-start" />
          {triggerLabel}
        </AdminButton>
      </DialogTrigger>
      <DialogContent className="admin-dialog-wide">
        <DialogHeader>
          <DialogTitle>Novo registro de aula</DialogTitle>
          <DialogDescription>
            O registro alimentará o histórico pedagógico do aluno ou da turma.
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={createLessonRecordAction}
          className="admin-form-grid admin-planner-dialog-form"
        >
          <FormField htmlFor="record-type" label="Tipo">
            <AdminDesignSelect
              id="record-type"
              name="record_type"
              onValueChange={(value) => {
                setType(value as "student" | "class");
                setTarget("");
                setShowIndividualNotes(false);
              }}
              options={[
                { label: "Aluno individual", value: "student" },
                { label: "Turma", value: "class" },
              ]}
              value={type}
            />
          </FormField>
          <FormField
            htmlFor="record-target"
            label={type === "student" ? "Aluno" : "Turma"}
          >
            <SearchableEntitySelect
              id="record-target"
              name="target_id"
              onValueChange={setTarget}
              options={
                type === "student"
                  ? students.map((item) => ({
                      label: item.full_name,
                      value: item.id,
                    }))
                  : classes.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
              }
              placeholder={type === "student" ? "Buscar aluno" : "Buscar turma"}
              required
              value={target}
            />
          </FormField>
          <FormField htmlFor="lesson-date" label="Data">
            <AdminDateInput
              defaultValue={saoPauloToday()}
              id="lesson-date"
              name="lesson_date"
              required
              type="date"
            />
          </FormField>
          <FormField htmlFor="lesson-name" label="Nome da aula">
            <AdminInput
              id="lesson-name"
              name="lesson_name"
              placeholder="Conversation, Kids Class..."
              required
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor="lesson-content"
            label="Conteúdo"
          >
            <Textarea
              id="lesson-content"
              name="content"
              placeholder="Ex.: Revisão de vocabulário, prática de conversação e atividade do livro."
              rows={3}
            />
          </FormField>
          <FormField htmlFor="lesson-report" label="Relatório">
            <Textarea
              id="lesson-report"
              name="lesson_report"
              placeholder="Registre a participação, avanços e pontos de atenção da aula."
              rows={3}
            />
          </FormField>
          <FormField htmlFor="lesson-homework" label="Tarefa">
            <Textarea
              id="lesson-homework"
              name="homework"
              placeholder="Descreva a tarefa e a orientação para a próxima aula."
              rows={3}
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor="lesson-observations"
            label="Observações gerais"
          >
            <Textarea
              id="lesson-observations"
              name="observations"
              placeholder="Inclua observações relevantes para o histórico pedagógico."
              rows={2}
            />
          </FormField>
          {type === "class" && members.length ? (
            <section className="admin-field-span-2 admin-student-notes">
              <button
                aria-expanded={showIndividualNotes}
                className="admin-student-notes-trigger"
                onClick={() => setShowIndividualNotes((current) => !current)}
                type="button"
              >
                <span>
                  <strong>Observações individuais</strong>
                  <small>{members.length} aluno(s) ativo(s)</small>
                </span>
                <ChevronDownIcon aria-hidden="true" />
              </button>
              {showIndividualNotes ? (
                <div className="admin-student-notes-list">
                  {members.map((member) => (
                    <details key={member.student_id}>
                      <summary>{member.students?.full_name ?? "Aluno"}</summary>
                      <div>
                        <Textarea
                          aria-label={`Relatório individual de ${member.students?.full_name ?? "aluno"}`}
                          name={`student_report_${member.student_id}`}
                          placeholder="Relatório individual"
                          rows={2}
                        />
                        <AdminInput
                          aria-label={`Observações individuais de ${member.students?.full_name ?? "aluno"}`}
                          name={`student_observations_${member.student_id}`}
                          placeholder="Observações"
                        />
                        <AdminInput
                          aria-label={`Tarefa individual de ${member.students?.full_name ?? "aluno"}`}
                          name={`student_homework_${member.student_id}`}
                          placeholder="Tarefa"
                        />
                      </div>
                    </details>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton pendingLabel="Salvando registro...">
              Salvar registro
            </SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
