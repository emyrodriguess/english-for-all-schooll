import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ThemeToggle } from "./components/theme-toggle";

export const metadata: Metadata = {
  title: "Design Tokens",
  description: "Tokens e componentes fundamentais do design system English For All.",
};

const primaryScale = [
  ["50", "#F0F6FA"],
  ["100", "#DCEAF3"],
  ["200", "#B9D3E4"],
  ["300", "#8CB3CE"],
  ["400", "#5B8FAF"],
  ["500", "#326987"],
  ["600", "#214E6B"],
  ["700", "#173B56"],
  ["800", "#102A43"],
  ["900", "#091C31"],
] as const;

const redScale = [
  ["50", "#FFF1F2"],
  ["100", "#FFE1E3"],
  ["200", "#FFC7CB"],
  ["300", "#FF9DA4"],
  ["400", "#F65F6A"],
  ["500", "#E72B39"],
  ["600", "#D1121F"],
  ["700", "#AD0F19"],
  ["800", "#8F121A"],
  ["900", "#760F16"],
] as const;

const neutralScale = [
  ["50", "#F7F9FC"],
  ["100", "#EEF2F6"],
  ["200", "#D9E2EC"],
  ["300", "#BCCCDC"],
  ["400", "#9FB3C8"],
  ["500", "#829AB1"],
  ["600", "#627D98"],
  ["700", "#486581"],
  ["800", "#334E68"],
  ["900", "#243B53"],
] as const;

const semanticColors = [
  { name: "Success", variable: "--success", value: "#16794B" },
  { name: "Warning", variable: "--warning", value: "#F5A524" },
  { name: "Error", variable: "--destructive", value: "#B42318" },
  { name: "Info", variable: "--info", value: "#1479C9" },
] as const;

const roleColors = [
  ["Background", "--background", "#F7F9FC"],
  ["Foreground", "--foreground", "#102A43"],
  ["Card", "--card", "#FFFFFF"],
  ["Primary", "--primary", "#102A43"],
  ["Secondary", "--secondary", "#D1121F"],
  ["Muted", "--muted", "#EEF2F6"],
  ["Accent", "--accent", "#FFF1F2"],
  ["Border", "--border", "#D9E2EC"],
  ["Input", "--input", "#BCCCDC"],
  ["Ring", "--ring", "#326987"],
] as const;

const chartColors = [
  ["Chart 1", "--chart-1", "#102A43"],
  ["Chart 2", "--chart-2", "#D1121F"],
  ["Chart 3", "--chart-3", "#1479C9"],
  ["Chart 4", "--chart-4", "#16794B"],
  ["Chart 5", "--chart-5", "#F5A524"],
] as const;

const typeScale = [
  ["Display", "3rem / 3.5rem", "600", "text-4xl sm:text-5xl"],
  ["Heading 1", "2.25rem / 2.75rem", "600", "text-3xl sm:text-4xl"],
  ["Heading 2", "1.875rem / 2.25rem", "600", "text-3xl"],
  ["Heading 3", "1.5rem / 2rem", "600", "text-2xl"],
  ["Body large", "1.125rem / 1.75rem", "400", "text-lg"],
  ["Body", "1rem / 1.5rem", "400", "text-base"],
  ["Small", "0.875rem / 1.25rem", "400", "text-sm"],
] as const;

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

