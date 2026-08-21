"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { navigation } from "@/content/landing";

import { Brand } from "./brand";
import { WhatsAppIcon } from "./whatsapp-icon";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button aria-label="Abrir menu" size="icon-lg" variant="ghost">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(88vw,23rem)] bg-card" side="right">
        <SheetHeader className="border-b border-border px-5 py-5">
          <Brand className="pr-10" />
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">
            Navegue pelas seções da landing page.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Navegação móvel" className="flex flex-col gap-2 px-5 py-4">
          {navigation.map((item) => (
            <a
              className="rounded-lg px-3 py-3 text-base font-semibold text-primary outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-5">
          <Button asChild className="w-full" size="xl" variant="cta">
            <a
              data-event="whatsapp_click_header"
              href={siteConfig.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsAppIcon data-icon="inline-start" />
              Conversar no WhatsApp
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
