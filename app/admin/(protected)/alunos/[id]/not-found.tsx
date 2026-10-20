import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function StudentNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Aluno não encontrado</EmptyTitle>
        <EmptyDescription>
          O cadastro pode ter sido arquivado ou o link está incorreto.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/admin/alunos">Voltar para alunos</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
