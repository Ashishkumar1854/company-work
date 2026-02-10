import ProductDetailsClient from "@/components/ProductDetailsClient";

type PageProps = {
  params: { company: string; model: string; id: string };
};

export default function ProductDetailsPage({ params }: PageProps) {
  return <ProductDetailsClient params={params} />;
}
