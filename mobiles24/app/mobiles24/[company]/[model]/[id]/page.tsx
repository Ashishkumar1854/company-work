//app/mobiles24/[company]/[model]/[id]/page.tsx
import ProductDetailsClient from "@/components/ProductDetailsClient";

type Props = {
  params: Promise<{
    company: string;
    model: string;
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  return (
    <ProductDetailsClient
      company={decodeURIComponent(resolvedParams.company)}
      model={decodeURIComponent(resolvedParams.model)}
      id={resolvedParams.id}
    />
  );
}
