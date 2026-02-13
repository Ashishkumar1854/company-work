"use client";

import { useEffect, useMemo, useState } from "react";
import AddBugModal from "@/components/AddBugModal";
import BugItem from "@/components/BugItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { initialSections } from "@/lib/initialData";
import { loadSections, loadTheme, saveSections, saveTheme } from "@/lib/storage";
import { BugStatus, ChecklistSection, StatusFilter } from "@/lib/types";

function createId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createSectionId(title: string) {
  return `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Date.now().toString()}`;
}

export default function TrackerDashboard() {
  const [sections, setSections] = useState<ChecklistSection[]>(initialSections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSections(loadSections());
    setTheme(loadTheme());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveSections(sections);
  }, [isHydrated, sections]);

  useEffect(() => {
    if (!isHydrated) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    saveTheme(theme);
  }, [isHydrated, theme]);

  const allItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  const counters = useMemo(() => {
    const total = allItems.length;
    const pending = allItems.filter((item) => item.status === "pending").length;
    const bug = allItems.filter((item) => item.status === "bug").length;
    const resolved = allItems.filter((item) => item.status === "resolved").length;
    const resolvedPct = total === 0 ? 0 : Math.round((resolved / total) * 100);
    return { total, pending, bug, resolved, resolvedPct };
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sections.flatMap((section) =>
      section.items
        .filter((item) => {
          const statusPass = filter === "all" || item.status === filter;
          const searchPass = !normalized || item.title.toLowerCase().includes(normalized);
          return statusPass && searchPass;
        })
        .map((item) => ({ sectionId: section.id, sectionTitle: section.title, item }))
    );
  }, [filter, query, sections]);

  const handleAddItem = (sectionId: string, title: string, newSectionTitle?: string) => {
    const trimmedSectionTitle = newSectionTitle?.trim();
    const isCreateSection = sectionId === "__create_new_section__";
    const resolvedSectionId = isCreateSection && trimmedSectionTitle ? createSectionId(trimmedSectionTitle) : sectionId;

    setSections((current) => {
      if (isCreateSection && trimmedSectionTitle) {
        const existingSection = current.find((section) => section.title.toLowerCase() === trimmedSectionTitle.toLowerCase());
        if (existingSection) {
          return current.map((section) =>
            section.id === existingSection.id
              ? {
                  ...section,
                  items: [
                    ...section.items,
                    {
                      id: createId(existingSection.id),
                      title,
                      status: "pending",
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              : section
          );
        }

        return [
          ...current,
          {
            id: resolvedSectionId,
            title: trimmedSectionTitle,
            items: [
              {
                id: createId(resolvedSectionId),
                title,
                status: "pending",
                createdAt: new Date().toISOString()
              }
            ]
          }
        ];
      }

      return current.map((section) =>
        section.id === resolvedSectionId
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: createId(resolvedSectionId),
                  title,
                  status: "pending",
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : section
      );
    });
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections((current) =>
      current
        .map((section) =>
          section.id === sectionId
            ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
            : section
        )
        .filter((section) => section.items.length > 0)
    );
  };

  const handleStatusChange = (sectionId: string, itemId: string, status: BugStatus) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) => (item.id === itemId ? { ...item, status } : item))
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar trackerMode theme={theme} onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-semibold md:text-3xl">Bug Tracker Dashboard</h1>
          <p className="mt-1 text-sm text-blue-100">Track checklist quality, open bugs, and resolution progress.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-xs text-blue-100">Total Items</p>
              <p className="text-2xl font-semibold">{counters.total}</p>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-xs text-blue-100">Pending</p>
              <p className="text-2xl font-semibold">{counters.pending}</p>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-xs text-blue-100">Bugs</p>
              <p className="text-2xl font-semibold">{counters.bug}</p>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-xs text-blue-100">Resolved</p>
              <p className="text-2xl font-semibold">{counters.resolved}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-blue-100">
              <span>Resolution Progress</span>
              <span>{counters.resolvedPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/30">
              <div className="h-2 rounded-full bg-emerald-300 transition-all" style={{ width: `${counters.resolvedPct}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search checklist items"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as StatusFilter)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="bug">Bug</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              + Add Checklist Item
            </button>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map(({ sectionId, sectionTitle, item }) => (
            <section
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sectionTitle}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Todo
                </span>
              </div>
              <BugItem
                item={item}
                onStatusChange={(itemId, status) => handleStatusChange(sectionId, itemId, status)}
                onDelete={(itemId) => handleDeleteItem(sectionId, itemId)}
              />
            </section>
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No checklist items match the current filter. Add a new checklist item to continue.
          </div>
        )}
      </main>

      <Footer />

      <AddBugModal
        isOpen={isModalOpen}
        sections={sections}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
