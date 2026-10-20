"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CLEAR_VALUE = "__all__";

export type DesignSystemSelectOption = {
  label: string;
  value: string;
};

export function DesignSystemSelect({
  defaultValue = "",
  emptyLabel,
  id,
  name,
  onValueChange,
  options,
  placeholder = "Selecione",
  required = false,
  value,
}: {
  defaultValue?: string;
  emptyLabel?: string;
  id: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: DesignSystemSelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const selectValue = selectedValue || undefined;

  return (
    <>
      <input name={name} type="hidden" value={selectedValue} />
      <Select
        onValueChange={(nextValue) => {
          const normalizedValue = nextValue === CLEAR_VALUE ? "" : nextValue;
          if (value === undefined) setUncontrolledValue(normalizedValue);
          onValueChange?.(normalizedValue);
        }}
        value={selectValue}
      >
        <SelectTrigger
          aria-required={required || undefined}
          className="admin-design-select-trigger"
          id={id}
        >
          <SelectValue placeholder={emptyLabel ?? placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {emptyLabel ? (
              <SelectItem value={CLEAR_VALUE}>{emptyLabel}</SelectItem>
            ) : null}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
