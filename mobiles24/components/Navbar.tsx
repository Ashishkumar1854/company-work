"use client";

import Link from "next/link";
import { useWishlist } from "@/components/WishlistProvider";

type NavbarProps = {
  storeName: string;
};

export default function Navbar({ storeName }: NavbarProps) {
  const { count } = useWishlist();
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-[0.3em] text-white">
            {storeName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
          >
            ❤
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
