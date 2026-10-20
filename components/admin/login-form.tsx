"use client";

import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon, LockKeyholeIcon, MailIcon } from "lucide-react";

import { loginAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/action-form";
import { FormField } from "@/components/admin/form-field";
import { Input } from "@/components/ui/input";
import { INITIAL_ACTION_STATE } from "@/lib/internal/action-state";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action] = useActionState(loginAction, INITIAL_ACTION_STATE);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="admin-login-form">
      <input name="next" type="hidden" value={nextPath ?? ""} />
      <FormField
        error={state.fieldErrors?.email?.[0]}
        htmlFor="email"
        label="E-mail"
      >
        <div className="admin-input-icon">
          <MailIcon aria-hidden="true" />
          <Input
            aria-invalid={Boolean(state.fieldErrors?.email)}
            autoComplete="email"
            id="email"
            name="email"
            placeholder="exemplo@gmail.com"
            type="email"
          />
        </div>
      </FormField>
      <FormField
        error={state.fieldErrors?.password?.[0]}
        htmlFor="password"
        label="Senha"
      >
        <div className="admin-input-icon">
          <LockKeyholeIcon aria-hidden="true" />
          <Input
            aria-invalid={Boolean(state.fieldErrors?.password)}
            autoComplete="current-password"
            id="password"
            name="password"
            placeholder="Sua senha"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="admin-input-end-icon admin-password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </FormField>
      {state.status === "error" && state.message ? (
        <p className="admin-form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="admin-login-submit" pendingLabel="Entrando...">
        Entrar
      </SubmitButton>
    </form>
  );
}
