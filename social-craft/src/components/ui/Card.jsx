// ============================================
// FILE: Card.jsx
// PURPOSE: Wraps content inside the shared elevated card style used across the site
// USES: children content passed from sections and pages
// ============================================

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-card border border-black/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card2 ${className}`}
    >
      {/* ── Section: Decorative Gradient Overlay ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_34%)]" />

      {/* ── Section: Card Content ── */}
      <div className="relative">{children}</div>
    </div>
  );
}
