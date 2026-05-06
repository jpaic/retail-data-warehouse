import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { compactCurrency, integer, percent } from "@/lib/format";
import { queryOne, queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [summary, topCustomers, segments, regions, segmentByYear] =
      await Promise.all([
        queryOne<{
          total_customers: number;
          top_customer: string;
          top_revenue: number;
          consumer_share: number;
        }>(`
          WITH customer_revenue AS (
            SELECT customer_name, SUM(total_revenue) AS revenue
            FROM marts.vw_customer_analytics
            GROUP BY customer_name
          ),
          segment_revenue AS (
            SELECT segment, SUM(total_revenue) AS revenue
            FROM marts.vw_customer_analytics
            GROUP BY segment
          )
          SELECT
            (SELECT COUNT(*) FROM customer_revenue)::int AS total_customers,
            (SELECT customer_name FROM customer_revenue ORDER BY revenue DESC LIMIT 1) AS top_customer,
            (SELECT revenue::float FROM customer_revenue ORDER BY revenue DESC LIMIT 1) AS top_revenue,
            COALESCE(
              (
                SELECT ROUND((SUM(revenue) FILTER (WHERE segment = 'Consumer') / NULLIF(SUM(revenue), 0) * 100)::numeric, 2)
                FROM segment_revenue
              ),
              0
            )::float AS consumer_share;
        `),
        queryRows<{ name: string; value: number }>(`
          SELECT
            customer_name AS name,
            SUM(total_revenue)::float AS value
          FROM marts.vw_customer_analytics
          GROUP BY customer_name
          ORDER BY value DESC
          LIMIT 15;
        `),
        queryRows<{
          segment: string;
          sales: number;
          profit: number;
          margin: number;
        }>(`
          SELECT
            segment,
            SUM(total_revenue)::float AS sales,
            SUM(total_profit)::float AS profit,
            COALESCE(ROUND((SUM(total_profit) / NULLIF(SUM(total_revenue), 0) * 100)::numeric, 2), 0)::float AS margin
          FROM marts.vw_customer_analytics
          GROUP BY segment
          ORDER BY sales DESC;
        `),
        queryRows<{ name: string; value: number }>(`
          SELECT
            COALESCE(region, 'Unassigned') AS name,
            SUM(total_revenue)::float AS value
          FROM marts.vw_customer_analytics
          GROUP BY region
          ORDER BY value DESC;
        `),
        queryRows<{ year: number; segment: string; sales: number }>(`
          SELECT
            year,
            segment,
            SUM(total_revenue)::float AS sales
          FROM marts.vw_customer_analytics
          GROUP BY year, segment
          ORDER BY year, segment;
        `),
      ]);

    return cachedJson({
      kpis: [
        {
          label: "Unique Customers",
          value: integer(summary.total_customers),
          detail: "Distinct customer names",
        },
        {
          label: "Top Customer",
          value: summary.top_customer ?? "N/A",
          detail: "Highest revenue customer",
        },
        {
          label: "Top Customer Revenue",
          value: compactCurrency(summary.top_revenue ?? 0),
          detail: "Single-customer revenue",
        },
        {
          label: "Consumer Share",
          value: percent(summary.consumer_share),
          detail: "Share of customer revenue",
        },
      ],
      topCustomers,
      segments,
      regions,
      segmentByYear,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
