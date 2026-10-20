import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const getCurrentAdmin = cache(async () => {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id,name,role,active,must_change_password")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile || !profile.active || profile.role !== "admin")
    return null;

  return { supabase, profile, email: String(claimsData.claims.email ?? "") };
});

export async function requireActiveAdmin(options?: {
  allowPasswordChange?: boolean;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.profile.must_change_password && !options?.allowPasswordChange) {
    redirect("/admin/alterar-senha");
  }
  return admin;
}

export async function requireAdminForAction(options?: {
  allowPasswordChange?: boolean;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Sua sessão expirou. Entre novamente.");
  if (admin.profile.must_change_password && !options?.allowPasswordChange) {
    throw new Error("Altere a senha temporária antes de continuar.");
  }
  return admin;
}
