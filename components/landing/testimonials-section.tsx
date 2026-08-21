import { testimonials } from "@/content/landing";

import { SectionHeading } from "./section-heading";
import { TestimonialCarousel } from "./testimonial-carousel";

const orderedTestimonials = [
  testimonials[3],
  testimonials[4],
  testimonials[0],
  testimonials[1],
  testimonials[2],
  testimonials[5],
] as const;

export function TestimonialsSection() {
  return (
    <section className="scroll-mt-24 bg-[#161C1F] py-14 text-white sm:py-24 lg:py-28" id="depoimentos">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-10 px-5 sm:px-8 lg:px-12">
        <SectionHeading inverted>O que nossos alunos dizem</SectionHeading>
        <TestimonialCarousel items={orderedTestimonials} />
      </div>
    </section>
  );
}
