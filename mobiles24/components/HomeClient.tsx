//components/HomeClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import type { PhoneItem } from "@/lib/api";
import { normalizeImageUrl, wrapImageProxy } from "@/lib/api";
import ActionButtons from "@/components/ActionButtons";
import CompanyFilter from "@/components/CompanyFilter";
import PhoneCard from "@/components/PhoneCard";
import AccessoryCard from "@/components/AccessoryCard";
import SearchBar from "@/components/SearchBar";

type AccessoryUnitLike = {
  Status?: unknown;
  SalePrice?: unknown;
  Offer?: unknown;
  Discount?: unknown;
  MRP?: unknown;
  OldPrice?: unknown;
};

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const parseOfferAmount = (raw: unknown) => {
  const text = String(raw ?? "").replace(/"/g, "").trim();
  if (!text) return 0;

  // Supports patterns like: "true,500", "500", "10%"
  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const preferred = parts.length > 1 ? parts[1] : parts[0];
  return toNumber(preferred);
};

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
  const [selectedAccessory, setSelectedAccessory] = useState<PhoneItem | null>(
    null,
  );
  const [modalImageSrc, setModalImageSrc] = useState("/placeholder-phone.svg");

  /* ✅ FIX: Sync activeType when route (initialTab) changes */
  useEffect(() => {
    setActiveType(initialTab);
  }, [initialTab]);

  /* ✅ Reset company only when tab changes */
  useEffect(() => {
    setActiveCompany("All");
    setSelectedFilter("all");
  }, [activeType]);

  useEffect(() => {
    if (!selectedAccessory) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedAccessory(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedAccessory]);

  useEffect(() => {
    if (!selectedAccessory) return;

    const rawCandidates = [
      selectedAccessory.raw?.image?.[0]?.path,
      selectedAccessory.raw?.Thumb,
      selectedAccessory.raw?.DummyThumb,
      selectedAccessory.image,
    ].filter(Boolean) as string[];

    const normalizedCandidates = rawCandidates
      .map((value) => normalizeImageUrl(String(value)))
      .filter(Boolean);

    setModalImageSrc(normalizedCandidates[0] || "/placeholder-phone.svg");
  }, [selectedAccessory]);

  useEffect(() => {
    if (!selectedAccessory) return;
    if (modalImageSrc !== "/placeholder-phone.svg") return;

    let active = true;
    const loadPdImage = async () => {
      try {
        const res = await fetch(
          `/api/mobiles24/pd?brand=${encodeURIComponent(
            selectedAccessory.company || "",
          )}&model=${encodeURIComponent(selectedAccessory.model || "")}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const json = await res.json();
        const candidate =
          json?.data?.thumbnail ||
          json?.data?.phone_images?.[0] ||
          "";
        const safe = normalizeImageUrl(candidate);
        if (active && safe && safe !== "/placeholder-phone.svg") {
          setModalImageSrc(safe);
        }
      } catch {
        // no-op
      }
    };

    loadPdImage();
    return () => {
      active = false;
    };
  }, [selectedAccessory, modalImageSrc]);

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

  const selectedAccessoryOffer = useMemo(() => {
    if (!selectedAccessory) return null;

    const units = Array.isArray(selectedAccessory.raw?.units)
      ? selectedAccessory.raw.units
      : [];
    const inStockUnit: AccessoryUnitLike | undefined =
      units.find(
        (u: AccessoryUnitLike) =>
          String(u?.Status || "").toLowerCase().replace(/\s+/g, "") ===
          "instock",
      ) || (units[0] as AccessoryUnitLike | undefined);

    const sale = toNumber(
      selectedAccessory.price || inStockUnit?.SalePrice || selectedAccessory.raw?.SalePrice,
    );

    const unitPrices = units
      .map((u: AccessoryUnitLike) => toNumber(u?.SalePrice))
      .filter((price: number) => price > 0);
    const unitMaxPrice = unitPrices.length ? Math.max(...unitPrices) : 0;

    const offerAmount = Math.max(
      parseOfferAmount(inStockUnit?.Offer),
      parseOfferAmount(selectedAccessory.raw?.Offer),
      parseOfferAmount(inStockUnit?.Discount),
      parseOfferAmount(selectedAccessory.raw?.Discount),
    );

    const oldFromRaw = Math.max(
      toNumber(inStockUnit?.MRP),
      toNumber(inStockUnit?.OldPrice),
      toNumber(selectedAccessory.raw?.MRP),
      toNumber(selectedAccessory.raw?.OldPrice),
    );

    const original =
      oldFromRaw ||
      (unitMaxPrice > sale ? unitMaxPrice : 0) ||
      (offerAmount > 0 ? sale + offerAmount : 0);
    const percent =
      sale > 0 && original > sale
        ? Math.max(1, Math.ceil(((original - sale) / original) * 100))
        : 0;

    return {
      sale,
      original,
      percent,
    };
  }, [selectedAccessory]);

  const isAccessoriesView = activeType === "accessories";
  const accessoryOffer = selectedAccessoryOffer ?? {
    sale: 0,
    original: 0,
    percent: 0,
  };

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
        placeholder="Search anything..."
      />

      <CompanyFilter
        companies={companies}
        active={activeCompany}
        onSelect={setActiveCompany}
        variant="default"
      />

      <section
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          isAccessoriesView ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {filtered.map((phone) => {
          if (phone.source === "accessory") {
            return (
              <div
                key={phone.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAccessory(phone)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedAccessory(phone);
                  }
                }}
                className="text-left"
              >
                <AccessoryCard item={phone} />
              </div>
            );
          }

          return (
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
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          No items found.
        </div>
      )}

      {selectedAccessory && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]"
          onClick={() => setSelectedAccessory(null)}
        >
          <div
            className="mx-auto mt-20 w-[min(92vw,560px)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900">
                {selectedAccessory.company} {selectedAccessory.model}
              </h3>
              <button
                type="button"
                aria-label="Close accessory preview"
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100"
                onClick={() => setSelectedAccessory(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="flex gap-3 rounded-xl border border-black/10 bg-zinc-50 p-3">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-black/10 bg-white">
                  <Image
                    src={wrapImageProxy(modalImageSrc)}
                    alt={`${selectedAccessory.company} ${selectedAccessory.model}`}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                    unoptimized
                    onError={() => setModalImageSrc("/placeholder-phone.svg")}
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="line-clamp-1 text-lg font-semibold text-zinc-900">
                    {selectedAccessory.company} {selectedAccessory.model}
                  </p>
                  {selectedAccessory.raw?.Desc && (
                    <p className="line-clamp-2 text-sm text-zinc-600">
                      {String(selectedAccessory.raw.Desc)}
                    </p>
                  )}
                  {selectedAccessory.raw?.Notes && (
                    <p className="line-clamp-2 text-sm text-zinc-600">
                      {String(selectedAccessory.raw.Notes)}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
                <p className="text-sm font-medium text-zinc-500">JUST</p>
                {accessoryOffer.sale > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <p className="text-3xl font-bold text-red-600">
                      ₹{accessoryOffer.sale}
                    </p>
                    {accessoryOffer.percent > 0 && (
                      <>
                        <span className="rounded-full bg-yellow-300 px-2 py-1 text-xs font-bold text-zinc-900">
                          {accessoryOffer.percent}% OFF
                        </span>
                        <span className="text-lg text-zinc-400 line-through">
                          ₹{accessoryOffer.original}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-red-600">Ask price</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
