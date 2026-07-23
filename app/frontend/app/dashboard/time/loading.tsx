import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageSpinner } from "@/components/LoadingState";

export default function TimeLoading() {
  return (
    <DashboardShell>
      <PageSpinner />
    </DashboardShell>
  );
}
