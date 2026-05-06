export type SalesPoint = {
  year: number;
  total_sales: number;
  total_profit: number;
  total_orders: number;
  avg_order_value: number;
};

export type CategoryPerformance = {
  category: string;
  total_sales: number;
  total_profit: number;
  total_quantity: number;
};

export type RegionPerformance = {
  region: string;
  total_sales: number;
  total_profit: number;
  total_orders: number;
};

export type ExecutiveOverview = {
  total_sales: number;
  total_profit: number;
  total_orders: number;
  avg_order_value: number;
};

export type KpiMetric = {
  label: string;
  value: string;
  detail: string;
};

export type BarDatum = {
  name: string;
  value: number;
  secondary?: number;
};

export type TimeDatum = {
  period: string;
  sales: number;
  profit?: number;
};

export type SegmentDatum = {
  segment: string;
  sales: number;
  profit?: number;
  margin?: number;
};

export type HeatmapDatum = {
  year: number;
  month: number;
  label: string;
  value: number;
};

export type OverviewPayload = {
  kpis: KpiMetric[];
  salesTrend: TimeDatum[];
  regions: BarDatum[];
  categories: BarDatum[];
};

export type SalesPayload = {
  kpis: KpiMetric[];
  annualTrend: TimeDatum[];
  monthlyTrend: TimeDatum[];
  markets: BarDatum[];
  priorities: BarDatum[];
};

export type CustomersPayload = {
  kpis: KpiMetric[];
  topCustomers: BarDatum[];
  segments: SegmentDatum[];
  regions: BarDatum[];
  segmentByYear: Array<{ year: number; segment: string; sales: number }>;
};

export type ProductsPayload = {
  kpis: KpiMetric[];
  categories: BarDatum[];
  categoryMargins: BarDatum[];
  subCategories: BarDatum[];
  topProducts: BarDatum[];
};

export type TimePayload = {
  kpis: KpiMetric[];
  annual: TimeDatum[];
  quarterly: Array<{ period: string; year: number; sales: number }>;
  monthly: Array<{ month: number; year: number; sales: number }>;
  heatmap: HeatmapDatum[];
};
