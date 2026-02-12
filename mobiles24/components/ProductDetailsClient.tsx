"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BottomCTA from "@/components/BottomCTA";
import WishlistToggle from "@/components/WishlistToggle";
import {
  API_ENDPOINTS,
  applySoldStatus,
  normalizeAccessoryItems,
  normalizeImageUrl,
  normalizeNewPhones,
  normalizeStoreInfo,
  normalizeUsedPhone,
  type PhoneItem,
  type SoldItem,
} from "@/lib/api";

const PHONE_NUMBER = "9039933984";
const WHATSAPP_NUMBER = "917803002677";

type ProductDetailsClientProps = {
  company: string;
  model: string;
  id: string;
};

type PdSpecRow = {
  key: string;
  val?: string | string[];
};

type PdSpecGroup = {
  title: string;
  specs?: PdSpecRow[];
};

type PdRam = {
  ram: string;
  price?: string;
};

type PdData = {
  brand?: string;
  phone_name?: string;
  thumbnail?: string;
  phone_images?: string[];
  release_date?: string;
  dimension?: string;
  os?: string;
  storage?: string;
  specifications?: PdSpecGroup[];
  color?: Record<string, string[]>;
  ram?: PdRam[];
};

type PdResponse = {
  status?: boolean;
  data?: PdData;
};

function toStringArray(input?: string | string[]): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => String(item ?? "").trim()).filter(Boolean);
  }

  if (typeof input === "string") {
    const value = input.trim();
    return value ? [value] : [];
  }

  return [];
}

function joinVals(input?: string | string[]) {
  return toStringArray(input).join("\n");
}

function compactSpecValue(rowKey: string | undefined, raw: string): string {
  const key = String(rowKey || "").toLowerCase();
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return raw;

  if (key === "2g bands" || key === "3g bands") {
    return lines.slice(0, 2).join("\n");
  }

  if (key === "4g bands" || key === "5g bands") {
    return lines[0];
  }

  return raw;
}

function getSpecValue(
  specs: PdSpecGroup[] | undefined,
  title: string,
  keys: string[],
): string {
  if (!Array.isArray(specs)) return "";

  const group = specs.find(
    (item) => item.title?.toLowerCase() === title.toLowerCase(),
  );
  if (!group || !Array.isArray(group.specs)) return "";

  for (const key of keys) {
    const row = group.specs.find(
      (item) => item.key?.toLowerCase() === key.toLowerCase(),
    );
    const value = joinVals(row?.val);
    if (value) return value;
  }

  return "";
}

function normalizePdImageUrl(url: string): string {
  const value = String(url || "").trim();
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  let fixed = value;
  if (fixed.endsWith(".")) fixed = `${fixed}jpg`;

  return normalizeImageUrl(fixed);
}

function looksValidStorage(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  return /(GB|TB|RAM|ROM|storage|\/)/i.test(trimmed);
}

function extractAccessoriesPayload(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") return [];

  const raw = payload as { items?: unknown[]; data?: { items?: unknown[] } };

  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data?.items)) return raw.data.items;
  return [];
}

