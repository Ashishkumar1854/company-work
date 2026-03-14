"use client";

// ============================================
// FILE: Footer.jsx
// PURPOSE: Displays site footer navigation, brand details, and social links
// USES: next/image, next/link, react-icons, servicesData, siteConfig
// ============================================

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { servicesData, siteConfig } from "@/lib/constants";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <footer className="border-t border-black/10 bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
      {/* ── Section: Footer Main Grid ── */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:items-stretch">
        <div className="flex h-full min-h-[220px] flex-col justify-between">
          {/* ── Section: Brand Summary ── */}
          <div className="space-y-3">
            <div className="relative h-16 w-[145px] overflow-hidden">
              <Image
                src="/logo-social-craft.png"
                alt="Social Craft logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm font-medium leading-6 text-gray-muted">
              {siteConfig.tagline}
            </p>
            <p className="max-w-xs text-sm leading-7 text-gray-body">
              Social Craft helps brands look sharper, communicate clearly, and
              grow with strategy-led creative execution.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-muted">
              Follow us
            </p>
            <div className="flex items-center gap-2.5 text-base text-gray-body">
              <Link
                href={siteConfig.instagram}
                aria-label="Instagram"
                className="rounded-full border border-black/10 bg-white p-2.5 transition-colors duration-200 hover:border-brand hover:text-brand"
              >
                <FaInstagram />
              </Link>
              <Link
                href={siteConfig.youtube}
                aria-label="YouTube"
                className="rounded-full border border-black/10 bg-white p-2.5 transition-colors duration-200 hover:border-brand hover:text-brand"
              >
                <FaYoutube />
              </Link>
              <Link
                href={siteConfig.linkedin}
                aria-label="LinkedIn"
                className="rounded-full border border-black/10 bg-white p-2.5 transition-colors duration-200 hover:border-brand hover:text-brand"
              >
                <FaLinkedin />
              </Link>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                aria-label="WhatsApp"
                className="rounded-full border border-black/10 bg-white p-2.5 text-whatsapp transition-colors duration-200 hover:border-whatsapp hover:bg-green-50"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-full min-h-[220px] flex-col justify-between">
          {/* ── Section: Services Links ── */}
          <div className="space-y-3">
            <h3 className="text-[1.2rem] leading-none">Services</h3>
            <div className="grid gap-2">
              {servicesData.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="text-sm font-medium leading-6 text-gray-body transition-colors duration-200 hover:text-brand"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <p className="max-w-xs text-sm leading-7 text-gray-muted">
              Strategy, creative, ads, and web support planned under one clear
              workflow.
            </p>
          </div>
        </div>

        <div className="flex h-full min-h-[220px] flex-col justify-between">
          {/* ── Section: Company Links ── */}
          <div className="space-y-3">
            <h3 className="text-[1.2rem] leading-none">Company</h3>
            <div className="grid gap-1">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium leading-6 text-gray-body transition-colors duration-200 hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Section: Contact Shortcut ── */}
          <div className="space-y-2.5 border-t border-black/10 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-muted">
              Contact
            </p>
            <p className="text-sm font-semibold text-ink">
              {siteConfig.email}
            </p>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center rounded-btn bg-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* ── Section: Footer Bottom Bar ── */}
      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-3 text-sm text-gray-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Social Craft. All rights reserved.</p>
          <p>Built for speed, clarity, and conversion.</p>
        </div>
      </div>
    </footer>
  );
}
