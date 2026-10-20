import { PlusIcon, UserPlusIcon } from "lucide-react";

import {
  createClassAction,
  joinClassAction,
  updateClassAction,
} from "@/app/admin/(protected)/turmas/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import {
  AdminButton,
  AdminDateInput,
  AdminInput,
} from "@/components/admin/admin-ui";
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

export function CreateClassDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AdminButton>
          <PlusIcon data-icon="inline-start" />
          Nova turma
        </AdminButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova turma</DialogTitle>
          <DialogDescription>
            Dia e horário serão definidos na Agenda.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={createClassAction} className="admin-login-form">
          <FormField htmlFor="class-name" label="Nome da turma">
            <AdminInput
              id="class-name"
              name="name"
              placeholder="Ex.: Conversation B1"
              required
            />
          </FormField>
          <FormField htmlFor="class-notes" label="Observações">
            <Textarea
              id="class-notes"
              name="notes"
              placeholder="Ex.: turma de conversação para adultos."
              rows={4}
            />
          </FormField>
          <SubmitButton>Criar turma</SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function JoinClassDialog({
  classId,
  students,
}: {
  classId: string;
  students: Array<{ id: string; full_name: string }>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AdminButton>
          <UserPlusIcon data-icon="inline-start" />
          Adicionar aluno
        </AdminButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar aluno à turma</DialogTitle>
          <DialogDescription>
            A entrada ficará registrada no histórico.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={joinClassAction} className="admin-login-form">
          <input name="class_id" type="hidden" value={classId} />
          <FormField htmlFor="join-student" label="Aluno">
            <SearchableEntitySelect
              id="join-student"
              name="student_id"
              options={students.map((student) => ({
                label: student.full_name,
                value: student.id,
              }))}
              placeholder="Buscar aluno"
              required
            />
          </FormField>
          <FormField htmlFor="joined-on" label="Data de entrada">
            <AdminDateInput
              defaultValue={saoPauloToday()}
              id="joined-on"
              name="joined_on"
              required
              type="date"
            />
          </FormField>
          <SubmitButton>Adicionar à turma</SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function EditClassDialog({
  classItem,
}: {
  classItem: { id: string; name: string; notes: string | null };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AdminButton variant="outline">Editar turma</AdminButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar turma</DialogTitle>
          <DialogDescription>
            O histórico de participantes e horários não será alterado.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={updateClassAction} className="admin-login-form">
          <input name="class_id" type="hidden" value={classItem.id} />
          <FormField
            htmlFor={`class-name-${classItem.id}`}
            label="Nome da turma"
          >
            <AdminInput
              defaultValue={classItem.name}
              id={`class-name-${classItem.id}`}
              name="name"
              placeholder="Ex.: Conversation B1"
              required
            />
          </FormField>
          <FormField
            htmlFor={`class-notes-${classItem.id}`}
            label="Observações"
          >
            <Textarea
              defaultValue={classItem.notes ?? ""}
              id={`class-notes-${classItem.id}`}
              name="notes"
              placeholder="Inclua observações relevantes para esta turma."
              rows={4}
            />
          </FormField>
          <SubmitButton>Salvar alterações</SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
