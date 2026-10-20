"use client";

import { createContext, useContext, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { AdminButton } from "@/components/admin/admin-ui";
import { formatMoney } from "@/lib/internal/format";

const FinanceVisibilityContext = createContext({
  isVisible: false,
  toggle: () => {},
});

export function FinanceVisibility({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FinanceVisibilityContext.Provider
      value={{ isVisible, toggle: () => setIsVisible((current) => !current) }}
    >
      <div className={isVisible ? "admin-finance-values-visible" : "admin-finance-values-hidden"}>
        <div className="admin-page-header">
          <div>
            <h1>Financeiro</h1>
            <p>Acompanhe a saúde financeira da escola sem alterar registros por aqui.</p>
          </div>
          <div className="admin-page-actions">
            <FinanceVisibilityToggle />
          </div>
        </div>
        {children}
      </div>
    </FinanceVisibilityContext.Provider>
  );
}

export function useFinanceVisibility() {
  return useContext(FinanceVisibilityContext);
}

function FinanceVisibilityToggle() {
  const { isVisible, toggle } = useFinanceVisibility();
  return (
    <AdminButton
      aria-label={isVisible ? "Ocultar valores financeiros" : "Mostrar valores financeiros"}
      className="admin-finance-visibility-toggle"
      onClick={toggle}
      size="icon-sm"
      title={isVisible ? "Ocultar valores" : "Mostrar valores"}
      type="button"
      variant="ghost"
    >
      {isVisible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
    </AdminButton>
  );
}

export function SensitiveMoney({ value }: { value: number }) {
  const { isVisible } = useFinanceVisibility();
  return (
    <span aria-label={isVisible ? formatMoney(value) : "Valor oculto"} className="admin-sensitive-money">
      {isVisible ? formatMoney(value) : "R$ •••••"}
    </span>
  );
}
