"use client";

import { useState } from "react";
import {
  BookOpenCheckIcon,
  CheckCircle2Icon,
  Code2Icon,
  CreditCardIcon,
  LayoutPanelTopIcon,
  ListChecksIcon,
  MoonIcon,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ThemeToggle } from "../../components/theme-toggle";

const variants = ["default", "line"] as const;
type TabsVariant = (typeof variants)[number];

const orientations = ["horizontal", "vertical"] as const;
type TabsOrientation = (typeof orientations)[number];

const basicUsage = `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function CourseTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Visao geral</TabsTrigger>
        <TabsTrigger value="modules">Modulos</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Conteudo da visao geral.</TabsContent>
      <TabsContent value="modules">Conteudo dos modulos.</TabsContent>
    </Tabs>
  )
}`;

const lineUsage = `<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Visao geral</TabsTrigger>
    <TabsTrigger value="modules">Modulos</TabsTrigger>
  </TabsList>
</Tabs>`;

const verticalUsage = `<Tabs orientation="vertical" defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Perfil</TabsTrigger>
    <TabsTrigger value="billing">Pagamento</TabsTrigger>
  </TabsList>
</Tabs>`;

const props = [
  ["orientation", '"horizontal" | "vertical"', '"horizontal"', "Define eixo de lista e conteudo."],
  ["defaultValue", "string", "undefined", "Aba inicial para uso nao controlado."],
  ["value", "string", "undefined", "Aba ativa em uso controlado."],
  ["onValueChange", "(value: string) => void", "undefined", "Callback ao trocar aba."],
  ["TabsList variant", '"default" | "line"', '"default"', "Tratamento visual da lista."],
  ["disabled", "boolean", "false", "Disponivel em TabsTrigger para bloquear uma aba."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function CourseTabs({
  variant = "default",
  orientation = "horizontal",
  disabled = false,
}: {
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  disabled?: boolean;
}) {
  return (
    <Tabs
      className={orientation === "vertical" ? "min-h-56 flex-row" : undefined}
      defaultValue="overview"
      orientation={orientation}
    >
      <TabsList variant={variant}>
        <TabsTrigger value="overview">
          <BookOpenCheckIcon data-icon="inline-start" />
          Visao geral
        </TabsTrigger>
        <TabsTrigger value="modules">
          <ListChecksIcon data-icon="inline-start" />
          Modulos
        </TabsTrigger>
        <TabsTrigger disabled={disabled} value="pricing">
          <CreditCardIcon data-icon="inline-start" />
          Planos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Curso de ingles conversacional</CardTitle>
            <CardDescription>
              Estrutura pensada para destravar fala, escuta e confianca.
            </CardDescription>
            <CardAction>
              <Badge variant="success">Ativo</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Use tabs quando o usuario precisa alternar entre paineis
            equivalentes sem sair do contexto.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="modules">
        <Card>
          <CardHeader>
            <CardTitle>Modulos</CardTitle>
            <CardDescription>Conteudo progressivo por situacao real.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>1. Apresentacoes e rotina</p>
            <p>2. Viagens e direcoes</p>
            <p>3. Entrevistas e trabalho</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pricing">
        <Card>
          <CardHeader>
            <CardTitle>Planos</CardTitle>
            <CardDescription>Detalhes de pagamento e acesso.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Conteudo do painel de planos.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function TabsShowcasePage() {
  const [variant, setVariant] = useState<TabsVariant>("default");
  const [orientation, setOrientation] = useState<TabsOrientation>("horizontal");
  const [disabled, setDisabled] = useState("false");
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Tabs</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Navegacao local entre paineis relacionados. A versao instalada usa
            Radix Tabs, suporta orientacao horizontal ou vertical e `TabsList`
            com variantes `default` e `line`.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutPanelTopIcon data-icon="inline-start" />
              Variantes
            </CardTitle>
            <CardDescription>
              Triggers sempre ficam dentro de `TabsList`; conteudos usam
              `TabsContent` com o mesmo `value`.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Default</h2>
              <CourseTabs />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Line</h2>
              <CourseTabs variant="line" />
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
              Ajuste variante, orientacao e estado desabilitado.
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
              <span className="text-sm font-medium">Aba de planos</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={setDisabled}
                value={disabled}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Habilitada
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Desabilitada
                </label>
              </RadioGroup>
            </div>

            <CourseTabs
              disabled={disabled === "true"}
              orientation={orientation}
              variant={variant}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRoundIcon data-icon="inline-start" />
              Controlled tabs
            </CardTitle>
            <CardDescription>
              Use `value` e `onValueChange` quando outra UI precisa conhecer a
              aba ativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs onValueChange={setActiveTab} value={activeTab}>
              <TabsList>
                <TabsTrigger value="account">Conta</TabsTrigger>
                <TabsTrigger value="password">Senha</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Conta</CardTitle>
                    <CardDescription>Edite dados basicos do aluno.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="tabs-name">Nome</Label>
                      <Input id="tabs-name" defaultValue="Gabriel Vieira" />
                    </div>
                    <Badge variant="info">Aba ativa: {activeTab}</Badge>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Senha</CardTitle>
                    <CardDescription>Atualize credenciais de acesso.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="tabs-password">Nova senha</Label>
                      <Input id="tabs-password" type="password" />
                    </div>
                    <Button>Salvar senha</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              Estados active, hover e focus usam tokens globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <CourseTabs variant="line" />
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
              Use `TabsList` para triggers e `TabsContent` para paineis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={lineUsage} />
            <CodeBlock code={verticalUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Tabs primitive com extensao de variant na lista.
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
            Tabs devem alternar conteudos equivalentes sem navegar para outra
            pagina.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Navigation</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Radix gerencia roles, `aria-selected`, foco e associacao entre
            trigger e painel.
          </p>
          <p>
            Teclado: Tab entra no conjunto; setas navegam entre triggers conforme
            a orientacao.
          </p>
          <p>
            Nao coloque triggers fora de `TabsList`; isso quebra a composicao e
            a experiencia de teclado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
