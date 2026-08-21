import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import { WhatsAppIcon } from "./whatsapp-icon";

export function FinalCtaSection() {
  return (
    <section className="bg-primary py-16 text-center text-primary-foreground sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vamos conversar?</h2>
        <p className="max-w-2xl text-base leading-7 text-primary-foreground/80 sm:text-lg">
          Converse com a equipe da English For All para entender melhor as aulas e tirar suas dúvidas.
        </p>
        <Button asChild size="xl" variant="cta">
          <a
            data-event="whatsapp_click_final_cta"
            href={siteConfig.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <WhatsAppIcon data-icon="inline-start" />
            Conversar no WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}
