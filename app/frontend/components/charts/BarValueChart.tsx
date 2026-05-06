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
import { compactCurrency } from "@/lib/format";

type BarValueChartProps = {
  data: Array<{ name: string; value: number; secondary?: number }>;
  height?: number;
  layout?: "horizontal" | "vertical";
  valueFormatter?: (value: number) => string;
  color?: string;
};

export function BarValueChart({
  data,
  height = 300,
  layout = "horizontal",
  valueFormatter = compactCurrency,
  color = "#2563eb",
}: BarValueChartProps) {
  if (data.length === 0) {
    return <EmptyChart height={height} />;
  }

  if (layout === "vertical") {
    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, bottom: 0, left: 12 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
          <XAxis
            stroke="#64748b"
            tickFormatter={(value) => valueFormatter(Number(value))}
            tickLine={false}
            type="number"
          />
          <YAxis
            dataKey="name"
            stroke="#64748b"
            tickLine={false}
            type="category"
            width={128}
          />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Bar dataKey="value" fill={color} name="Value" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
        <YAxis
          stroke="#64748b"
          tickFormatter={(value) => valueFormatter(Number(value))}
          tickLine={false}
          width={74}
        />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Bar dataKey="value" fill={color} name="Value" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ height }: { height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500"
      style={{ height }}
    >
      No chart data available.
    </div>
  );
}
