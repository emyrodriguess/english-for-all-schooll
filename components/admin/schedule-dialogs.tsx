"use client";

import { useState } from "react";
import { CalendarPlusIcon, PlusIcon } from "lucide-react";

import {
  assignScheduleAction,
  createSlotAction,
} from "@/app/admin/(protected)/agenda/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FormField } from "@/components/admin/form-field";
import { DesignSystemSelect } from "@/components/admin/design-system-select";
import { SearchableEntitySelect } from "@/components/admin/searchable-entity-select";
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
import { saoPauloToday } from "@/lib/internal/format";

export function CreateSlotDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Configurar horário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo horário semanal</DialogTitle>
          <DialogDescription>
            O intervalo ficará disponível todas as semanas.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={createSlotAction} className="admin-login-form">
          <FormField htmlFor="slot-weekday" label="Dia da semana">
            <DesignSystemSelect
              id="slot-weekday"
              name="weekday"
              options={[
                { label: "Segunda-feira", value: "1" },
                { label: "Terça-feira", value: "2" },
                { label: "Quarta-feira", value: "3" },
                { label: "Quinta-feira", value: "4" },
                { label: "Sexta-feira", value: "5" },
                { label: "Sábado", value: "6" },
                { label: "Domingo", value: "7" },
              ]}
              required
            />
          </FormField>
          <div className="admin-form-grid">
            <FormField htmlFor="slot-start" label="Início">
              <Input id="slot-start" name="start_time" required type="time" />
            </FormField>
            <FormField htmlFor="slot-end" label="Fim">
              <Input id="slot-end" name="end_time" required type="time" />
            </FormField>
          </div>
          <SubmitButton>Adicionar horário</SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function AssignSlotDialog({
  slotId,
  students,
  classes,
}: {
  slotId: string;
  students: Array<{ id: string; full_name: string }>;
  classes: Array<{ id: string; name: string }>;
}) {
  const [type, setType] = useState<"student" | "class">("student");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CalendarPlusIcon data-icon="inline-start" />
          Ocupar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ocupar horário</DialogTitle>
          <DialogDescription>
            Escolha um aluno ou turma e a vigência da ocupação.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={assignScheduleAction} className="admin-login-form">
          <input name="slot_id" type="hidden" value={slotId} />
          <FormField htmlFor="assignment-type" label="Tipo">
            <DesignSystemSelect
              id="assignment-type"
              name="assignment_type"
              onValueChange={(value) => setType(value as "student" | "class")}
              options={[
                { label: "Aluno individual", value: "student" },
                { label: "Turma", value: "class" },
              ]}
              value={type}
            />
          </FormField>
          <FormField
            htmlFor="assignment-target"
            label={type === "student" ? "Aluno" : "Turma"}
          >
            <SearchableEntitySelect
              key={type}
              id="assignment-target"
              name="target_id"
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
              placeholder={
                type === "student" ? "Buscar aluno" : "Buscar turma"
              }
              required
            />
          </FormField>
          <div className="admin-form-grid">
            <FormField htmlFor="assignment-start" label="Início">
              <Input
                defaultValue={saoPauloToday()}
                id="assignment-start"
                name="start_date"
                required
                type="date"
              />
            </FormField>
            <FormField htmlFor="assignment-end" label="Término opcional">
              <Input id="assignment-end" name="end_date" type="date" />
            </FormField>
          </div>
          <SubmitButton>Confirmar ocupação</SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
