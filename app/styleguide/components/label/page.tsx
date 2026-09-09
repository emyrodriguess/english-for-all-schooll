"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  Code2Icon,
  InfoIcon,
  Loader2Icon,
  MoonIcon,
  SlidersHorizontalIcon,
  TagIcon,
  TextCursorInputIcon,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const states = ["default", "required", "optional", "invalid", "disabled", "loading"] as const;
type LabelState = (typeof states)[number];

const basicUsage = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailField() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="voce@email.com" />
    </div>
  )
}`;

const requiredUsage = `<Label htmlFor="name">
  Nome
  <span aria-hidden="true" className="text-destructive">*</span>
</Label>`;

const disabledUsage = `<div className="group" data-disabled="true">
  <Label htmlFor="locked">Campo bloqueado</Label>
  <Input id="locked" disabled />
</div>`;

const props = [
  ["htmlFor", "string", "undefined", "Associa o label ao id do controle."],
  ["className", "string", "undefined", "Use para layout ou pequenos ajustes."],
  ["children", "React.ReactNode", "required", "Texto do label e indicadores visuais."],
  ["...props", "React.ComponentProps<typeof LabelPrimitive.Root>", "undefined", "Aceita props do Radix Label primitive."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function FieldExample({
  id,
  label,
  description,
  state = "default",
  control = "input",
}: {
  id: string;
  label: string;
  description: string;
  state?: LabelState;
  control?: "input" | "textarea";
}) {
  const isDisabled = state === "disabled" || state === "loading";
  const isInvalid = state === "invalid";

  return (
    <div className="group flex flex-col gap-2" data-disabled={isDisabled ? "true" : undefined}>
      <Label htmlFor={id}>
        {label}
        {state === "required" ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : null}
        {state === "optional" ? (
          <span className="text-xs font-normal text-muted-foreground">Opcional</span>
        ) : null}
      </Label>
      <div className="relative">
        {control === "textarea" ? (
          <Textarea
            aria-describedby={`${id}-description`}
            aria-invalid={isInvalid || undefined}
            disabled={isDisabled}
            id={id}
            placeholder="Conte um pouco sobre seu objetivo."
          />
        ) : (
          <Input
            aria-describedby={`${id}-description`}
            aria-invalid={isInvalid || undefined}
            disabled={isDisabled}
            id={id}
            placeholder="voce@email.com"
            type="email"
          />
        )}
        {state === "loading" ? (
          <Loader2Icon className="absolute right-2.5 top-2.5 animate-spin text-muted-foreground" />
        ) : null}
      </div>
      <p
        className={cn(
          "text-xs leading-5 text-muted-foreground",
          isInvalid && "text-destructive",
        )}
        id={`${id}-description`}
      >
        {isInvalid ? "Informe um valor valido para continuar." : description}
      </p>
    </div>
  );
}

export default function LabelShowcasePage() {
  const [state, setState] = useState<LabelState>("default");
  const [control, setControl] = useState<"input" | "textarea">("input");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Label</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Texto associado a controles de formulario. A versao shadcn usa
            Radix Label, preserva `htmlFor` e aplica estados de disabled por
            `peer-disabled` ou `group-data-[disabled=true]`.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon data-icon="inline-start" />
              Variantes de uso
            </CardTitle>
            <CardDescription>
              Label nao tem variants formais; a variacao vem da composicao com
              campos, ajuda textual e estados.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FieldExample
              description="Associado ao input por htmlFor e id."
              id="label-default"
              label="Email"
            />
            <FieldExample
              description="Indicador visual; valide tambem no formulario."
              id="label-required"
              label="Nome completo"
              state="required"
            />
            <FieldExample
              description="Sinalize quando o campo nao for obrigatorio."
              id="label-optional"
              label="Telefone"
              state="optional"
            />
            <FieldExample
              description="Mensagem textual acompanha o estado de erro."
              id="label-invalid"
              label="Email"
              state="invalid"
            />
            <FieldExample
              description="O label herda opacidade pelo group disabled."
              id="label-disabled"
              label="Cupom"
              state="disabled"
            />
            <FieldExample
              control="textarea"
              description="Tambem funciona com Textarea."
              id="label-textarea"
              label="Objetivo"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon data-icon="inline-start" />
              Demo interativa
            </CardTitle>
            <CardDescription>
              Alterne estado e controle para validar associacao, erro e
              disabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Estado</span>
              <div className="flex flex-wrap gap-2">
                {states.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setState(item)}
                    size="sm"
                    variant={state === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Controle</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={(value) => setControl(value as "input" | "textarea")}
                value={control}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="input" />
                  Input
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="textarea" />
                  Textarea
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <FieldExample
                control={control}
                description="Preview composto com label, controle e descricao."
                id="label-interactive"
                label="Contato"
                state={state}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextCursorInputIcon data-icon="inline-start" />
              Inline control
            </CardTitle>
            <CardDescription>Use flex com gap para checkbox/radio.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <input className="peer size-4 accent-current" id="terms-styleguide" type="checkbox" />
              <Label htmlFor="terms-styleguide">Aceito os termos do curso</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado loading</CardTitle>
            <CardDescription>
              O controle fica disabled e o label reduz opacidade pelo grupo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldExample
              description="Validando disponibilidade..."
              id="label-loading"
              label="Email"
              state="loading"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>Label usa texto sem cor manual.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ThemeToggle />
            <FieldExample
              description="Preview em dark mode."
              id="label-dark"
              label="Email"
            />
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
              Use `htmlFor` apontando para o `id` do controle correspondente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={requiredUsage} />
            <CodeBlock code={disabledUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Label primitive.
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
            Label e uma das pecas mais importantes para formularios acessiveis.
          </CardDescription>
          <CardAction>
            <Badge variant="info">
              <InfoIcon data-icon="inline-start" />
              Forms
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Todo input, textarea, checkbox ou radio deve ter um nome acessivel.
            Label visivel com `htmlFor` e `id` e o caminho mais claro.
          </p>
          <p>
            Indicadores como asterisco ajudam visualmente, mas required e erro
            precisam ser comunicados por validacao e texto.
          </p>
          <p>
            Para estados disabled, desabilite o controle real. O label apenas
            acompanha o estado visual.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
