//components/ActionButtons.tsx
"use client";

import Link from "next/link";

type ActionButtonsProps = {
  usedPhonesCount: number;
  newPhonesCount: number;
  accessoriesCount: number;
  active: "used" | "new" | "accessories";
};

export default function ActionButtons({
  usedPhonesCount,
  newPhonesCount,
  accessoriesCount,
  active,
}: ActionButtonsProps) {
  const baseStyle =
    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* USED */}
      <Link
        href="/mobiles24"
        className={`${baseStyle} ${
          active === "used"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base">
          🔁
        </span>
        <span>
          Used Phones
          <div
            className={`text-xs font-medium ${
              active === "used" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {usedPhonesCount} items
          </div>
        </span>
      </Link>

      {/* NEW */}
      <Link
        href="/mobiles24/new"
        className={`${baseStyle} ${
          active === "new"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base">
          📱
        </span>
        <span>
          New Phones
          <div
            className={`text-xs font-medium ${
              active === "new" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {newPhonesCount} items
          </div>
        </span>
      </Link>

      {/* ACCESSORIES */}
      <Link
        href="/mobiles24/accessories"
        className={`${baseStyle} ${
          active === "accessories"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base">
          🎧
        </span>
        <span>
          Accessories
          <div
            className={`text-xs font-medium ${
              active === "accessories" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {accessoriesCount} items
          </div>
        </span>
      </Link>
    </div>
  );
}
