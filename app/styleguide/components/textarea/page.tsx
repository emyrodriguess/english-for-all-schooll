"use client";

import { useMemo, useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Code2Icon,
  Loader2Icon,
  MessageSquareTextIcon,
  MoonIcon,
  SlidersHorizontalIcon,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const sizes = ["default", "compact", "tall"] as const;
type TextareaSize = (typeof sizes)[number];

const states = ["default", "invalid", "disabled", "loading"] as const;
type TextareaState = (typeof states)[number];

const basicUsage = `import { Textarea } from "@/components/ui/textarea"

export function MessageTextarea() {
  return <Textarea placeholder="Escreva sua mensagem aqui." />
}`;

const invalidUsage = `<Textarea
  aria-invalid
  defaultValue="Texto curto demais"
  placeholder="Conte mais sobre seu objetivo."
/>`;

const counterUsage = `const maxLength = 180

<Textarea
  maxLength={maxLength}
  value={message}
  onChange={(event) => setMessage(event.target.value)}
/>`;

const props = [
  ["placeholder", "string", "undefined", "Texto auxiliar antes do preenchimento."],
  ["rows", "number", "undefined", "Altura inicial do campo."],
  ["maxLength", "number", "undefined", "Limite nativo de caracteres."],
  ["disabled", "boolean", "false", "Remove interacao e aplica estado desabilitado."],
  ["aria-invalid", "boolean", "false", "Aciona estilo de erro com tokens destructive."],
  ["className", "string", "undefined", "Use para layout, altura e composicao."],
  ["...props", 'React.ComponentProps<"textarea">', "undefined", "Aceita props nativas de textarea."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function FieldPreview({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function sizeClassName(size: TextareaSize) {
  return cn(
    size === "compact" && "min-h-12",
    size === "tall" && "min-h-32",
  );
}

function InteractiveTextarea({
  size,
  state,
}: {
  size: TextareaSize;
  state: TextareaState;
}) {
  const [message, setMessage] = useState(
    "Quero praticar conversacao para me sentir mais seguro em viagens.",
  );
  const maxLength = 180;
  const count = message.length;
  const tone = useMemo(() => {
    if (state === "invalid") return "text-destructive";
    if (count > maxLength * 0.85) return "text-warning";
    return "text-muted-foreground";
  }, [count, state]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Textarea
          aria-invalid={state === "invalid" || undefined}
          className={cn(sizeClassName(size), state === "loading" && "pr-9")}
          disabled={state === "disabled" || state === "loading"}
          maxLength={maxLength}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Conte seu objetivo com o ingles"
          value={message}
        />
        {state === "loading" ? (
          <Loader2Icon className="absolute right-2.5 top-2.5 animate-spin text-muted-foreground" />
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        {state === "invalid" ? (
          <p className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircleIcon data-icon="inline-start" />
            Escreva pelo menos 20 caracteres.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Mensagem para avaliacao inicial.</p>
        )}
        <span className={cn("text-xs tabular-nums", tone)}>
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export default function TextareaShowcasePage() {
  const [size, setSize] = useState<TextareaSize>("default");
  const [state, setState] = useState<TextareaState>("default");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Textarea</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Campo para respostas longas, mensagens, observacoes e descricoes.
            A base do shadcn usa props nativas de textarea e os tokens do design
            system para foco, borda, placeholder, disabled e erro.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextCursorInputIcon data-icon="inline-start" />
              Tamanhos e estados
            </CardTitle>
            <CardDescription>
              Textarea nao possui variants formais; tamanho e comportamento
              vêm de props nativas e classes de layout.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FieldPreview
              description="Altura base definida pelo componente."
              label="Default"
            >
              <Textarea placeholder="Escreva sua mensagem aqui." />
            </FieldPreview>

            <FieldPreview
              description="Menor altura para comentarios rapidos."
              label="Compact"
            >
              <Textarea className="min-h-12" placeholder="Comentario curto" />
            </FieldPreview>

            <FieldPreview
              description="Mais espaco para depoimentos e descricoes."
              label="Tall"
            >
              <Textarea className="min-h-32" placeholder="Conte sua experiencia" />
            </FieldPreview>

            <FieldPreview
              description="Estado visual de erro via aria-invalid."
              label="Invalido"
            >
              <Textarea aria-invalid defaultValue="Curto" />
            </FieldPreview>

            <FieldPreview
              description="Remove foco e edicao."
              label="Desabilitado"
            >
              <Textarea disabled placeholder="Campo bloqueado" />
            </FieldPreview>

            <FieldPreview
              description="Limite nativo para formularios."
              label="Com limite"
            >
              <Textarea maxLength={120} placeholder="Ate 120 caracteres" />
            </FieldPreview>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon data-icon="inline-start" />
              Demo interativa
            </CardTitle>
            <CardDescription>
              Ajuste tamanho e estado para testar conteudo real de formulario.
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
                className="grid gap-3 sm:grid-cols-2"
                onValueChange={(value) => setState(value as TextareaState)}
                value={state}
              >
                {states.map((item) => (
                  <label className="flex items-center gap-2 text-sm" key={item}>
                    <RadioGroupItem value={item} />
                    {item}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <FieldPreview
                description="Preview com contador, erro e loading visual."
                label="Objetivo do aluno"
              >
                <InteractiveTextarea size={size} state={state} />
              </FieldPreview>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Com botao</CardTitle>
            <CardDescription>
              Acoes ficam fora ou abaixo do textarea, preservando foco.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Textarea placeholder="Escreva sua duvida para o professor." />
            <Button className="self-start" size="sm">
              Enviar mensagem
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Use disabled e um indicador claro.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea disabled placeholder="Salvando resposta..." />
              <Loader2Icon className="absolute right-2.5 top-2.5 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>Tokens globais controlam fundo e foco.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ThemeToggle />
            <Textarea placeholder="Preview em dark mode" />
            <Textarea aria-invalid defaultValue="Texto invalido" />
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
              Importe direto de `@/components/ui/textarea` e use props nativas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={invalidUsage} />
            <CodeBlock code={counterUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API e a mesma de um textarea HTML, com estilos shadcn.
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
            Textareas precisam de label claro, ajuda contextual e mensagem de
            erro textual.
          </CardDescription>
          <CardAction>
            <Badge variant="info">
              <MessageSquareTextIcon data-icon="inline-start" />
              Forms
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Associe o campo a um label visivel, especialmente em respostas
            longas onde o placeholder desaparece.
          </p>
          <p>
            Use `aria-invalid` junto de mensagem textual para erro. Cor sozinha
            nao comunica o problema.
          </p>
          <p>
            Defina `rows`, `maxLength` ou altura minima quando o contexto exigir
            uma resposta mais curta ou mais longa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
