"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { createStudentAction } from "@/app/admin/(protected)/alunos/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FormField } from "@/components/admin/form-field";
import { PhoneInput } from "@/components/admin/phone-input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function isMinor(birthDate: string) {
  if (!birthDate) return false;
  const birth = new Date(`${birthDate}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age < 18;
}

export function StudentCreateDialog({
  initiallyOpen = false,
}: {
  initiallyOpen?: boolean;
}) {
  const [financialContact, setFinancialContact] = useState("student");
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Novo aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="admin-dialog-wide">
        <DialogHeader>
          <DialogTitle>Novo aluno</DialogTitle>
          <DialogDescription>
            Cadastre os dados essenciais. Contrato e agenda podem ser
            adicionados na ficha.
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={createStudentAction}
          className="admin-form-grid"
          onSuccess={() => setOpen(false)}
          resetOnSuccess
        >
          <FormField
            className="admin-field-span-2"
            htmlFor="full_name"
            label="Nome completo"
          >
            <Input id="full_name" name="full_name" required />
          </FormField>
          <FormField htmlFor="whatsapp" label="WhatsApp">
            <PhoneInput
              id="whatsapp"
              name="whatsapp"
              placeholder="(11) 99999-9999"
              required
            />
          </FormField>
          <FormField htmlFor="email" label="E-mail">
            <Input id="email" name="email" type="email" />
          </FormField>
          <FormField htmlFor="birth_date" label="Data de nascimento">
            <Input
              id="birth_date"
              name="birth_date"
              onChange={(event) => {
                if (isMinor(event.target.value))
                  setFinancialContact("guardian");
              }}
              type="date"
            />
          </FormField>
          <FormField htmlFor="status" label="Status">
            <select
              className="admin-control admin-control-full"
              defaultValue="active"
              id="status"
              name="status"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </FormField>
          <fieldset className="admin-field admin-field-span-2">
            <legend>Contato financeiro</legend>
            <RadioGroup
              name="financial_contact_type"
              onValueChange={setFinancialContact}
              value={financialContact}
            >
              <div className="admin-radio-row">
                <RadioGroupItem id="contact-student" value="student" />
                <Label htmlFor="contact-student">O próprio aluno</Label>
              </div>
              <div className="admin-radio-row">
                <RadioGroupItem id="contact-guardian" value="guardian" />
                <Label htmlFor="contact-guardian">Um responsável</Label>
              </div>
            </RadioGroup>
          </fieldset>
          {financialContact === "guardian" ? (
            <>
              <FormField htmlFor="guardian_name" label="Nome do responsável">
                <Input id="guardian_name" name="guardian_name" required />
              </FormField>
              <FormField htmlFor="guardian_relationship" label="Parentesco">
                <Input
                  id="guardian_relationship"
                  name="guardian_relationship"
                />
              </FormField>
              <FormField
                htmlFor="guardian_whatsapp"
                label="WhatsApp do responsável"
              >
                <PhoneInput
                  id="guardian_whatsapp"
                  name="guardian_whatsapp"
                  required
                />
              </FormField>
              <FormField htmlFor="guardian_email" label="E-mail do responsável">
                <Input id="guardian_email" name="guardian_email" type="email" />
              </FormField>
            </>
          ) : null}
          <FormField
            className="admin-field-span-2"
            htmlFor="administrative_notes"
            label="Observações administrativas"
          >
            <Textarea
              id="administrative_notes"
              name="administrative_notes"
              rows={3}
            />
          </FormField>
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton pendingLabel="Cadastrando...">
              Cadastrar aluno
            </SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
