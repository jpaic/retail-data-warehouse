"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RegionPerformance } from "@/types/dashboard";

type RegionChartProps = {
  data: RegionPerformance[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(value);

export function RegionChart({ data }: RegionChartProps) {
  if (data.length === 0) {
    return <EmptyChart message="No regional data available." />;
  }

  return (
    <ResponsiveContainer height={300} width="100%">
      <BarChart data={data} margin={{ top: 10, right: 18, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="region" stroke="#64748b" tickLine={false} />
        <YAxis
          stroke="#64748b"
          tickFormatter={formatCurrency}
          tickLine={false}
          width={70}
        />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Bar dataKey="total_sales" fill="#0f766e" name="Sales" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500">
      {message}
    </div>
  );
}
