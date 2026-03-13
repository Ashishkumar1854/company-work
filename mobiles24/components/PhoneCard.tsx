//components/PhoneCard.tsx
"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PhoneItem } from "@/lib/api";
import { useWishlist } from "@/components/WishlistProvider";
import { normalizeImageUrl, wrapImageProxy } from "@/lib/api";
import { getPdImage } from "@/lib/pdImage";

type PhoneCardProps = {
  phone: PhoneItem;
};

export default function PhoneCard({ phone }: PhoneCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(phone.id);

  const imageCandidates = useMemo(() => {
    const rawList = [
      phone.image,
      phone.raw?.image?.[0]?.path,
      phone.raw?.Thumb,
      phone.raw?.DummyThumb,
    ];

    const safeList = rawList.filter(Boolean) as string[];

    const candidates: string[] = [];
    const pushCandidate = (rawUrl: string) => {
      const normalized = normalizeImageUrl(rawUrl);
      candidates.push(
        phone.source === "accessory"
          ? wrapImageProxy(normalized)
          : normalized,
      );
    };
    for (const raw of safeList) {
      const value = String(raw).trim();
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

    candidates.push("/placeholder-phone.svg");
    return Array.from(new Set(candidates));
  }, [phone.image, phone.raw]);

  const [imgIndex, setImgIndex] = useState(0);
  const [allCandidatesFailed, setAllCandidatesFailed] = useState(false);
  const [pdFallbackImage, setPdFallbackImage] = useState("");
  const pdFallbackTriedRef = useRef(false);
  const imgSrc =
    pdFallbackImage || imageCandidates[imgIndex] || "/placeholder-phone.svg";

  useEffect(() => {
    setImgIndex(0);
    setAllCandidatesFailed(false);
    setPdFallbackImage("");
    pdFallbackTriedRef.current = false;
  }, [phone.id]);

  useEffect(() => {
    const current = imageCandidates[imgIndex] || "";
    const hasRealCandidate = imageCandidates.some(
      (item) => item !== "/placeholder-phone.svg",
    );

    if (phone.source !== "accessory") {
      if (current !== "/placeholder-phone.svg") return;
    } else {
      if (hasRealCandidate && !allCandidatesFailed && current !== "/placeholder-phone.svg") {
        return;
      }
    }
    if (pdFallbackTriedRef.current || pdFallbackImage) return;

    let active = true;
    pdFallbackTriedRef.current = true;

    const loadPdImage = async () => {
      try {
        const safe = await getPdImage(
          phone.company || "",
          phone.model || "",
        );
        if (active && safe && safe !== "/placeholder-phone.svg") {
          setPdFallbackImage(
            phone.source === "accessory" ? wrapImageProxy(safe) : safe,
          );
        }
      } catch {
        // no-op: keep placeholder when PD fallback is unavailable
      }
    };

    loadPdImage();

    return () => {
      active = false;
    };
  }, [
    imgIndex,
    imageCandidates,
    phone.company,
    phone.model,
    pdFallbackImage,
  ]);

  /* ================= CONDITION (USED PHONES ONLY) ================= */
  const condition =
    phone.source === "used"
      ? (phone.raw?.Condition as string) ||
        (phone.raw?.IsRepaired === 0 ? "Non Repaired" : "")
      : "";

  /* ================= PRICE HIDE LOGIC =================
     1. If product priceHidden = true → show "Ask price"
     2. Else show actual price
  ====================================================== */
  const hidePrice =
    phone.source !== "accessory" &&
    Boolean(
      phone.raw?.PriceHidden ||
        phone.raw?.priceHidden ||
        phone.raw?.HidePrice === 1 ||
        phone.raw?.PriceVisibility === "hide",
    );

  const priceLabel = hidePrice
    ? "Ask price"
    : phone.price
      ? `At ₹${phone.price}`
      : "Ask price";

  return (
    <div
      className={`group rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition ${
        phone.isSold ? "opacity-70 grayscale" : "hover:shadow-md"
      }`}
    >
      <div className="flex gap-4">
        {/* ================= IMAGE SECTION ================= */}
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-100 p-1">
          {imgSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={imgSrc}
                alt={`${phone.company} ${phone.model}`}
                fill
                sizes="72px"
                className="object-contain"
                unoptimized
                onError={() => {
                  if (pdFallbackImage && imgSrc === pdFallbackImage) {
                    setPdFallbackImage("");
                    return;
                  }

                  const placeholderIndex = imageCandidates.indexOf(
                    "/placeholder-phone.svg",
                  );

                  setImgIndex((prev) => {
                    const next = prev + 1;
                    if (next < imageCandidates.length) return next;
                    if (placeholderIndex >= 0 && prev !== placeholderIndex) {
                      return placeholderIndex;
                    }
                    setAllCandidatesFailed(true);
                    return prev;
                  });
                }}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">
              No image
            </div>
          )}

          {/* SOLD BADGE */}
          {phone.isSold && (
            <div className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              Sold
            </div>
          )}
        </div>

        {/* ================= DETAILS SECTION ================= */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold">
                {phone.company} {phone.model}
              </h3>

              <p className="text-xs text-zinc-500">{phone.storage}</p>

              {/* USED CONDITION */}
              {condition && (
                <p className="text-xs font-semibold text-emerald-600">
                  {condition}
                </p>
              )}
            </div>

            {/* ================= WISHLIST BUTTON ================= */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (phone.isSold) return;
                toggle(phone);
              }}
              aria-label={
                phone.isSold
                  ? "Sold product"
                  : liked
                    ? "Remove from wishlist"
                    : "Add to wishlist"
              }
              title={liked ? "Wishlisted" : "Wishlist"}
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition ${
                phone.isSold
                  ? "cursor-not-allowed border-black/10 text-zinc-400"
                  : liked
                    ? "border-black bg-black text-white"
                    : "border-black/10 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <Heart size={14} className={liked ? "fill-current" : ""} />
            </button>
          </div>

          {/* ================= PRICE ================= */}
          <p className="text-sm font-semibold text-zinc-900">{priceLabel}</p>

          {/* SOLD DATE (IF EXISTS) */}
          {phone.raw?.soldOn && (
            <p className="text-[10px] text-zinc-500">
              Sold on {String(phone.raw.soldOn).slice(0, 10)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
