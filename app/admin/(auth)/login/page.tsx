import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/admin/brand-logo";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="admin-auth-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <BrandLogo variant="auth" />
        </div>
        <div className="admin-login-copy">
          <h1>Bem-vinda de volta</h1>
          <p>Entre para acessar o sistema interno da escola.</p>
        </div>
        <LoginForm nextPath={next} />
        <p className="admin-login-security">
          Ambiente seguro e restrito à equipe administrativa.
        </p>
      </section>
    </main>
  );
}
