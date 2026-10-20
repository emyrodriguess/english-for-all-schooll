import { AdminBadge } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  cancelled: "Cancelado",
  pending: "Pendente",
  overdue: "Inadimplente",
  paid: "Pago",
  completed: "Encerrado",
  ended: "Encerrado",
  sent: "Enviado",
  processing: "Processando",
  failed: "Falhou",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <AdminBadge className={cn("admin-status", `status-${status}`)} variant="outline">
      {labels[status] ?? status}
    </AdminBadge>
  );
}
