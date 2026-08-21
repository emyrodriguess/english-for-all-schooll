"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { TestimonialItem } from "@/content/landing";
import { cn } from "@/lib/utils";

export function TestimonialCarousel({ items }: { items: readonly TestimonialItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function getStep() {
    return window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
  }

  function goTo(index: number) {
    const rail = railRef.current;
    if (!rail) return;

    const boundedIndex = Math.max(0, Math.min(items.length - 1, index));
    const target = rail.children.item(boundedIndex) as HTMLElement | null;
    if (!target) return;

    rail.scrollTo({ left: target.offsetLeft - rail.offsetLeft, behavior: "smooth" });
    setActiveIndex(boundedIndex);
  }

  function handleScroll() {
    const rail = railRef.current;
    if (!rail) return;

    const children = Array.from(rail.children) as HTMLElement[];
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - rail.offsetLeft - rail.scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="relative px-0 sm:px-14">
        <div
          aria-label="Depoimentos de alunos"
          className="testimonial-rail flex snap-x snap-mandatory gap-5 overflow-x-auto"
          onScroll={handleScroll}
          ref={railRef}
        >
          {items.map((item, index) => (
            <article
              aria-label={`Depoimento ${index + 1} de ${items.length}`}
              className="flex min-h-[16rem] min-w-full snap-start items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#161C1F] p-2 shadow-none sm:min-h-0 sm:p-3 md:min-w-[calc(50%-0.625rem)]"
              key={item.image}
            >
              <Image
                alt={item.alt}
                className="h-auto max-h-[25rem] w-full rounded-lg object-contain"
                height={item.height}
                loading="lazy"
                sizes="(max-width: 767px) 100vw, 50vw"
                src={item.image}
                width={item.width}
              />
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between sm:left-0 sm:right-0">
          <Button
            aria-label="Depoimentos anteriores"
            className="pointer-events-auto border-white/25 bg-transparent text-white shadow-none hover:bg-white/10"
            onClick={() => goTo(activeIndex - getStep())}
            size="icon-lg"
            variant="outline"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            aria-label="Próximos depoimentos"
            className="pointer-events-auto border-white/25 bg-transparent text-white shadow-none hover:bg-white/10"
            onClick={() => goTo(activeIndex + getStep())}
            size="icon-lg"
            variant="outline"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div aria-label="Selecionar depoimento" className="flex flex-wrap justify-center md:hidden" role="group">
          {items.map((item, index) => (
            <button
              aria-label={`Ir para depoimento ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={cn(
                "relative size-11 rounded-full outline-none transition-colors before:absolute before:left-1/2 before:top-1/2 before:size-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary-300/60 before:transition-all hover:before:bg-primary-200 focus-visible:ring-3 focus-visible:ring-primary-300/60",
                activeIndex === index && "before:w-7 before:bg-secondary",
              )}
              key={item.image}
              onClick={() => goTo(index)}
              type="button"
            />
          ))}
        </div>

        <div aria-label="Selecionar grupo de depoimentos" className="hidden md:flex" role="group">
          {[0, 2, 4].map((index) => (
            <button
              aria-label={`Ir para o grupo de depoimentos ${index / 2 + 1}`}
              aria-pressed={Math.floor(activeIndex / 2) === index / 2}
              className={cn(
                "relative size-11 rounded-full outline-none transition-colors before:absolute before:left-1/2 before:top-1/2 before:size-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary-300/60 before:transition-all hover:before:bg-primary-200 focus-visible:ring-3 focus-visible:ring-primary-300/60",
                Math.floor(activeIndex / 2) === index / 2
                  ? "before:w-7 before:bg-secondary"
                  : undefined,
              )}
              key={index}
              onClick={() => goTo(index)}
              type="button"
            />
          ))}
        </div>

      </div>
    </div>
  );
}
