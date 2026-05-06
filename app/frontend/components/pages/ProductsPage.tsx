"use client";

import { ChartCard } from "@/components/cards/ChartCard";
import { KpiGrid } from "@/components/cards/KpiGrid";
import { BarValueChart } from "@/components/charts/BarValueChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton, ErrorBanner } from "@/components/LoadingState";
import { useApiData } from "@/components/pages/useApiData";
import type { ProductsPayload } from "@/types/dashboard";

export function ProductsPage() {
  const { data, isLoading, error } = useApiData<ProductsPayload>("/api/products");

  return (
    <>
      <PageHeader
        description="Category, sub-category, product, discount, and margin analytics from the product mart view."
        eyebrow="03 - Products"
        title="Product Analytics"
      />
      {error ? <ErrorBanner message={error} /> : null}
      <KpiGrid isLoading={isLoading} kpis={data?.kpis ?? []} />
      <div className="mt-6 grid gap-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Revenue by Category">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#2563eb" data={data?.categories ?? []} />}
          </ChartCard>
          <ChartCard title="Profit Margin by Category">
            {isLoading ? <ChartSkeleton /> : <BarValueChart color="#0f766e" data={data?.categoryMargins ?? []} valueFormatter={(value) => `${value.toFixed(1)}%`} />}
          </ChartCard>
        </div>
        <ChartCard title="Revenue by Sub-Category">
          {isLoading ? <ChartSkeleton height="h-96" /> : <BarValueChart data={data?.subCategories ?? []} height={384} />}
        </ChartCard>
        <ChartCard title="Top 10 Products by Revenue">
          {isLoading ? <ChartSkeleton height="h-96" /> : <BarValueChart color="#7c3aed" data={data?.topProducts ?? []} height={384} layout="vertical" />}
        </ChartCard>
      </div>
    </>
  );
}
