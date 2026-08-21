import Image from "next/image";

import { SectionHeading } from "./section-heading";

export function FounderSection() {
  return (
    <section className="scroll-mt-24 bg-card py-20 sm:py-24 lg:py-28" id="fundadora">
      <div className="mx-auto grid w-full max-w-[1536px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div className="flex flex-col gap-6">
          <SectionHeading>Conheça quem está por trás da English For All</SectionHeading>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-primary sm:text-2xl">Emily Rodrigues Ferreira</h3>
            <p className="text-lg font-semibold text-secondary">Fundadora e Diretora Pedagógica</p>
            <p className="font-medium text-primary">Ensina inglês há 5 anos</p>
          </div>
          <div className="flex max-w-2xl flex-col gap-4 text-base leading-7 text-muted-foreground">
            <p>
              A trajetória de Emily com o inglês começou através da paixão pelo aprendizado e da curiosidade por conhecer novas culturas e possibilidades.
            </p>
            <p>
              Com o tempo, o idioma deixou de ser apenas um conhecimento e passou a ser percebido como uma ferramenta capaz de transformar vidas.
            </p>
            <p>
              Essa experiência despertou o propósito de ensinar e, posteriormente, de construir uma escola com uma forma mais humana, prática e eficiente de aprender inglês.
            </p>
          </div>
        </div>
        <div className="relative min-h-[28rem] overflow-hidden rounded-2xl shadow-lg sm:min-h-[38rem] lg:min-h-[42rem]">
          <Image
            alt="Emily Rodrigues Ferreira, fundadora e Diretora Pedagógica da English For All."
            className="object-cover object-center"
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            src="/images/founder/emily-rodrigues-ferreira.webp"
          />
        </div>
      </div>
    </section>
  );
}
