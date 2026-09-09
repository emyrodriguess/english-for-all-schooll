"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Code2Icon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
  MoonIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TypeIcon,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const inputTypes = ["text", "email", "password", "search", "file"] as const;
type InputType = (typeof inputTypes)[number];

const basicUsage = `import { Input } from "@/components/ui/input"

export function EmailInput() {
  return <Input type="email" placeholder="voce@email.com" />
}`;

const invalidUsage = `<Input
  aria-invalid
  defaultValue="email-invalido"
  type="email"
/>`;

const fileUsage = `<Input type="file" accept="image/*,.pdf" />`;

const props = [
  ["type", 'React.HTMLInputTypeAttribute', '"text"', "Define teclado, validacao nativa e comportamento."],
  ["placeholder", "string", "undefined", "Texto auxiliar antes do preenchimento."],
  ["disabled", "boolean", "false", "Remove interacao e aplica estado desabilitado."],
  ["aria-invalid", "boolean", "false", "Aciona estilo de erro com tokens destructive."],
  ["className", "string", "undefined", "Use para layout, largura e composicao."],
  ["...props", 'React.ComponentProps<"input">', "undefined", "Aceita props nativas de input."],
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

function InteractiveInput({
  type,
  state,
}: {
  type: InputType;
  state: "default" | "invalid" | "disabled" | "loading";
}) {
  const [showPassword, setShowPassword] = useState(false);
  const effectiveType =
    type === "password" && showPassword ? "text" : type === "file" ? "file" : type;
  const placeholderByType: Record<InputType, string> = {
    text: "Gabriel Vieira",
    email: "gabriel@email.com",
    password: "Digite sua senha",
    search: "Buscar aula, modulo ou material",
    file: "",
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {type === "search" ? (
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        ) : null}
        {type === "email" ? (
          <MailIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        ) : null}
        <Input
          aria-invalid={state === "invalid" || undefined}
          className={cn((type === "search" || type === "email") && "pl-8", type === "password" && "pr-9")}
          disabled={state === "disabled" || state === "loading"}
          placeholder={placeholderByType[type]}
          type={effectiveType}
        />
        {state === "loading" ? (
          <Loader2Icon className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
        {type === "password" ? (
          <Button
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword((value) => !value)}
            size="icon"
            type="button"
            variant="ghost"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">Alternar visibilidade da senha</span>
          </Button>
        ) : null}
      </div>
      {state === "invalid" ? (
        <p className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircleIcon data-icon="inline-start" />
          Informe um valor valido antes de continuar.
        </p>
      ) : null}
    </div>
  );
}

export default function InputShowcasePage() {
  const [type, setType] = useState<InputType>("email");
  const [state, setState] = useState<"default" | "invalid" | "disabled" | "loading">("default");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Input</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Campo base para texto, email, senha, busca, arquivo e outros tipos
            nativos. Ele herda os tokens do design system para borda, foco,
            placeholder, disabled e erro.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TypeIcon data-icon="inline-start" />
              Tipos e estados
            </CardTitle>
            <CardDescription>
              O componente usa props nativas de input, entao a variacao vem de
              `type`, `disabled` e `aria-invalid`.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FieldPreview
              description="Uso base para nome, cidade ou respostas curtas."
              label="Texto"
            >
              <Input placeholder="Nome completo" type="text" />
            </FieldPreview>

            <FieldPreview
              description="Aciona teclado de email e validacao nativa."
              label="Email"
            >
              <Input placeholder="voce@email.com" type="email" />
            </FieldPreview>

            <FieldPreview
              description="Campo protegido para credenciais."
              label="Senha"
            >
              <Input placeholder="Digite sua senha" type="password" />
            </FieldPreview>

            <FieldPreview
              description="Estado visual de erro via aria-invalid."
              label="Invalido"
            >
              <Input aria-invalid defaultValue="email-invalido" type="email" />
            </FieldPreview>

            <FieldPreview
              description="Remove foco e interacao."
              label="Desabilitado"
            >
              <Input disabled placeholder="Campo bloqueado" />
            </FieldPreview>

            <FieldPreview
              description="Suporte nativo a upload de arquivo."
              label="Arquivo"
            >
              <Input type="file" />
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
              Alterne tipo e estado para validar comportamento e tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tipo</span>
              <div className="flex flex-wrap gap-2">
                {inputTypes.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setType(item)}
                    size="sm"
                    variant={type === item ? "default" : "outline"}
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
                onValueChange={(value) => setState(value as typeof state)}
                value={state}
              >
                {["default", "invalid", "disabled", "loading"].map((item) => (
                  <label className="flex items-center gap-2 text-sm" key={item}>
                    <RadioGroupItem value={item} />
                    {item}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <FieldPreview
                description="Preview composto para busca, email, senha e arquivo."
                label="Preview"
              >
                <InteractiveInput state={state} type={type} />
              </FieldPreview>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Com icone</CardTitle>
            <CardDescription>Composicao simples usando padding lateral.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Buscar aulas" type="search" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Use icone ao lado para processo curto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input disabled placeholder="Validando email" />
              <Loader2Icon className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>Tokens globais controlam foco, fundo e erro.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ThemeToggle />
            <Input placeholder="Preview em dark mode" />
            <Input aria-invalid defaultValue="valor invalido" />
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
              Importe direto de `@/components/ui/input` e use props nativas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={invalidUsage} />
            <CodeBlock code={fileUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API e a mesma de um input HTML, com estilos shadcn.
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
            Input precisa de label acessivel e estado de erro legivel.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Forms</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Associe cada input a um `label` ou a um nome acessivel quando usado
            em formularios reais.
          </p>
          <p>
            Use `aria-invalid` para expor erro e acompanhe com mensagem textual,
            nao apenas cor.
          </p>
          <p>
            Prefira `type` correto para teclado mobile, validacao nativa e
            preenchimento automatico.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
