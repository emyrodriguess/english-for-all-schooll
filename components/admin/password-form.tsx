"use client";

import { useActionState } from "react";

import { changePasswordAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/action-form";
import { FormField } from "@/components/admin/form-field";
import { Input } from "@/components/ui/input";
import { INITIAL_ACTION_STATE } from "@/lib/internal/action-state";

export function PasswordForm() {
  const [state, action] = useActionState(
    changePasswordAction,
    INITIAL_ACTION_STATE,
  );
  return (
    <form action={action} className="admin-login-form">
      <FormField
        error={state.fieldErrors?.password?.[0]}
        hint="Mínimo de 10 caracteres, com maiúscula, minúscula e número."
        htmlFor="password"
        label="Nova senha"
      >
        <Input
          autoComplete="new-password"
          id="password"
          name="password"
          type="password"
        />
      </FormField>
      <FormField
        error={state.fieldErrors?.confirmation?.[0]}
        htmlFor="confirmation"
        label="Confirme a nova senha"
      >
        <Input
          autoComplete="new-password"
          id="confirmation"
          name="confirmation"
          type="password"
        />
      </FormField>
      {state.status === "error" && state.message ? (
        <p className="admin-form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton
        className="admin-login-submit"
        pendingLabel="Atualizando..."
      >
        Salvar nova senha
      </SubmitButton>
    </form>
  );
}
