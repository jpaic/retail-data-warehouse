import type { QueryResultRow } from "pg";
import { pool } from "@/lib/db";
import { compactCurrency, currency, integer, percent } from "@/lib/format";
import type { KpiMetric } from "@/types/dashboard";

export async function queryRows<T extends QueryResultRow>(sql: string) {
  const result = await pool.query<T>(sql);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow>(sql: string) {
  const result = await pool.query<T>(sql);
  return result.rows[0];
}

export function financialKpis(values: {
  total_sales: number;
  total_profit: number;
  profit_margin?: number;
  avg_order_value: number;
}): KpiMetric[] {
  const kpis = [
    {
      label: "Total Sales",
      value: compactCurrency(values.total_sales),
      detail: "Revenue from mart aggregates",
    },
    {
      label: "Total Profit",
      value: compactCurrency(values.total_profit),
      detail: "Profit across selected grain",
    },
    {
      label: "Average Order Value",
      value: currency(values.avg_order_value),
      detail: "Sales divided by orders",
    },
  ];

  if (typeof values.profit_margin === "number") {
    kpis.push({
      label: "Profit Margin",
      value: percent(values.profit_margin),
      detail: "Profit as share of sales",
    });
  }

  return kpis;
}
