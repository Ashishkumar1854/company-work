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
    "flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-center text-xs font-semibold transition duration-200 ease-out hover:-translate-y-0.5 sm:gap-3 sm:px-4 sm:py-1.5 sm:text-sm";
  const iconBase =
    "flex h-8 w-8 items-center justify-center rounded-xl text-sm transition sm:h-9 sm:w-9 sm:text-base";
  const activeIcon = "bg-white text-black shadow-sm";
  const inactiveIcon = "bg-black/5 text-black";

  const card3d =
    "shadow-[0_6px_0_0_rgba(0,0,0,0.12)] hover:shadow-[0_8px_0_0_rgba(0,0,0,0.16)] active:translate-y-0.5 active:shadow-[0_3px_0_0_rgba(0,0,0,0.18)]";

  return (
    <div className="grid grid-cols-1 gap-3 pb-1 sm:grid-cols-3 sm:pb-0">
      {/* USED */}
      <Link
        href="/mobiles24"
        className={`${baseStyle} ${card3d} ${
          active === "used"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span
          className={`${iconBase} ${
            active === "used" ? activeIcon : inactiveIcon
          }`}
        >
          🔁
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-sm font-semibold">Used Phones</span>
          <span
            className={`text-xs font-medium ${
              active === "used" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {usedPhonesCount} items
          </span>
        </span>
      </Link>

      {/* NEW */}
      <Link
        href="/mobiles24/new"
        className={`${baseStyle} ${card3d} ${
          active === "new"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span
          className={`${iconBase} ${
            active === "new" ? activeIcon : inactiveIcon
          }`}
        >
          📱
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-sm font-semibold">New Phones</span>
          <span
            className={`text-xs font-medium ${
              active === "new" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {newPhonesCount} items
          </span>
        </span>
      </Link>

      {/* ACCESSORIES */}
      <Link
        href="/mobiles24/accessories"
        className={`${baseStyle} ${card3d} ${
          active === "accessories"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        <span
          className={`${iconBase} ${
            active === "accessories" ? activeIcon : inactiveIcon
          }`}
        >
          🎧
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-sm font-semibold">Accessories</span>
          <span
            className={`text-xs font-medium ${
              active === "accessories" ? "text-white/70" : "text-zinc-500"
            }`}
          >
            {accessoriesCount} items
          </span>
        </span>
      </Link>
    </div>
  );
}
