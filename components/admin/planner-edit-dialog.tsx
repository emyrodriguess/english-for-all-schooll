import { PencilIcon } from "lucide-react";

import { updateLessonRecordAction } from "@/app/admin/(protected)/planner/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditableLesson = {
  id: string;
  lesson_date: string;
  lesson_name: string | null;
  content: string | null;
  observations: string | null;
  lesson_report: string | null;
  homework: string | null;
  lesson_student_notes?: Array<{
    id: string;
    individual_report: string | null;
    observations: string | null;
    homework: string | null;
    students: { full_name?: string } | null;
  }> | null;
};

export function PlannerEditDialog({ record }: { record: EditableLesson }) {
  const prefix = `edit-lesson-${record.id}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Editar registro" size="icon-sm" variant="ghost">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="admin-dialog-wide">
        <DialogHeader>
          <DialogTitle>Editar registro pedagógico</DialogTitle>
          <DialogDescription>
            A autoria e a data de atualização serão registradas automaticamente.
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={updateLessonRecordAction}
          className="admin-form-grid admin-planner-dialog-form"
        >
          <input name="record_id" type="hidden" value={record.id} />
          <FormField htmlFor={`${prefix}-date`} label="Data">
            <Input
              defaultValue={record.lesson_date}
              id={`${prefix}-date`}
              name="lesson_date"
              required
              type="date"
            />
          </FormField>
          <FormField htmlFor={`${prefix}-name`} label="Nome da aula">
            <Input
              defaultValue={record.lesson_name ?? ""}
              id={`${prefix}-name`}
              name="lesson_name"
              placeholder="Ex.: Conversation class — Unit 4"
              required
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor={`${prefix}-content`}
            label="Conteúdo"
          >
            <Textarea
              defaultValue={record.content ?? ""}
              id={`${prefix}-content`}
              name="content"
              placeholder="Descreva os conteúdos e atividades abordados."
              rows={3}
            />
          </FormField>
          <FormField htmlFor={`${prefix}-report`} label="Relatório">
            <Textarea
              defaultValue={record.lesson_report ?? ""}
              id={`${prefix}-report`}
              name="lesson_report"
              placeholder="Registre participação, avanços e pontos de atenção."
              rows={3}
            />
          </FormField>
          <FormField htmlFor={`${prefix}-homework`} label="Tarefa">
            <Textarea
              defaultValue={record.homework ?? ""}
              id={`${prefix}-homework`}
              name="homework"
              placeholder="Descreva a tarefa e a orientação para a próxima aula."
              rows={3}
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor={`${prefix}-observations`}
            label="Observações"
          >
            <Textarea
              defaultValue={record.observations ?? ""}
              id={`${prefix}-observations`}
              name="observations"
              placeholder="Inclua observações relevantes para o histórico pedagógico."
              rows={2}
            />
          </FormField>
          {record.lesson_student_notes?.length ? (
            <fieldset className="admin-field-span-2 admin-student-notes">
              <legend>Observações individuais</legend>
              {record.lesson_student_notes.map((note) => (
                <div key={note.id}>
                  <strong>{note.students?.full_name ?? "Aluno"}</strong>
                  <Textarea
                    defaultValue={note.individual_report ?? ""}
                    name={`note_report_${note.id}`}
                    placeholder="Relatório individual"
                    rows={2}
                  />
                  <Input
                    defaultValue={note.observations ?? ""}
                    name={`note_observations_${note.id}`}
                    placeholder="Observações"
                  />
                  <Input
                    defaultValue={note.homework ?? ""}
                    name={`note_homework_${note.id}`}
                    placeholder="Tarefa"
                  />
                </div>
              ))}
            </fieldset>
          ) : null}
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
