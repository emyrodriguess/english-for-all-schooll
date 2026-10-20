"use client";

import { startTransition, useId, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { AdminButton } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export function FilterForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <form
      className={className}
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        const query = new URLSearchParams();
        for (const [key, value] of new FormData(event.currentTarget)) {
          if (typeof value === "string" && value) query.set(key, value);
        }
        startTransition(() => {
          router.replace(query.size ? `${pathname}?${query}` : pathname);
        });
      }}
    >
      {children}
    </form>
  );
}

export function AdminFilterBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <FilterForm className={cn("admin-filter-bar", className)}>{children}</FilterForm>;
}

export function AdminFilterAdvanced({
  children,
  defaultOpen = false,
  label = "Mais filtros",
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="admin-filter-advanced">
      <AdminButton
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="admin-filter-advanced-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
        variant="ghost"
      >
        {label}
        <ChevronDownIcon aria-hidden="true" />
      </AdminButton>
      {isOpen ? (
        <div className="admin-filter-advanced-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
