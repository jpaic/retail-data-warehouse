import { compactCurrency } from "@/lib/format";
import type { HeatmapDatum } from "@/types/dashboard";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type HeatmapProps = {
  data: HeatmapDatum[];
};

export function Heatmap({ data }: HeatmapProps) {
  const years = Array.from(new Set(data.map((item) => item.year))).sort();
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] gap-2" style={{ gridTemplateColumns: "72px repeat(12, 1fr)" }}>
        <div />
        {months.map((month) => (
          <div className="text-center text-xs font-medium text-slate-500" key={month}>
            {month}
          </div>
        ))}
        {years.map((year) => (
          <Row data={data} key={year} maxValue={maxValue} year={year} />
        ))}
      </div>
    </div>
  );
}

function Row({
  data,
  maxValue,
  year,
}: {
  data: HeatmapDatum[];
  maxValue: number;
  year: number;
}) {
  return (
    <>
      <div className="flex items-center text-sm font-medium text-slate-700">{year}</div>
      {months.map((month, index) => {
        const value =
          data.find((item) => item.year === year && item.month === index + 1)?.value ?? 0;
        const intensity = Math.max(0.08, value / maxValue);

        return (
          <div
            className="rounded-md px-2 py-3 text-center text-xs font-medium text-slate-950"
            key={`${year}-${month}`}
            style={{
              backgroundColor: `rgba(37, 99, 235, ${intensity})`,
              color: intensity > 0.55 ? "white" : "#0f172a",
            }}
            title={`${month} ${year}: ${compactCurrency(value)}`}
          >
            {compactCurrency(value)}
          </div>
        );
      })}
    </>
  );
}
