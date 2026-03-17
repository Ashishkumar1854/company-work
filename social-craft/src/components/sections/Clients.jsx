"use client";

// ============================================
// FILE: Clients.jsx
// PURPOSE: Displays a looping marquee of industry chips to build credibility
// USES: framer-motion, clientChips
// ============================================

import { motion } from "framer-motion";
import { clientChips } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const marqueeItems = [...clientChips, ...clientChips];

export default function Clients() {
  return (
    <motion.section {...motionProps} className="py-4 sm:py-6">
      {/* ── Section: Clients Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 flex items-center justify-center gap-3">
          {/* ── Section: Ornament Title ── */}
          <span className="hidden h-px flex-1 bg-black/10 sm:block" />
          <p className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-gray-muted">
            Trusted by teams who ship
          </p>
          <span className="hidden h-px flex-1 bg-black/10 sm:block" />
        </div>

        {/* ── Section: Infinite Marquee ── */}
        <div className="overflow-hidden rounded-card border border-black/10 bg-white/70 py-3 shadow-card">
          <div className="flex min-w-max animate-[marquee_24s_linear_infinite] gap-3 px-4">
            {marqueeItems.map((chip, index) => (
              <div
                key={`${chip}-${index}`}
                className="flex items-center gap-3 rounded-pill border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-gray-body"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.section>
  );
}