async function fetchPdData(brand: string, model: string): Promise<PdData | null> {
  const url = `/api/mobiles24/pd?brand=${encodeURIComponent(
    brand,
  )}&model=${encodeURIComponent(model)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const json = (await res.json()) as PdResponse;
    return json?.status && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export default function ProductDetailsClient({
  company,
  model,
  id,
}: ProductDetailsClientProps) {
  const [storeName, setStoreName] = useState("Mobiles24");
  const [phone, setPhone] = useState<PhoneItem | null>(null);
  const [usedPhones, setUsedPhones] = useState<PhoneItem[]>([]);
  const [newPhones, setNewPhones] = useState<PhoneItem[]>([]);
  const [pdData, setPdData] = useState<PdData | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchJson = async (url: string) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${url}`);
      return res.json();
    };

    const load = async () => {
      try {
        const [storeData, storeOIData, storeNPData, soldData] = await Promise.all([
          fetchJson(API_ENDPOINTS.store),
          fetchJson(API_ENDPOINTS.storeOIProxy),
          fetchJson(API_ENDPOINTS.storeNP),
          fetchJson(API_ENDPOINTS.sold),
        ]);

        if (!active) return;

        const store = normalizeStoreInfo(storeData);
        setStoreName(store.name);

        const usedRaw = Array.isArray(storeData?.used_phones)
          ? storeData.used_phones
          : [];
        const soldItems = Array.isArray(soldData) ? (soldData as SoldItem[]) : [];

        const normalizedUsed = applySoldStatus(
          usedRaw.map(normalizeUsedPhone),
          soldItems,
        );
        const normalizedNew = normalizeNewPhones(storeNPData);
        const normalizedAccessories = normalizeAccessoryItems(
          extractAccessoriesPayload(storeOIData),
        );

        setUsedPhones(normalizedUsed);
        setNewPhones(normalizedNew);

        const allPhones = [...normalizedUsed, ...normalizedNew, ...normalizedAccessories];
        const found = allPhones.find((item) => String(item.id) === String(id)) || null;
        setPhone(found);

        const pdCandidates: Array<{ brand: string; model: string }> = [];
        const pushCandidate = (b?: string, m?: string) => {
          const brandValue = String(b || "").trim();
          const modelValue = String(m || "").trim();
          if (!brandValue || !modelValue) return;

          if (
            pdCandidates.some(
              (item) =>
                item.brand.toLowerCase() === brandValue.toLowerCase() &&
                item.model.toLowerCase() === modelValue.toLowerCase(),
            )
          ) {
            return;
          }

          pdCandidates.push({ brand: brandValue, model: modelValue });
        };

        pushCandidate(company, model);
        pushCandidate(found?.company, found?.model);
        pushCandidate(found?.raw?.Company, found?.raw?.Model);

        let details: PdData | null = null;
        for (const item of pdCandidates) {
          details = await fetchPdData(item.brand, item.model);
          if (details) break;
        }

        if (!active) return;

        setPdData(details);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load");
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [company, model, id]);

  useEffect(() => {
    setShowAllSpecs(false);
  }, [id]);

  const gallery = useMemo(() => {
    const list: string[] = [];

    if (pdData?.thumbnail) {
      const fixed = normalizePdImageUrl(pdData.thumbnail);
      if (fixed) list.push(fixed);
    }

    if (Array.isArray(pdData?.phone_images)) {
      for (const image of pdData.phone_images) {
        const fixed = normalizePdImageUrl(image);
        if (fixed) list.push(fixed);
      }
    }

    // Fallback only when PD gallery missing
    if (list.length === 0 && phone?.image) {
      list.push(normalizeImageUrl(phone.image));
    }

    return Array.from(new Set(list.filter(Boolean)));
  }, [pdData?.thumbnail, pdData?.phone_images, phone?.image]);

  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage((prev) => (gallery.includes(prev) ? prev : gallery[0]));
    } else {
      setSelectedImage("");
    }
  }, [gallery]);

  const relatedProducts = useMemo(() => {
    if (!phone) return [];

    const sourceList = phone.source === "new" ? newPhones : usedPhones;

    return sourceList
      .filter((item) => item.id !== phone.id)
      .sort((a, b) => {
        const aSameBrand = a.company?.toLowerCase() === phone.company?.toLowerCase();
        const bSameBrand = b.company?.toLowerCase() === phone.company?.toLowerCase();
        if (aSameBrand === bSameBrand) return 0;
        return aSameBrand ? -1 : 1;
      })
      .slice(0, 10);
  }, [phone, newPhones, usedPhones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName={storeName} />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="h-80 animate-pulse rounded-3xl bg-zinc-200" />
        </main>
      </div>
    );
  }

  if (!phone && !pdData) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName={storeName} />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center">
          <div className="rounded-3xl bg-white px-6 py-8 shadow-sm">
            <h1 className="text-2xl font-semibold">Phone not found</h1>
            <p className="mt-2 text-sm text-zinc-500">
              {error || "This product may have been removed."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const phoneTitle =
    pdData?.phone_name || `${phone?.company || ""} ${phone?.model || ""}`.trim();
  const brand = pdData?.brand || phone?.company || company;

  const hidePrice = Boolean(
    phone?.raw?.PriceHidden ||
      phone?.raw?.priceHidden ||
      phone?.raw?.HidePrice === 1 ||
      phone?.raw?.PriceVisibility === "hide",
  );

  const displayStorage = looksValidStorage(pdData?.storage || "")
    ? (pdData?.storage as string)
    : looksValidStorage(phone?.storage || "")
      ? (phone?.storage as string)
      : "";

  const priceLabel = phone?.price && !hidePrice ? `₹${phone.price}` : "Ask price";

  const message = `Hi, I want details for ${phoneTitle}${
    displayStorage ? ` (${displayStorage})` : ""
  }.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;

  const highlights = [
    { label: "Release", value: pdData?.release_date || "" },
    { label: "OS", value: pdData?.os || "" },
    { label: "Storage", value: displayStorage },
    {
      label: "Processor",
      value: getSpecValue(pdData?.specifications, "Platform", ["Chipset", "CPU"]),
    },
    {
      label: "Main Camera",
      value: getSpecValue(pdData?.specifications, "Main Camera", ["Dual", "Triple", "Single"]),
    },
    {
      label: "Display",
      value: getSpecValue(pdData?.specifications, "Display", ["Type", "Size"]),
    },
    {
      label: "Battery",
      value: getSpecValue(pdData?.specifications, "Battery", ["Type", "Charging"]),
    },
    {
      label: "Weight",
      value: getSpecValue(pdData?.specifications, "Body", ["Weight"]),
    },
  ].filter((item) => item.value);

  const specGroups = Array.isArray(pdData?.specifications)
    ? pdData.specifications
    : [];
  const visibleSpecGroups = showAllSpecs ? specGroups : specGroups.slice(0, 4);

  const ramOptions = Array.isArray(pdData?.ram) ? pdData.ram : [];
  const colors = pdData?.color ? Object.keys(pdData.color) : [];

  return (
    <div className="min-h-screen bg-[#f5f3ef] pb-20 sm:pb-0">
      <Navbar storeName={storeName} />

      <main className="mx-auto max-w-6xl space-y-4 px-2.5 py-3 sm:px-4 sm:py-5">
        <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="grid gap-3 p-2.5 sm:p-4 lg:grid-cols-[84px_1fr_1.05fr] lg:gap-4">
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-14 min-w-12 overflow-hidden rounded-lg border bg-zinc-100 lg:h-16 lg:min-w-0 ${
                    selectedImage === img ? "border-[#16a34a]" : "border-black/10"
                  }`}
                >
                  <Image
                    src={img}
                    alt={phoneTitle}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={phoneTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 36vw"
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    No image
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-2 flex justify-center gap-1.5">
                  {gallery.map((img, idx) => (
                    <button
                      key={`dot-${img}-${idx}`}
                      onClick={() => setSelectedImage(img)}
                      className={`h-2.5 w-2.5 rounded-full ${
                        selectedImage === img ? "bg-[#16a34a]" : "bg-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="order-3 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  {brand}
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
                  {phoneTitle}
                </h1>
                {displayStorage && (
                  <p className="mt-1 text-xs text-zinc-600 sm:text-sm">{displayStorage}</p>
                )}
              </div>

              <div className="text-3xl font-bold text-zinc-900 sm:text-4xl">{priceLabel}</div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#16a34a] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="rounded-full border border-black/10 px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Call Now
                </a>
              </div>

              {phone && <WishlistToggle phone={phone} />}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-lg border border-black/10 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {item.label}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm font-medium text-zinc-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {colors.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Colors
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colors.map((color, idx) => (
                      <span
                        key={`${color || "color"}-${idx}`}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ramOptions.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    RAM Options
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ramOptions.map((ram, idx) => (
                      <span
                        key={`${ram.ram || "ram"}-${ram.price || "noprice"}-${idx}`}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium"
                      >
                        {ram.ram || "Variant"}
                        {ram.price ? ` - ${ram.price}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {specGroups.length > 0 && (
          <section className="space-y-3">
            {visibleSpecGroups.map((group, groupIndex) => {
              const rows = Array.isArray(group.specs) ? group.specs : [];
              if (rows.length === 0) return null;
              const groupKey = `${group.title || "group"}-${groupIndex}`;

              return (
                <div key={groupKey} className="overflow-hidden rounded-xl border border-black/10 bg-white">
                  <div className="bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-900 sm:text-base">
                    {group.title || "Details"}
                  </div>

                  <div>
                    {rows.map((row, rowIndex) => (
                      <div
                        key={`${groupKey}-${row.key || "row"}-${rowIndex}`}
                        className="grid gap-1 border-t border-black/5 px-3 py-2 sm:grid-cols-[132px_1fr]"
                      >
                        <p className="text-xs font-medium text-zinc-500 sm:text-sm">
                          {row.key || "Info"}
                        </p>
                        <p className="whitespace-pre-line text-sm text-zinc-900">
                          {compactSpecValue(row.key, joinVals(row.val) || "-")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {specGroups.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSpecs((prev) => !prev)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-zinc-800"
              >
                {showAllSpecs
                  ? "Show Less Details"
                  : `More Details (${specGroups.length - 4} sections)`}
              </button>
            )}
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
                Related {phone?.source === "new" ? "New" : "Used"} Phones
              </h2>
              <span className="text-xs text-zinc-500">{relatedProducts.length} items</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {relatedProducts.map((item) => {
                const itemPrice = item.price ? `₹${item.price}` : "Ask price";

                return (
                  <Link
                    key={item.id}
                    href={`/mobiles24/${encodeURIComponent(item.company || "unknown")}/${encodeURIComponent(item.model || "unknown")}/${item.id}`}
                    className="rounded-2xl border border-black/10 bg-white p-2 transition hover:shadow-sm"
                  >
                    <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={item.image || "https://phoneo.site/placeholder-phone.png"}
                        alt={`${item.company} ${item.model}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="line-clamp-1 text-xs font-semibold text-zinc-900">
                      {item.company} {item.model}
                    </p>
                    <p className="line-clamp-1 text-[11px] text-zinc-500">{item.storage}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-900">{itemPrice}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomCTA
        phoneNumber={PHONE_NUMBER}
        whatsappNumber={WHATSAPP_NUMBER}
        message={message}
      />
    </div>
  );
}
