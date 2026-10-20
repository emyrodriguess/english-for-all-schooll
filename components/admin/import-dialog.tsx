"use client";

import { startTransition, useActionState, useState } from "react";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  RotateCcwIcon,
} from "lucide-react";

import {
  confirmImportAction,
  getImportPreviewPageAction,
  prepareImportAction,
} from "@/app/admin/(protected)/import-actions";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FileUploadInput } from "@/components/admin/file-upload-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActionState } from "@/lib/internal/action-state";
import {
  importModuleLabels,
  type ImportModule,
  type ImportPreview,
} from "@/lib/internal/import-definitions";

const PREVIEW_PAGE_SIZE = 20;

function PreviewStatus({ status }: { status: "valid" | "invalid" }) {
  const valid = status === "valid";
  return (
    <Badge variant={valid ? "success" : "destructive"}>
      {valid ? (
        <CheckCircle2Icon data-icon="inline-start" />
      ) : (
        <CircleXIcon data-icon="inline-start" />
      )}
      {valid ? "Válida" : "Revisar"}
    </Badge>
  );
}

function ImportWorkflow({
  module,
  onComplete,
  onReset,
}: {
  module: ImportModule;
  onComplete: () => void;
  onReset: () => void;
}) {
  const action = prepareImportAction.bind(null, module);
  const initialState: ActionState<ImportPreview> = { status: "idle" };
  const [state, formAction, pending] = useActionState(action, initialState);
  const preview = state.data;
  const [page, setPage] = useState(1);
  const [pageRows, setPageRows] = useState<ImportPreview["rows"]>([]);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const rows = page === 1 || !pageRows.length ? preview?.rows ?? [] : pageRows;
  const totalPages = preview
    ? Math.max(1, Math.ceil(preview.totalRows / PREVIEW_PAGE_SIZE))
    : 1;

  const changePage = (nextPage: number) => {
    if (!preview || nextPage === page || nextPage < 1 || nextPage > totalPages)
      return;
    setIsChangingPage(true);
    startTransition(async () => {
      const result = await getImportPreviewPageAction(preview.jobId, nextPage);
      if (result.status === "success" && result.data) {
        setPage(result.data.page);
        setPageRows(result.data.rows);
      }
      setIsChangingPage(false);
    });
  };

  if (!preview) {
    return (
      <form action={formAction} className="admin-import-upload">
        <FileUploadInput
          accept=".csv,text/csv"
          description="Arquivo CSV · máximo de 10 MB"
          id={`import-${module}-file`}
          name="file"
          required
        />
        {pending ? <Progress value={65} /> : null}
        {state.status === "error" ? (
          <p className="admin-form-error" role="alert">
            {state.message}
          </p>
        ) : null}
        <Button disabled={pending} type="submit">
          {pending ? "Validando arquivo..." : "Gerar prévia"}
        </Button>
      </form>
    );
  }

  return (
    <div className="admin-import-preview">
      <div className="admin-import-summary">
        <div>
          <strong>{preview.totalRows.toLocaleString("pt-BR")}</strong>
          <span>Linhas</span>
        </div>
        <div className="admin-import-summary-success">
          <strong>{preview.validRows.toLocaleString("pt-BR")}</strong>
          <span>Válidas</span>
        </div>
        <div className="admin-import-summary-error">
          <strong>{preview.invalidRows.toLocaleString("pt-BR")}</strong>
          <span>Para revisar</span>
        </div>
      </div>
      <p className="admin-import-columns">
        <strong>Colunas reconhecidas:</strong> {preview.detectedColumns.join(", ")}
      </p>
      <div className="admin-import-table-region" aria-busy={isChangingPage}>
        <div className="admin-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Linha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dados</TableHead>
                <TableHead>Validação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const feedback = [...row.errors, ...row.duplicates].join(" ");
                return (
                  <TableRow key={row.rowNumber}>
                    <TableCell>{row.rowNumber}</TableCell>
                    <TableCell>
                      <PreviewStatus status={row.status} />
                    </TableCell>
                    <TableCell>
                      {Object.values(row.values)
                        .filter(Boolean)
                        .slice(0, 4)
                        .join(" · ")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          feedback
                            ? "admin-import-feedback-error"
                            : "admin-import-feedback-success"
                        }
                      >
                        {feedback || "Pronta para importar"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 ? (
        <div className="admin-import-pagination">
          <span>
            Página {page} de {totalPages}
          </span>
          <div>
            <Button
              disabled={isChangingPage || page === 1}
              onClick={() => changePage(page - 1)}
              size="sm"
              type="button"
              variant="outline"
            >
              <ChevronLeftIcon data-icon="inline-start" />
              Anterior
            </Button>
            <Button
              disabled={isChangingPage || page === totalPages}
              onClick={() => changePage(page + 1)}
              size="sm"
              type="button"
              variant="outline"
            >
              Próxima
              <ChevronRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      ) : null}
      <div className="admin-import-footer">
        <p
          className={
            preview.invalidRows
              ? "admin-import-feedback-error"
              : "admin-import-feedback-success"
          }
        >
          {preview.invalidRows
            ? "As linhas em vermelho não serão importadas. Corrija o arquivo e envie uma nova versão se necessário."
            : "Prévia válida. Você já pode confirmar a importação."}
        </p>
        <div>
          <Button onClick={onReset} type="button" variant="outline">
            <RotateCcwIcon data-icon="inline-start" />
            Novo arquivo
          </Button>
          <ActionForm action={confirmImportAction} onSuccess={onComplete}>
            <input name="job_id" type="hidden" value={preview.jobId} />
            <SubmitButton pendingLabel="Importando...">
              Confirmar {preview.validRows.toLocaleString("pt-BR")} linha(s)
            </SubmitButton>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}

export function ImportDialog({
  module,
  initiallyOpen = false,
}: {
  module: ImportModule;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [workflowKey, setWorkflowKey] = useState(0);
  const resetWorkflow = () => setWorkflowKey((current) => current + 1);

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetWorkflow();
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Importar CSV</Button>
      </DialogTrigger>
      <DialogContent className="admin-dialog-import">
        <DialogHeader>
          <DialogTitle>Importar {importModuleLabels[module]}</DialogTitle>
          <DialogDescription>
            Envie o CSV, revise os dados e confirme somente as linhas válidas.
          </DialogDescription>
        </DialogHeader>
        <ImportWorkflow
          key={workflowKey}
          module={module}
          onComplete={() => setOpen(false)}
          onReset={resetWorkflow}
        />
      </DialogContent>
    </Dialog>
  );
}