function ScaleRow({
  name,
  prefix,
  colors,
}: {
  name: string;
  prefix: string;
  colors: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-muted-foreground">{prefix}-50 → {prefix}-900</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-10">
        {colors.map(([step, hex]) => (
          <div className="overflow-hidden rounded-lg border bg-card" key={step}>
            <div
              className="h-20"
              style={{ backgroundColor: `var(${prefix}-${step})` }}
            />
            <div className="flex flex-col gap-0.5 px-2 py-2">
              <span className="text-xs font-semibold">{step}</span>
              <code className="text-[10px] text-muted-foreground">{hex}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenSwatch({
  name,
  variable,
  value,
}: {
  name: string;
  variable: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <span
        aria-hidden="true"
        className="size-12 shrink-0 rounded-md border shadow-xs"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{name}</span>
        <code className="block truncate text-xs text-muted-foreground">{variable}</code>
        <span className="block text-[11px] text-muted-foreground">{value}</span>
      </span>
    </div>
  );
}

function ExamplePanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-xs">
      <h3 className="mb-5 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="flex flex-col gap-6 border-b pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Design Tokens
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A base visual da English For All: clara, confiante e acolhedora. Cada
            decisão nasce do azul-marinho e do vermelho presentes na marca.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex flex-col gap-20 py-12 lg:gap-24 lg:py-16">
        <section className="flex flex-col gap-8" id="colors">
          <SectionHeader
            description="O azul-marinho conduz hierarquia e confiança. O vermelho cria energia e destaca ações importantes sem competir com os estados semânticos."
            title="Color palette"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl bg-primary-800 text-white shadow-sm">
              <div className="flex min-h-48 flex-col justify-between p-6">
                <span className="text-sm font-medium text-white/70">Brand navy</span>
                <div>
                  <p className="text-2xl font-semibold">Primary · 800</p>
                  <code className="text-sm text-white/70">#102A43 · --primary</code>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl bg-brand-red-600 text-white shadow-sm">
              <div className="flex min-h-48 flex-col justify-between p-6">
                <span className="text-sm font-medium text-white/75">Brand red</span>
                <div>
                  <p className="text-2xl font-semibold">Secondary · 600</p>
                  <code className="text-sm text-white/75">#D1121F · --secondary</code>
                </div>
              </div>
            </div>
          </div>

          <ScaleRow colors={primaryScale} name="Primary scale" prefix="--primary" />
          <ScaleRow colors={redScale} name="Brand red scale" prefix="--brand-red" />
          <ScaleRow colors={neutralScale} name="Neutral scale" prefix="--neutral" />

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Semantic colors</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {semanticColors.map((color) => (
                <TokenSwatch key={color.variable} {...color} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Interface roles</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {roleColors.map(([name, variable, value]) => (
                <TokenSwatch key={variable} name={name} value={value} variable={variable} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Chart colors</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {chartColors.map(([name, variable, value]) => (
                <TokenSwatch key={variable} name={name} value={value} variable={variable} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8" id="typography">
          <SectionHeader
            description="Poppins combina formas geométricas amigáveis com leitura direta. Os pesos 400–700 cobrem texto, controles e títulos sem depender de uma segunda família."
            title="Typography"
          />

          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <div className="text-8xl font-semibold leading-none tracking-[-0.06em] sm:text-9xl">Aa</div>
              <h3 className="mt-6 text-2xl font-semibold">Poppins</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Geométrica, inclusiva e segura para títulos, corpo de texto e interface.
              </p>
              <p className="mt-6 break-words text-sm leading-7">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789 · !?@#%&
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b bg-muted/60 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid-cols-[1fr_10rem_5rem]">
                <span>Style</span>
                <span>Size / line height</span>
                <span className="hidden sm:block">Weight</span>
              </div>
              {typeScale.map(([name, size, weight, className]) => (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-4 border-b px-4 py-5 last:border-b-0 sm:grid-cols-[1fr_10rem_5rem]"
                  key={name}
                >
                  <div>
                    <p className={className}>Learn without limits.</p>
                    <p className="mt-1 text-xs text-muted-foreground">{name}</p>
                  </div>
                  <code className="text-xs text-muted-foreground">{size}</code>
                  <code className="hidden text-xs text-muted-foreground sm:block">{weight}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8" id="shape">
          <SectionHeader
            description="A grade de 4px mantém consistência. Cantos de 10px suavizam a interface e sombras frias criam profundidade sem deixá-la pesada."
            title="Spacing, radius & elevation"
          />

          <div className="grid gap-8 xl:grid-cols-3">
            <ExamplePanel title="Spacing rhythm">
              <div className="flex flex-col gap-3">
                {[4, 8, 12, 16, 24, 32, 48, 64].map((space) => (
                  <div className="flex items-center gap-3" key={space}>
                    <code className="w-10 text-xs text-muted-foreground">{space}px</code>
                    <span
                      className="block h-3 rounded-full bg-primary"
                      style={{ width: `${space * 2}px` }}
                    />
                  </div>
                ))}
              </div>
            </ExamplePanel>

            <ExamplePanel title="Border radius">
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["0", "0"],
                  ["sm", "0.375rem"],
                  ["md", "0.5rem"],
                  ["lg", "0.625rem"],
                  ["xl", "0.875rem"],
                  ["pill", "9999px"],
                ].map(([name, radius]) => (
                  <div className="text-center" key={name}>
                    <div
                      className="mx-auto h-16 border-2 border-primary bg-primary/10"
                      style={{ borderRadius: radius }}
                    />
                    <code className="mt-2 block text-xs text-muted-foreground">{name}</code>
                  </div>
                ))}
              </div>
            </ExamplePanel>

            <ExamplePanel title="Shadows">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["none", "none"],
                  ["xs", "var(--shadow-xs)"],
                  ["sm", "var(--shadow-sm)"],
                  ["md", "var(--shadow-md)"],
                  ["lg", "var(--shadow-lg)"],
                ].map(([name, shadow]) => (
                  <div className="text-center" key={name}>
                    <div
                      className="h-16 rounded-lg border bg-card"
                      style={{ boxShadow: shadow }}
                    />
                    <code className="mt-2 block text-xs text-muted-foreground">{name}</code>
                  </div>
                ))}
              </div>
            </ExamplePanel>
          </div>
        </section>

        <section className="flex flex-col gap-8" id="components">
          <SectionHeader
            description="Os componentes oficiais do shadcn já consomem os papéis semânticos do tema. Alterar um token atualiza toda a biblioteca de forma previsível."
            title="Components"
          />

          <div className="grid gap-5 xl:grid-cols-2">
            <ExamplePanel title="Button">
              <div className="flex flex-wrap gap-3">
                <Button>
                  Começar agora
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button variant="secondary">Ação da marca</Button>
                <Button variant="outline">Ver detalhes</Button>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="destructive">Excluir</Button>
                <Button disabled>Indisponível</Button>
              </div>
            </ExamplePanel>

            <ExamplePanel title="Badge">
              <div className="flex flex-wrap gap-3">
                <Badge>Primary</Badge>
                <Badge variant="secondary">Brand</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Concluído</Badge>
                <Badge variant="warning">Atenção</Badge>
                <Badge variant="info">Informação</Badge>
                <Badge variant="destructive">Erro</Badge>
              </div>
            </ExamplePanel>

            <ExamplePanel title="Card">
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Próxima aula</CardTitle>
                  <CardDescription>
                    Conversation practice · Intermediate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6">
                    Pratique situações reais com uma trilha curta e feedback imediato.
                  </p>
                </CardContent>
                <CardFooter className="justify-between gap-4">
                  <Badge variant="success">Confirmada</Badge>
                  <Button size="sm">Entrar na aula</Button>
                </CardFooter>
              </Card>
            </ExamplePanel>

            <ExamplePanel title="Radio Group">
              <RadioGroup aria-label="Escolha seu nível de inglês" defaultValue="intermediate">
                {[
                  ["beginner", "Iniciante"],
                  ["intermediate", "Intermediário"],
                  ["advanced", "Avançado"],
                ].map(([value, label]) => (
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-3 py-3 text-sm transition-colors hover:bg-muted"
                    htmlFor={`level-${value}`}
                    key={value}
                  >
                    <RadioGroupItem id={`level-${value}`} value={value} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
            </ExamplePanel>

            <div className="xl:col-span-2">
              <ExamplePanel title="Alert">
                <div className="grid gap-3 lg:grid-cols-2">
                  <Alert variant="success">
                    <CheckCircle2Icon />
                    <AlertTitle>Progresso salvo</AlertTitle>
                    <AlertDescription>
                      Sua atividade foi adicionada ao histórico.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <TriangleAlertIcon />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      Revise sua conexão antes de iniciar a aula ao vivo.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="info">
                    <InfoIcon />
                    <AlertTitle>Nova atividade</AlertTitle>
                    <AlertDescription>
                      Um exercício de conversação está disponível.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <TriangleAlertIcon />
                    <AlertTitle>Não foi possível concluir</AlertTitle>
                    <AlertDescription>
                      Tente novamente ou fale com o suporte.
                    </AlertDescription>
                  </Alert>
                </div>
              </ExamplePanel>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
