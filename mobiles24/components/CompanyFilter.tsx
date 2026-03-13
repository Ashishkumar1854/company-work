//components/CompanyFilter.tsx
import { useMemo, useState } from "react";
import Image from "next/image";
import { getBrandFallbackImage } from "@/lib/api";

type CompanyFilterProps = {
  companies: string[];
  active: string;
  onSelect: (value: string) => void;
  variant?: "default" | "accessories";
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
  variant = "default",
}: CompanyFilterProps) {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const mobileCollapsedCompanies = useMemo(() => {
    const allChip = companies.find((c) => c === "All");
    const firstBrand = companies.find((c) => c !== "All");

    const list: string[] = [];
    if (allChip) list.push(allChip);

    if (active !== "All" && companies.includes(active)) {
      list.push(active);
    } else if (firstBrand) {
      list.push(firstBrand);
    }

    return Array.from(new Set(list));
  }, [companies, active]);

  const renderChip = (company: string, compact = false) => {
    const color = BRAND_COLORS[company] || "#111111";
    const isActive = active === company;

    if (variant === "accessories") {
      const logo =
        company === "All" ? "" : getBrandFallbackImage(company);
      return (
        <button
          key={company}
          className={`flex items-center overflow-hidden whitespace-nowrap rounded-full border bg-white shadow-sm transition ${
            isActive ? "ring-2 ring-black/10" : ""
          }`}
          style={{
            borderColor: "rgba(0,0,0,0.1)",
          }}
          onClick={() => onSelect(company)}
        >
          <span
            className="flex h-11 w-12 items-center justify-center border-r border-black/10"
            style={{
              backgroundColor: company === "All" ? "#111111" : "#ffffff",
            }}
          >
            {company === "All" ? (
              <span className="text-sm text-white">★</span>
            ) : (
              <Image
                src={logo}
                alt={company}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                unoptimized
              />
            )}
          </span>
          <span
            className="px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {company}
          </span>
        </button>
      );
    }

    return (
      <button
        key={company}
        className={`flex items-center whitespace-nowrap rounded-full border transition duration-200 ease-out ${
          compact
            ? "gap-1.5 px-2.5 py-1.5 text-xs font-medium"
            : "gap-2 px-4 py-2 font-semibold"
        } ${
          isActive ? "text-white" : "bg-white text-zinc-900"
        } shadow-[0_6px_0_0_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_rgba(0,0,0,0.14)] active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(0,0,0,0.18)]`}
        style={{
          borderColor: isActive ? color : "rgba(0,0,0,0.08)",
          backgroundColor: isActive ? color : "#ffffff",
        }}
        onClick={() => onSelect(company)}
      >
        <span
          className={`flex items-center justify-center rounded-full font-bold ${
            compact ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]"
          }`}
          style={{
            backgroundColor: isActive ? "rgba(255,255,255,0.2)" : color,
            color: "#fff",
          }}
        >
          {company === "All" ? "★" : company.slice(0, 2).toUpperCase()}
        </span>
        <span className={compact ? "min-w-0 truncate" : ""}>{company}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile: compact -> expand */}
      <div className="pb-2 text-sm sm:hidden">
        {showAllMobile ? (
          <div className="flex gap-3 overflow-x-auto">
            {companies.map((company) => renderChip(company))}
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
            {mobileCollapsedCompanies.map((company) => (
              <div key={company} className="min-w-0 [&>button]:w-full">
                {renderChip(company, true)}
              </div>
            ))}

            {companies.length > mobileCollapsedCompanies.length && (
              <button
                type="button"
                onClick={() => setShowAllMobile(true)}
                className="rounded-full border border-black/10 bg-white px-2 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm"
              >
                &gt;&gt;
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: full list */}
      <div className="hidden gap-3 overflow-x-auto pb-2 text-sm sm:flex">
        {companies.map((company) => renderChip(company))}
      </div>
    </>
  );
}
