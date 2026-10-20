import type { Metadata } from "next";

import { PasswordForm } from "@/components/admin/password-form";
import { BrandLogo } from "@/components/admin/brand-logo";
import { requireActiveAdmin } from "@/lib/internal/auth";

export const metadata: Metadata = { title: "Criar nova senha" };

export default async function ChangePasswordPage() {
  await requireActiveAdmin({ allowPasswordChange: true });
  return (
    <main className="admin-auth-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <BrandLogo variant="auth" />
        </div>
        <div className="admin-login-copy">
          <h1>Crie sua nova senha</h1>
          <p>Por segurança, substitua a senha temporária antes de continuar.</p>
        </div>
        <PasswordForm />
      </section>
    </main>
  );
}
