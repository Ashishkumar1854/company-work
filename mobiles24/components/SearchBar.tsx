//components/SearchBar.tsx
import { useEffect, useRef, useState } from "react";

type FilterOption = {
  key: string;
  label: string;
};

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onSelectFilter?: (key: string) => void;
};

export default function SearchBar({
  value,
  onChange,
  filterOptions = [],
  selectedFilter = "all",
  onSelectFilter,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
        <span className="text-zinc-400">🔍</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search anything..."
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm"
          aria-label="Filter"
        >
          ⏷
        </button>
      </div>

      {isOpen && filterOptions.length > 0 && onSelectFilter && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/10 bg-white py-1 shadow-lg">
          {filterOptions.map((option) => {
            const active = selectedFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onSelectFilter(option.key);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm transition ${
                  active
                    ? "bg-black text-white"
                    : "text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
