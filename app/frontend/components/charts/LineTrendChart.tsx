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
import { compactCurrency } from "@/lib/format";

type LineTrendChartProps = {
  data: Array<{ period: string; sales: number; profit?: number }>;
  height?: number;
};

export function LineTrendChart({ data, height = 320 }: LineTrendChartProps) {
  if (data.length === 0) {
    return <EmptyChart height={height} />;
  }

  return (
    <ResponsiveContainer height={height} width="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
        <XAxis dataKey="period" stroke="#64748b" tickLine={false} />
        <YAxis
          stroke="#64748b"
          tickFormatter={(value) => compactCurrency(Number(value))}
          tickLine={false}
          width={74}
        />
        <Tooltip formatter={(value) => compactCurrency(Number(value))} />
        <Line
          dataKey="sales"
          dot={{ r: 4 }}
          name="Sales"
          stroke="#2563eb"
          strokeWidth={3}
          type="monotone"
        />
        <Line
          dataKey="profit"
          dot={{ r: 4 }}
          name="Profit"
          stroke="#0f766e"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ height }: { height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500"
      style={{ height }}
    >
      No trend data available.
    </div>
  );
}
