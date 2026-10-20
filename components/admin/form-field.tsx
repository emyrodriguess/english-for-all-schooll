import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("admin-field", className)}
      data-invalid={Boolean(error) || undefined}
    >
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="admin-field-error">{error}</p> : null}
      {!error && hint ? <p className="admin-field-hint">{hint}</p> : null}
    </div>
  );
}
