//components/PhoneCard.tsx
"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import type { PhoneItem } from "@/lib/api";
import { useWishlist } from "@/components/WishlistProvider";

type PhoneCardProps = {
  phone: PhoneItem;
};

export default function PhoneCard({ phone }: PhoneCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(phone.id);

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
  const hidePrice = Boolean(
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
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
          {phone.image ? (
            <Image
              src={phone.image}
              alt={`${phone.company} ${phone.model}`}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
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
