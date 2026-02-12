"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { loadTheme, saveTheme } from "@/lib/storage";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setTheme(loadTheme());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    saveTheme(theme);
  }, [isHydrated, theme]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar theme={theme} onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#93c5fd_0%,_#e2e8f0_40%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_right,_#1d4ed8_0%,_#0f172a_45%,_#020617_100%)]" />

        <section className="mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
          <span className="rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-200">
            QA Operations
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-100 md:text-6xl">
            Professional Bug Tracker Dashboard
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-700 dark:text-slate-300 md:text-lg">
            Track checklist coverage, flag bugs quickly, monitor resolution progress, and keep your product release-ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tracker"
              className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand-700"
            >
              Open Bug Tracker
            </Link>
            <Link
              href="/tracker"
              className="rounded-lg border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Start Reviewing
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
