import { LaptopIcon, UsersRoundIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

import { WhatsAppIcon } from "./whatsapp-icon";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-card" id="inicio">
      <div aria-hidden="true" className="hero-backdrop" />
      <div className="mx-auto grid w-full max-w-[1536px] items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:items-start lg:gap-14 lg:px-12 lg:py-16 xl:gap-20 xl:pt-[4.5rem]">
        <div className="relative z-10 flex flex-col gap-7">
          <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-secondary lg:hidden" />
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Aprenda inglês de forma prática, personalizada e 100% online.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Para crianças, adolescentes, jovens e adultos que querem desenvolver o inglês e utilizá-lo com mais confiança no dia a dia, nos estudos, em viagens e no mercado de trabalho.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" variant="cta">
              <a
                data-event="whatsapp_click_hero"
                href={siteConfig.whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                <WhatsAppIcon data-icon="inline-start" />
                Conversar no WhatsApp
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="#metodologia">Conheça nossa metodologia</a>
            </Button>
          </div>
          <div className="hidden flex-col gap-4 pt-2 text-sm font-semibold text-primary sm:flex sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                <LaptopIcon className="size-5" />
              </span>
              <span>Aulas 100% online</span>
            </div>
            <Separator className="hidden h-8 sm:block" orientation="vertical" />
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                <UsersRoundIcon className="size-5" />
              </span>
              <span className="max-w-44">Ensino próximo e personalizado</span>
            </div>
          </div>
        </div>

        <div className="relative z-0 flex w-full items-center justify-center lg:justify-end">
          <div aria-hidden="true" className="hero-media-glow" />
          <div className="relative aspect-square w-full max-w-[38rem] rounded-2xl border border-brand-red-300 bg-white p-2 shadow-[0_24px_64px_rgba(16,42,67,0.16)]">
            <div className="relative size-full overflow-hidden rounded-[0.625rem]">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm sm:left-5 sm:top-5">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-5"
                  height={20}
                  src="/icons/google-meet.svg"
                  width={20}
                />
                <span className="text-sm font-semibold text-primary">Google Meet</span>
                <span aria-label="Online" className="size-2 rounded-full bg-green-600" role="img" />
              </div>
              <Image
                alt="Aula de inglês online ao vivo exibida em notebook, celular e tablet."
                className="object-cover object-center"
                fill
                preload
                sizes="(max-width: 1023px) calc(100vw - 2.5rem), min(50vw, 38rem)"
                src="/images/hero/live-class-devices-v2.webp"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
