// ============================================
// FILE: next.config.js
// PURPOSE: Configures Next.js runtime behavior, images, and public env passthrough
// USES: process.env variables for public site configuration
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GOOGLE_SHEET_URL: process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

module.exports = nextConfig;
