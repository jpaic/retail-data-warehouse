import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageSpinner } from "@/components/LoadingState";

export default function ProductsLoading() {
  return (
    <DashboardShell>
      <PageSpinner />
    </DashboardShell>
  );
}
