"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  Code2Icon,
  HelpCircleIcon,
  InfoIcon,
  KeyboardIcon,
  Loader2Icon,
  MoonIcon,
  SaveIcon,
  SearchIcon,
  SlidersHorizontalIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ThemeToggle } from "../../components/theme-toggle";

const sides = ["top", "right", "bottom", "left"] as const;
type TooltipSide = (typeof sides)[number];

const basicUsage = `import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SaveTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Salvar alterações</p>
      </TooltipContent>
    </Tooltip>
  )
}`;

const providerUsage = `import { TooltipProvider } from "@/components/ui/tooltip"

<TooltipProvider>
  {children}
</TooltipProvider>`;

const sideUsage = `<TooltipContent side="right" sideOffset={8}>
  Atalho: Ctrl + S
</TooltipContent>`;

const props = [
  ["delayDuration", "number", "0", "Delay global no TooltipProvider."],
  ["side", '"top" | "right" | "bottom" | "left"', '"top"', "Posição do conteúdo."],
  ["sideOffset", "number", "0", "Distância entre trigger e tooltip."],
  ["asChild", "boolean", "false", "Disponível no TooltipTrigger para compor com Button."],
  ["open", "boolean", "undefined", "Estado controlado do tooltip."],
  ["onOpenChange", "(open: boolean) => void", "undefined", "Callback ao abrir ou fechar."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function IconTooltip({
  side = "top",
  label,
  children,
}: {
  side?: TooltipSide;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={8}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function TooltipShowcasePage() {
  const [side, setSide] = useState<TooltipSide>("top");
  const [state, setState] = useState("default");
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Tooltip</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Ajuda contextual curta para botões, ícones e controles. A base
            shadcn usa Radix Tooltip, portal, arrow e tokens de foreground,
            background e animação.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Exemplos</CardTitle>
            <CardDescription>
              Use tooltips para explicar ações compactas; não esconda informação essencial.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Ícones</CardTitle>
                <CardDescription>Botões compactos com rótulo acessível.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <IconTooltip label="Salvar alterações">
                  <Button size="icon" variant="outline">
                    <SaveIcon />
                    <span className="sr-only">Salvar alterações</span>
                  </Button>
                </IconTooltip>
                <IconTooltip label="Pesquisar aulas">
                  <Button size="icon" variant="outline">
                    <SearchIcon />
                    <span className="sr-only">Pesquisar aulas</span>
                  </Button>
                </IconTooltip>
                <IconTooltip label="Ajuda sobre matrícula">
                  <Button size="icon" variant="outline">
                    <HelpCircleIcon />
                    <span className="sr-only">Ajuda sobre matrícula</span>
                  </Button>
                </IconTooltip>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Com teclado</CardTitle>
                <CardDescription>Conteúdo curto com dica de atalho.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <KeyboardIcon data-icon="inline-start" />
                      Atalhos
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>
                    <span>Salvar: Ctrl + S</span>
                    <kbd data-slot="kbd">S</kbd>
                  </TooltipContent>
                </Tooltip>
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
              Ajuste posição e estado visual antes de passar o mouse ou focar o botão.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Side</span>
              <div className="flex flex-wrap gap-2">
                {sides.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setSide(item)}
                    size="sm"
                    variant={side === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Estado do trigger</span>
              <RadioGroup className="flex flex-col gap-3" onValueChange={setState} value={state}>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="default" />
                  Default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="loading" />
                  Loading visual
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="disabled" />
                  Disabled
                </label>
              </RadioGroup>
            </div>

            <div className="flex min-h-36 items-center justify-center rounded-lg border bg-card p-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled={state === "disabled"} variant="outline">
                    {state === "loading" ? (
                      <Loader2Icon className="animate-spin" data-icon="inline-start" />
                    ) : (
                      <InfoIcon data-icon="inline-start" />
                    )}
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side} sideOffset={8}>
                  <p>Tooltip em {side}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controlled tooltip</CardTitle>
            <CardDescription>
              Útil para previews guiados ou estados de onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Tooltip open={controlledOpen} onOpenChange={setControlledOpen}>
              <TooltipTrigger asChild>
                <Button onClick={() => setControlledOpen((value) => !value)} variant="outline">
                  Alternar tooltip
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                Controlado por estado React
              </TooltipContent>
            </Tooltip>
            <Badge variant={controlledOpen ? "success" : "outline"}>
              {controlledOpen ? "Aberto" : "Fechado"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              Tooltip usa `foreground` para fundo e `background` para texto.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <div className="flex flex-wrap gap-3">
              <IconTooltip label="A cor acompanha o tema">
                <Button variant="outline">Hover em dark mode</Button>
              </IconTooltip>
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
              O app foi envolvido com `TooltipProvider` no layout raiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={providerUsage} />
            <CodeBlock code={sideUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Tooltip primitive.
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
            Tooltips aparecem em hover e foco, mas não substituem labels ou textos essenciais.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Overlay</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Triggers icon-only ainda precisam de `sr-only` ou nome acessível; tooltip é ajuda extra.
          </p>
          <p>
            Mantenha textos curtos. Para conteúdo longo ou interativo, use Popover ou Dialog.
          </p>
          <p>
            Elementos disabled não recebem foco. Se precisar explicar o motivo,
            coloque o tooltip em um wrapper focável ou mostre texto auxiliar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
