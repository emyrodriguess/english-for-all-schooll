"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  Code2Icon,
  KeyboardIcon,
  Layers3Icon,
  MoonIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const items = [
  {
    value: "method",
    title: "Como o curso combina conversacao e gramatica?",
    content:
      "Cada modulo parte de situacoes reais: apresentacao, trabalho, viagens e entrevistas. A gramatica aparece como suporte para falar melhor, nao como fim em si mesma.",
  },
  {
    value: "schedule",
    title: "Posso estudar em horarios flexiveis?",
    content:
      "Sim. O accordion funciona bem para FAQs de venda, detalhes de modulo e politicas porque entrega respostas longas sem aumentar demais a altura inicial da pagina.",
  },
  {
    value: "certificate",
    title: "O certificado pode ser destacado?",
    content:
      "Use o item aberto por padrao para destacar a informacao mais importante. Em landing pages, isso ajuda a responder objecoes sem criar outro bloco visual.",
  },
] as const;

const basicUsage = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Quanto tempo dura o curso?</AccordionTrigger>
        <AccordionContent>
          O aluno acompanha aulas ao vivo e materiais de apoio por modulo.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`;

const multipleUsage = `<Accordion type="multiple" defaultValue={["method", "schedule"]}>
  <AccordionItem value="method">
    <AccordionTrigger>Metodo</AccordionTrigger>
    <AccordionContent>Conteudo do metodo.</AccordionContent>
  </AccordionItem>
</Accordion>`;

const props = [
  ["type", '"single" | "multiple"', '"single"', "Define se um ou varios itens podem ficar abertos."],
  ["collapsible", "boolean", "false", "Permite fechar o item aberto no modo single."],
  ["defaultValue", "string | string[]", "undefined", "Estado inicial nao controlado."],
  ["value", "string | string[]", "undefined", "Estado controlado pelo componente pai."],
  ["onValueChange", "(value) => void", "undefined", "Callback chamado ao abrir ou fechar itens."],
] as const;

function DemoAccordion({
  mode,
  tone,
  bordered = false,
}: {
  mode: "single" | "multiple";
  tone: "default" | "card" | "primary";
  bordered?: boolean;
}) {
  const commonClassName = cn(
    "rounded-lg",
    tone === "card" && "border bg-card px-4",
    tone === "primary" && "border border-primary/20 bg-primary/5 px-4",
    bordered && "border bg-card px-4",
  );

  if (mode === "multiple") {
    return (
      <Accordion className={commonClassName} defaultValue={["method", "schedule"]} type="multiple">
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <Accordion
      className={commonClassName}
      collapsible
      defaultValue="method"
      type="single"
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

export default function AccordionShowcasePage() {
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [tone, setTone] = useState<"default" | "card" | "primary">("default");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Accordion
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Componente expansivel para FAQs, detalhes de aulas, politicas e
            conteudos longos. Ele usa primitives Radix, tokens do design system
            e estados acessiveis por teclado.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3Icon data-icon="inline-start" />
              Variantes
            </CardTitle>
            <CardDescription>
              O shadcn accordion nao tem variants formais; a composicao abaixo
              mostra tratamentos permitidos com tokens sem alterar a API base.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Default</h2>
              <DemoAccordion mode="single" tone="default" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Card surface</h2>
              <DemoAccordion bordered mode="single" tone="card" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Brand tint</h2>
              <DemoAccordion mode="single" tone="primary" />
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
              Altere o modo e a superficie para validar comportamento em tempo
              real.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Modo</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={(value) => setMode(value as "single" | "multiple")}
                value={mode}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="single" />
                  Single, com fechamento opcional
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="multiple" />
                  Multiple, varios itens abertos
                </label>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tratamento visual</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setTone("default")}
                  size="sm"
                  variant={tone === "default" ? "default" : "outline"}
                >
                  Default
                </Button>
                <Button
                  onClick={() => setTone("card")}
                  size="sm"
                  variant={tone === "card" ? "default" : "outline"}
                >
                  Card
                </Button>
                <Button
                  onClick={() => setTone("primary")}
                  size="sm"
                  variant={tone === "primary" ? "default" : "outline"}
                >
                  Brand tint
                </Button>
              </div>
            </div>

            <DemoAccordion mode={mode} tone={tone} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estados</CardTitle>
            <CardDescription>
              Estados principais para validacao visual, foco e itens
              indisponiveis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Accordion defaultValue="open" type="single">
              <AccordionItem value="open">
                <AccordionTrigger>Aberto por padrao</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Use `defaultValue` para deixar uma resposta estrategica
                  visivel no carregamento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="closed">
                <AccordionTrigger>Fechado</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Conteudo fechado preserva leitura progressiva da pagina.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem disabled value="disabled">
                <AccordionTrigger>Desabilitado</AccordionTrigger>
                <AccordionContent>
                  Este item nao recebe interacao enquanto estiver desabilitado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Passe pelo trigger com Tab para ver o foco usando `--ring`.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              O componente herda as variaveis globais, entao nao precisa de
              classes `dark:` para cores.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <DemoAccordion bordered mode="single" tone="card" />
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
              Importe as quatro partes do componente e escolha `single` ou
              `multiple` conforme o fluxo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={multipleUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Accordion por meio do shadcn/ui.
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

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyboardIcon data-icon="inline-start" />
              Acessibilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
            <p>
              O trigger e renderizado como botao e recebe `aria-expanded`
              automaticamente. A navegacao por Tab chega aos headers, Enter e
              Espaco alternam o item, e o estado desabilitado remove a
              interacao.
            </p>
            <p>
              Use titulos claros no `AccordionTrigger`; eles viram o ponto de
              decisao para leitores de tela e usuarios que escaneiam a pagina.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2Icon data-icon="inline-start" />
              Checklist de uso
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>Use `type=&quot;single&quot;` para FAQ comum.</p>
            <p>Use `type=&quot;multiple&quot;` quando respostas precisam ser comparadas.</p>
            <p>Mantenha conteudos curtos o bastante para nao virar uma pagina escondida.</p>
            <p>Prefira tokens (`bg-card`, `border`, `text-muted-foreground`) ao customizar.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
