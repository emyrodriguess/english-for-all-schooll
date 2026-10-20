"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFinanceVisibility } from "@/components/admin/finance-visibility";
import { formatMoney } from "@/lib/internal/format";

const config = {
  received: { label: "Recebido", color: "var(--chart-1)" },
  forecast: { label: "Previsto", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RevenueChart({
  data,
}: {
  data: Array<{ month: string; forecast: number; received: number }>;
}) {
  const { isVisible } = useFinanceVisibility();
  return (
    <div className="admin-revenue-chart-wrap">
      <ChartContainer
      className="admin-revenue-chart"
      config={config}
      initialDimension={{ width: 720, height: 290 }}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 8, right: 12, top: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickFormatter={(value) =>
            isVisible
              ? value === 0
                ? "R$ 0"
                : `R$ ${Math.round(value / 1000)} mil`
              : "•••"
          }
          tickLine={false}
          width={58}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <>
                  <span className="text-muted-foreground">
                    {config[String(name) as keyof typeof config]?.label}
                  </span>
                  <span className="ml-auto font-semibold">
                    {isVisible ? formatMoney(Number(value)) : "R$ •••••"}
                  </span>
                </>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
        <Line
          dataKey="received"
          dot={{ r: 3 }}
          stroke="var(--color-received)"
          strokeWidth={2.3}
          type="monotone"
        />
        <Line
          dataKey="forecast"
          dot={{ r: 3 }}
          stroke="var(--color-forecast)"
          strokeWidth={2.3}
          type="monotone"
        />
      </LineChart>
      </ChartContainer>
      {!isVisible ? (
        <div aria-hidden="true" className="admin-chart-privacy-cover">
          Valores ocultos
        </div>
      ) : null}
    </div>
  );
}
