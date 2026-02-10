import ListingPageClient from "@/components/ListingPageClient";

export default function AccessoriesPage() {
  return (
    <ListingPageClient
      initialTab="accessories"
      showActions={false}
      heroTitle="Accessories"
      heroSlogan="Accessories that match your style."
      heroDescription="Cases, chargers, earbuds, and more."
    />
  );
}
