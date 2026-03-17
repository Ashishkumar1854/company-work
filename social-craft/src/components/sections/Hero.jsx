"use client";

// ============================================
// FILE: Hero.jsx
// PURPOSE: Introduces Social Craft with key messaging, CTAs, and delivery metrics
// USES: framer-motion, next/image, react-icons, Button, Badge
// ============================================

import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaWhatsapp } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import {
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { siteConfig } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const heroBadges = [
  "Strategy-first",
  "Fast Turnarounds",
  "Brand Consistency",
  "Reporting & KPIs",
];

const metrics = [
  { value: "24-48h", label: "Typical delivery", icon: HiOutlineClock },
  { value: "One Team", label: "Design + Growth + Web", icon: HiOutlineUserGroup },
  { value: "Weekly", label: "Calendar & Review", icon: HiOutlineCalendarDays },
  { value: "Monthly", label: "Report with Actions", icon: HiOutlineChartBarSquare },
];

export default function Hero() {
  const handleTalkToUsClick = () => {
    const talkMessage =
      "Hi Social Craft! I would like to discuss my brand requirements with your team.";

    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(talkMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <motion.section
      {...motionProps}
      className="min-h-[70vh] px-4 pb-8 pt-14 sm:pb-10 sm:pt-16"
    >
      {/* ── Section: Hero Content Wrapper ── */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.2fr_0.85fr] lg:gap-10">
        <div className="space-y-6">
          {/* ── Section: Hero Left Column ── */}
          <Badge className="gap-2">
            <FaStar className="text-xs" />
            Creative system for growth-focused brands
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl leading-[1.05]">
              A creative agency built for brands that want consistent growth.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-gray-muted sm:text-lg">
              Social Craft blends graphics, editing, social media, ads, and web
              execution into one sharp delivery system so your brand looks better
              and performs better at the same time.
            </p>
          </div>

          {/* ── Section: Hero CTA Row ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="ghost" href="/services" icon={<FaArrowRight />}>
              Explore Services
            </Button>
            <Button
              variant="ghost"
              onClick={handleTalkToUsClick}
              icon={<HiOutlineChatBubbleLeftRight />}
            >
              Talk to Us
            </Button>
            <Button variant="whatsapp" href="#booking" icon={<FaWhatsapp />}>
              Book Now
            </Button>
          </div>

          {/* ── Section: Hero Badge Row ── */}
          <div className="flex flex-wrap gap-2">
            {heroBadges.map((item) => (
              <Badge key={item} variant="gray">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* ── Section: Hero Right Card ── */}
        <div className="rounded-card border border-black/10 bg-white p-4 shadow-card sm:p-5">
          <div className="space-y-4">
            <div className="rounded-[18px] border border-dashed border-brand/20 bg-[linear-gradient(135deg,rgba(29,78,216,0.16),rgba(242,244,247,0.85),rgba(148,163,184,0.18))] p-4">
              {/* ── Section: Decorative Art Block ── */}
              <div className="relative h-52 overflow-hidden rounded-[16px] border border-dashed border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(242,244,247,0.92))]">
                <Image
                  src="/images/hero-craft-preview.svg"
                  alt="Creative showcase preview"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(11,18,32,0.65))] p-4">
                  <p className="max-w-[12rem] font-serif text-lg leading-tight text-white">
                    Crafted for attention
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section: Metrics Grid ── */}
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  key={metric.value}
                  className="rounded-[18px] border border-black/10 bg-white p-3 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
                >
                  {/* ── Section: Metric Icon ── */}
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-brand">
                    <metric.icon className="text-[1.1rem]" />
                  </div>

                  <p className="font-serif text-lg text-ink">{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-muted">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
