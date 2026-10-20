"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { AdminButton } from "@/components/admin/admin-ui";
import { Spinner } from "@/components/ui/spinner";
import type { ActionState } from "@/lib/internal/action-state";
import { INITIAL_ACTION_STATE } from "@/lib/internal/action-state";

export function ActionForm({
  action,
  children,
  className,
  onSuccess,
  resetOnSuccess = false,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Operação concluída.");
      if (resetOnSuccess) formRef.current?.reset();
      onSuccess?.();
      if (formRef.current?.closest('[role="dialog"]')) {
        requestAnimationFrame(() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
          );
        });
      }
    }
    if (state.status === "error") toast.error(state.message);
  }, [onSuccess, resetOnSuccess, state]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      {children}
      {state.status === "error" && state.message ? (
        <p className="admin-form-error" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Salvando...",
  variant = "default",
  className,
  size,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: React.ComponentProps<typeof AdminButton>["variant"];
  className?: string;
  size?: React.ComponentProps<typeof AdminButton>["size"];
}) {
  const { pending } = useFormStatus();
  return (
    <AdminButton
      className={className}
      disabled={pending}
      size={size}
      type="submit"
      variant={variant}
    >
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? pendingLabel : children}
    </AdminButton>
  );
}
