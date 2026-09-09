"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  BellIcon,
  CheckCircle2Icon,
  Code2Icon,
  InfoIcon,
  LinkIcon,
  Loader2Icon,
  MoonIcon,
  SlidersHorizontalIcon,
  TagIcon,
  TriangleAlertIcon,
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

import { ThemeToggle } from "../../components/theme-toggle";

const variants = [
  "default",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "outline",
  "ghost",
  "link",
] as const;

type BadgeVariant = (typeof variants)[number];

const basicUsage = `import { Badge } from "@/components/ui/badge"

export function StatusBadge() {
  return <Badge variant="success">Ativo</Badge>
}`;

const iconUsage = `import { BadgeCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function VerifiedBadge() {
  return (
    <Badge variant="secondary">
      <BadgeCheckIcon data-icon="inline-start" />
      Verificado
    </Badge>
  )
}`;

const linkUsage = `<Badge asChild variant="outline">
  <a href="/styleguide/components/badge">Documentacao</a>
</Badge>`;

const props = [
  ["variant", variants.map((variant) => `"${variant}"`).join(" | "), '"default"', "Define tom visual e intencao semantica."],
  ["asChild", "boolean", "false", "Renderiza o badge como filho, util para links."],
  ["className", "string", "undefined", "Use para layout ou ajustes pequenos."],
  ["children", "React.ReactNode", "required", "Texto curto, numero ou icone com rotulo."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function VariantBadge({ variant }: { variant: BadgeVariant }) {
  const labels: Record<BadgeVariant, string> = {
    default: "Default",
    secondary: "Secondary",
    destructive: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    outline: "Outline",
    ghost: "Ghost",
    link: "Link",
  };

  return <Badge variant={variant}>{labels[variant]}</Badge>;
}

export default function BadgeShowcasePage() {
  const [variant, setVariant] = useState<BadgeVariant>("default");
  const [withIcon, setWithIcon] = useState("yes");
  const [shape, setShape] = useState("label");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Badge</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Marcador compacto para status, categorias, contadores e metadados.
            A versao do projeto preserva as variantes do shadcn e adiciona tons
            semanticos do design system: success, warning e info.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon data-icon="inline-start" />
              Variantes
            </CardTitle>
            <CardDescription>
              Todas as variantes usam tokens globais, incluindo as extensoes
              semanticas do projeto.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {variants.map((item) => (
                <VariantBadge key={item} variant={item} />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Com icones</CardTitle>
                  <CardDescription>
                    Use icone + texto quando o status precisa ser escaneado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="success">
                    <CheckCircle2Icon data-icon="inline-start" />
                    Ativo
                  </Badge>
                  <Badge variant="warning">
                    <TriangleAlertIcon data-icon="inline-start" />
                    Revisar
                  </Badge>
                  <Badge variant="info">
                    <InfoIcon data-icon="inline-start" />
                    Novo
                  </Badge>
                  <Badge variant="destructive">
                    <AlertCircleIcon data-icon="inline-start" />
                    Erro
                  </Badge>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader>
                  <CardTitle>Contadores</CardTitle>
                  <CardDescription>
                    Numeros curtos podem usar formato circular.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                    8
                  </Badge>
                  <Badge
                    className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                    variant="destructive"
                  >
                    99
                  </Badge>
                  <Badge
                    className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                    variant="outline"
                  >
                    20+
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon data-icon="inline-start" />
              Demo interativa
            </CardTitle>
            <CardDescription>
              Ajuste variante, icone e formato para testar combinacoes comuns.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Variante</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setVariant(item)}
                    size="sm"
                    variant={variant === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium">Icone</span>
                <RadioGroup
                  className="flex flex-col gap-3"
                  onValueChange={setWithIcon}
                  value={withIcon}
                >
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="yes" />
                    Com icone
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="no" />
                    Apenas texto
                  </label>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium">Formato</span>
                <RadioGroup
                  className="flex flex-col gap-3"
                  onValueChange={setShape}
                  value={shape}
                >
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="label" />
                    Label
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="counter" />
                    Counter
                  </label>
                </RadioGroup>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <Badge
                className={
                  shape === "counter"
                    ? "h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                    : undefined
                }
                variant={variant}
              >
                {withIcon === "yes" && shape === "label" ? (
                  <BadgeCheckIcon data-icon="inline-start" />
                ) : null}
                {shape === "counter" ? "12" : "Matricula aberta"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Estados</CardTitle>
            <CardDescription>Default, link, foco e estado passivo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge asChild variant="outline">
              <a href="/styleguide/components/badge">
                <LinkIcon data-icon="inline-start" />
                Link
              </a>
            </Badge>
            <Badge aria-invalid variant="outline">
              Invalido
            </Badge>
            <Badge className="opacity-50" aria-disabled="true" variant="secondary">
              Indisponivel
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>
              Badge pode sinalizar processamento curto com icone animado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
              Sincronizando
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>As cores vêm dos tokens globais.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ThemeToggle />
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Ativo</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="info">Info</Badge>
            </div>
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
              Use texto curto. Para links, combine `asChild` com uma ancora.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={iconUsage} />
            <CodeBlock code={linkUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              `variant` vem do CVA e `asChild` vem do Slot do Radix.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {props.map(([name, type, defaultValue, description]) => (
              <div className="rounded-lg border p-4" key={name}>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-xs">{name}</code>
                  <Badge variant="outline">{defaultValue}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{type}</p>
                <p className="mt-2 text-sm leading-6">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon data-icon="inline-start" />
            Acessibilidade e uso
          </CardTitle>
          <CardDescription>
            Badge e um marcador visual, nao um controle interativo por padrao.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Guidance</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Evite depender apenas da cor; use texto claro como Ativo, Pendente,
            Erro ou Novo.
          </p>
          <p>
            Quando o badge for clicavel, renderize com `asChild` e use um link
            ou botao real.
          </p>
          <p>
            Mantenha labels curtos para preservar leitura em cards, tabelas e
            navegacao lateral.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
