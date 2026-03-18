// ============================================
// FILE: layout.js
// PURPOSE: Defines root metadata, fonts, analytics, and shared layout wrappers
// USES: next/font/google, Navbar, Footer, WhatsAppFloat, GoogleAnalytics, globals.css
// ============================================

import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Social Craft | Creative & Growth Studio",
    template: "%s | Social Craft",
  },
  description:
    "Social Craft helps brands grow with graphics, video editing, social media management, digital marketing, and high-converting websites.",
  applicationName: "Social Craft",
  keywords: [
    "creative agency",
    "social media management",
    "video editing",
    "digital marketing",
    "web development",
    "graphics design",
  ],
  authors: [{ name: "Social Craft" }],
  creator: "Social Craft",
  publisher: "Social Craft",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Social Craft | Creative & Growth Studio",
    description:
      "Creative systems for graphics, editing, social media, ads, and websites that turn attention into growth.",
    url: "/",
    siteName: "Social Craft",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Craft | Creative & Growth Studio",
    description:
      "Creative systems for graphics, editing, social media, ads, and websites that turn attention into growth.",
  },
  icons: {
    icon: "/logo-social-craft.svg",
    shortcut: "/logo-social-craft.svg",
    apple: "/logo-social-craft.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {/* ── Section: Google Analytics Scripts ── */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {/* ── Section: Shared Site Chrome ── */}
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
