//components/Navbar.tsx
"use client";

import Link from "next/link";
import { Heart, Smartphone } from "lucide-react";
import { useWishlist } from "@/components/WishlistProvider";

type NavbarProps = {
  storeName: string;
  variant?: "default" | "accessories";
};

export default function Navbar({
  storeName,
  variant = "default",
}: NavbarProps) {
  const { count } = useWishlist();
  const isAccessories = variant === "accessories";
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-black">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 ${
          isAccessories ? "py-5 sm:py-6" : "py-3"
        } sm:px-6`}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
            <Smartphone className="h-5 w-5" aria-hidden="true" />
          </span>
          {!isAccessories && (
            <span className="font-display text-lg font-semibold tracking-[0.3em] text-white">
              {storeName}
            </span>
          )}
        </div>
        {isAccessories && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <span className="font-display text-3xl font-light tracking-[0.08em] text-white sm:text-5xl">
              {String(storeName).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white text-black"
          >
            <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
