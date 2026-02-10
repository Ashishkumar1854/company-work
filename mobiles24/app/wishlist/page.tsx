import Navbar from "@/components/Navbar";
import WishlistClient from "@/components/WishlistClient";
import { getStoreInfo } from "@/lib/api";

export default async function WishlistPage() {
  const store = await getStoreInfo();
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar storeName={store.name} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <section className="rounded-3xl bg-white px-6 py-6 shadow-sm">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Wishlist
          </h1>
          <p className="text-sm text-zinc-500">
            Your saved phones will appear here.
          </p>
        </section>
        <WishlistClient />
      </main>
    </div>
  );
}
