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
import type { CategoryPerformance } from "@/types/dashboard";

type CategoryChartProps = {
  data: CategoryPerformance[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(value);

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return <EmptyChart message="No category data available." />;
  }

  return (
    <ResponsiveContainer height={300} width="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 18, bottom: 0, left: 14 }}
      >
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
        <XAxis
          stroke="#64748b"
          tickFormatter={formatCurrency}
          tickLine={false}
          type="number"
        />
        <YAxis
          dataKey="category"
          stroke="#64748b"
          tickLine={false}
          type="category"
          width={110}
        />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Bar dataKey="total_sales" fill="#7c3aed" name="Sales" radius={[0, 4, 4, 0]} />
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
