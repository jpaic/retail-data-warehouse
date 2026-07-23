import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageSpinner } from "@/components/LoadingState";

export default function CustomersLoading() {
  return (
    <DashboardShell>
      <PageSpinner />
    </DashboardShell>
  );
}
