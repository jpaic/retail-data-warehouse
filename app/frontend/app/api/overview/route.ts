import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { financialKpis, queryOne, queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [overview, salesTrend, regions, categories] = await Promise.all([
      queryOne<{
        total_sales: number;
        total_profit: number;
        total_orders: number;
        avg_order_value: number;
        profit_margin: number;
      }>(`
      SELECT
        COALESCE(SUM(total_revenue), 0)::float AS total_sales,
        COALESCE(SUM(total_profit), 0)::float AS total_profit,
        COALESCE(SUM(total_orders), 0)::int AS total_orders,
        COALESCE(
          ROUND((SUM(total_revenue) / NULLIF(SUM(total_orders), 0))::numeric, 2),
          0
        )::float AS avg_order_value,
        COALESCE(
          ROUND((SUM(total_profit) / NULLIF(SUM(total_revenue), 0) * 100)::numeric, 2),
          0
        )::float AS profit_margin
      FROM marts.vw_time_analysis;
    `),
      queryRows<{ period: string; sales: number; profit: number }>(`
        SELECT
          year::text AS period,
          SUM(total_revenue)::float AS sales,
          SUM(total_profit)::float AS profit
        FROM marts.vw_time_analysis
        GROUP BY year
        ORDER BY year;
      `),
      queryRows<{ name: string; value: number }>(`
        SELECT
          COALESCE(region, 'Unassigned') AS name,
          SUM(total_revenue)::float AS value
        FROM marts.vw_customer_analytics
        GROUP BY region
        ORDER BY value DESC;
      `),
      queryRows<{ name: string; value: number }>(`
        SELECT
          category AS name,
          SUM(total_revenue)::float AS value
        FROM marts.vw_product_analytics
        GROUP BY category
        ORDER BY value DESC;
      `),
    ]);

    return cachedJson({
      kpis: financialKpis(overview),
      salesTrend,
      regions,
      categories,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
