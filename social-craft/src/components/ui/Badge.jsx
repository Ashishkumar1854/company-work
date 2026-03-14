// ============================================
// FILE: Badge.jsx
// PURPOSE: Displays small pill labels for categories, stats, and UI accents
// USES: text children passed from section components
// ============================================

const variantClasses = {
  blue: "bg-blue-50 text-brand",
  gray: "bg-slate-100 text-gray-muted",
};

export default function Badge({ children, variant = "blue", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-sm font-bold ${variantClasses[variant]} ${className}`}
    >
      {/* ── Section: Badge Label ── */}
      {children}
    </span>
  );
}
