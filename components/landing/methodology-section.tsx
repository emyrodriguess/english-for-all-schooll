import {
  BookOpenIcon,
  EarIcon,
  MessageCircleIcon,
  PenLineIcon,
  TargetIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { languageSkills, methodologyPillars } from "@/content/landing";

import { SectionHeading } from "./section-heading";

const skillIcons = [MessageCircleIcon, EarIcon, BookOpenIcon, PenLineIcon] as const;

export function MethodologySection() {
  return (
    <section className="relative scroll-mt-20 overflow-hidden bg-primary py-20 text-primary-foreground sm:py-24 lg:py-28" id="metodologia">
      <div aria-hidden="true" className="stage-orb stage-orb-left" />
      <div aria-hidden="true" className="stage-orb stage-orb-right" />
      <div className="relative mx-auto grid w-full max-w-[1536px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.2fr_0.75fr] lg:items-center lg:px-12">
        <div className="flex flex-col gap-7">
          <SectionHeading inverted>Como funcionam as aulas</SectionHeading>
          <p className="max-w-sm text-lg font-semibold leading-8 text-primary-foreground/90">
            Na English For All, aprender inglês significa usar o idioma desde o começo.
          </p>
        </div>

        <Card className="overflow-hidden border-primary-600 bg-primary-700/70 py-0 text-primary-foreground shadow-lg ring-1 ring-primary-300/25">
          <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-72 overflow-hidden bg-primary-900/30 sm:min-h-[25rem]">
              <Image
                alt="Recorte de uma aula online ao vivo da English For All."
                className="object-cover object-[55%_50%]"
                fill
                sizes="(max-width: 639px) 100vw, 34vw"
                src="/images/methodology-banner.webp"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-7">
              <CardHeader className="px-0">
                <CardTitle className="sr-only">Pilares da metodologia</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 px-0">
                {methodologyPillars.map((pillar, index) => (
                  <div className="flex flex-col" key={pillar}>
                    <div className="flex items-center gap-4 py-5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </span>
                      <span className="text-base font-semibold sm:text-lg">{pillar}</span>
                    </div>
                    {index < methodologyPillars.length - 1 ? (
                      <Separator className="bg-primary-300/30" />
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-7">
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-1" aria-label="Habilidades desenvolvidas">
            {languageSkills.map((skill, index) => {
              const Icon = skillIcons[index];
              return (
                <li className="flex items-center gap-3 text-sm font-semibold sm:text-base" key={skill}>
                  <Icon className="size-6 shrink-0" strokeWidth={1.8} />
                  {skill}
                </li>
              );
            })}
          </ul>
          <Separator className="bg-primary-300/35" />
          <div className="flex flex-col gap-5 text-base font-semibold">
            <p className="flex items-center gap-3">
              <UserRoundCheckIcon className="size-7 shrink-0" />
              Acompanhamento próximo
            </p>
            <p className="flex items-center gap-3">
              <TargetIcon className="size-7 shrink-0" />
              Respeito ao ritmo e aos objetivos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
