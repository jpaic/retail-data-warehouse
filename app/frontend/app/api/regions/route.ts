import { cachedJson, databaseErrorResponse } from "@/lib/api";
import { queryRows } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await queryRows(`
      SELECT
        COALESCE(region, 'Unassigned') AS region,
        SUM(total_revenue)::float AS total_sales,
        SUM(total_profit)::float AS total_profit,
        SUM(total_orders)::int AS total_orders
      FROM marts.vw_customer_analytics
      GROUP BY region
      ORDER BY total_sales DESC;
    `);

    return cachedJson(rows);
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
