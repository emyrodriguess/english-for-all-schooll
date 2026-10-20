"use client";

import { useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";

import {
  deactivateSlotAction,
  releaseAssignmentAction,
} from "@/app/admin/(protected)/agenda/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { AdminButton } from "@/components/admin/admin-ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ScheduleSlotActions({
  assignmentId,
  slotId,
  today,
}: {
  assignmentId: string;
  slotId: string;
  today: string;
}) {
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AdminButton
            aria-label="Ações do horário"
            size="sm"
            variant="ghost"
          >
            <EllipsisVerticalIcon aria-hidden="true" />
          </AdminButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="admin-slot-menu">
          <ActionForm
            action={releaseAssignmentAction}
            className="admin-slot-menu-form"
          >
            <input name="assignment_id" type="hidden" value={assignmentId} />
            <input name="effective_on" type="hidden" value={today} />
            <SubmitButton
              className="admin-slot-menu-item"
              pendingLabel="Liberando..."
              size="sm"
              variant="ghost"
            >
              Liberar
            </SubmitButton>
          </ActionForm>
          <DropdownMenuItem
            onSelect={() => setRemoveOpen(true)}
            variant="destructive"
          >
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={setRemoveOpen} open={removeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover horário semanal?</DialogTitle>
            <DialogDescription>
              O horário deixará de aparecer na disponibilidade. Aulas e ocupações
              anteriores serão preservadas.
            </DialogDescription>
          </DialogHeader>
          <ActionForm action={deactivateSlotAction}>
            <input name="slot_id" type="hidden" value={slotId} />
            <SubmitButton pendingLabel="Removendo..." variant="destructive">
              Confirmar remoção
            </SubmitButton>
          </ActionForm>
        </DialogContent>
      </Dialog>
    </>
  );
}
