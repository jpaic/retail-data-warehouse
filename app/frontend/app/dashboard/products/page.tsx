import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProductsPage } from "@/components/pages/ProductsPage";

export default function ProductsDashboardPage() {
  return (
    <DashboardShell>
      <ProductsPage />
    </DashboardShell>
  );
}
