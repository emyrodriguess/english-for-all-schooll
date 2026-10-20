import { type NextRequest } from "next/server";

import { getCurrentAdmin } from "@/lib/internal/auth";
import {
  importModules,
  importTemplates,
  type ImportModule,
} from "@/lib/internal/import-definitions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ module: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response("Não autorizado", { status: 401 });
  const { module } = await params;
  if (!importModules.includes(module as ImportModule))
    return new Response("Módulo inválido", { status: 404 });
  return new Response(`\uFEFF${importTemplates[module as ImportModule]}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="modelo-${module}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
