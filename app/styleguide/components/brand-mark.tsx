import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 place-items-center rounded-full border-[5px] border-white/30 border-t-brand-red-500 border-b-white bg-white text-sm font-bold leading-none text-primary-800 shadow-sm",
        className,
      )}
    >
      E
    </span>
  );
}
