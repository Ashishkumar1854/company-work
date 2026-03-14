"use client";

// ============================================
// FILE: Button.jsx
// PURPOSE: Renders reusable button styles for internal links and click actions
// USES: next/link for navigation
// ============================================

import Link from "next/link";

const variantClasses = {
  primary:
    "bg-gradient-to-r from-brand to-brand-secondary text-white shadow-card hover:shadow-card2",
  ghost:
    "border border-black/10 bg-white text-ink shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:bg-blue-50",
  whatsapp:
    "bg-whatsapp text-white shadow-[0_16px_36px_rgba(37,211,102,0.28)] hover:brightness-95",
};

const sizeClasses = {
  sm: "min-h-[42px] px-4 py-2 text-sm",
  md: "min-h-[46px] px-5 py-2.5 text-sm sm:text-base",
  lg: "min-h-[52px] px-6 py-3 text-base",
};

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current"
      aria-hidden="true"
    />
  );
}

function ButtonContent({ children, icon, loading }) {
  return (
    <>
      {/* ── Section: Button Inner Content ── */}
      <span className="inline-flex items-center gap-2">
        {loading ? <Spinner /> : icon ? <span className="text-lg">{icon}</span> : null}
        <span>{children}</span>
      </span>
    </>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  loading = false,
  icon,
  children,
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center rounded-btn font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...props}>
        {/* ── Section: Link Button Content ── */}
        <ButtonContent icon={icon} loading={loading}>
          {children}
        </ButtonContent>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || props.disabled}
      className={classes}
      {...props}
    >
      {/* ── Section: Action Button Content ── */}
      <ButtonContent icon={icon} loading={loading}>
        {children}
      </ButtonContent>
    </button>
  );
}
