"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  CalendarDays,
  Camera,
  Cpu,
  HardDrive,
  Heart,
  Share2,
  Smartphone,
  Weight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomCTA from "@/components/BottomCTA";
import WishlistToggle from "@/components/WishlistToggle";
import { useWishlist } from "@/components/WishlistProvider";
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

async function fetchPdData(
  brand: string,
  model: string,
): Promise<PdData | null> {
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
  const { isWishlisted, toggle } = useWishlist();
  const [storeName, setStoreName] = useState("Mobiles24");
  const [phone, setPhone] = useState<PhoneItem | null>(null);
  const [usedPhones, setUsedPhones] = useState<PhoneItem[]>([]);
  const [newPhones, setNewPhones] = useState<PhoneItem[]>([]);
  const [pdData, setPdData] = useState<PdData | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
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
        const [storeData, storeOIData, storeNPData, soldData] =
          await Promise.all([
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
        const soldItems = Array.isArray(soldData)
          ? (soldData as SoldItem[])
          : [];

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

        const allPhones = [
          ...normalizedUsed,
          ...normalizedNew,
          ...normalizedAccessories,
        ];
        const found =
          allPhones.find((item) => String(item.id) === String(id)) || null;
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
        const aSameBrand =
          a.company?.toLowerCase() === phone.company?.toLowerCase();
        const bSameBrand =
          b.company?.toLowerCase() === phone.company?.toLowerCase();
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
    pdData?.phone_name ||
    `${phone?.company || ""} ${phone?.model || ""}`.trim();
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

  const priceLabel =
    phone?.price && !hidePrice ? `₹${phone.price}` : "Ask price";

  const message = `Hi, I want details for ${phoneTitle}${
    displayStorage ? ` (${displayStorage})` : ""
  }.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;

  const liked = phone ? isWishlisted(phone.id) : false;

  const toggleWishlist = () => {
    if (!phone || phone.isSold) return;
    toggle(phone);
  };

  const shareProduct = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!shareUrl) return;

    const shareData = {
      title: `${brand} ${phoneTitle}`,
      text: displayStorage ? `${phoneTitle} - ${displayStorage}` : `${phoneTitle}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 1400);
    } catch {
      // Ignore when user cancels share sheet.
    }
  };

  const highlights = [
    { label: "Release", value: pdData?.release_date || "", icon: CalendarDays },
    { label: "Storage", value: displayStorage, icon: HardDrive },
    {
      label: "Processor",
      value: getSpecValue(pdData?.specifications, "Platform", [
        "Chipset",
        "CPU",
      ]),
      icon: Cpu,
    },
    {
      label: "Main Camera",
      value: getSpecValue(pdData?.specifications, "Main Camera", [
        "Dual",
        "Triple",
        "Single",
      ]),
      icon: Camera,
    },
    {
      label: "Display",
      value: getSpecValue(pdData?.specifications, "Display", ["Type", "Size"]),
      icon: Smartphone,
    },
    {
      label: "Battery",
      value: getSpecValue(pdData?.specifications, "Battery", [
        "Type",
        "Charging",
      ]),
      icon: BatteryCharging,
    },
    {
      label: "Weight",
      value: getSpecValue(pdData?.specifications, "Body", ["Weight"]),
      icon: Weight,
    },
    { label: "OS", value: pdData?.os || "", icon: Smartphone },
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

      <main className="mx-auto max-w-[70rem] space-y-3 px-2 py-2.5 sm:px-3 sm:py-4">
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
          <div className="grid gap-2.5 p-2 sm:p-3 lg:grid-cols-[70px_0.86fr_1.14fr] lg:gap-3">
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-12 min-w-[44px] overflow-hidden rounded-md border bg-zinc-100 lg:h-12 lg:min-w-0 ${
                    selectedImage === img
                      ? "border-[#16a34a]"
                      : "border-black/10"
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
              <div className="relative mx-auto aspect-[4/5] w-[82%] max-w-[300px] overflow-hidden rounded-lg border border-black/5 bg-zinc-100 sm:max-w-[340px] lg:w-full lg:max-w-[380px]">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={phoneTitle}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
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

            <div className="order-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {brand}
                  </p>
                  <h1 className="mt-1 text-[1.72rem] font-semibold leading-tight text-zinc-900 sm:text-[1.95rem]">
                    {phoneTitle}
                  </h1>
                  {displayStorage && (
                    <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                      {displayStorage}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className={`rounded-full border p-2 transition ${
                      liked
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-zinc-700"
                    }`}
                    aria-label="Toggle wishlist"
                    title="Wishlist"
                  >
                    <Heart size={15} className={liked ? "fill-current" : ""} />
                  </button>

                  <button
                    type="button"
                    onClick={shareProduct}
                    className="rounded-full border border-black/10 bg-white p-2 text-zinc-700 transition hover:bg-zinc-50"
                    aria-label="Share product"
                    title="Share"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              <div className="text-[2.1rem] font-bold text-zinc-900 sm:text-[2.35rem]">
                {priceLabel}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#16a34a] px-4 py-2 text-center text-sm font-semibold text-white shadow-sm"
                >
                  Book Now
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-center text-sm font-semibold"
                >
                  Call Now
                </a>
              </div>

              {phone && <WishlistToggle phone={phone} />}
              {copiedShare && (
                <p className="-mt-1 text-xs font-medium text-[#16a34a]">Link copied</p>
              )}

              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">
                  Highlights
                </p>

                <div className="mt-1.5">
                  {highlights.slice(0, 7).map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={`${item.label}-${idx}`}
                        className={`flex items-start gap-2.5 py-2 ${
                          idx === 0 ? "" : "border-t border-zinc-100"
                        }`}
                      >
                        <span className="mt-0.5 rounded-md border border-zinc-200 bg-zinc-50 p-1.5 text-zinc-500">
                          <Icon size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-zinc-500">
                            {item.label}
                          </p>
                          <p className="line-clamp-2 whitespace-pre-line text-sm font-medium text-zinc-800">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                        className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium"
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
                        className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium"
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
                <div
                  key={groupKey}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                >
                  <div className="bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 sm:text-base">
                    {group.title || "Details"}
                  </div>

                  <div>
                    {rows.map((row, rowIndex) => (
                      <div
                        key={`${groupKey}-${row.key || "row"}-${rowIndex}`}
                        className="grid gap-1 border-t border-black/5 px-3 py-2 sm:grid-cols-[124px_1fr]"
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
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm"
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
              <span className="text-xs text-zinc-500">
                {relatedProducts.length} items
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-5">
              {relatedProducts.map((item) => {
                const itemPrice = item.price ? `₹${item.price}` : "Ask price";

                return (
                  <Link
                    key={item.id}
                    href={`/mobiles24/${encodeURIComponent(item.company || "unknown")}/${encodeURIComponent(item.model || "unknown")}/${item.id}`}
                    className="rounded-xl border border-zinc-200 bg-white p-1.5 transition hover:shadow-sm sm:p-2"
                  >
                    <div className="relative mb-1.5 aspect-[3/4] overflow-hidden rounded-lg border border-zinc-100 bg-gradient-to-b from-zinc-50 to-zinc-100/70 sm:mb-2">
                      <Image
                        src={
                          item.image ||
                          "https://phoneo.site/placeholder-phone.png"
                        }
                        alt={`${item.company} ${item.model}`}
                        fill
                        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 18vw"
                        className="object-contain p-1.5 sm:p-2"
                        unoptimized
                      />
                    </div>
                    <p className="line-clamp-1 text-[11px] font-semibold text-zinc-900 sm:text-xs">
                      {item.company} {item.model}
                    </p>
                    <p className="line-clamp-1 text-[10px] text-zinc-500 sm:text-[11px]">
                      {item.storage}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-zinc-900 sm:mt-1 sm:text-xs">
                      {itemPrice}
                    </p>
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
