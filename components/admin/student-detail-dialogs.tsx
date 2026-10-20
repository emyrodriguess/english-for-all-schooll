import {
  CalendarXIcon,
  CircleXIcon,
  FilePlus2Icon,
  RefreshCcwIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import {
  addGuardianAction,
  attachContractDocumentAction,
  cancelContractAction,
  cancelStudentAction,
  createContractAction,
  renewContractAction,
} from "@/app/admin/(protected)/alunos/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { CurrencyInput } from "@/components/admin/currency-input";
import { FileUploadInput } from "@/components/admin/file-upload-input";
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
import { Textarea } from "@/components/ui/textarea";
import { saoPauloToday } from "@/lib/internal/format";

export function AddGuardianDialog({ studentId }: { studentId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserRoundPlusIcon data-icon="inline-start" />
          Responsável
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar responsável</DialogTitle>
          <DialogDescription>
            O responsável poderá ser escolhido como contato financeiro.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={addGuardianAction} className="admin-form-grid">
          <input name="student_id" type="hidden" value={studentId} />
          <FormField
            className="admin-field-span-2"
            htmlFor="guardian-full-name"
            label="Nome completo"
          >
            <Input id="guardian-full-name" name="full_name" required />
          </FormField>
          <FormField htmlFor="guardian-whatsapp" label="WhatsApp">
            <PhoneInput id="guardian-whatsapp" name="whatsapp" required />
          </FormField>
          <FormField htmlFor="guardian-email" label="E-mail">
            <Input id="guardian-email" name="email" type="email" />
          </FormField>
          <FormField htmlFor="guardian-relationship" label="Parentesco">
            <Input id="guardian-relationship" name="relationship" />
          </FormField>
          <FormField htmlFor="guardian-financial" label="Contato financeiro">
            <select
              className="admin-control admin-control-full"
              defaultValue="no"
              id="guardian-financial"
              name="financial"
            >
              <option value="no">Não alterar</option>
              <option value="yes">Usar este responsável</option>
            </select>
          </FormField>
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton>Adicionar responsável</SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function CreateContractDialog({ studentId }: { studentId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <FilePlus2Icon data-icon="inline-start" />
          Novo contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="admin-dialog-wide">
        <DialogHeader>
          <DialogTitle>Novo contrato</DialogTitle>
          <DialogDescription>
            As cobranças serão geradas automaticamente a partir destes dados.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={createContractAction} className="admin-form-grid">
          <input name="student_id" type="hidden" value={studentId} />
          <FormField htmlFor="modality" label="Modalidade">
            <select
              className="admin-control admin-control-full"
              id="modality"
              name="modality"
              required
            >
              <option disabled value="">
                Selecione
              </option>
              <option value="individual">Individual</option>
              <option value="duo">Duo</option>
              <option value="turma">Turma</option>
            </select>
          </FormField>
          <FormField htmlFor="weekly_frequency" label="Frequência semanal">
            <Input
              defaultValue="1"
              id="weekly_frequency"
              max="7"
              min="1"
              name="weekly_frequency"
              required
              type="number"
            />
          </FormField>
          <FormField htmlFor="contract_type" label="Tipo de contrato">
            <select
              className="admin-control admin-control-full"
              id="contract_type"
              name="contract_type"
              required
            >
              <option disabled value="">
                Selecione
              </option>
              <option value="mensal">Mensal</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </FormField>
          <FormField htmlFor="monthly_amount" label="Mensalidade">
            <CurrencyInput
              id="monthly_amount"
              name="monthly_amount"
              required
            />
          </FormField>
          <FormField
            hint="Define o início da vigência do contrato."
            htmlFor="start_date"
            label="Início"
          >
            <Input id="start_date" name="start_date" required type="date" />
          </FormField>
          <FormField
            hint="Define a primeira mensalidade gerada; não altera cobranças já existentes."
            htmlFor="billing_start_date"
            label="Primeira competência"
          >
            <Input
              id="billing_start_date"
              name="billing_start_date"
              required
              type="date"
            />
          </FormField>
          <FormField
            hint="Deixe em branco para contrato sem prazo definido."
            htmlFor="end_date"
            label="Término"
          >
            <Input id="end_date" name="end_date" type="date" />
          </FormField>
          <FormField htmlFor="due_day" label="Dia do vencimento">
            <Input
              defaultValue="10"
              id="due_day"
              max="31"
              min="1"
              name="due_day"
              required
              type="number"
            />
          </FormField>
          <FormField
            hint="Preencha apenas se a primeira cobrança for diferente da mensalidade."
            htmlFor="first_invoice_amount"
            label="Valor da primeira cobrança"
          >
            <CurrencyInput
              id="first_invoice_amount"
              name="first_invoice_amount"
            />
          </FormField>
          <FormField htmlFor="document" label="Documento">
            <FileUploadInput
              accept=".pdf,.jpg,.jpeg,.png"
              id="document"
              name="document"
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor="contract-notes"
            label="Observações"
          >
            <Textarea id="contract-notes" name="notes" rows={3} />
          </FormField>
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton pendingLabel="Criando contrato...">
              Criar contrato
            </SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function CancelStudentDialog({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <CalendarXIcon data-icon="inline-start" />
          Cancelar aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar {studentName}?</DialogTitle>
          <DialogDescription>
            O contrato, participações e agenda serão encerrados. Cobranças
            pagas, atrasadas e da competência atual serão preservadas.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={cancelStudentAction} className="admin-login-form">
          <input name="student_id" type="hidden" value={studentId} />
          <FormField
            hint="Cobranças futuras após esta data serão canceladas; o histórico será preservado."
            htmlFor="effective_date"
            label="Data efetiva"
          >
            <Input
              defaultValue={saoPauloToday()}
              id="effective_date"
              name="effective_date"
              required
              type="date"
            />
          </FormField>
          <FormField
            hint="Digite CANCELAR para confirmar."
            htmlFor="confirmation"
            label="Confirmação"
          >
            <Input
              autoComplete="off"
              id="confirmation"
              name="confirmation"
              required
            />
          </FormField>
          <SubmitButton pendingLabel="Cancelando..." variant="destructive">
            Confirmar cancelamento
          </SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

type ContractForRenewal = {
  id: string;
  student_id: string;
  modality: string;
  weekly_frequency: number;
  contract_type: string;
  monthly_amount: number;
  due_day: number;
  end_date: string | null;
};

export function RenewContractDialog({
  contract,
}: {
  contract: ContractForRenewal;
}) {
  const prefix = `renew-${contract.id}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <RefreshCcwIcon data-icon="inline-start" />
          Renovar
        </Button>
      </DialogTrigger>
      <DialogContent className="admin-dialog-wide">
        <DialogHeader>
          <DialogTitle>Renovar contrato</DialogTitle>
          <DialogDescription>
            O contrato atual será encerrado no dia anterior ao novo início.
            Nenhum histórico será sobrescrito.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={renewContractAction} className="admin-form-grid">
          <input name="contract_id" type="hidden" value={contract.id} />
          <input name="student_id" type="hidden" value={contract.student_id} />
          <FormField htmlFor={`${prefix}-modality`} label="Modalidade">
            <Input
              defaultValue={contract.modality}
              id={`${prefix}-modality`}
              name="modality"
              required
            />
          </FormField>
          <FormField htmlFor={`${prefix}-frequency`} label="Frequência semanal">
            <Input
              defaultValue={contract.weekly_frequency}
              id={`${prefix}-frequency`}
              max="7"
              min="1"
              name="weekly_frequency"
              required
              type="number"
            />
          </FormField>
          <FormField htmlFor={`${prefix}-type`} label="Tipo de contrato">
            <Input
              defaultValue={contract.contract_type}
              id={`${prefix}-type`}
              name="contract_type"
              required
            />
          </FormField>
          <FormField htmlFor={`${prefix}-amount`} label="Mensalidade">
            <CurrencyInput
              defaultValue={contract.monthly_amount}
              id={`${prefix}-amount`}
              name="monthly_amount"
              required
            />
          </FormField>
          <FormField
            hint="Inicia uma nova vigência sem alterar o contrato anterior."
            htmlFor={`${prefix}-start`}
            label="Novo início"
          >
            <Input
              id={`${prefix}-start`}
              name="start_date"
              required
              type="date"
            />
          </FormField>
          <FormField
            hint="Define a primeira mensalidade do contrato renovado."
            htmlFor={`${prefix}-billing`}
            label="Primeira competência"
          >
            <Input
              id={`${prefix}-billing`}
              name="billing_start_date"
              required
              type="date"
            />
          </FormField>
          <FormField
            hint="Deixe em branco quando a renovação não tiver prazo final."
            htmlFor={`${prefix}-end`}
            label="Novo término"
          >
            <Input id={`${prefix}-end`} name="end_date" type="date" />
          </FormField>
          <FormField htmlFor={`${prefix}-due`} label="Dia do vencimento">
            <Input
              defaultValue={contract.due_day}
              id={`${prefix}-due`}
              max="31"
              min="1"
              name="due_day"
              required
              type="number"
            />
          </FormField>
          <FormField
            hint="Preencha apenas se a primeira cobrança for diferente da mensalidade."
            htmlFor={`${prefix}-first`}
            label="Valor da primeira cobrança"
          >
            <CurrencyInput
              id={`${prefix}-first`}
              name="first_invoice_amount"
            />
          </FormField>
          <FormField htmlFor={`${prefix}-document`} label="Novo documento">
            <FileUploadInput
              accept=".pdf,.jpg,.jpeg,.png"
              id={`${prefix}-document`}
              name="document"
            />
          </FormField>
          <FormField
            className="admin-field-span-2"
            htmlFor={`${prefix}-notes`}
            label="Observações"
          >
            <Textarea id={`${prefix}-notes`} name="notes" rows={3} />
          </FormField>
          <div className="admin-form-actions admin-field-span-2">
            <SubmitButton pendingLabel="Renovando...">
              Confirmar renovação
            </SubmitButton>
          </div>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function CancelContractDialog({
  contractId,
  studentId,
}: {
  contractId: string;
  studentId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <CircleXIcon data-icon="inline-start" />
          Encerrar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar contrato?</DialogTitle>
          <DialogDescription>
            Cobranças futuras serão canceladas; pagamentos e cobranças
            históricas permanecerão disponíveis.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={cancelContractAction} className="admin-login-form">
          <input name="contract_id" type="hidden" value={contractId} />
          <input name="student_id" type="hidden" value={studentId} />
          <FormField
            hint="O histórico do contrato e das cobranças anteriores será preservado."
            htmlFor={`cancel-contract-${contractId}`}
            label="Data efetiva"
          >
            <Input
              defaultValue={saoPauloToday()}
              id={`cancel-contract-${contractId}`}
              name="effective_date"
              required
              type="date"
            />
          </FormField>
          <FormField
            hint="Digite ENCERRAR para confirmar."
            htmlFor={`cancel-contract-confirm-${contractId}`}
            label="Confirmação"
          >
            <Input
              id={`cancel-contract-confirm-${contractId}`}
              name="confirmation"
              required
            />
          </FormField>
          <SubmitButton pendingLabel="Encerrando..." variant="destructive">
            Encerrar contrato
          </SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function AttachContractDocumentDialog({
  contractId,
  studentId,
}: {
  contractId: string;
  studentId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <FilePlus2Icon data-icon="inline-start" />
          Anexar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anexar documento do contrato</DialogTitle>
          <DialogDescription>
            Envie PDF, JPG ou PNG de até 10 MB.
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={attachContractDocumentAction}
          className="admin-login-form"
        >
          <input name="contract_id" type="hidden" value={contractId} />
          <input name="student_id" type="hidden" value={studentId} />
          <FormField
            htmlFor={`attach-contract-${contractId}`}
            label="Documento"
          >
            <FileUploadInput
              accept=".pdf,.jpg,.jpeg,.png"
              id={`attach-contract-${contractId}`}
              name="document"
              required
            />
          </FormField>
          <SubmitButton pendingLabel="Enviando...">
            Anexar documento
          </SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
