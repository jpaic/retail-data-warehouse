import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { integer, percent } from "@/lib/format";
import { queryOne, queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [summary, categories, categoryMargins, subCategories, topProducts] =
      await Promise.all([
        queryOne<{
          total_products: number;
          best_category: string;
          best_sub_category: string;
          avg_discount: number;
        }>(`
          WITH category_revenue AS (
            SELECT category, SUM(total_revenue) AS revenue
            FROM marts.vw_product_analytics
            GROUP BY category
          ),
          sub_category_revenue AS (
            SELECT sub_category, SUM(total_revenue) AS revenue
            FROM marts.vw_product_analytics
            GROUP BY sub_category
          )
          SELECT
            COUNT(DISTINCT product_name)::int AS total_products,
            (SELECT category FROM category_revenue ORDER BY revenue DESC LIMIT 1) AS best_category,
            (SELECT sub_category FROM sub_category_revenue ORDER BY revenue DESC LIMIT 1) AS best_sub_category,
            COALESCE((SELECT ROUND((AVG(discount) * 100)::numeric, 2) FROM marts.vw_sales_overview), 0)::float AS avg_discount
          FROM marts.vw_product_analytics;
        `),
        queryRows<{ name: string; value: number; secondary: number }>(`
          SELECT
            category AS name,
            SUM(total_revenue)::float AS value,
            SUM(total_profit)::float AS secondary
          FROM marts.vw_product_analytics
          GROUP BY category
          ORDER BY value DESC;
        `),
        queryRows<{ name: string; value: number }>(`
          SELECT
            category AS name,
            COALESCE(ROUND((SUM(total_profit) / NULLIF(SUM(total_revenue), 0) * 100)::numeric, 2), 0)::float AS value
          FROM marts.vw_product_analytics
          GROUP BY category
          ORDER BY value DESC;
        `),
        queryRows<{ name: string; value: number; secondary: number }>(`
          SELECT
            sub_category AS name,
            SUM(total_revenue)::float AS value,
            SUM(total_profit)::float AS secondary
          FROM marts.vw_product_analytics
          GROUP BY sub_category
          ORDER BY value DESC;
        `),
        queryRows<{ name: string; value: number }>(`
          SELECT
            product_name AS name,
            SUM(total_revenue)::float AS value
          FROM marts.vw_product_analytics
          GROUP BY product_name
          ORDER BY value DESC
          LIMIT 10;
        `),
      ]);

    return cachedJson({
      kpis: [
        {
          label: "Unique Products",
          value: integer(summary.total_products),
          detail: "Distinct product names",
        },
        {
          label: "Best Category",
          value: summary.best_category ?? "N/A",
          detail: "Highest revenue category",
        },
        {
          label: "Best Sub-Category",
          value: summary.best_sub_category ?? "N/A",
          detail: "Highest revenue sub-category",
        },
        {
          label: "Average Discount",
          value: percent(summary.avg_discount),
          detail: "Average discount applied",
        },
      ],
      categories,
      categoryMargins,
      subCategories,
      topProducts,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
