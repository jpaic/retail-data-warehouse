import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageSpinner } from "@/components/LoadingState";

export default function InsightsLoading() {
  return (
    <DashboardShell>
      <PageSpinner />
    </DashboardShell>
  );
}
