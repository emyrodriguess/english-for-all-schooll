"use client";

import {
  type ChangeEventHandler,
  type ComponentProps,
  useState,
} from "react";

import { Input } from "@/components/ui/input";

function formatCurrencyInput(value: string | number | undefined) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  if (typeof value === "number") return formatter.format(value);
  if (value?.startsWith("R$")) return value;
  if (value?.includes(",") || value?.includes(".")) {
    const parsed = Number(value.replace(/\./g, "").replace(",", "."));
    if (Number.isFinite(parsed)) return formatter.format(parsed);
  }
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  const cents = Number.parseInt(digits, 10);
  return formatter.format(cents / 100);
}

type CurrencyInputProps = Omit<
  ComponentProps<typeof Input>,
  "defaultValue" | "onChange" | "type" | "value"
> & {
  defaultValue?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
};

export function CurrencyInput({
  defaultValue,
  onChange,
  value,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatCurrencyInput(value ?? defaultValue),
  );
  const currentValue =
    value === undefined ? displayValue : formatCurrencyInput(value);

  return (
    <Input
      {...props}
      inputMode="numeric"
      onChange={(event) => {
        const formatted = formatCurrencyInput(event.currentTarget.value);
        event.currentTarget.value = formatted;
        setDisplayValue(formatted);
        onChange?.(event);
      }}
      placeholder="R$ 0,00"
      type="text"
      value={currentValue}
    />
  );
}
