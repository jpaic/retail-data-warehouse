export function PageSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return <div className={`${height} animate-pulse rounded-md bg-slate-100`} />;
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </section>
  );
}
