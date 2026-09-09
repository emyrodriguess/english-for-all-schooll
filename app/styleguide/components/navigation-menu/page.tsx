"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpenCheckIcon,
  CheckCircle2Icon,
  CircleHelpIcon,
  Code2Icon,
  CompassIcon,
  GraduationCapIcon,
  LayoutGridIcon,
  MoonIcon,
  PlaneIcon,
  SlidersHorizontalIcon,
  UsersRoundIcon,
  type LucideIcon,
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../../components/theme-toggle";

const basicUsage = `import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function MainNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild>
              <Link href="/courses">Todos os cursos</Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

const linkUsage = `<NavigationMenuItem>
  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
    <Link href="/styleguide">Design Tokens</Link>
  </NavigationMenuLink>
</NavigationMenuItem>`;

const viewportUsage = `<NavigationMenu viewport={false}>
  <NavigationMenuList>{/* content abre abaixo do item */}</NavigationMenuList>
</NavigationMenu>`;

const props = [
  ["viewport", "boolean", "true", "Controla se o viewport compartilhado do Radix e usado."],
  ["asChild", "boolean", "false", "Disponivel em NavigationMenuLink para usar Link do Next."],
  ["value", "string", "undefined", "Item aberto em uso controlado."],
  ["onValueChange", "(value: string) => void", "undefined", "Callback ao abrir/trocar item."],
  ["delayDuration", "number", "200", "Atraso de abertura do Radix."],
  ["skipDelayDuration", "number", "300", "Janela para pular delay entre itens."],
] as const;

const courseLinks = [
  {
    title: "Conversacao",
    href: "/styleguide/components/tabs",
    description: "Aulas ao vivo para destravar a fala em situacoes reais.",
    icon: UsersRoundIcon,
  },
  {
    title: "Viagens",
    href: "/styleguide/components/card",
    description: "Vocabulário e pratica para aeroportos, hoteis e passeios.",
    icon: PlaneIcon,
  },
  {
    title: "Certificacao",
    href: "/styleguide/components/badge",
    description: "Trilha com metas, avaliacao e certificado de conclusao.",
    icon: GraduationCapIcon,
  },
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  icon?: LucideIcon;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          {Icon ? <Icon data-icon="inline-start" /> : null}
          <div>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function EnglishNavigationMenu({
  viewport = true,
  compact = false,
  disabled = false,
}: {
  viewport?: boolean;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <NavigationMenu viewport={viewport}>
      <NavigationMenuList className={cn("flex-wrap justify-start", compact && "max-w-md")}>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-1 md:w-[520px] md:grid-cols-[0.8fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end rounded-md bg-muted p-5 no-underline outline-none transition-colors hover:bg-muted/80 focus:bg-muted"
                    href="/styleguide"
                  >
                    <BookOpenCheckIcon />
                    <div className="mt-4 text-base font-medium">English For All</div>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground">
                      Design system para paginas de curso, venda e area do aluno.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {courseLinks.map((item) => (
                <ListItem
                  href={item.href}
                  icon={item.icon}
                  key={item.title}
                  title={item.title}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger disabled={disabled}>Recursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-2 p-1">
              <ListItem href="/styleguide/components/dialog" icon={CompassIcon} title="Matricula">
                Fluxos de inscricao, dialogs e formularios de conversao.
              </ListItem>
              <ListItem href="/styleguide/components/accordion" icon={CircleHelpIcon} title="FAQ">
                Perguntas frequentes para landing pages e paginas de curso.
              </ListItem>
              <ListItem href="/styleguide/components/separator" icon={LayoutGridIcon} title="Layout">
                Divisores, navegacao e organizacao visual.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/styleguide">Tokens</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default function NavigationMenuShowcasePage() {
  const [viewport, setViewport] = useState("true");
  const [disabled, setDisabled] = useState("false");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Navigation Menu
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Navegacao avançada para headers com dropdowns, mega menus e links
            diretos. A base shadcn usa Radix Navigation Menu, tokens globais e
            composicao com `asChild` para links do Next.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CompassIcon data-icon="inline-start" />
              Exemplos
            </CardTitle>
            <CardDescription>
              Menus podem combinar dropdowns ricos, links diretos e estados
              desabilitados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="rounded-lg border bg-card p-4">
              <EnglishNavigationMenu />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <EnglishNavigationMenu viewport={false} />
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
              Controle viewport compartilhado e estado desabilitado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Viewport</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={setViewport}
                value={viewport}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Compartilhado
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Por item
                </label>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Trigger Recursos</span>
              <RadioGroup
                className="flex flex-col gap-3"
                onValueChange={setDisabled}
                value={disabled}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Habilitado
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Desabilitado
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <EnglishNavigationMenu
                disabled={disabled === "true"}
                viewport={viewport === "true"}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estados</CardTitle>
            <CardDescription>
              Hover, focus, open, active e disabled ficam nos triggers e links.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border bg-card p-4">
              <EnglishNavigationMenu disabled />
            </div>
            <Button disabled variant="outline">
              Exemplo de acao indisponivel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              Popover, muted, focus ring e textos herdam variaveis globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <div className="rounded-lg border bg-card p-4">
              <EnglishNavigationMenu viewport={false} />
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
              Use `NavigationMenuLink asChild` com `Link` para navegação Next.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={linkUsage} />
            <CodeBlock code={viewportUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Navigation Menu primitive com `viewport` no Root.
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
            Radix gerencia roles, foco, abertura por teclado e fechamento ao sair.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Navigation</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Use triggers para abrir conteúdo e links reais para navegação. Não
            transforme texto estático em item clicável sem destino.
          </p>
          <p>
            Teclado: Tab entra no menu, setas navegam entre itens, Enter ou
            Espaço acionam triggers e links.
          </p>
          <p>
            Em mobile, menus complexos geralmente precisam de Drawer ou layout
            dedicado; Navigation Menu funciona melhor para headers desktop.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
