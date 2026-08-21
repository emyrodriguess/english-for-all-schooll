import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { navigation } from "@/content/landing";

import { Brand } from "./brand";
import { MobileNavigation } from "./mobile-navigation";
import { WhatsAppIcon } from "./whatsapp-icon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex h-20 w-full max-w-[1536px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Brand />
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              className="rounded-md text-sm font-semibold text-primary outline-none transition-colors hover:text-secondary focus-visible:ring-3 focus-visible:ring-ring/50"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button asChild size="xl" variant="cta">
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
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
