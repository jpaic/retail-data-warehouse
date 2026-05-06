"use client";

import { ChartCard } from "@/components/cards/ChartCard";
import { KpiGrid } from "@/components/cards/KpiGrid";
import { BarValueChart } from "@/components/charts/BarValueChart";
import { Heatmap } from "@/components/charts/Heatmap";
import { LineTrendChart } from "@/components/charts/LineTrendChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton, ErrorBanner } from "@/components/LoadingState";
import { useApiData } from "@/components/pages/useApiData";
import type { TimePayload } from "@/types/dashboard";

export function TimePage() {
  const { data, isLoading, error } = useApiData<TimePayload>("/api/time");

  return (
    <>
      <PageHeader
        description="Seasonality, annual growth, quarterly performance, and month-by-month revenue patterns."
        eyebrow="04 - Time"
        title="Time Analysis"
      />
      {error ? <ErrorBanner message={error} /> : null}
      <KpiGrid isLoading={isLoading} kpis={data?.kpis ?? []} />
      <div className="mt-6 grid gap-6">
        <ChartCard title="Annual Revenue">
          {isLoading ? <ChartSkeleton height="h-72" /> : <LineTrendChart data={data?.annual ?? []} height={288} />}
        </ChartCard>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Quarterly Revenue by Year">
            {isLoading ? <ChartSkeleton /> : <BarValueChart data={(data?.quarterly ?? []).map((item) => ({ name: `${item.year} ${item.period}`, value: item.sales }))} />}
          </ChartCard>
          <ChartCard title="Monthly Revenue by Year">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#0f766e" data={(data?.monthly ?? []).map((item) => ({ name: `${item.year}-${String(item.month).padStart(2, "0")}`, value: item.sales }))} />}
          </ChartCard>
        </div>
        <ChartCard title="Seasonality Heatmap">
          {isLoading ? <ChartSkeleton height="h-64" /> : <Heatmap data={data?.heatmap ?? []} />}
        </ChartCard>
      </div>
    </>
  );
}
