"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SalesPoint } from "@/types/dashboard";

type SalesChartProps = {
  data: SalesPoint[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(value);

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return <EmptyChart message="No sales trend data available." />;
  }

  return (
    <ResponsiveContainer height={320} width="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
        <XAxis dataKey="year" stroke="#64748b" tickLine={false} />
        <YAxis
          stroke="#64748b"
          tickFormatter={formatCurrency}
          tickLine={false}
          width={72}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => `Year ${label}`}
        />
        <Line
          dataKey="total_sales"
          dot={{ r: 4 }}
          name="Sales"
          stroke="#2563eb"
          strokeWidth={3}
          type="monotone"
        />
        <Line
          dataKey="total_profit"
          dot={{ r: 4 }}
          name="Profit"
          stroke="#16a34a"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500">
      {message}
    </div>
  );
}
