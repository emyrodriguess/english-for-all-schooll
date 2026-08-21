import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      aria-label="English For All — início"
      className={cn(
        "inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      href="#inicio"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="size-12 rounded-full object-contain sm:size-14"
        height={56}
        src="/brand/english-for-all-logo.webp"
        width={56}
      />
      <span className="text-lg font-bold tracking-tight text-primary sm:text-xl">
        English For All
      </span>
    </Link>
  );
}
