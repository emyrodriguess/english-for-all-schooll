"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_RESULTS = 20;

export type EntitySelectOption = {
  label: string;
  value: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function SearchableEntitySelect({
  className,
  defaultValue = "",
  emptyLabel,
  id,
  name,
  onValueChange,
  options,
  placeholder = "Digite para pesquisar",
  required = false,
  value,
}: {
  className?: string;
  defaultValue?: string;
  emptyLabel?: string;
  id: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: EntitySelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const deferredSearch = useDeferredValue(search);
  const selectedValue = value ?? uncontrolledValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const results = useMemo(() => {
    const query = normalize(deferredSearch);
    const matches = query
      ? options.filter((option) => normalize(option.label).includes(query))
      : options;
    return matches.slice(0, MAX_VISIBLE_RESULTS);
  }, [deferredSearch, options]);

  const visibleOptions = useMemo(
    () => [
      ...(!deferredSearch && emptyLabel
        ? [{ label: emptyLabel, value: "" }]
        : []),
      ...results,
    ],
    [deferredSearch, emptyLabel, results],
  );
  const setOpenWithSelection = () => {
    const selectedIndex = visibleOptions.findIndex(
      (option) => option.value === selectedValue,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  useEffect(() => {
    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    if (!isOpen) return;
    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [isOpen]);

  const selectValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    setSearch("");
    setIsOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const safeActiveIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(visibleOptions.length - 1, 0),
  );
  const safeActiveOption = visibleOptions[safeActiveIndex];
  const optionId = (index: number) => `${id}-option-${index}`;

  return (
    <div className={cn("admin-search-select", className)} ref={rootRef}>
      <input name={name} type="hidden" value={selectedValue} />
      <div className="admin-search-select-input">
        <SearchIcon aria-hidden="true" />
        <Input
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && safeActiveOption ? optionId(safeActiveIndex) : undefined
          }
          aria-controls={`${id}-results`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-required={required || undefined}
          autoComplete="off"
          id={id}
          ref={inputRef}
          onChange={(event) => {
            setSearch(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearch("");
            setOpenWithSelection();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (!isOpen) {
                setOpenWithSelection();
                return;
              }
              const direction = event.key === "ArrowDown" ? 1 : -1;
              setActiveIndex((index) => {
                const start = index < 0 ? 0 : index;
                return Math.min(
                  Math.max(start + direction, 0),
                  Math.max(visibleOptions.length - 1, 0),
                );
              });
            }
            if (event.key === "Home" && isOpen) {
              event.preventDefault();
              setActiveIndex(0);
            }
            if (event.key === "End" && isOpen) {
              event.preventDefault();
              setActiveIndex(Math.max(visibleOptions.length - 1, 0));
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setSearch("");
              setIsOpen(false);
            }
            if (event.key === "Enter" && safeActiveOption) {
              event.preventDefault();
              selectValue(safeActiveOption.value);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          value={isOpen ? search : (selectedOption?.label ?? "")}
        />
        <ChevronDownIcon aria-hidden="true" />
      </div>
      {isOpen ? (
        <>
          <span aria-live="polite" className="sr-only">
            {visibleOptions.length
              ? `${visibleOptions.length} opção(ões) disponível(is).`
              : "Nenhuma opção encontrada."}
          </span>
          <div
            aria-label={placeholder}
            className="admin-search-select-results"
            id={`${id}-results`}
            role="listbox"
          >
          {visibleOptions.map((option, index) => (
            <button
              aria-selected={index === safeActiveIndex}
              className="admin-search-select-option"
              data-active={index === safeActiveIndex || undefined}
              id={optionId(index)}
              key={option.value || "empty"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectValue(option.value)}
              role="option"
              type="button"
            >
              <span>{option.label}</span>
              {option.value === selectedValue ? (
                <CheckIcon aria-hidden="true" />
              ) : null}
            </button>
          ))}
          {!results.length ? (
            <p className="admin-search-select-empty">Nenhum resultado encontrado.</p>
          ) : null}
          {results.length === MAX_VISIBLE_RESULTS ? (
            <p className="admin-search-select-hint">
              Refine a busca para encontrar outro resultado.
            </p>
          ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
