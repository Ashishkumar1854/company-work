"use client";

// ============================================
// FILE: WhatsAppFloat.jsx
// PURPOSE: Shows a persistent WhatsApp CTA and logs click events to Google Sheets
// USES: react-icons, siteConfig, saveToSheet
// ============================================

import { FaWhatsapp } from "react-icons/fa";
import { saveToSheet } from "@/lib/googleSheets";
import { siteConfig } from "@/lib/constants";

export default function WhatsAppFloat() {
  const whatsappNumber = siteConfig.whatsappNumber;

  const handleClick = async () => {
    await saveToSheet("WhatsappClicks", {
      sourcePage: window.location.pathname,
      sourceSection: "float-button",
      phoneNumber: whatsappNumber,
    });

    window.open(`https://wa.me/${whatsappNumber}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="group fixed bottom-6 right-6 z-50">
      {/* ── Section: Hover Tooltip ── */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[-84px] rounded-pill bg-ink px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-card transition-all duration-300 group-hover:block group-hover:opacity-100">
        Chat with us!
      </div>

      {/* ── Section: Floating WhatsApp Button ── */}
      <button
        type="button"
        onClick={handleClick}
        className="flex h-16 w-16 animate-[floatPulse_2.8s_ease-in-out_infinite] items-center justify-center rounded-full bg-whatsapp p-4 text-white shadow-[0_20px_55px_rgba(37,211,102,0.42)] transition-transform duration-300 hover:-translate-y-1"
        aria-label="Open WhatsApp chat"
      >
        <FaWhatsapp size={28} />
      </button>

      <style jsx>{`
        @keyframes floatPulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 20px 55px rgba(37, 211, 102, 0.42);
          }
          50% {
            transform: translateY(-4px) scale(1.03);
            box-shadow: 0 24px 64px rgba(37, 211, 102, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
