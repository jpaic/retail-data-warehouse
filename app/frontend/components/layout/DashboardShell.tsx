import { Sidebar } from "@/components/layout/Sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
