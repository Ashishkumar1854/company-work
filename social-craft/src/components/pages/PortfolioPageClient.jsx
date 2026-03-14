"use client";

// ============================================
// FILE: PortfolioPageClient.jsx
// PURPOSE: Renders the interactive portfolio page with category filtering
// USES: useState, next/image, Badge, portfolioData
// ============================================

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { portfolioData } from "@/lib/constants";

const tabs = [
  { label: "All", value: "all" },
  { label: "Videos", value: "videos" },
  { label: "Photos", value: "photos" },
  { label: "Posters", value: "posters" },
  { label: "Web", value: "web" },
];

const expandedPortfolio = [
  ...portfolioData,
  ...portfolioData.map((item) => ({
    ...item,
    id: item.id + 100,
    title: `${item.title} Campaign`,
    description: `${item.description} with stronger messaging, clearer conversion paths, and channel-ready execution.`,
  })),
];

export default function PortfolioPageClient() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems =
    activeTab === "all"
      ? expandedPortfolio
      : expandedPortfolio.filter((item) => item.category === activeTab);

  return (
    <div className="py-20">
      {/* ── Section: Portfolio Page Header ── */}
      <section className="mb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
              Selected work
            </p>
            <h1>Portfolio</h1>
            <p className="text-base leading-8 text-gray-muted sm:text-lg">
              A broader look at the creative systems, campaign assets, and web
              builds Social Craft delivers for modern brands.
            </p>
          </div>

          {/* ── Section: Portfolio Filter Tabs ── */}
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
      </section>

      {/* ── Section: Portfolio Detail Grid ── */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-card border border-black/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card2"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[1.5rem]">{item.title}</h2>
                  <Badge className="capitalize">{item.category}</Badge>
                </div>
                <p className="text-sm leading-7 text-gray-muted">
                  {item.description}
                </p>
                <div className="rounded-[18px] bg-slate-50 p-4 text-sm leading-7 text-gray-body">
                  Creative direction, production polish, and delivery structure
                  built to support a stronger customer journey across channels.
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
