import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { navigation } from "@/content/landing";

import { Brand } from "./brand";
import { WhatsAppIcon } from "./whatsapp-icon";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <rect height="18" rx="5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary-900 py-10 text-primary-foreground">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-8 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Brand className="[&_span]:text-primary-foreground" />
          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {navigation.map((item) => (
              <a className="rounded-sm text-primary-foreground/80 outline-none hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-primary-300/60" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            <a className="rounded-sm text-primary-foreground/80 outline-none hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-primary-300/60" href="#faq">
              Perguntas frequentes
            </a>
          </nav>
          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <a
              className="inline-flex items-center gap-2 rounded-sm outline-none hover:text-primary-200 focus-visible:ring-3 focus-visible:ring-primary-300/60"
              data-event="instagram_click"
              href={siteConfig.instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              <InstagramIcon className="size-5" />
              Instagram
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-sm outline-none hover:text-primary-200 focus-visible:ring-3 focus-visible:ring-primary-300/60"
              href={siteConfig.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="size-5" />
              WhatsApp
            </a>
          </div>
        </div>
        <Separator className="bg-primary-700" />
        <p className="text-center text-sm text-primary-foreground/65">
          © {new Date().getFullYear()} English For All. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
