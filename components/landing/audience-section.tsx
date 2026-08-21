import Image from "next/image";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { audience } from "@/content/landing";

import { SectionHeading } from "./section-heading";

export function AudienceSection() {
  return (
    <section className="scroll-mt-24 bg-card py-20 sm:py-24 lg:py-28" id="publicos">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-12 px-5 sm:px-8 lg:px-12">
        <div className="flex max-w-3xl flex-col gap-5">
          <SectionHeading>Inglês para diferentes fases da vida</SectionHeading>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A English For All atende crianças, adolescentes, jovens e adultos com a mesma importância, respeitando objetivos e momentos diferentes.
          </p>
        </div>

        <div className="audience-rail grid min-w-0 grid-cols-1 gap-5 pb-0 sm:auto-cols-[68%] sm:grid-flow-col sm:grid-cols-none sm:gap-4 sm:overflow-x-auto sm:pb-4 lg:grid-flow-row lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
          {audience.map((item) => (
            <Card className="min-w-0 snap-start overflow-hidden border-border bg-card py-0 shadow-md" key={item.title}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  alt={item.alt}
                  className="object-cover transition-transform duration-500 motion-safe:hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 639px) 86vw, (max-width: 1023px) 68vw, 25vw"
                  src={item.image}
                />
              </div>
              <CardHeader className="p-6 sm:p-7">
                <CardTitle className="text-xl font-bold text-primary sm:text-2xl">{item.title}</CardTitle>
                <CardDescription className="text-base leading-7 text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
