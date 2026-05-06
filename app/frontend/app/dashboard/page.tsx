import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewPage } from "@/components/pages/OverviewPage";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <OverviewPage />
    </DashboardShell>
  );
}
