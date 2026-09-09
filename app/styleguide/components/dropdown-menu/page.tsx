"use client";

import { useState } from "react";
import {
  BellIcon,
  CheckCircle2Icon,
  Code2Icon,
  CreditCardIcon,
  GraduationCapIcon,
  Loader2Icon,
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  UserRoundIcon,
  UsersRoundIcon,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ThemeToggle } from "../../components/theme-toggle";

const aligns = ["start", "center", "end"] as const;
type MenuAlign = (typeof aligns)[number];

const basicUsage = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Configurações</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

const checkboxUsage = `<DropdownMenuCheckboxItem checked={notifications}>
  Notificações
</DropdownMenuCheckboxItem>`;

const submenuUsage = `<DropdownMenuSub>
  <DropdownMenuSubTrigger>Convidar aluno</DropdownMenuSubTrigger>
  <DropdownMenuPortal>
    <DropdownMenuSubContent>
      <DropdownMenuItem>Email</DropdownMenuItem>
      <DropdownMenuItem>WhatsApp</DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</DropdownMenuSub>`;

const props = [
  ["open", "boolean", "undefined", "Estado controlado do menu."],
  ["onOpenChange", "(open: boolean) => void", "undefined", "Callback ao abrir ou fechar."],
  ["modal", "boolean", "true", "Define se interação fora do menu fica modal."],
  ["align", '"start" | "center" | "end"', '"start"', "Alinhamento do conteúdo ao trigger."],
  ["sideOffset", "number", "4", "Distância entre trigger e conteúdo."],
  ["variant", '"default" | "destructive"', '"default"', "Disponível em DropdownMenuItem."],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function AccountMenu({
  align = "start",
  loading = false,
  disabledApi = true,
}: {
  align?: MenuAlign;
  loading?: boolean;
  disabledApi?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontalIcon data-icon="inline-start" />
          Conta
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel>Aluno</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRoundIcon data-icon="inline-start" />
            Perfil
            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon data-icon="inline-start" />
            Pagamento
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon data-icon="inline-start" />
            Preferências
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UsersRoundIcon data-icon="inline-start" />
            Turma
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GraduationCapIcon data-icon="inline-start" />
              Convidar aluno
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>WhatsApp</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Copiar link</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem disabled={disabledApi}>Integração API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          {loading ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : <LogOutIcon data-icon="inline-start" />}
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PreferencesMenu() {
  const [email, setEmail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [density, setDensity] = useState("comfortable");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <BellIcon data-icon="inline-start" />
          Preferências
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked={email} onCheckedChange={setEmail}>
            Email
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={whatsapp} onCheckedChange={setWhatsapp}>
            WhatsApp
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Densidade</DropdownMenuLabel>
        <DropdownMenuRadioGroup onValueChange={setDensity} value={density}>
          <DropdownMenuRadioItem value="compact">Compacta</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Confortável</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">Espaçosa</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DropdownMenuShowcasePage() {
  const [align, setAlign] = useState<MenuAlign>("start");
  const [loading, setLoading] = useState("false");
  const [disabledApi, setDisabledApi] = useState("true");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">shadcn/ui</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Dropdown Menu
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Menu contextual para ações, atalhos, seleção simples e submenus. A
            base shadcn usa Radix Dropdown Menu e herda tokens de popover,
            accent, destructive, border e ring.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Exemplos</CardTitle>
            <CardDescription>
              Itens devem ficar dentro de `DropdownMenuGroup` quando relacionados.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Conta</CardTitle>
                <CardDescription>Grupos, shortcuts, submenu e destructive.</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountMenu />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Checkbox items e radio group.</CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesMenu />
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
              Ajuste alinhamento, loading e item desabilitado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Alinhamento</span>
              <div className="flex flex-wrap gap-2">
                {aligns.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setAlign(item)}
                    size="sm"
                    variant={align === item ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Estado de saída</span>
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

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Integração API</span>
              <RadioGroup className="flex flex-col gap-3" onValueChange={setDisabledApi} value={disabledApi}>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="true" />
                  Desabilitada
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="false" />
                  Habilitada
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <AccountMenu align={align} disabledApi={disabledApi === "true"} loading={loading === "true"} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estados</CardTitle>
            <CardDescription>
              Hover, focus, disabled, destructive e submenu aberto são tratados pelo Radix.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <AccountMenu disabledApi />
            <Button disabled variant="outline">Trigger disabled</Button>
            <Button disabled>
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
              Processando
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
              Popover, accent, focus ring e destructive herdam o tema.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ThemeToggle />
            <div className="flex flex-wrap gap-3">
              <AccountMenu />
              <PreferencesMenu />
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
              Use `asChild` no trigger para compor com Button e mantenha itens relacionados em grupos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <CodeBlock code={basicUsage} />
            <CodeBlock code={checkboxUsage} />
            <CodeBlock code={submenuUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props principais</CardTitle>
            <CardDescription>
              A API vem do Radix Dropdown Menu primitive.
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
            Radix gerencia foco, roles, seleção, submenus e navegação por teclado.
          </CardDescription>
          <CardAction>
            <Badge variant="info">Overlay</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          <p>
            Teclado: Enter ou Espaço abre o menu, setas navegam, Enter aciona e
            Escape fecha.
          </p>
          <p>
            Use `DropdownMenuItem variant=&quot;destructive&quot;` para ações perigosas e
            `disabled` para itens indisponíveis.
          </p>
          <p>
            Menus são para ações curtas. Para formulários longos ou confirmação
            crítica, prefira Dialog ou Alert Dialog.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
