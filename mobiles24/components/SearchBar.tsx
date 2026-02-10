type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
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
        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm"
        aria-label="Filter"
      >
        ⏷
      </button>
    </div>
  );
}
