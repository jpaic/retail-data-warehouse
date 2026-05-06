"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { compactCurrency } from "@/lib/format";

type PieValueChartProps = {
  data: Array<{ name: string; value: number }>;
};

const colors = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#be123c"];

export function PieValueChart({ data }: PieValueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500">
        No segment data available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_180px]">
      <ResponsiveContainer height={288} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={64}
            nameKey="name"
            outerRadius={104}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} key={entry.name} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => compactCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col justify-center gap-3">
        {data.map((item, index) => (
          <div className="flex items-center gap-2 text-sm" key={item.name}>
            <span
              className="size-2 rounded-full"
              style={{ background: colors[index % colors.length] }}
            />
            <span className="flex-1 text-slate-600">{item.name}</span>
            <span className="font-medium text-slate-950">
              {compactCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
