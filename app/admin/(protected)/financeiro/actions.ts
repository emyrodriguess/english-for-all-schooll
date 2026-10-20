"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { getErrorMessage } from "@/lib/internal/action-state";
import { requireAdminForAction } from "@/lib/internal/auth";

export async function registerPaymentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      invoice_id: z.uuid(),
      student_id: z.uuid(),
      amount: z.coerce.number().nonnegative(),
      payment_date: z.iso.date(),
      notes: z.string().trim().max(2000).optional().default(""),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Revise os dados do pagamento.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  const receipt = formData.get("receipt");
  if (receipt instanceof File && receipt.size > 0) {
    if (receipt.size > 10 * 1024 * 1024)
      return {
        status: "error",
        message: "O comprovante deve ter no máximo 10 MB.",
      };
    if (!["application/pdf", "image/jpeg", "image/png"].includes(receipt.type))
      return {
        status: "error",
        message: "Envie o comprovante em PDF, JPG ou PNG.",
      };
  }
  try {
    const { supabase } = await requireAdminForAction();
    const { data: paymentId, error } = await supabase.rpc("register_payment", {
      target_invoice_id: parsed.data.invoice_id,
      payment_amount: parsed.data.amount,
      paid_on: parsed.data.payment_date,
      payment_notes: parsed.data.notes || undefined,
    });
    if (error) throw error;
    if (receipt instanceof File && receipt.size > 0) {
      const storageKey = `${parsed.data.student_id}/${paymentId}/${receipt.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(storageKey, receipt, {
          contentType: receipt.type,
          upsert: false,
        });
      if (uploadError)
        return {
          status: "error",
          message: "Pagamento registrado, mas o comprovante não foi enviado.",
        };
      const { error: updateError } = await supabase
        .from("payments")
        .update({ receipt_storage_key: storageKey })
        .eq("id", paymentId);
      if (updateError)
        return {
          status: "error",
          message:
            "Pagamento registrado e arquivo salvo, mas o vínculo do comprovante precisa ser revisado.",
        };
    }
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    return {
      status: "success",
      message: "Pagamento registrado. A cobrança foi quitada.",
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function runFinanceAutomationAction(
  _state: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _state;
  void _formData;
  try {
    const { supabase } = await requireAdminForAction();
    const { data, error } = await supabase.rpc("run_finance_automation");
    if (error) throw error;
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/dashboard");
    const result = data as {
      overdue_invoices?: number;
      generated_invoices?: number;
      queued_messages?: number;
    } | null;
    return {
      status: "success",
      message: `Automação concluída: ${result?.overdue_invoices ?? 0} atraso(s), ${result?.generated_invoices ?? 0} cobrança(s) e ${result?.queued_messages ?? 0} mensagem(ns).`,
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function attachPaymentReceiptAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ payment_id: z.uuid(), student_id: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  const receipt = formData.get("receipt");
  if (!parsed.success || !(receipt instanceof File) || receipt.size === 0) {
    return { status: "error", message: "Selecione um comprovante válido." };
  }
  if (receipt.size > 10 * 1024 * 1024) {
    return {
      status: "error",
      message: "O comprovante deve ter no máximo 10 MB.",
    };
  }
  if (!["application/pdf", "image/jpeg", "image/png"].includes(receipt.type)) {
    return {
      status: "error",
      message: "Envie o comprovante em PDF, JPG ou PNG.",
    };
  }

  try {
    const { supabase } = await requireAdminForAction();
    const storageKey = `${parsed.data.student_id}/${parsed.data.payment_id}/${receipt.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-receipts")
      .upload(storageKey, receipt, {
        contentType: receipt.type,
        upsert: false,
      });
    if (uploadError) throw uploadError;
    const { error } = await supabase
      .from("payments")
      .update({ receipt_storage_key: storageKey })
      .eq("id", parsed.data.payment_id);
    if (error) throw error;
    revalidatePath("/admin/financeiro");
    revalidatePath(`/admin/alunos/${parsed.data.student_id}`);
    return { status: "success", message: "Comprovante anexado ao pagamento." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
