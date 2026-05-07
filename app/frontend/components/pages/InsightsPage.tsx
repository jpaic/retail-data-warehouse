import { ChartCard } from "@/components/cards/ChartCard";
import { PageHeader } from "@/components/layout/PageHeader";

const insightGroups = [
  {
    title: "Revenue & Scale",
    tone: "border-blue-600",
    insights: [
      "$12.6M across 51,290 order lines with steady year-over-year growth in the source dataset.",
      "APAC and EU behave like core markets worth defending first in any growth plan.",
      "Order-priority mix should be monitored because urgency can quietly change fulfillment cost.",
    ],
  },
  {
    title: "Customer Analytics",
    tone: "border-teal-600",
    insights: [
      "Consumer demand drives the largest segment share, while business segments remain useful for high-value orders.",
      "Top customers are concentrated enough to justify account-style retention tracking.",
      "Segment growth is broad-based, reducing dependence on a single customer cohort.",
    ],
  },
  {
    title: "Product Analytics",
    tone: "border-amber-500",
    insights: [
      "Technology leads revenue, with category mix carrying more value than pure order count.",
      "Office Supplies can create high-volume, thinner-margin operating pressure.",
      "Discounting should be watched beside product margin, especially for low-margin sub-categories.",
    ],
  },
  {
    title: "Seasonality & Time",
    tone: "border-rose-500",
    insights: [
      "Q4 seasonality is consistent enough to support earlier inventory and demand planning.",
      "Q1 softness is a recurring campaign opportunity rather than a one-off anomaly.",
      "The final year in the dataset is the strongest, making the trend story easy to communicate.",
    ],
  },
];

export function InsightsPage() {
  return (
    <>
      <PageHeader
        description="Narrative business findings translated from the Streamlit showcase into the warehouse-backed dashboard."
        eyebrow="05 - Insights"
        title="Key Business Insights"
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {insightGroups.map((group) => (
          <ChartCard key={group.title} title={group.title}>
            <div className="space-y-3">
              {group.insights.map((insight) => (
                <article
                  className={`rounded-lg border border-slate-200 border-l-4 ${group.tone} bg-white p-4 text-sm leading-6 text-slate-600`}
                  key={insight}
                >
                  {insight}
                </article>
              ))}
            </div>
          </ChartCard>
        ))}
      </div>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Executive Summary
          </p>

          <h3 className="text-lg font-semibold text-slate-900">
            Technology products and APAC demand represent the strongest long-term growth drivers.
          </h3>

          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Regional consistency, recurring Q4 demand acceleration, and strong consumer segment activity
            indicate a stable retail growth pattern across the dataset. Margin pressure from discount-heavy
            categories remains the primary operational risk area.
          </p>
        </div>
      </section>
    </>
  );
}
