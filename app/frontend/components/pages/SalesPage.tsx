"use client";

import { ChartCard } from "@/components/cards/ChartCard";
import { KpiGrid } from "@/components/cards/KpiGrid";
import { BarValueChart } from "@/components/charts/BarValueChart";
import { LineTrendChart } from "@/components/charts/LineTrendChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton, ErrorBanner } from "@/components/LoadingState";
import { useApiData } from "@/components/pages/useApiData";
import type { SalesPayload } from "@/types/dashboard";

export function SalesPage() {
  const { data, isLoading, error } = useApiData<SalesPayload>("/api/sales");

  return (
    <>
      <PageHeader
        description="Revenue and profitability trends with market and order-priority breakdowns from the dashboard mart views."
        eyebrow="01 - Sales Overview"
        title="Sales Overview"
      />
      {error ? <ErrorBanner message={error} /> : null}
      <KpiGrid isLoading={isLoading} kpis={data?.kpis ?? []} />
      <div className="mt-6 grid gap-6">
        <ChartCard title="Monthly Revenue and Profit Trend">
          {isLoading ? <ChartSkeleton height="h-80" /> : <LineTrendChart data={data?.monthlyTrend ?? []} />}
        </ChartCard>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Revenue by Market">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#2563eb" data={data?.markets ?? []} layout="vertical" />}
          </ChartCard>
          <ChartCard title="Revenue by Order Priority">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#d97706" data={data?.priorities ?? []} />}
          </ChartCard>
        </div>
        <ChartCard title="Annual Revenue and Profit">
          {isLoading ? <ChartSkeleton height="h-72" /> : <LineTrendChart data={data?.annualTrend ?? []} height={288} />}
        </ChartCard>
      </div>
    </>
  );
}
