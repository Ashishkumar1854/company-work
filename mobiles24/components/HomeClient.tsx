"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [activeType, setActiveType] = useState<"used" | "new" | "accessories">(
    initialTab
  );

  useEffect(() => {
    setActiveCompany("All");
  }, [activeType]);

  const currentList =
    activeType === "new"
      ? newPhones
      : activeType === "accessories"
      ? accessories
      : usedPhones;

  const companies = useMemo(() => {
    const list = Array.from(
      new Set(currentList.map((item) => item.company).filter(Boolean))
    );
    return ["All", ...list];
  }, [currentList]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return currentList
      .filter((item) =>
        activeCompany === "All" ? true : item.company === activeCompany
      )
      .filter((item) => {
        if (!query) return true;
        const text = `${item.company} ${item.model} ${item.storage}`
          .toLowerCase()
          .trim();
        return text.includes(query);
      });
  }, [currentList, activeCompany, search]);

  return (
    <div className="space-y-6">
      {showActions && (
        <ActionButtons
          usedPhonesCount={usedPhones.length}
          newPhonesCount={newPhones.length}
          accessoriesCount={accessoriesCount}
          active={activeType}
          onChange={setActiveType}
        />
      )}

      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
        <span>{filtered.length} items</span>
        <span>{activeCompany === "All" ? "All Brands" : activeCompany}</span>
      </div>

      <SearchBar value={search} onChange={setSearch} />

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
              phone.company || "brand"
            )}/${encodeURIComponent(phone.model || "model")}/${phone.id}`}
          >
            <PhoneCard phone={phone} />
          </Link>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          No items found. Try a different search or company.
        </div>
      )}
    </div>
  );
}
