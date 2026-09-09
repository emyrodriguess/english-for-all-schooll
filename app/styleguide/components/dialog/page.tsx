"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Code2Icon,
  Loader2Icon,
  LockKeyholeIcon,
  MoonIcon,
  Settings2Icon,
  SlidersHorizontalIcon,
  UserRoundIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ThemeToggle } from "../../components/theme-toggle";

const sizes = ["sm", "md", "lg"] as const;
type DialogSize = (typeof sizes)[number];

const basicUsage = `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CourseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar inscricao</DialogTitle>
          <DialogDescription>
            Revise seus dados antes de continuar.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}`;

const formUsage = `<DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Editar perfil</DialogTitle>
    <DialogDescription>Atualize seus dados de aluno.</DialogDescription>
  </DialogHeader>
  <div className="flex flex-col gap-4">
    <Label htmlFor="name">Nome</Label>
    <Input id="name" />
  </div>
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="outline">Cancelar</Button>
    </DialogClose>
    <Button>Salvar</Button>
  </DialogFooter>
</DialogContent>`;

const controlledUsage = `const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Titulo obrigatorio</DialogTitle>
  </DialogContent>
</Dialog>`;

const props = [
  ["open", "boolean", "undefined", "Estado controlado do dialog."],
  ["defaultOpen", "boolean", "false", "Estado inicial nao controlado."],
  ["onOpenChange", "(open: boolean) => void", "undefined", "Callback ao abrir ou fechar."],
  ["modal", "boolean", "true", "Define comportamento modal do Radix."],
  ["showCloseButton", "boolean", "true", "Prop customizada em DialogContent."],
  ["asChild", "boolean", "false", "Disponivel no Trigger e Close para compor com Button."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function sizeClassName(size: DialogSize) {
  if (size === "lg") return "sm:max-w-2xl";
  if (size === "md") return "sm:max-w-lg";
  return "sm:max-w-sm";
}

function ProfileDialog({
  size = "sm",
  loading = false,
}: {
  size?: DialogSize;
  loading?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserRoundIcon data-icon="inline-start" />
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className={sizeClassName(size)}>
        <DialogHeader>
          <DialogTitle>Editar perfil do aluno</DialogTitle>
          <DialogDescription>
            Atualize dados usados para contato e acompanhamento das aulas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`dialog-name-${size}`}>Nome</Label>
            <Input id={`dialog-name-${size}`} defaultValue="Gabriel Vieira" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`dialog-email-${size}`}>Email</Label>
            <Input id={`dialog-email-${size}`} defaultValue="gabriel@email.com" type="email" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DialogShowcasePage() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DialogSize>("sm");
  const [loading, setLoading] = useState("false");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Dialog</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Overlay modal para fluxos focados, formulários curtos e confirmações
            que não devem tirar o usuário do contexto. Todo Dialog precisa de
            `DialogTitle` para acessibilidade.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2Icon data-icon="inline-start" />
              Exemplos
            </CardTitle>
            <CardDescription>
              Use `DialogTrigger asChild` para preservar o estilo do Button e
              `DialogClose asChild` para ações de fechamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Form modal</CardTitle>
                <CardDescription>Edição curta com footer e ações.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileDialog />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Sem botão de fechar</CardTitle>
                <CardDescription>Use quando as ações devem ficar explícitas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Abrir confirmação</Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Confirmar inscrição</DialogTitle>
                      <DialogDescription>
                        Você poderá revisar os dados antes do pagamento.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Voltar</Button>
                      </DialogClose>
                      <Button>Continuar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="md:col-span-2" size="sm">
              <CardHeader>
                <CardTitle>Controlled dialog</CardTitle>
                <CardDescription>
                  Estado externo útil para abrir após validações ou eventos.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <LockKeyholeIcon data-icon="inline-start" />
                      Abrir controlado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acesso liberado</DialogTitle>
                      <DialogDescription>
                        O estado deste dialog também aparece no badge da página.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton>
                      <Button onClick={() => setOpen(false)}>Entendi</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Badge variant={open ? "success" : "outline"}>
                  {open ? "Aberto" : "Fechado"}
                </Badge>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon data-icon="inline-start" />
              Demo interativa
            </CardTitle>
            <CardDescription>
              Ajuste tamanho e estado de carregamento antes de abrir.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tamanho</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setSize(item)}
                    size="sm"
                    variant={size === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Estado</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={setLoading}
                value={loading}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Loading
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <ProfileDialog loading={loading === "true"} size={size} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircleIcon data-icon="inline-start" />
              Estados
            </CardTitle>
            <CardDescription>
              Hover, focus, disabled e loading vivem no trigger e nas ações.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <ProfileDialog />
            <Button disabled variant="outline">Trigger disabled</Button>
            <Button disabled>
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
              Salvando
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              Overlay, conteúdo, ring e footer usam tokens globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <ProfileDialog size="md" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2Icon data-icon="inline-start" />
              Uso
            </CardTitle>
            <CardDescription>
              Sempre inclua `DialogTitle`; use `sr-only` se precisar ocultar visualmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={formUsage} />
            <CodeBlock code={controlledUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Dialog primitive, com `showCloseButton` no conteúdo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {props.map(([name, propType, defaultValue, description]) => (
              <div className="rounded-lg border p-4" key={name}>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-xs">{name}</code>
                  <Badge variant="outline">{defaultValue}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{propType}</p>
                <p className="mt-2 text-sm leading-6">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2Icon data-icon="inline-start" />
            Acessibilidade
          </CardTitle>
          <CardDescription>
            Dialog prende foco, fecha com Escape e associa título e descrição ao modal.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Overlay</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            `DialogTitle` é obrigatório. Se o título não aparece na UI, mantenha
            no DOM com `className=&quot;sr-only&quot;`.
          </p>
          <p>
            Use Dialog para tarefas focadas. Para ações destrutivas, prefira
            Alert Dialog porque ele comunica risco com mais força.
          </p>
          <p>
            Triggers e closes devem usar elementos interativos reais. Com shadcn,
            `asChild` permite usar Button sem perder semântica.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
