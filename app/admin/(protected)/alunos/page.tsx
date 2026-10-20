import Link from "next/link";
import type { Metadata } from "next";
import { SearchIcon, UsersIcon } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { FilterForm } from "@/components/admin/filter-form";
import { ImportDialog } from "@/components/admin/import-dialog";
import { StudentCreateDialog } from "@/components/admin/student-create-dialog";
import { StudentTable } from "@/components/admin/student-table";
import { SearchableEntitySelect } from "@/components/admin/searchable-entity-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { getStudents } from "@/lib/internal/students";

export const metadata: Metadata = { title: "Alunos" };

type SearchParams = {
  q?: string;
  status?: string;
  classId?: string;
  page?: string;
  order?: string;
  novo?: string;
  importar?: string;
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const data = await getStudents(params);
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const urlForPage = (page: number) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && !["page", "novo", "importar"].includes(key))
        query.set(key, value);
    });
    query.set("page", String(page));
    return `/admin/alunos?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        actions={
          <>
            <StudentCreateDialog initiallyOpen={params.novo === "1"} />
            <ImportDialog
              initiallyOpen={params.importar === "1"}
              module="students"
            />
          </>
        }
        description={`${data.total.toLocaleString("pt-BR")} aluno(s) cadastrado(s)`}
        title="Alunos"
      />
      <Card className="admin-data-card">
        <CardContent>
          <FilterForm className="admin-filterbar">
            <div className="admin-filter-search">
              <SearchIcon />
              <Input
                defaultValue={params.q}
                name="q"
                placeholder="Buscar por nome, e-mail ou telefone"
              />
            </div>
            <label>
              <span>Status</span>
              <select
                className="admin-control admin-control-full"
                defaultValue={params.status ?? ""}
                name="status"
              >
                <option value="">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </label>
            <label>
              <span>Turma</span>
              <SearchableEntitySelect
                defaultValue={params.classId ?? ""}
                emptyLabel="Todas"
                id="student-class-filter"
                name="classId"
                options={data.classes.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Buscar turma"
              />
            </label>
            <label>
              <span>Ordenar</span>
              <select
                className="admin-control admin-control-full"
                defaultValue={params.order ?? "recent"}
                name="order"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="name">Nome</option>
              </select>
            </label>
            <Button type="submit">Filtrar</Button>
            <Button asChild variant="link">
              <Link href="/admin/alunos">Limpar filtros</Link>
            </Button>
          </FilterForm>
          {data.students.length ? (
            <StudentTable
              students={
                data.students as unknown as Parameters<
                  typeof StudentTable
                >[0]["students"]
              }
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum aluno encontrado</EmptyTitle>
                <EmptyDescription>
                  Cadastre o primeiro aluno ou ajuste os filtros.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <StudentCreateDialog />
              </EmptyContent>
            </Empty>
          )}
          {data.students.length ? (
            <div className="admin-pagination">
              <p>
                Mostrando {(data.page - 1) * data.pageSize + 1} a{" "}
                {Math.min(data.page * data.pageSize, data.total)} de{" "}
                {data.total} alunos
              </p>
              <div>
                <Button
                  asChild
                  disabled={data.page <= 1}
                  size="sm"
                  variant="outline"
                >
                  <Link
                    aria-disabled={data.page <= 1}
                    href={urlForPage(Math.max(1, data.page - 1))}
                  >
                    Anterior
                  </Link>
                </Button>
                <span>
                  Página {data.page} de {totalPages}
                </span>
                <Button
                  asChild
                  disabled={data.page >= totalPages}
                  size="sm"
                  variant="outline"
                >
                  <Link
                    aria-disabled={data.page >= totalPages}
                    href={urlForPage(Math.min(totalPages, data.page + 1))}
                  >
                    Próxima
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
