"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { BrandMark } from "./components/brand-mark";
import { navigation } from "./navigation";

export function StyleguideShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar px-6 py-7 text-sidebar-foreground lg:flex">
        <Link
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50"
          href="/styleguide"
        >
          <BrandMark />
          <span className="leading-tight">
            <span className="block text-base font-semibold">English For All</span>
            <span className="block text-xs text-sidebar-foreground/70">
              Design System
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação do styleguide" className="mt-10 flex flex-col gap-7">
          {navigation.map((section) =>
            section.items.length > 0 ? (
              <div className="flex flex-col gap-2" key={section.title}>
                <h2 className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/55">
                  {section.title}
                </h2>
                <ul className="flex flex-col gap-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "block rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
                            isActive
                              ? "border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
                              : "border-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                          href={item.href}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null,
          )}
        </nav>

        <div className="mt-auto border-t border-sidebar-border pt-5 text-xs leading-5 text-sidebar-foreground/60">
          <p>Foundation · v1.0</p>
          <p>Pronto para páginas e componentes.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link className="flex items-center gap-2" href="/styleguide">
            <BrandMark className="size-8 border-4 text-xs" />
            <span className="text-sm font-semibold">English For All</span>
          </Link>
          <nav aria-label="Navegação móvel do styleguide">
            {navigation.flatMap((section) => section.items).map((item) => (
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className="rounded-md bg-sidebar-accent px-3 py-2 text-xs font-medium"
                href={item.href}
                key={item.href}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="min-h-screen lg:ml-72">{children}</main>
    </div>
  );
}
