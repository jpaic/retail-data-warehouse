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
