//components/WishlistClient.tsx
"use client";

import Link from "next/link";
import PhoneCard from "@/components/PhoneCard";
import { useWishlist } from "@/components/WishlistProvider";

export default function WishlistClient() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-8 text-center text-sm text-zinc-500">
        Wishlist is empty. Tap a phone and add it to wishlist.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((phone) => (
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
  );
}
