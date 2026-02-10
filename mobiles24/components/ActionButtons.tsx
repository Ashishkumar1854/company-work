type ActionButtonsProps = {
  usedPhonesCount: number;
  newPhonesCount: number;
  accessoriesCount: number;
  active: "used" | "new" | "accessories";
  onChange: (value: "used" | "new" | "accessories") => void;
};

export default function ActionButtons({
  usedPhonesCount,
  newPhonesCount,
  accessoriesCount,
  active,
  onChange,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <button
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
          active === "used"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
        onClick={() => onChange("used")}
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
      </button>
      <button
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
          active === "new"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
        onClick={() => onChange("new")}
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
      </button>
      <button
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
          active === "accessories"
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
        onClick={() => onChange("accessories")}
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
      </button>
    </div>
  );
}
