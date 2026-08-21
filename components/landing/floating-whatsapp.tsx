import { siteConfig } from "@/config/site";

import { WhatsAppIcon } from "./whatsapp-icon";

export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Conversar com a English For All no WhatsApp"
      className="floating-whatsapp fixed right-4 z-30 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-secondary/30 sm:right-6 sm:size-16"
      data-event="whatsapp_click_floating"
      href={siteConfig.whatsappUrl}
      rel="noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="size-7 sm:size-8" />
    </a>
  );
}
