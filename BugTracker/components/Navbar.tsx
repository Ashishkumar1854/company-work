"use client";

import Link from "next/link";

type NavbarProps = {
  trackerMode?: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Navbar({ trackerMode = false, theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">BT</span>
          BugTracker
        </Link>

        <div className="flex items-center gap-2">
          {!trackerMode && (
            <Link
              href="/tracker"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Open Tracker
            </Link>
          )}
          {trackerMode && (
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Landing
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
