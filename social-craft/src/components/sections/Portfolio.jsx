"use client";

// ============================================
// FILE: Portfolio.jsx
// PURPOSE: Filters and showcases portfolio work with tabbed categories
// USES: framer-motion, next/image, useState, Badge, portfolioData
// ============================================

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { portfolioData } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const tabs = [
  { label: "All", value: "all" },
  { label: "Videos", value: "videos" },
  { label: "Photos", value: "photos" },
  { label: "Posters", value: "posters" },
  { label: "Web", value: "web" },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems =
    activeTab === "all"
      ? portfolioData
      : portfolioData.filter((item) => item.category === activeTab);

  return (
    <motion.section {...motionProps} className="py-20">
      {/* ── Section: Portfolio Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* ── Section: Portfolio Heading ── */}
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
              Portfolio
            </p>
            <h2>Signature Work</h2>
          </div>

          {/* ── Section: Portfolio Tabs ── */}
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-btn px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
                    isActive
                      ? "bg-brand text-white"
                      : "border border-black/10 bg-white text-gray-body"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section: Portfolio Grid ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-card border border-black/10 bg-white shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* ── Section: Portfolio Hover Overlay ── */}
              <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,rgba(11,18,32,0.03),rgba(11,18,32,0.82))] p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="space-y-3">
                  <Badge className="capitalize">{item.category}</Badge>
                  <div>
                    <h3 className="text-2xl text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
