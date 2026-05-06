"use client";

import { ChartCard } from "@/components/cards/ChartCard";
import { KpiGrid } from "@/components/cards/KpiGrid";
import { BarValueChart } from "@/components/charts/BarValueChart";
import { LineTrendChart } from "@/components/charts/LineTrendChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton, ErrorBanner } from "@/components/LoadingState";
import { useApiData } from "@/components/pages/useApiData";
import type { OverviewPayload } from "@/types/dashboard";

export function OverviewPage() {
  const { data, isLoading, error } = useApiData<OverviewPayload>("/api/overview");

  return (
    <>
      <PageHeader
        description="Executive view of revenue, profit, order volume, regional performance, and category mix."
        eyebrow="Executive Dashboard"
        title="Retail Data Warehouse"
      />
      {error ? <ErrorBanner message={error} /> : null}
      <KpiGrid isLoading={isLoading} kpis={data?.kpis ?? []} />
      <div className="mt-6 grid gap-6">
        <ChartCard eyebrow="Sales" title="Annual Sales and Profit Trend">
          {isLoading ? <ChartSkeleton height="h-80" /> : <LineTrendChart data={data?.salesTrend ?? []} />}
        </ChartCard>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard eyebrow="Regions" title="Regional Performance">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#0f766e" data={data?.regions ?? []} />}
          </ChartCard>
          <ChartCard eyebrow="Categories" title="Category Performance">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#7c3aed" data={data?.categories ?? []} />}
          </ChartCard>
        </div>
      </div>
    </>
  );
}
