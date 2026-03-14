// ============================================
// FILE: page.js
// PURPOSE: Defines metadata and renders the portfolio page client component
// USES: PortfolioPageClient
// ============================================

import PortfolioPageClient from "@/components/pages/PortfolioPageClient";

export const metadata = {
  title: "Portfolio",
  description:
    "Browse Social Craft portfolio work across posters, videos, photography, funnels, ad creatives, and web builds.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
