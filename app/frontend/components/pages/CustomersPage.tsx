"use client";

import { ChartCard } from "@/components/cards/ChartCard";
import { KpiGrid } from "@/components/cards/KpiGrid";
import { BarValueChart } from "@/components/charts/BarValueChart";
import { PieValueChart } from "@/components/charts/PieValueChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton, ErrorBanner } from "@/components/LoadingState";
import { useApiData } from "@/components/pages/useApiData";
import type { CustomersPayload } from "@/types/dashboard";

export function CustomersPage() {
  const { data, isLoading, error } = useApiData<CustomersPayload>("/api/customers");
  const segmentPie =
    data?.segments.map((segment) => ({
      name: segment.segment,
      value: segment.sales,
    })) ?? [];

  return (
    <>
      <PageHeader
        description="Customer concentration, segment mix, and geographic revenue patterns."
        eyebrow="02 - Customers"
        title="Customer Analytics"
      />
      {error ? <ErrorBanner message={error} /> : null}
      <KpiGrid isLoading={isLoading} kpis={data?.kpis ?? []} />
      <div className="mt-6 grid gap-6">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <ChartCard title="Top 15 Customers by Revenue">
            {isLoading ? <ChartSkeleton height="h-96" /> : <BarValueChart data={data?.topCustomers ?? []} height={384} layout="vertical" />}
          </ChartCard>
          <ChartCard title="Revenue by Segment">
            {isLoading ? <ChartSkeleton /> : <PieValueChart data={segmentPie} />}
          </ChartCard>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Revenue by Region">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#0f766e" data={data?.regions ?? []} />}
          </ChartCard>
          <ChartCard title="Profit Margin by Segment">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#d97706" data={(data?.segments ?? []).map((item) => ({ name: item.segment, value: item.margin ?? 0 }))} valueFormatter={(value) => `${value.toFixed(1)}%`} />}
          </ChartCard>
        </div>
      </div>
    </>
  );
}
