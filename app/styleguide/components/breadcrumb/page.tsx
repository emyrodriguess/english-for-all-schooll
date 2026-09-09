"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  Code2Icon,
  FolderOpenIcon,
  HomeIcon,
  Loader2Icon,
  MoonIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ThemeToggle } from "../../components/theme-toggle";

const separators = ["chevron", "slash", "dot"] as const;
type SeparatorKind = (typeof separators)[number];

const basicUsage = `import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CourseBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/styleguide">Styleguide</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`;

const ellipsisUsage = `<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1">
      <BreadcrumbEllipsis />
      <span className="sr-only">Abrir navegação intermediária</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem>Componentes</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>`;

const separatorUsage = `<BreadcrumbSeparator>/</BreadcrumbSeparator>`;

const props = [
  ["asChild", "boolean", "false", "Disponível em BreadcrumbLink para usar Next Link."],
  ["aria-label", "string", '"breadcrumb"', "Definido no nav raiz para identificar a trilha."],
  ["aria-current", '"page"', '"page"', "Definido em BreadcrumbPage."],
  ["children", "React.ReactNode", "required", "Itens, separadores e página atual."],
  ["className", "string", "undefined", "Use para layout, truncamento ou responsividade."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function CustomSeparator({ kind }: { kind: SeparatorKind }) {
  if (kind === "slash") return <BreadcrumbSeparator>/</BreadcrumbSeparator>;
  if (kind === "dot") return <BreadcrumbSeparator>·</BreadcrumbSeparator>;
  return <BreadcrumbSeparator />;
}

function CourseBreadcrumb({
  separator = "chevron",
  collapsed = false,
  loading = false,
}: {
  separator?: SeparatorKind;
  collapsed?: boolean;
  loading?: boolean;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className="inline-flex items-center gap-1" href="/styleguide">
              <HomeIcon data-icon="inline-start" />
              Styleguide
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <CustomSeparator kind={separator} />
        {collapsed ? (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <BreadcrumbEllipsis />
                  <span className="sr-only">Abrir navegação intermediária</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Foundation</DropdownMenuItem>
                  <DropdownMenuItem>Componentes</DropdownMenuItem>
                  <DropdownMenuItem>Overlay</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <CustomSeparator kind={separator} />
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/styleguide/components/card">Components</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <CustomSeparator kind={separator} />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/styleguide/components/navigation-menu">Navigation</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <CustomSeparator kind={separator} />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
                Carregando
              </span>
            ) : (
              "Breadcrumb"
            )}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function BreadcrumbShowcasePage() {
  const [separator, setSeparator] = useState<SeparatorKind>("chevron");
  const [collapsed, setCollapsed] = useState("false");
  const [loading, setLoading] = useState("false");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Breadcrumb</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Trilha de navegação para mostrar localização dentro da hierarquia.
            A base shadcn usa markup semântico com `nav`, `ol`, links,
            separadores ocultos de leitores de tela e página atual.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpenIcon data-icon="inline-start" />
              Exemplos
            </CardTitle>
            <CardDescription>
              Use breadcrumbs em páginas internas, dashboards e áreas com hierarquia clara.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-lg border bg-card p-4">
              <CourseBreadcrumb />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <CourseBreadcrumb collapsed />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/styleguide">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRightIcon />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Separador customizado</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
              Ajuste separador, colapso e estado visual de loading.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Separador</span>
              <div className="flex flex-wrap gap-2">
                {separators.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setSeparator(item)}
                    size="sm"
                    variant={separator === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Formato</span>
              <RadioGroup className="flex flex-col gap-3" onValueChange={setCollapsed} value={collapsed}>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Completo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Colapsado
                </label>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Página atual</span>
              <RadioGroup className="flex flex-col gap-3" onValueChange={setLoading} value={loading}>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Loading visual
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <CourseBreadcrumb
                collapsed={collapsed === "true"}
                loading={loading === "true"}
                separator={separator}
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
              Links têm hover/focus, página atual usa `aria-current`, ellipsis abre menu.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CourseBreadcrumb collapsed />
            <Button disabled variant="outline">Link indisponível em outra UI</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoonIcon data-icon="inline-start" />
              Dark mode
            </CardTitle>
            <CardDescription>
              Textos, página atual e dropdown usam tokens globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <CourseBreadcrumb collapsed separator="slash" />
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
              Use `BreadcrumbLink asChild` com `Link` do Next e termine com `BreadcrumbPage`.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={ellipsisUsage} />
            <CodeBlock code={separatorUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              O componente é composto por elementos HTML semânticos.
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
            Breadcrumb comunica localização; não deve substituir a navegação principal.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Navigation</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            O nav raiz usa `aria-label=&quot;breadcrumb&quot;` e a lista ordenada preserva a hierarquia.
          </p>
          <p>
            Separadores são `aria-hidden`; leitores de tela ouvem apenas links e página atual.
          </p>
          <p>
            A página atual deve usar `BreadcrumbPage`, que define `aria-current=&quot;page&quot;`.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
