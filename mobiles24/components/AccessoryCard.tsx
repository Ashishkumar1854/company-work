//components/AccessoryCard.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { PhoneItem } from "@/lib/api";
import {
  getBrandFallbackImage,
  normalizeImageUrl,
  wrapImageProxy,
} from "@/lib/api";

type AccessoryCardProps = {
  item: PhoneItem;
};

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const parseOfferAmount = (raw: unknown) => {
  const text = String(raw ?? "").replace(/"/g, "").trim();
  if (!text) return 0;
  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const preferred = parts.length > 1 ? parts[1] : parts[0];
  return toNumber(preferred);
};

const getOffer = (item: PhoneItem) => {
  const units = Array.isArray(item.raw?.units) ? item.raw.units : [];
  const inStockUnit =
    units.find((u: any) => {
      const status = String(u?.Status || "")
        .toLowerCase()
        .replace(/\s+/g, "");
      return status === "instock";
    }) ||
    units.find((u: any) => {
      const price = Number(String(u?.SalePrice ?? "").replace(/[^\d]/g, ""));
      return Number.isFinite(price) && price > 0;
    }) ||
    null;

  const sale =
    toNumber(inStockUnit?.SalePrice) ||
    toNumber(item.raw?.SalePrice) ||
    toNumber(item.price);
  const original =
    toNumber(inStockUnit?.MRP) ||
    toNumber(inStockUnit?.OldPrice) ||
    toNumber(item.raw?.MRP) ||
    toNumber(item.raw?.OldPrice);

  const percent =
    original > 0 && sale > 0
      ? Math.max(0, Math.round(((original - sale) / original) * 100))
      : Math.max(
          parseOfferAmount(inStockUnit?.Offer),
          parseOfferAmount(item.raw?.Offer),
          parseOfferAmount(inStockUnit?.Discount),
          parseOfferAmount(item.raw?.Discount),
        );

  return {
    sale,
    original,
    percent,
  };
};

export default function AccessoryCard({ item }: AccessoryCardProps) {
  const imageCandidates = useMemo(() => {
    const rawList = [
      item.image,
      item.raw?.image?.[0]?.path,
      item.raw?.Thumb,
      item.raw?.DummyThumb,
    ];

    const candidates: string[] = [];
    const pushCandidate = (rawUrl: string) => {
      const normalized = normalizeImageUrl(rawUrl);
      candidates.push(wrapImageProxy(normalized));
    };

    for (const raw of rawList) {
      const value = String(raw || "").trim();
      if (!value) continue;

      if (value.startsWith("/api/") || value.startsWith("/placeholder-")) {
        candidates.push(value);
        continue;
      }

      const [basePath, query] = value.split("?");
      if (value.endsWith(".")) {
        pushCandidate(`${value}webp`);
        pushCandidate(`${value}jpg`);
        pushCandidate(`${value}png`);
        continue;
      }

      const lastSeg = basePath.split("/").pop() || "";
      if (!lastSeg.includes(".") && !basePath.endsWith("/")) {
        const withExt = (ext: string) =>
          query ? `${basePath}.${ext}?${query}` : `${basePath}.${ext}`;
        pushCandidate(withExt("webp"));
        pushCandidate(withExt("jpg"));
        pushCandidate(withExt("png"));
      }

      if (/\.svg$/i.test(basePath)) {
        const stem = basePath.replace(/\.svg$/i, "");
        const withExt = (ext: string) =>
          query ? `${stem}.${ext}?${query}` : `${stem}.${ext}`;
        pushCandidate(withExt("webp"));
        pushCandidate(withExt("jpg"));
        pushCandidate(withExt("png"));
      }

      pushCandidate(value);
    }

    candidates.push(getBrandFallbackImage(item.company));
    candidates.push("/placeholder-phone.svg");
    return Array.from(new Set(candidates));
  }, [item.company, item.image, item.raw]);

  const [imgIndex, setImgIndex] = useState(0);
  const imgSrc = imageCandidates[imgIndex] || "/placeholder-phone.svg";

  useEffect(() => {
    setImgIndex(0);
  }, [item.id]);

  const offer = useMemo(() => getOffer(item), [item]);
  const showOff = offer.percent > 0 && offer.percent <= 99;
  const showOriginal = offer.original > 0 && offer.sale > 0;
  const secondaryText =
    (item.raw?.Notes && String(item.raw.Notes)) ||
    (item.raw?.Desc && String(item.raw.Desc)) ||
    "";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex gap-4">
        <div className="relative h-[108px] w-[108px] flex-shrink-0 overflow-hidden rounded-xl bg-white">
          <Image
            src={imgSrc}
            alt={`${item.company} ${item.model}`}
            fill
            sizes="108px"
            className="object-contain p-1"
            unoptimized
            onError={() => {
              const placeholderIndex = imageCandidates.indexOf(
                "/placeholder-phone.svg",
              );
              setImgIndex((prev) => {
                const next = prev + 1;
                if (next < imageCandidates.length) return next;
                if (placeholderIndex >= 0 && prev !== placeholderIndex) {
                  return placeholderIndex;
                }
                return prev;
              });
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[15px] font-medium text-sky-800">
            {item.company} {item.model}
          </p>
          {secondaryText && (
            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
              {secondaryText}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {showOff && (
              <span className="font-semibold text-emerald-700">
                {offer.percent}% OFF
              </span>
            )}
            {showOriginal && (
              <span className="text-zinc-400 line-through">
                ₹{offer.original}
              </span>
            )}
          </div>
          <p className="mt-1 text-[15px] font-semibold text-zinc-900">
            {showOff || showOriginal ? "Now ₹" : "At ₹"}
            {offer.sale > 0 ? offer.sale : item.price || "0"}
          </p>
        </div>
      </div>
    </div>
  );
}
