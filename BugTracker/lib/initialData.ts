import { ChecklistSection } from "./types";

const now = new Date().toISOString();

export const initialSections: ChecklistSection[] = [
  {
    id: "navbar",
    title: "Navbar",
    items: [
      { id: "nav-1", title: "Logo visible", status: "pending", createdAt: now },
      { id: "nav-2", title: "Tracker button links correctly", status: "pending", createdAt: now }
    ]
  },
  {
    id: "hero",
    title: "Hero",
    items: [{ id: "hero-1", title: "Hero section loads", status: "pending", createdAt: now }]
  },
  {
    id: "homepage",
    title: "Homepage",
    items: [{ id: "home-1", title: "Primary content renders", status: "pending", createdAt: now }]
  },
  {
    id: "social-icons",
    title: "Social Icons",
    items: [{ id: "social-1", title: "Icons align across breakpoints", status: "pending", createdAt: now }]
  },
  {
    id: "offers",
    title: "Offers",
    items: [{ id: "offers-1", title: "Offers list is visible", status: "pending", createdAt: now }]
  },
  {
    id: "used-phones",
    title: "Used Phones",
    items: [{ id: "used-1", title: "Used phones cards render", status: "pending", createdAt: now }]
  },
  {
    id: "new-phones",
    title: "New Phones",
    items: [{ id: "new-1", title: "New phones cards render", status: "pending", createdAt: now }]
  },
  {
    id: "accessories",
    title: "Accessories",
    items: [{ id: "acc-1", title: "Accessories page section renders", status: "pending", createdAt: now }]
  },
  {
    id: "search-bar",
    title: "Search Bar",
    items: [{ id: "search-1", title: "Search input accepts typing", status: "pending", createdAt: now }]
  },
  {
    id: "companies-filter",
    title: "Companies Filter",
    items: [{ id: "companies-1", title: "Company filter updates list", status: "pending", createdAt: now }]
  },
  {
    id: "finance",
    title: "Finance",
    items: [{ id: "finance-1", title: "Finance options calculate correctly", status: "pending", createdAt: now }]
  },
  {
    id: "product-card",
    title: "Product Card",
    items: [{ id: "card-1", title: "Product card metadata is complete", status: "pending", createdAt: now }]
  },
  {
    id: "product-details",
    title: "Product Details",
    items: [{ id: "details-1", title: "Details page shows full specification", status: "pending", createdAt: now }]
  },
  {
    id: "wishlist",
    title: "Wishlist",
    items: [{ id: "wishlist-1", title: "Wishlist add and remove actions work", status: "pending", createdAt: now }]
  },
  {
    id: "product-images",
    title: "Product Images",
    items: [{ id: "images-1", title: "Image gallery and zoom work", status: "pending", createdAt: now }]
  },
  {
    id: "book-now",
    title: "Book Now",
    items: [{ id: "book-1", title: "Booking CTA starts checkout flow", status: "pending", createdAt: now }]
  }
];
