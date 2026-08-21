import { differentials } from "@/content/landing";

import { SectionHeading } from "./section-heading";

export function DifferentialsSection() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden bg-primary py-20 text-primary-foreground sm:py-24 lg:py-28" id="diferenciais">
      <div aria-hidden="true" className="stage-dots" />
      <div className="relative mx-auto grid w-full max-w-[1536px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12">
        <SectionHeading inverted>Por que escolher a English For All?</SectionHeading>
        <ol className="relative flex flex-col border-l border-primary-300/45 pl-7 sm:pl-10">
          {differentials.map((item, index) => (
            <li className="relative flex min-h-16 items-center border-b border-primary-300/30 py-4 last:border-b-0" key={item}>
              <span aria-hidden="true" className="absolute -left-[2.05rem] size-2.5 rounded-full bg-card sm:-left-[2.82rem]" />
              <span className="mr-5 min-w-12 text-3xl font-bold tabular-nums text-brand-red-300 sm:text-4xl">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold leading-6 sm:text-xl">{item}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
