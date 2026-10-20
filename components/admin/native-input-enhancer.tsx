"use client";

import { useEffect } from "react";

const pickerTypes = new Set(["date", "time", "month"]);

export function NativeInputEnhancer() {
  useEffect(() => {
    const openPicker = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.disabled || target.readOnly || !pickerTypes.has(target.type)) return;

      try {
        target.showPicker?.();
      } catch {
        // Browsers without showPicker keep their native click behavior.
      }
    };

    document.addEventListener("click", openPicker, true);
    return () => document.removeEventListener("click", openPicker, true);
  }, []);

  return null;
}
