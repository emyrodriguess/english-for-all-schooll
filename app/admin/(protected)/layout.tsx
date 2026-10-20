import { AdminShell } from "@/components/admin/admin-shell";
import { requireActiveAdmin } from "@/lib/internal/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, email } = await requireActiveAdmin();
  return (
    <AdminShell profile={{ name: profile.name, email }}>{children}</AdminShell>
  );
}
