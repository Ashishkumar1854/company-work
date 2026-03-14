"use client";

// ============================================
// FILE: LogoShowcase.jsx
// PURPOSE: Displays a simple logo wall for brand credibility placeholders
// USES: framer-motion
// ============================================

import { motion } from "framer-motion";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const logoNames = [
  "Northline",
  "Pixel House",
  "Urban Mint",
  "ScaleX",
  "Luma Foods",
  "Pulse Clinic",
  "Studio 21",
  "Bright Lane",
];

export default function LogoShowcase() {
  return (
    <motion.section {...motionProps} className="py-20">
      {/* ── Section: Logo Showcase Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl space-y-3">
          {/* ── Section: Logo Showcase Heading ── */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
            Brand exposure
          </p>
          <h2>Brands We&apos;ve Created For</h2>
        </div>

        {/* ── Section: Placeholder Logo Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {logoNames.map((name) => (
            <div
              key={name}
              className="flex min-h-[130px] items-center justify-center rounded-card border border-black/10 bg-slate-100 text-center shadow-[0_12px_34px_rgba(15,23,42,0.05)] grayscale transition-all duration-300 hover:-translate-y-1 hover:grayscale-0"
            >
              <span className="px-6 font-serif text-2xl text-gray-muted">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
