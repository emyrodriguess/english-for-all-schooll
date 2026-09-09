"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  Code2Icon,
  Columns3Icon,
  LayoutListIcon,
  MoonIcon,
  Rows3Icon,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const orientations = ["horizontal", "vertical"] as const;
type SeparatorOrientation = (typeof orientations)[number];

const tones = ["default", "muted", "brand"] as const;
type SeparatorTone = (typeof tones)[number];

const basicUsage = `import { Separator } from "@/components/ui/separator"

export function SectionDivider() {
  return <Separator className="my-6" />
}`;

const verticalUsage = `<div className="flex h-5 items-center gap-4 text-sm">
  <span>Blog</span>
  <Separator orientation="vertical" />
  <span>Aulas</span>
</div>`;

const semanticUsage = `<Separator decorative={false} aria-label="Separar detalhes do plano" />`;

const props = [
  ["orientation", '"horizontal" | "vertical"', '"horizontal"', "Define eixo e dimensao do divisor."],
  ["decorative", "boolean", "true", "Quando false, expõe o separador para tecnologia assistiva."],
  ["className", "string", "undefined", "Use para margem, altura, largura ou tom via tokens."],
  ["...props", "React.ComponentProps<typeof SeparatorPrimitive.Root>", "undefined", "Aceita props do Radix Separator primitive."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function toneClassName(tone: SeparatorTone) {
  return cn(
    tone === "muted" && "bg-muted-foreground/25",
    tone === "brand" && "bg-primary/60",
  );
}

function InteractiveSeparator({
  orientation,
  tone,
  decorative,
}: {
  orientation: SeparatorOrientation;
  tone: SeparatorTone;
  decorative: boolean;
}) {
  if (orientation === "vertical") {
    return (
      <div className="flex h-24 items-center gap-5 rounded-lg border bg-card p-5 text-sm">
        <span>Curso</span>
        <Separator
          className={toneClassName(tone)}
          decorative={decorative}
          orientation="vertical"
        />
        <span>Aulas</span>
        <Separator
          className={toneClassName(tone)}
          decorative={decorative}
          orientation="vertical"
        />
        <span>Suporte</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">Plano English For All</h3>
        <p className="text-sm text-muted-foreground">
          Conversacao ao vivo, materiais e feedback individual.
        </p>
      </div>
      <Separator
        className={cn("my-5", toneClassName(tone))}
        decorative={decorative}
      />
      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <span>8 modulos</span>
        <span>Ao vivo</span>
        <span>Certificado</span>
      </div>
    </div>
  );
}

export default function SeparatorShowcasePage() {
  const [orientation, setOrientation] = useState<SeparatorOrientation>("horizontal");
  const [tone, setTone] = useState<SeparatorTone>("default");
  const [decorative, setDecorative] = useState("true");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Separator</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Divisor visual para separar blocos, itens inline e grupos de
            conteudo. A base do shadcn usa Radix Separator e o token `border`
            como cor padrao.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rows3Icon data-icon="inline-start" />
              Orientacoes
            </CardTitle>
            <CardDescription>
              Use horizontal para separar secoes e vertical para separar itens
              em uma linha.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="rounded-lg border p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-medium">Horizontal</h2>
                <p className="text-sm text-muted-foreground">
                  Ideal para dividir cabecalho, corpo e metadados.
                </p>
              </div>
              <Separator className="my-5" />
              <div className="text-sm">Inicio das aulas: Setembro</div>
            </div>

            <div className="flex h-20 items-center gap-4 rounded-lg border p-5 text-sm">
              <span>Sobre</span>
              <Separator orientation="vertical" />
              <span>Aulas</span>
              <Separator orientation="vertical" />
              <span>Beneficios</span>
              <Separator orientation="vertical" />
              <span>Contato</span>
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
              Ajuste orientacao, tom e semantica para validar o comportamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Orientacao</span>
              <div className="flex flex-wrap gap-2">
                {orientations.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setOrientation(item)}
                    size="sm"
                    variant={orientation === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Tom</span>
              <div className="flex flex-wrap gap-2">
                {tones.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setTone(item)}
                    size="sm"
                    variant={tone === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Semantica</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={setDecorative}
                value={decorative}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Decorative
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Exposto para leitores de tela
                </label>
              </RadioGroup>
            </div>

            <InteractiveSeparator
              decorative={decorative === "true"}
              orientation={orientation}
              tone={tone}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutListIcon data-icon="inline-start" />
              Em listas
            </CardTitle>
            <CardDescription>
              Separe itens relacionados sem criar novos cards.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium">Modulo 1</p>
              <p className="text-sm text-muted-foreground">Apresentacoes e rotina</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Modulo 2</p>
              <p className="text-sm text-muted-foreground">Viagens e direcoes</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Modulo 3</p>
              <p className="text-sm text-muted-foreground">Entrevistas e trabalho</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Columns3Icon data-icon="inline-start" />
              Inline
            </CardTitle>
            <CardDescription>Use vertical com altura definida no container.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-16 items-center gap-4 text-sm">
              <div>
                <p className="font-medium">12</p>
                <p className="text-muted-foreground">Aulas</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-medium">4.9</p>
                <p className="text-muted-foreground">Nota</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-medium">Ao vivo</p>
                <p className="text-muted-foreground">Formato</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>Cor vem do token `border`.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <div>
              <p className="text-sm font-medium">Preview</p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                O contraste acompanha o tema ativo.
              </p>
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
              Prefira Separator no lugar de `hr` ou `div` com border manual.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={verticalUsage} />
            <CodeBlock code={semanticUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Separator primitive.
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
            Separadores costumam ser decorativos; use semantica apenas quando a
            divisao precisa ser anunciada.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Layout</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            O padrão `decorative=true` remove o separador da arvore acessivel,
            ideal para divisores puramente visuais.
          </p>
          <p>
            Se o separador representa uma quebra estrutural relevante, use
            `decorative=false` e forneça um nome acessivel quando necessário.
          </p>
          <p>
            Nao use Separator para criar espacamento. Use margem, padding e gap;
            deixe o componente representar uma linha real.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
