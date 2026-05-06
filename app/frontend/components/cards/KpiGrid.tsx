import { KpiCard } from "@/components/KPIcard";
import type { KpiMetric } from "@/types/dashboard";

type KpiGridProps = {
  kpis: KpiMetric[];
  isLoading?: boolean;
};

export function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-36 animate-pulse rounded-lg border border-slate-200 bg-white"
              key={index}
            />
          ))
        : kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
    </section>
  );
}
