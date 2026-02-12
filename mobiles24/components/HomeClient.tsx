//components/HomeClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { PhoneItem } from "@/lib/api";
import ActionButtons from "@/components/ActionButtons";
import CompanyFilter from "@/components/CompanyFilter";
import PhoneCard from "@/components/PhoneCard";
import SearchBar from "@/components/SearchBar";

type HomeClientProps = {
  usedPhones: PhoneItem[];
  newPhones: PhoneItem[];
  accessories: PhoneItem[];
  accessoriesCount: number;
  initialTab?: "used" | "new" | "accessories";
  showActions?: boolean;
};

export default function HomeClient({
  usedPhones,
  newPhones,
  accessories,
  accessoriesCount,
  initialTab = "used",
  showActions = true,
}: HomeClientProps) {
  const [search, setSearch] = useState("");
  const [activeCompany, setActiveCompany] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeType, setActiveType] = useState<"used" | "new" | "accessories">(
    initialTab,
  );

  /* ✅ FIX: Sync activeType when route (initialTab) changes */
  useEffect(() => {
    setActiveType(initialTab);
  }, [initialTab]);

  /* ✅ Reset company only when tab changes */
  useEffect(() => {
    setActiveCompany("All");
    setSelectedFilter("all");
  }, [activeType]);

  const filterOptions = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "5g", label: "5G" },
      { key: "best_price", label: "Best Price" },
      { key: "in_warranty", label: "In Warranty" },
      { key: "low_to_high", label: "Low To High" },
      { key: "high_to_low", label: "High To Low" },
      { key: "0-10000", label: "Under 10,000" },
      { key: "10000-20000", label: "Under 10,000 to 20,000" },
      { key: "20000-30000", label: "Under 20,000 to 30,000" },
      { key: "30000-40000", label: "Under 30,000 to 40,000" },
      { key: "40000-50000", label: "Under 40,000 to 50,000" },
      { key: "50000-60000", label: "Under 50,000 to 60,000" },
      { key: "60000-70000", label: "Under 60,000 to 70,000" },
      { key: "70000-80000", label: "Under 70,000 to 80,000" },
      { key: "90000-100000", label: "Under 90,000 to 100,000" },
      { key: "100000-110000", label: "Under 100,000 to 110,000" },
    ],
    [],
  );

  const currentList: PhoneItem[] = useMemo(() => {
    if (activeType === "new") return newPhones;
    if (activeType === "accessories") return accessories;
    return usedPhones;
  }, [activeType, usedPhones, newPhones, accessories]);

  const companies = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(currentList.map((item) => item.company).filter(Boolean)),
      ),
    ];
  }, [currentList]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const parsePrice = (value: string) => {
      const numeric = Number(String(value || "").replace(/[^\d]/g, ""));
      return Number.isFinite(numeric) ? numeric : 0;
    };

    const base = currentList
      .filter((item) =>
        activeCompany === "All" ? true : item.company === activeCompany,
      )
      .filter((item) => {
        if (!query) return true;
        const text = `${item.company} ${item.model} ${item.storage}`
          .toLowerCase()
          .trim();
        return text.includes(query);
      });

    if (selectedFilter === "all") return base;

    if (selectedFilter === "low_to_high" || selectedFilter === "best_price") {
      return [...base].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    if (selectedFilter === "high_to_low") {
      return [...base].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    if (selectedFilter === "5g") {
      return base.filter((item) => {
        const text = `${item.company} ${item.model} ${item.storage} ${JSON.stringify(item.raw || {})}`
          .toLowerCase()
          .trim();
        return text.includes("5g");
      });
    }

    if (selectedFilter === "in_warranty") {
      return base.filter((item) => {
        const rawText = JSON.stringify(item.raw || {}).toLowerCase();
        return rawText.includes("warranty");
      });
    }

    const range = selectedFilter.match(/^(\d+)-(\d+)$/);
    if (range) {
      const min = Number(range[1]);
      const max = Number(range[2]);
      return base.filter((item) => {
        const price = parsePrice(item.price);
        return price >= min && price <= max;
      });
    }

    return base;
  }, [currentList, activeCompany, search, selectedFilter]);

  return (
    <div className="space-y-6">
      {showActions && (
        <ActionButtons
          usedPhonesCount={usedPhones.length}
          newPhonesCount={newPhones.length}
          accessoriesCount={accessoriesCount}
          active={activeType}
        />
      )}

      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
        <span>{filtered.length} items</span>
        <span>{activeCompany === "All" ? "All Brands" : activeCompany}</span>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      <CompanyFilter
        companies={companies}
        active={activeCompany}
        onSelect={setActiveCompany}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((phone) => (
          <Link
            key={phone.id}
            href={`/mobiles24/${encodeURIComponent(
              phone.company?.trim() || "unknown",
            )}/${encodeURIComponent(
              phone.model?.trim() || "unknown",
            )}/${phone.id}`}
          >
            <PhoneCard phone={phone} />
          </Link>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          No items found.
        </div>
      )}
    </div>
  );
}
