import { faqItems } from "@/content/landing";

import { FaqAccordion } from "./faq-accordion";
import { SectionHeading } from "./section-heading";

export function FaqSection() {
  return (
    <section className="bg-card py-20 sm:py-24 lg:py-28" id="faq">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-10 px-5 sm:px-8 lg:px-12">
        <SectionHeading>Perguntas frequentes</SectionHeading>
        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
