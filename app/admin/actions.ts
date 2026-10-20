"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/internal/action-state";
import { createClient } from "@/lib/supabase/server";
import { requireAdminForAction } from "@/lib/internal/auth";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
  next: z.string().optional(),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Use pelo menos 10 caracteres.")
      .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
      .regex(/[a-z]/, "Inclua uma letra minúscula.")
      .regex(/[0-9]/, "Inclua um número."),
    confirmation: z.string(),
  })
  .refine((value) => value.password === value.confirmation, {
    path: ["confirmation"],
    message: "As senhas não coincidem.",
  });

function safeNextPath(value?: string) {
  if (!value?.startsWith("/admin/") || value.startsWith("/admin/login")) {
    return "/admin/dashboard";
  }
  return value;
}

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { status: "error", message: "E-mail ou senha incorretos." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("active,role")
    .eq("id", signInData.user.id)
    .maybeSingle();
  if (!profile?.active || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { status: "error", message: "Esta conta não possui acesso ao sistema interno." };
  }

  redirect(safeNextPath(result.data.next));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "A nova senha ainda não atende aos requisitos.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { supabase } = await requireAdminForAction({
    allowPasswordChange: true,
  });
  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });
  if (error)
    return { status: "error", message: "Não foi possível alterar a senha." };

  const { error: profileError } = await supabase.rpc(
    "complete_password_change",
  );
  if (profileError) {
    return {
      status: "error",
      message:
        "Senha alterada, mas o perfil não foi liberado. Tente novamente.",
    };
  }

  redirect("/admin/dashboard");
}
