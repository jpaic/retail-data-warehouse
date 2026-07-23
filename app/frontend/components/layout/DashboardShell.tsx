"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useCallback, useEffect, useState } from "react";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={closeSidebar}
          />
          <div className="relative z-50 flex h-full w-72">
            <Sidebar />
          </div>
        </div>
      ) : null}

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Open navigation"
            className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
              RD
            </div>
            <span className="text-sm font-semibold text-slate-950">Retail DWH</span>
          </div>
        </header>
        <main className="px-5 py-6 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
