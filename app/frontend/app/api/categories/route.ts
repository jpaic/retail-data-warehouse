import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await queryRows(`
      SELECT
        category,
        SUM(total_revenue)::float AS total_sales,
        SUM(total_profit)::float AS total_profit,
        SUM(total_quantity)::int AS total_quantity
      FROM marts.vw_product_analytics
      GROUP BY category
      ORDER BY total_sales DESC;
    `);

    return cachedJson(rows);
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
