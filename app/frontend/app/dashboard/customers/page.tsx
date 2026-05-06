import { CustomersPage } from "@/components/pages/CustomersPage";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function CustomersDashboardPage() {
  return (
    <DashboardShell>
      <CustomersPage />
    </DashboardShell>
  );
}
