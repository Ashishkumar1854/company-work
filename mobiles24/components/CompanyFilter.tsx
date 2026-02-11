//components/CompanyFilter.tsx
type CompanyFilterProps = {
  companies: string[];
  active: string;
  onSelect: (value: string) => void;
};

const BRAND_COLORS: Record<string, string> = {
  Apple: "#111111",
  OnePlus: "#ef4444",
  Oppo: "#22c55e",
  Vivo: "#2563eb",
  Realme: "#f59e0b",
  Samsung: "#1d4ed8",
  Motorola: "#0ea5e9",
  Xiaomi: "#f97316",
  Nokia: "#2563eb",
  Tecno: "#0f172a",
  Google: "#6b7280",
};

export default function CompanyFilter({
  companies,
  active,
  onSelect,
}: CompanyFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 text-sm">
      {companies.map((company) => {
        const color = BRAND_COLORS[company] || "#111111";
        const isActive = active === company;
        return (
          <button
            key={company}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-semibold shadow-sm transition ${
              isActive ? "text-white" : "bg-white text-zinc-900"
            }`}
            style={{
              borderColor: isActive ? color : "rgba(0,0,0,0.08)",
              backgroundColor: isActive ? color : "#ffffff",
            }}
            onClick={() => onSelect(company)}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: isActive ? "rgba(255,255,255,0.2)" : color,
                color: "#fff",
              }}
            >
              {company === "All" ? "★" : company.slice(0, 2).toUpperCase()}
            </span>
            {company}
          </button>
        );
      })}
    </div>
  );
}
