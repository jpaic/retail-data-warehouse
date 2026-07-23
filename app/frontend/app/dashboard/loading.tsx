import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageSpinner } from "@/components/LoadingState";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <PageSpinner />
    </DashboardShell>
  );
}
