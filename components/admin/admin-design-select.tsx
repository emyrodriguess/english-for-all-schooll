"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_VALUE = "__admin-select-empty__";

export type AdminDesignSelectOption = {
  label: string;
  value: string;
};

export function AdminDesignSelect({
  defaultValue = "",
  disabled,
  id,
  name,
  onValueChange,
  options,
  placeholder,
  value,
}: {
  defaultValue?: string;
  disabled?: boolean;
  id: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: AdminDesignSelectOption[];
  placeholder?: string;
  value?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const toRadixValue = (optionValue: string) =>
    optionValue === "" ? EMPTY_VALUE : optionValue;

  return (
    <Select
      disabled={disabled}
      onValueChange={(nextValue) => {
        const next = nextValue === EMPTY_VALUE ? "" : nextValue;
        if (value === undefined) setUncontrolledValue(next);
        onValueChange?.(next);
      }}
      value={toRadixValue(selectedValue)}
    >
      <input name={name} type="hidden" value={selectedValue} />
      <SelectTrigger className="admin-design-select-trigger" id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="admin-design-select-content" position="popper">
        {options.map((option) => (
          <SelectItem
            key={option.value || EMPTY_VALUE}
            value={toRadixValue(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
