//components/PhoneCard.tsx
"use client";

import Image from "next/image";
import type { PhoneItem } from "@/lib/api";
import { useWishlist } from "@/components/WishlistProvider";

type PhoneCardProps = {
  phone: PhoneItem;
};

export default function PhoneCard({ phone }: PhoneCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(phone.id);
  const condition =
    phone.source === "used"
      ? (phone.raw?.Condition as string) ||
        (phone.raw?.IsRepaired === 0 ? "Non Repaired" : "")
      : "";
  const priceLabel = phone.priceHidden
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
          {phone.isSold && (
            <div className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              Sold
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold">
                {phone.company} {phone.model}
              </h3>
              <p className="text-xs text-zinc-500">{phone.storage}</p>
              {condition && (
                <p className="text-xs font-semibold text-emerald-600">
                  {condition}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                if (phone.isSold) return;
                toggle(phone);
              }}
              className={`rounded-full border px-2 py-1 text-[10px] font-semibold transition ${
                phone.isSold
                  ? "border-black/10 text-zinc-400"
                  : liked
                  ? "border-black bg-black text-white"
                  : "border-black/10"
              }`}
            >
              {phone.isSold ? "Sold" : liked ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
          <p className="text-sm font-semibold text-zinc-900">{priceLabel}</p>
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
