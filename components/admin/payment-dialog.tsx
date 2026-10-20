import { CircleDollarSignIcon } from "lucide-react";

import {
  attachPaymentReceiptAction,
  registerPaymentAction,
} from "@/app/admin/(protected)/financeiro/actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FileUploadInput } from "@/components/admin/file-upload-input";
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
import { formatMoney, saoPauloToday } from "@/lib/internal/format";

export function PaymentDialog({
  invoice,
}: {
  invoice: {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
  };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <CircleDollarSignIcon data-icon="inline-start" />
          Registrar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pagamento</DialogTitle>
          <DialogDescription>
            {invoice.studentName} · {formatMoney(invoice.amount)}. O MVP aceita
            somente quitação integral.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={registerPaymentAction} className="admin-login-form">
          <input name="invoice_id" type="hidden" value={invoice.id} />
          <input name="student_id" type="hidden" value={invoice.studentId} />
          <FormField htmlFor={`payment-amount-${invoice.id}`} label="Valor">
            <Input
              defaultValue={invoice.amount.toFixed(2)}
              id={`payment-amount-${invoice.id}`}
              name="amount"
              readOnly
              step="0.01"
              type="number"
            />
          </FormField>
          <FormField
            htmlFor={`payment-date-${invoice.id}`}
            label="Data do pagamento"
          >
            <Input
              defaultValue={saoPauloToday()}
              id={`payment-date-${invoice.id}`}
              name="payment_date"
              required
              type="date"
            />
          </FormField>
          <FormField htmlFor={`receipt-${invoice.id}`} label="Comprovante">
            <FileUploadInput
              accept=".pdf,.jpg,.jpeg,.png"
              id={`receipt-${invoice.id}`}
              name="receipt"
            />
          </FormField>
          <FormField
            htmlFor={`payment-notes-${invoice.id}`}
            label="Observações"
          >
            <Textarea
              id={`payment-notes-${invoice.id}`}
              name="notes"
              rows={3}
            />
          </FormField>
          <SubmitButton pendingLabel="Registrando...">
            Confirmar pagamento
          </SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

export function AttachPaymentReceiptDialog({
  paymentId,
  studentId,
}: {
  paymentId: string;
  studentId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Anexar comprovante
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anexar comprovante</DialogTitle>
          <DialogDescription>
            Envie PDF, JPG ou PNG de até 10 MB.
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={attachPaymentReceiptAction}
          className="admin-login-form"
        >
          <input name="payment_id" type="hidden" value={paymentId} />
          <input name="student_id" type="hidden" value={studentId} />
          <FormField
            htmlFor={`attach-receipt-${paymentId}`}
            label="Comprovante"
          >
            <FileUploadInput
              accept=".pdf,.jpg,.jpeg,.png"
              id={`attach-receipt-${paymentId}`}
              name="receipt"
              required
            />
          </FormField>
          <SubmitButton pendingLabel="Enviando...">
            Anexar comprovante
          </SubmitButton>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}
