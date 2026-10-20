"use client";

import {
  type ChangeEventHandler,
  type ComponentProps,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { formatPhone } from "@/lib/internal/format";

type PhoneInputProps = Omit<
  ComponentProps<typeof Input>,
  "defaultValue" | "onChange" | "type" | "value"
> & {
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
};

export function PhoneInput({
  defaultValue = "",
  onChange,
  placeholder = "(11) 99999-9999",
  value,
  ...props
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatPhone(value ?? defaultValue),
  );

  const currentValue = value === undefined ? displayValue : formatPhone(value);

  return (
    <Input
      {...props}
      inputMode="tel"
      onChange={(event) => {
        const formatted = formatPhone(event.currentTarget.value);
        event.currentTarget.value = formatted;
        setDisplayValue(formatted);
        onChange?.(event);
      }}
      placeholder={placeholder}
      type="tel"
      value={currentValue}
    />
  );
}
