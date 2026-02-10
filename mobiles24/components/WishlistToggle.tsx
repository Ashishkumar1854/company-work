"use client";

import type { PhoneItem } from "@/lib/api";
import { useWishlist } from "@/components/WishlistProvider";

type WishlistToggleProps = {
  phone: PhoneItem;
};

export default function WishlistToggle({ phone }: WishlistToggleProps) {
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(phone.id);

  return (
    <button
      type="button"
      onClick={() => {
        if (phone.isSold) return;
        toggle(phone);
      }}
      className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
        phone.isSold
          ? "border border-black/10 bg-zinc-100 text-zinc-400"
          : liked
          ? "bg-black text-white"
          : "border border-black/10 bg-white"
      }`}
    >
      {phone.isSold ? "Sold Out" : liked ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
