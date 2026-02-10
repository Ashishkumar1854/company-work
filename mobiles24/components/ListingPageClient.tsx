"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FinanceBanner from "@/components/FinanceBanner";
import HomeClient from "@/components/HomeClient";
import {
  API_ENDPOINTS,
  applySoldStatus,
  getAccessoriesCount,
  isAccessory,
  normalizeAccessoryItems,
  normalizeNewPhones,
  normalizeStoreInfo,
  normalizeUsedPhone,
  type PhoneItem,
  type SoldItem,
  type StoreInfo,
} from "@/lib/api";

type ListingPageClientProps = {
  initialTab?: "used" | "new" | "accessories";
  showActions?: boolean;
  heroTitle?: string;
  heroSlogan?: string;
  heroDescription?: string;
};

type LoadState = {
  store: StoreInfo | null;
  usedPhones: PhoneItem[];
  newPhones: PhoneItem[];
  accessories: PhoneItem[];
  accessoriesCount: number;
  loading: boolean;
  error: string | null;
};

export default function ListingPageClient({
  initialTab = "used",
  showActions = true,
  heroTitle,
  heroSlogan,
  heroDescription,
}: ListingPageClientProps) {
  const [state, setState] = useState<LoadState>({
    store: null,
    usedPhones: [],
    newPhones: [],
    accessories: [],
    accessoriesCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [storeRes, storeOIRes, storeNPRes, soldRes] = await Promise.all([
          fetch(API_ENDPOINTS.store, { cache: "no-store" }),
          fetch(API_ENDPOINTS.storeOI, { cache: "no-store" }),
          fetch(API_ENDPOINTS.storeNP, { cache: "no-store" }),
          fetch(API_ENDPOINTS.sold, { cache: "no-store" }),
        ]);

        const [storeData, storeOIData, storeNPData, soldData] =
          await Promise.all([
            storeRes.json(),
            storeOIRes.json(),
            storeNPRes.json(),
            soldRes.json(),
          ]);

        if (!active) return;

        const store = normalizeStoreInfo(storeData);
        const usedPhonesRaw = Array.isArray(storeData?.used_phones)
          ? storeData.used_phones
          : Array.isArray(storeOIData?.used_phones)
          ? storeOIData.used_phones
          : [];
        const usedPhones = usedPhonesRaw.map(normalizeUsedPhone);
        const accessoriesList = normalizeAccessoryItems(storeOIData);
        const newPhones = normalizeNewPhones(storeNPData);
        const soldItems = Array.isArray(soldData) ? (soldData as SoldItem[]) : [];
        const usedPhonesWithSold = applySoldStatus(usedPhones, soldItems);
        const accessoriesFallback = usedPhonesWithSold.filter((item) =>
          isAccessory(item, store.categories || [])
        );
        const accessories =
          accessoriesList.length > 0 ? accessoriesList : accessoriesFallback;
        const accessoriesCount =
          accessoriesList.length > 0
            ? accessoriesList.length
            : getAccessoriesCount(storeData, usedPhonesWithSold, store.categories || []);

        // storeOIData is fetched intentionally (as requested) for parity with reference API usage
        void storeOIData;

        setState({
          store,
          usedPhones: usedPhonesWithSold,
          newPhones,
          accessories,
          accessoriesCount,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "Failed to load data",
        }));
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName="Mobiles24" />
        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
          <div className="h-40 rounded-3xl bg-zinc-200 animate-pulse" />
          <div className="h-20 rounded-3xl bg-zinc-200 animate-pulse" />
          <div className="h-14 rounded-2xl bg-zinc-200 animate-pulse" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-zinc-200 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (state.error || !state.store) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName="Mobiles24" />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm">
            <h1 className="font-display text-2xl font-semibold">
              Failed to load
            </h1>
            <p className="text-sm text-zinc-500">
              {state.error || "Unable to fetch APIs"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const title = heroTitle || state.store.name;
  const slogan = heroSlogan || state.store.slogan;
  const description = heroDescription || state.store.description;

  const accessories = state.accessories || [];

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar storeName={state.store.name} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <Hero
          title={title}
          slogan={slogan}
          description={description}
          imageUrl={state.store.bannerUrl}
        />
        <FinanceBanner phoneNumber="9039933984" imageUrl="/group-3193.webp" />
        <HomeClient
          usedPhones={state.usedPhones}
          newPhones={state.newPhones}
          accessories={accessories}
          accessoriesCount={state.accessoriesCount}
          initialTab={initialTab}
          showActions={showActions}
        />
      </main>
    </div>
  );
}
