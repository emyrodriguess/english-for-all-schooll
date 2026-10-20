import Link from "next/link";
import { MoreHorizontalIcon } from "lucide-react";

import { StatusBadge } from "@/components/admin/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  formatPhone,
  formatTime,
  formatWeekday,
  initials,
} from "@/lib/internal/format";

type StudentRow = {
  id: string;
  full_name: string;
  email: string | null;
  whatsapp: string;
  status: string;
  contracts: Array<{ status: string; end_date: string | null }> | null;
  class_memberships: Array<{
    status: string;
    classes: { name?: string } | null;
  }> | null;
  invoices: Array<{ status: string }> | null;
  schedule_assignments: Array<{
    active: boolean;
    weekly_slots: { weekday?: number; start_time?: string } | null;
  }> | null;
};

export function StudentTable({ students }: { students: StudentRow[] }) {
  return (
    <div className="admin-table-wrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Financeiro</TableHead>
            <TableHead>Próxima aula</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const activeContract = student.contracts?.find(
              (contract) => contract.status === "active",
            );
            const membership = student.class_memberships?.find(
              (item) => item.status === "active",
            );
            const overdue = student.invoices?.some(
              (invoice) => invoice.status === "overdue",
            );
            const assignment = student.schedule_assignments?.find(
              (item) => item.active,
            );
            return (
              <TableRow key={student.id}>
                <TableCell>
                  <Link
                    className="admin-student-cell"
                    href={`/admin/alunos/${student.id}`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {initials(student.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      <strong>{student.full_name}</strong>
                      <small>{student.email ?? "Sem e-mail"}</small>
                    </span>
                  </Link>
                </TableCell>
                <TableCell>{formatPhone(student.whatsapp)}</TableCell>
                <TableCell>
                  {membership?.classes?.name ?? "Sem turma"}
                </TableCell>
                <TableCell>
                  {activeContract
                    ? `Até ${formatDate(activeContract.end_date)}`
                    : "Sem contrato ativo"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={overdue ? "overdue" : "paid"} />
                </TableCell>
                <TableCell>
                  {assignment?.weekly_slots
                    ? `${formatWeekday(assignment.weekly_slots.weekday)} · ${formatTime(assignment.weekly_slots.start_time)}`
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label={`Ações de ${student.full_name}`}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/alunos/${student.id}`}>
                            Abrir ficha
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/alunos/${student.id}?tab=finance`}
                          >
                            Ver financeiro
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
