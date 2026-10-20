"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  ChartNoAxesCombinedIcon,
  ChevronRightIcon,
  ClipboardPenLineIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  UsersIcon,
  UserRoundIcon,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/admin/brand-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { initials } from "@/lib/internal/format";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/alunos", label: "Alunos", icon: UsersIcon },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDaysIcon },
  { href: "/admin/turmas", label: "Turmas", icon: UserRoundIcon },
  {
    href: "/admin/financeiro",
    label: "Financeiro",
    icon: ChartNoAxesCombinedIcon,
  },
  { href: "/admin/planner", label: "Planner", icon: ClipboardPenLineIcon },
] as const;

function AdminNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav aria-label="Navegação principal" className="admin-nav">
      {navigation.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "admin-nav-link",
              active && "is-active",
              mobile && "is-mobile",
            )}
            href={item.href}
            key={item.href}
            onFocus={() => router.prefetch(item.href)}
            onMouseEnter={() => router.prefetch(item.href)}
            prefetch
          >
            <item.icon aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link className="admin-brand" href="/admin/dashboard">
      <BrandLogo />
    </Link>
  );
}

export function AdminShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: { name: string; email: string };
}) {
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <Brand />
        <AdminNavigation />
        <div className="admin-sidebar-profile">
          <Avatar>
            <AvatarFallback>{initials(profile.name)}</AvatarFallback>
          </Avatar>
          <span>
            <strong>{profile.name}</strong>
            <small>Administradora</small>
          </span>
          <ChevronRightIcon aria-hidden="true" />
        </div>
      </aside>
      <div className="admin-frame">
        <header className="admin-topbar">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Abrir menu"
                className="admin-mobile-menu"
                size="icon"
                variant="ghost"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="admin-mobile-sheet" side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu principal</SheetTitle>
                <SheetDescription className="sr-only">
                  Navegação do sistema interno
                </SheetDescription>
              </SheetHeader>
              <Brand />
              <AdminNavigation mobile />
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="admin-account-trigger" variant="ghost">
                <Avatar>
                  <AvatarFallback>{initials(profile.name)}</AvatarFallback>
                </Avatar>
                <span>{profile.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="admin-account-menu">
              <DropdownMenuLabel>
                <span className="admin-account-label">
                  {profile.name}
                  <small>{profile.email}</small>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <form action={logoutAction}>
                    <button type="submit">
                      <LogOutIcon />
                      Sair
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
