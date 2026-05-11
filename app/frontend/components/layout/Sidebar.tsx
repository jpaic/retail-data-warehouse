"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Sales", href: "/dashboard/sales" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Time", href: "/dashboard/time" },
  { label: "Insights", href: "/dashboard/insights" },
];

const techStack = ["Next.js", "React", "TypeScript", "TailwindCSS", "Recharts", "PostgreSQL", "Neon", "Vercel"];
const prefetchUrls = [
  "/api/overview",
  "/api/sales",
  "/api/customers",
  "/api/products",
  "/api/time",
];

export function Sidebar() {
  const pathname = usePathname();

  useEffect(() => {
    const prefetch = () => {
      prefetchUrls.forEach((url) => {
        fetch(url).catch(() => undefined);
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch);
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(prefetch, 600);
    return () => globalThis.clearTimeout(id);
  }, []);

  return (
    <aside className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-68 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold">
          RD
        </div>
        <div>
          <h1 className="text-sm font-semibold">Retail DWH</h1>
          <p className="text-xs text-slate-400">Sales Analytics</p>
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white aria-[current=page]:bg-white aria-[current=page]:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 hidden rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-5 text-slate-400 lg:block">
        <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">
          Tech Stack
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((item) => (
            <span
              className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] text-slate-300"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 hidden rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-5 text-slate-400 lg:block">
        <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">
          Data Source
        </p>
        <a
          className="mt-2 block text-slate-300 transition hover:text-white"
          href="https://www.kaggle.com/datasets/thuandao/superstore-sales-analytics/data"
          rel="noreferrer"
          target="_blank"
        >
          ↗ Kaggle — Superstore Sales Analytics
        </a>
        <p className="mt-1 text-slate-500">
          51,290 order lines · Global retail · 2011–2014
        </p>
      </div>

      <div className="mt-4 hidden rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-5 text-slate-400 lg:block">
        <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">
          Author
        </p>
        <p className="mt-2 text-slate-300">Jovan Paić</p>
        <a
          className="mt-1 block text-slate-300 transition hover:text-white"
          href="https://github.com/jpaic/retail-data-warehouse"
          rel="noreferrer"
          target="_blank"
        >
          ↗ GitHub Repository
        </a>
      </div>
    </aside>
  );
}
