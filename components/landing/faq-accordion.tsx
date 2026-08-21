import type { FaqItem } from "@/content/landing";

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <details
          className="group rounded-xl border border-border bg-card px-5 shadow-xs open:border-primary-200"
          data-slot="faq-item"
          key={item.question}
          open={index === 0}
        >
          <summary
            className="flex min-h-14 cursor-pointer list-none items-start gap-4 py-4 text-base font-semibold text-primary outline-none marker:hidden focus-visible:rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 group-open:[&_[data-slot=faq-icon]]:after:content-['−'] sm:text-lg [&::-webkit-details-marker]:hidden"
            data-event="faq_open"
          >
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground after:content-['+']"
              data-slot="faq-icon"
            />
            <span>{item.question}</span>
          </summary>
          <div className="pb-5 pl-11 pr-7 text-base leading-7 text-muted-foreground">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
