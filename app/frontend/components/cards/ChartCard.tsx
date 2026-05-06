type ChartCardProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function ChartCard({ title, eyebrow, children }: ChartCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-1 text-lg font-semibold text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}
