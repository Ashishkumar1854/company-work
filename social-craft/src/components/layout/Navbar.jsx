"use client";

// ============================================
// FILE: Navbar.jsx
// PURPOSE: Renders the sticky main navigation with desktop links and mobile menu
// USES: next/image, next/link, next/navigation, react-icons, Button, navLinks, siteConfig
// ============================================

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { navLinks, siteConfig } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClasses = (href) => {
    const isActive = href === "/" ? pathname === "/" : pathname === href;

    return `rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive ? "bg-blue-50 text-brand" : "text-gray-body hover:bg-blue-50 hover:text-brand"
    }`;
  };

  const closeMenu = () => setIsOpen(false);
  const handleProposalClick = () => {
    const proposalMessage = `Hi Social Craft! I'm interested in collaborating with your team for my brand.

Please share your proposal, available service packages, pricing, onboarding process, and expected timeline to begin.

Looking forward to hearing from you.`;

    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(proposalMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(242,244,247,0.86)] backdrop-blur-md">
      {/* ── Section: Main Navbar Bar ── */}
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-3 sm:px-4">
        <Link href="/" className="flex items-center -ml-3 sm:-ml-4">
          {/* ── Section: Brand Identity ── */}
          <div className="relative h-28 w-[145px] overflow-hidden">
            <Image
              src="/logo-social-craft.png"
              alt="Social Craft logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* ── Section: Desktop Navigation Links ── */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={getLinkClasses(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Section: Desktop Action Buttons ── */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" onClick={handleProposalClick} icon={<FaWhatsapp />}>
            Get Proposal
          </Button>
          <Button href="/#booking">Book Now</Button>
        </div>

        {/* ── Section: Mobile Menu Toggle ── */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white text-ink shadow-[0_12px_28px_rgba(15,23,42,0.08)] lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <IoClose size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* ── Section: Mobile Navigation Panel ── */}
      <div
        className={`overflow-hidden border-t border-black/10 bg-white/95 transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={getLinkClasses(link.href)}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Button variant="ghost" onClick={handleProposalClick} icon={<FaWhatsapp />}>
              Get Proposal
            </Button>
            <Button href="/#booking" onClick={closeMenu}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
