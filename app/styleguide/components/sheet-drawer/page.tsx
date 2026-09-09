"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  Code2Icon,
  Loader2Icon,
  MenuIcon,
  MoonIcon,
  PanelBottomIcon,
  PanelRightIcon,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ThemeToggle } from "../../components/theme-toggle";

const sheetSides = ["right", "left", "top", "bottom"] as const;
type SheetSide = (typeof sheetSides)[number];

const drawerDirections = ["bottom", "right", "left", "top"] as const;
type DrawerDirection = (typeof drawerDirections)[number];

const sheetUsage = `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Menu do aluno</SheetTitle>
      <SheetDescription>Acesso rápido aos recursos.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`;

const drawerUsage = `import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

<Drawer direction="bottom">
  <DrawerTrigger asChild>
    <Button>Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Meta de estudos</DrawerTitle>
      <DrawerDescription>Defina sua rotina semanal.</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`;

const controlledUsage = `const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetTitle>Titulo obrigatório</SheetTitle>
  </SheetContent>
</Sheet>`;

const props = [
  ["Sheet side", '"top" | "right" | "bottom" | "left"', '"right"', "Lado por onde o painel entra."],
  ["Drawer direction", '"top" | "right" | "bottom" | "left"', '"bottom"', "Direção controlada pelo Vaul."],
  ["open", "boolean", "undefined", "Estado controlado do overlay."],
  ["onOpenChange", "(open: boolean) => void", "undefined", "Callback ao abrir ou fechar."],
  ["showCloseButton", "boolean", "true", "Prop customizada em SheetContent."],
  ["asChild", "boolean", "false", "Disponível nos triggers/closes para compor com Button."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function StudentForm() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="sheet-drawer-name">Nome</Label>
        <Input id="sheet-drawer-name" defaultValue="Gabriel Vieira" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sheet-drawer-email">Email</Label>
        <Input id="sheet-drawer-email" defaultValue="gabriel@email.com" type="email" />
      </div>
    </div>
  );
}

function SheetExample({
  side = "right",
  loading = false,
}: {
  side?: SheetSide;
  loading?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PanelRightIcon data-icon="inline-start" />
          Abrir Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Editar perfil do aluno</SheetTitle>
          <SheetDescription>
            Painel lateral para formulários curtos, filtros e navegação contextual.
          </SheetDescription>
        </SheetHeader>
        <StudentForm />
        <SheetFooter>
          <Button disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
            Salvar alterações
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DrawerExample({
  direction = "bottom",
  loading = false,
}: {
  direction?: DrawerDirection;
  loading?: boolean;
}) {
  const [goal, setGoal] = useState(4);

  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <PanelBottomIcon data-icon="inline-start" />
          Abrir Drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Meta semanal</DrawerTitle>
            <DrawerDescription>
              Defina quantas aulas de inglês quer estudar esta semana.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-4 px-4 py-6">
            <Button
              disabled={goal <= 1}
              onClick={() => setGoal((value) => Math.max(1, value - 1))}
              size="icon"
              variant="outline"
            >
              -
              <span className="sr-only">Diminuir meta</span>
            </Button>
            <div className="text-center">
              <div className="text-5xl font-semibold tabular-nums">{goal}</div>
              <div className="text-xs uppercase text-muted-foreground">aulas/semana</div>
            </div>
            <Button
              disabled={goal >= 7}
              onClick={() => setGoal((value) => Math.min(7, value + 1))}
              size="icon"
              variant="outline"
            >
              +
              <span className="sr-only">Aumentar meta</span>
            </Button>
          </div>
          <DrawerFooter>
            <Button disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
              Salvar meta
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default function SheetDrawerShowcasePage() {
  const [sheetSide, setSheetSide] = useState<SheetSide>("right");
  const [drawerDirection, setDrawerDirection] = useState<DrawerDirection>("bottom");
  const [loading, setLoading] = useState("false");
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Sheet / Drawer</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Painéis temporários para edição, navegação contextual, filtros e
            fluxos mobile. Sheet usa Radix Dialog; Drawer usa Vaul com gesto e
            comportamento de painel inferior.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Exemplos</CardTitle>
            <CardDescription>
              Use Sheet para painéis laterais e Drawer para bottom sheets ou fluxos móveis.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Sheet</CardTitle>
                <CardDescription>Formulário lateral com footer fixo.</CardDescription>
              </CardHeader>
              <CardContent>
                <SheetExample />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Drawer</CardTitle>
                <CardDescription>Meta interativa em painel inferior.</CardDescription>
              </CardHeader>
              <CardContent>
                <DrawerExample />
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
              Ajuste lado do Sheet, direção do Drawer e estado visual.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Sheet side</span>
              <div className="flex flex-wrap gap-2">
                {sheetSides.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setSheetSide(item)}
                    size="sm"
                    variant={sheetSide === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Drawer direction</span>
              <div className="flex flex-wrap gap-2">
                {drawerDirections.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setDrawerDirection(item)}
                    size="sm"
                    variant={drawerDirection === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Estado</span>
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

            <div className="flex flex-wrap gap-3 rounded-lg border bg-card p-6">
              <SheetExample loading={loading === "true"} side={sheetSide} />
              <DrawerExample direction={drawerDirection} loading={loading === "true"} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controlled Sheet</CardTitle>
            <CardDescription>
              Estado externo para abrir painéis depois de validações ou eventos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Sheet open={controlledOpen} onOpenChange={setControlledOpen}>
              <SheetTrigger asChild>
                <Button>
                  <MenuIcon data-icon="inline-start" />
                  Abrir controlado
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navegação rápida</SheetTitle>
                  <SheetDescription>Atalhos para páginas do design system.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4 text-sm">
                  <a className="rounded-md px-2 py-2 hover:bg-muted" href="/styleguide/components/dialog">Dialog</a>
                  <a className="rounded-md px-2 py-2 hover:bg-muted" href="/styleguide/components/dropdown-menu">Dropdown Menu</a>
                  <a className="rounded-md px-2 py-2 hover:bg-muted" href="/styleguide/components/navigation-menu">Navigation Menu</a>
                </div>
                <SheetFooter>
                  <Button onClick={() => setControlledOpen(false)}>Fechar</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
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
              Popover, overlay, borders, footer e textos usam tokens globais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <div className="flex flex-wrap gap-3">
              <SheetExample side="left" />
              <DrawerExample />
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
              Sempre inclua Title e Description; use `sr-only` se precisar ocultar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={sheetUsage} />
            <CodeBlock code={drawerUsage} />
            <CodeBlock code={controlledUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              Sheet vem de Radix Dialog; Drawer vem de Vaul.
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
            Sheet e Drawer prendem foco e precisam de título acessível.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Overlay</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            `SheetTitle` e `DrawerTitle` são obrigatórios para tecnologias assistivas.
          </p>
          <p>
            Use Sheet para tarefas laterais persistentes; use Drawer para ações móveis ou bottom sheets.
          </p>
          <p>
            Triggers e closes devem ser botões reais. Use `asChild` para compor com Button sem perder semântica.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
