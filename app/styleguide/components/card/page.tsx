"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CheckCircle2Icon,
  Code2Icon,
  CreditCardIcon,
  Layers3Icon,
  MoonIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const basicUsage = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CourseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modulo de conversacao</CardTitle>
        <CardDescription>Aulas ao vivo com pratica guiada.</CardDescription>
        <CardAction>
          <Badge>Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Ideal para destravar a fala em situacoes reais.</p>
      </CardContent>
      <CardFooter>
        <Button>Ver detalhes</Button>
      </CardFooter>
    </Card>
  )
}`;

const sizeUsage = `<Card size="sm">
  <CardHeader>
    <CardTitle>Resumo compacto</CardTitle>
    <CardDescription>Menos padding para listas e dashboards.</CardDescription>
  </CardHeader>
</Card>`;

const props = [
  ["size", '"default" | "sm"', '"default"', "Ajusta o espacamento interno do card."],
  ["className", "string", "undefined", "Permite layout e composicoes com tokens."],
  ["children", "React.ReactNode", "required", "Conteudo composto por header, content e footer."],
  ["...props", 'React.ComponentProps<"div">', "undefined", "Aceita atributos HTML de div."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function CourseCard({
  size,
  tone,
  withFooter = true,
}: {
  size: "default" | "sm";
  tone: "default" | "primary" | "success";
  withFooter?: boolean;
}) {
  return (
    <Card
      className={cn(
        tone === "primary" && "border-primary/20 bg-primary/5",
        tone === "success" && "border-success/20 bg-success/5",
      )}
      size={size}
    >
      <CardHeader>
        <CardTitle>Conversacao em ingles</CardTitle>
        <CardDescription>
          Pratica semanal para ganhar confianca em chamadas, viagens e
          entrevistas.
        </CardDescription>
        <CardAction>
          <Badge variant={tone === "success" ? "success" : "secondary"}>
            {tone === "success" ? "Ativo" : "Novo"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
          <BookOpenCheckIcon data-icon="inline-start" />
          <span className="text-sm text-muted-foreground">
            8 modulos com feedback individual
          </span>
        </div>
        <p className="text-sm leading-6">
          Use cards para agrupar conteudos independentes, como planos, modulos,
          depoimentos, metricas e chamadas para acao.
        </p>
      </CardContent>
      {withFooter ? (
        <CardFooter className="justify-between gap-3">
          <span className="text-sm font-medium">R$ 297</span>
          <Button size="sm">
            Ver plano
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function CardShowcasePage() {
  const [size, setSize] = useState<"default" | "sm">("default");
  const [tone, setTone] = useState<"default" | "primary" | "success">("default");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Card</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Container semantico para agrupar informacoes relacionadas. A versao
            instalada usa tokens globais, suporte a `size` e composicao completa
            com header, action, content e footer.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3Icon data-icon="inline-start" />
              Variantes de composicao
            </CardTitle>
            <CardDescription>
              Card nao usa variants de estilo como Button; a variacao vem da
              composicao e do prop `size`.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <CourseCard size="default" tone="default" />
            <CourseCard size="sm" tone="primary" />
            <MetricCard
              description="Indicador compacto para dashboard ou secao de prova social."
              label="Alunos acompanhados"
              value="+1.200"
            />
            <MetricCard
              description="Formato enxuto para resumo de beneficios e numeros."
              label="Satisfacao media"
              value="4.9/5"
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
              Controle o tamanho e o tom para testar a superficie com os tokens
              do design system.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tamanho</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={(value) => setSize(value as "default" | "sm")}
                value={size}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="default" />
                  Default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="sm" />
                  Small
                </label>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tom</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setTone("default")}
                  size="sm"
                  variant={tone === "default" ? "default" : "outline"}
                >
                  Default
                </Button>
                <Button
                  onClick={() => setTone("primary")}
                  size="sm"
                  variant={tone === "primary" ? "default" : "outline"}
                >
                  Primary tint
                </Button>
                <Button
                  onClick={() => setTone("success")}
                  size="sm"
                  variant={tone === "success" ? "default" : "outline"}
                >
                  Success tint
                </Button>
              </div>
            </div>

            <CourseCard size={size} tone={tone} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon data-icon="inline-start" />
              Default
            </CardTitle>
            <CardDescription>Superficie padrao com `bg-card`.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Boa para conteudo editorial, planos e secoes de curso.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Brand tint</CardTitle>
            <CardDescription>
              Destaque suave usando o azul da marca.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Badge variant="secondary">Recomendado</Badge>
          </CardFooter>
        </Card>

        <Card className="opacity-60" aria-disabled="true">
          <CardHeader>
            <CardTitle>Disabled visual</CardTitle>
            <CardDescription>
              Card e apenas container; desabilite as acoes internas.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button disabled size="sm">
              Indisponivel
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              O componente troca background, texto, ring e muted via variaveis
              globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <CourseCard size="default" tone="primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon data-icon="inline-start" />
              Estados de acao
            </CardTitle>
            <CardDescription>
              Hover, focus e disabled devem ficar nos controles internos, nao
              no container.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button>
              Acao principal
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline">Acao secundaria</Button>
            <Button disabled>Carregando</Button>
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
              Use sempre a composicao completa quando houver titulo, descricao,
              corpo e acoes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={sizeUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              O card exporta subcomponentes que aceitam props HTML de `div`.
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
            <CheckCircle2Icon data-icon="inline-start" />
            Acessibilidade
          </CardTitle>
          <CardDescription>
            Card e estrutural, entao a acessibilidade depende do conteudo e das
            acoes que ele agrupa.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Mantenha a hierarquia de titulos coerente com a pagina; `CardTitle`
            nao define nivel de heading sozinho.
          </p>
          <p>
            Se o card inteiro for clicavel, use um link ou botao real como
            elemento interativo principal.
          </p>
          <p>
            Estados como disabled, loading e focus devem aparecer nos controles
            internos, preservando semantica de teclado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
