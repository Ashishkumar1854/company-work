// ============================================
// FILE: constants.js
// PURPOSE: Stores all static site content and shared frontend configuration
// USES: process.env for public WhatsApp number
// ============================================

export const siteConfig = {
  name: "Social Craft",
  tagline: "Creative & Growth Studio",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  email: "hello@socialcraft.in",
  instagram: "#",
  youtube: "#",
  linkedin: "#",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "#booking" },
];

export const servicesData = [
  {
    id: 1,
    kicker: "Design & Edit",
    title: "Graphics & Video Editing",
    description: "Reels, ads, posters, thumbnails, brand kits.",
    href: "/services",
  },
  {
    id: 2,
    kicker: "Consistency",
    title: "Social Media Management",
    description: "Calendar, posting, workflows, insights.",
    href: "/services",
  },
  {
    id: 3,
    kicker: "Performance",
    title: "Digital Marketing",
    description: "Meta/Google campaigns, tracking, reporting.",
    href: "/services",
  },
  {
    id: 4,
    kicker: "Build",
    title: "Web Development",
    description: "Fast websites & landing pages that convert.",
    href: "/services",
  },
  {
    id: 5,
    kicker: "Bundle",
    title: "All-in Growth Retainer",
    description: "Content + ads + web — one roadmap.",
    href: "/services",
  },
];

export const serviceFeatures = {
  "Graphics & Video Editing": [
    "Reels, ads, posters, thumbnails, and launch creatives",
    "Fast edit turnaround for campaign and content needs",
    "Brand-aligned templates for repeatable publishing",
    "Caption-safe layouts optimized for social platforms",
    "Revision cycles focused on clarity and performance",
  ],
  "Social Media Management": [
    "Monthly content calendar planning and publishing rhythm",
    "Caption writing, scheduling, and asset coordination",
    "Workflow support for approvals and feedback loops",
    "Weekly review of what is performing and why",
    "Consistent execution that keeps your brand active",
  ],
  "Digital Marketing": [
    "Meta and Google campaign setup with clear objectives",
    "Creative-testing support for better click-through rates",
    "Tracking, reporting, and actionable optimization notes",
    "Lead-generation and awareness campaign structures",
    "Performance monitoring tied to business outcomes",
  ],
  "Web Development": [
    "Landing pages and websites built for fast loading",
    "Conversion-focused sections with clear CTAs",
    "Responsive layouts for mobile, tablet, and desktop",
    "SEO-ready structure and clean user journeys",
    "Launch support for updates, fixes, and polish",
  ],
  "All-in Growth Retainer": [
    "One joined-up roadmap across content, ads, and web",
    "Priority execution with ongoing strategic direction",
    "Weekly review cadence and monthly growth reporting",
    "Cross-channel consistency in design and messaging",
    "Single partner accountability for delivery and results",
  ],
};

export const portfolioData = [
  {
    id: 1,
    title: "Poster Series",
    category: "posters",
    thumbnail: "/images/portfolio/p1.jpg",
    description: "12 creatives, brand consistency",
  },
  {
    id: 2,
    title: "Reel Editing",
    category: "videos",
    thumbnail: "/images/portfolio/p2.jpg",
    description: "Hook + captions, higher retention",
    videoUrl: "https://www.instagram.com/phoneoseller/reel/DV6Dup1gQe9/",
  },
  {
    id: 3,
    title: "Lead Funnel",
    category: "web",
    thumbnail: "/images/portfolio/p3.jpg",
    description: "Landing + ads, better conversion",
  },
  {
    id: 4,
    title: "Brand Photos",
    category: "photos",
    thumbnail: "/images/portfolio/p4.jpg",
    description: "Clean product photography",
  },
  {
    id: 5,
    title: "Website Build",
    category: "web",
    thumbnail: "/images/portfolio/p5.jpg",
    description: "SEO + speed, more inquiries",
  },
  {
    id: 6,
    title: "Ad Creatives",
    category: "posters",
    thumbnail: "/images/portfolio/p6.jpg",
    description: "High CTR ad designs",
  },
];

export const testimonialsData = [
  {
    id: 1,
    clientName: "Rahul S.",
    serviceType: "Social Media",
    reviewText:
      "Design came on time, edits were crisp, our page finally looks premium.",
    rating: 5,
  },
  {
    id: 2,
    clientName: "Priya M.",
    serviceType: "Retainer",
    reviewText:
      "They built a complete system for us. Weekly rhythm is solid and consistent.",
    rating: 5,
  },
  {
    id: 3,
    clientName: "Amit K.",
    serviceType: "Web + Ads",
    reviewText:
      "Our landing page started converting better. Clean, fast, and focused.",
    rating: 5,
  },
];

export const clientChips = [
  "Retail",
  "Real Estate",
  "Clinics",
  "Education",
  "Restaurants",
  "Startups",
  "Creators",
  "Events",
];
