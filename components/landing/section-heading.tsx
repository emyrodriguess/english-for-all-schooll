import { cn } from "@/lib/utils";

export function SectionHeading({
  children,
  className,
  inverted = false,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  inverted?: boolean;
}>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-secondary" />
      <h2
        className={cn(
          "max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl",
          inverted ? "text-primary-foreground" : "text-primary",
        )}
      >
        {children}
      </h2>
    </div>
  );
}
