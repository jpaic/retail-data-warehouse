import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { compactCurrency, percent } from "@/lib/format";
import { queryOne, queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [summary, annual, quarterly, monthly, heatmap] = await Promise.all([
      queryOne<{
        best_year: number;
        best_month: number;
        best_quarter: number;
        growth: number;
        best_year_sales: number;
      }>(`
        WITH annual AS (
          SELECT year, SUM(total_revenue) AS sales
          FROM marts.vw_time_analysis
          GROUP BY year
        ),
        monthly AS (
          SELECT month, SUM(total_revenue) AS sales
          FROM marts.vw_time_analysis
          GROUP BY month
        ),
        quarterly AS (
          SELECT quarter, SUM(total_revenue) AS sales
          FROM marts.vw_time_analysis
          GROUP BY quarter
        ),
        bounds AS (
          SELECT
            (SELECT sales FROM annual ORDER BY year ASC LIMIT 1) AS first_sales,
            (SELECT sales FROM annual ORDER BY year DESC LIMIT 1) AS last_sales
        )
        SELECT
          (SELECT year FROM annual ORDER BY sales DESC LIMIT 1)::int AS best_year,
          (SELECT month FROM monthly ORDER BY sales DESC LIMIT 1)::int AS best_month,
          (SELECT quarter FROM quarterly ORDER BY sales DESC LIMIT 1)::int AS best_quarter,
          (SELECT sales::float FROM annual ORDER BY sales DESC LIMIT 1) AS best_year_sales,
          COALESCE((SELECT ROUND(((last_sales - first_sales) / NULLIF(first_sales, 0) * 100)::numeric, 2) FROM bounds), 0)::float AS growth;
      `),
      queryRows<{ period: string; sales: number }>(`
        SELECT
          year::text AS period,
          SUM(total_revenue)::float AS sales
        FROM marts.vw_time_analysis
        GROUP BY year
        ORDER BY year;
      `),
      queryRows<{ period: string; year: number; sales: number }>(`
        SELECT
          'Q' || quarter AS period,
          year,
          SUM(total_revenue)::float AS sales
        FROM marts.vw_time_analysis
        GROUP BY year, quarter
        ORDER BY year, quarter;
      `),
      queryRows<{ month: number; year: number; sales: number }>(`
        SELECT
          month,
          year,
          SUM(total_revenue)::float AS sales
        FROM marts.vw_time_analysis
        GROUP BY year, month
        ORDER BY year, month;
      `),
      queryRows<{ year: number; month: number; label: string; value: number }>(`
        SELECT
          year,
          month,
          TO_CHAR(MAKE_DATE(year, month, 1), 'Mon') AS label,
          SUM(total_revenue)::float AS value
        FROM marts.vw_time_analysis
        GROUP BY year, month
        ORDER BY year, month;
      `),
    ]);

    const bestMonth = new Date(2020, summary.best_month - 1, 1).toLocaleString(
      "en-US",
      { month: "long" },
    );

    return cachedJson({
      kpis: [
        {
          label: "Best Year",
          value: String(summary.best_year),
          detail: `${compactCurrency(summary.best_year_sales)} revenue`,
        },
        {
          label: "Best Month",
          value: bestMonth,
          detail: "Highest revenue month",
        },
        {
          label: "Best Quarter",
          value: `Q${summary.best_quarter}`,
          detail: "Highest revenue quarter",
        },
        {
          label: "Overall Growth",
          value: percent(summary.growth),
          detail: "First year to last year",
        },
      ],
      annual,
      quarterly,
      monthly,
      heatmap,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
