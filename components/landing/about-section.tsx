import { HeartHandshakeIcon, TargetIcon, UsersRoundIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { SectionHeading } from "./section-heading";

const principles = [
  { icon: TargetIcon, label: "Metodologia adequada" },
  { icon: UsersRoundIcon, label: "Acompanhamento de qualidade" },
  { icon: HeartHandshakeIcon, label: "Ambiente acolhedor" },
] as const;

export function AboutSection() {
  return (
    <section className="scroll-mt-24 bg-card py-20 sm:py-24 lg:py-28" id="sobre">
      <div className="mx-auto grid w-full max-w-[1536px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr_0.85fr] lg:gap-12 lg:px-12">
        <div className="flex flex-col gap-7">
          <SectionHeading>Conheça a English For All</SectionHeading>
          <div className="flex max-w-xl flex-col gap-5 text-base leading-7 text-muted-foreground">
            <p>
              A English For All nasceu com um propósito simples e poderoso: provar que aprender inglês pode ser uma experiência leve, prática e transformadora.
            </p>
            <p>
              A escola foi criada para atender pessoas que desejam desenvolver o inglês de forma eficiente, com foco na comunicação e na aplicação do idioma na vida real.
            </p>
          </div>
        </div>

        <ul className="flex flex-col" aria-label="Princípios da English For All">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <li className="flex flex-col" key={principle.label}>
                <div className="flex min-h-24 items-center gap-5 py-5">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Icon className="size-7" strokeWidth={1.8} />
                  </span>
                  <span className="text-lg font-semibold text-primary">{principle.label}</span>
                </div>
                {index < principles.length - 1 ? <Separator /> : null}
              </li>
            );
          })}
        </ul>

        <div className="relative flex min-h-64 items-center overflow-hidden rounded-2xl bg-primary-50 p-8 sm:p-10 lg:min-h-full">
          <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full border-[28px] border-secondary/10" />
          <p className="relative text-2xl font-bold leading-snug tracking-tight text-primary sm:text-3xl">
            Inglês como ferramenta para carreira, viagens, estudos e realização de sonhos.
          </p>
        </div>
      </div>
    </section>
  );
}
