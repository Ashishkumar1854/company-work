// //used phone and new phones done

// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import FinanceBanner from "@/components/FinanceBanner";
// import HomeClient from "@/components/HomeClient";

// import {
//   API_ENDPOINTS,
//   normalizeStoreInfo,
//   normalizeUsedPhone,
//   normalizeNewPhones,
//   normalizeAccessoryItems,
//   applySoldStatus,
//   type PhoneItem,
//   type StoreInfo,
//   type SoldItem,
// } from "@/lib/api";

// type Props = {
//   type: "used" | "new" | "accessory";
// };

// export default function ListingPageClient({ type }: Props) {
//   const [store, setStore] = useState<StoreInfo | null>(null);
//   const [usedPhones, setUsedPhones] = useState<PhoneItem[]>([]);
//   const [newPhones, setNewPhones] = useState<PhoneItem[]>([]);
//   const [accessories, setAccessories] = useState<PhoneItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;

//     async function load() {
//       try {
//         const [storeRes, oiRes, npRes, soldRes] = await Promise.all([
//           fetch(API_ENDPOINTS.store).then(r => r.json()),
//           fetch(API_ENDPOINTS.storeOI).then(r => r.json()),
//           fetch(API_ENDPOINTS.storeNP).then(r => r.json()),
//           fetch(API_ENDPOINTS.sold).then(r => r.json()),
//         ]);

//         if (!active) return;

//         setStore(normalizeStoreInfo(storeRes));

//         const used = applySoldStatus(
//           (storeRes.used_phones || []).map(normalizeUsedPhone),
//           soldRes as SoldItem[]
//         );

//         setUsedPhones(used);
//         setNewPhones(normalizeNewPhones(npRes));
//         setAccessories(normalizeAccessoryItems(oiRes));

//       } catch (e) {
//         console.error("Listing load error:", e);
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       active = false;
//     };
//   }, []);

//   if (loading || !store) return null;

//   return (
//     <div className="min-h-screen bg-[#f7f4ef]">
//       <Navbar storeName={store.name} />

//       <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//         <Hero
//           title={store.name}
//           slogan={store.slogan}
//           description={store.description}
//           imageUrl={store.bannerUrl}
//         />

//         <FinanceBanner phoneNumber="9039933984" />

//         <HomeClient
//           usedPhones={usedPhones}
//           newPhones={newPhones}
//           accessories={accessories}
//           accessoriesCount={accessories.length}
//           initialTab={
//             type === "new"
//               ? "new"
//               : type === "accessory"
//               ? "accessories"
//               : "used"
//           }
//         />
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FinanceBanner from "@/components/FinanceBanner";
import HomeClient from "@/components/HomeClient";

import {
  API_ENDPOINTS,
  normalizeStoreInfo,
  normalizeUsedPhone,
  normalizeNewPhones,
  normalizeAccessoryItems,
  applySoldStatus,
  type PhoneItem,
  type StoreInfo,
  type SoldItem,
} from "@/lib/api";

type Props = {
  type: "used" | "new" | "accessories";
};

function pickFirstArray(candidates: any[]): any[] {
  for (const value of candidates) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function extractAccessories(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  return pickFirstArray([
    payload.items,
    payload.data?.items,
    payload.other_items,
    payload.data?.other_items,
    payload.result?.items,
  ]);
}

export default function ListingPageClient({ type }: Props) {
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [usedPhones, setUsedPhones] = useState<PhoneItem[]>([]);
  const [newPhones, setNewPhones] = useState<PhoneItem[]>([]);
  const [accessories, setAccessories] = useState<PhoneItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchJson(url: string) {
      try {
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          console.error("❌ API Failed:", url, res.status);
          return null;
        }

        return await res.json();
      } catch (err) {
        console.error("❌ Fetch error:", url, err);
        return null;
      }
    }

    async function load() {
      try {
        console.log("🚀 Fetching all APIs...");

        const [storeRes, oiRes, npRes, soldRes] = await Promise.all([
          fetchJson(API_ENDPOINTS.store),
          fetchJson(API_ENDPOINTS.storeOIProxy),
          fetchJson(API_ENDPOINTS.storeNP),
          fetchJson(API_ENDPOINTS.sold),
        ]);

        if (!active) return;

        console.log("📦 STORE RESPONSE:", storeRes);
        console.log("📦 STORE OI RESPONSE (Accessories API):", oiRes);
        console.log("📦 NEW PHONES RESPONSE:", npRes);
        console.log("📦 SOLD RESPONSE:", soldRes);

        // ================= STORE =================
        if (!storeRes) throw new Error("Store API failed");

        const normalizedStore = normalizeStoreInfo(storeRes);
        setStore(normalizedStore);
        console.log("🏬 Normalized Store:", normalizedStore);

        // ================= USED =================
        const usedRaw = Array.isArray(storeRes?.used_phones)
          ? storeRes.used_phones
          : [];

        console.log("📱 Raw Used Phones Count:", usedRaw.length);

        const soldItems = Array.isArray(soldRes) ? (soldRes as SoldItem[]) : [];

        const used = applySoldStatus(
          usedRaw.map(normalizeUsedPhone),
          soldItems,
        );

        console.log("📱 Final Used Phones Count:", used.length);

        // ================= NEW =================
        const newPhonesData = normalizeNewPhones(npRes || []);
        console.log("🆕 New Phones Count:", newPhonesData.length);

        // ================= ACCESSORIES (ULTRA SAFE FIX) =================

        let accessoriesRaw = extractAccessories(oiRes);

        if (accessoriesRaw.length > 0) {
          console.log(
            "🎧 Accessories from storeOI response:",
            accessoriesRaw.length,
          );
        }

        if (accessoriesRaw.length === 0) {
          const fallbackFromStore = extractAccessories(storeRes);
          if (fallbackFromStore.length > 0) {
            accessoriesRaw = fallbackFromStore;
            console.warn(
              "⚠️ storeOI had no items. Using store fallback:",
              accessoriesRaw.length,
            );
          }
        }

        if (accessoriesRaw.length === 0) {
          const bust = `${API_ENDPOINTS.storeOIProxy}${
            API_ENDPOINTS.storeOIProxy.includes("?") ? "&" : "?"
          }_=${Date.now()}`;
          const oiRetryRes = await fetchJson(bust);
          if (!active) return;

          accessoriesRaw = extractAccessories(oiRetryRes);
          console.warn(
            "⚠️ Retried storeOI because first response had no accessories:",
            accessoriesRaw.length,
          );
        }

        if (accessoriesRaw.length === 0) {
          console.warn("❌ Accessories not found in any known response shape");
        }

        console.log("🎧 FINAL Raw Accessories Count:", accessoriesRaw.length);

        const accessoriesData = normalizeAccessoryItems(accessoriesRaw);

        console.log(
          "🎧 FINAL Normalized Accessories Count:",
          accessoriesData.length,
        );

        // ================= SET STATE =================
        setUsedPhones(used);
        setNewPhones(newPhonesData);
        setAccessories(accessoriesData);
      } catch (e) {
        console.error("❌ Listing load error:", e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  // ================= CATEGORY VISIBILITY =================

  const visibleCategories = useMemo(() => {
    if (!store?.categories) return [];

    const combined = [...usedPhones, ...newPhones];

    return store.categories.filter((cat: any) =>
      combined.some(
        (item: any) =>
          Array.isArray(item.raw?.categories) &&
          item.raw.categories.some((c: any) => Number(c.id) === Number(cat.id)),
      ),
    );
  }, [store?.categories, usedPhones, newPhones]);

  // ================= APPLY FILTER =================

  const filteredUsed = selectedCategoryId
    ? usedPhones.filter((item: any) =>
        item.raw?.categories?.some(
          (c: any) => Number(c.id) === Number(selectedCategoryId),
        ),
      )
    : usedPhones;

  const filteredNew = selectedCategoryId
    ? newPhones.filter((item: any) =>
        item.raw?.categories?.some(
          (c: any) => Number(c.id) === Number(selectedCategoryId),
        ),
      )
    : newPhones;

  const filteredAccessories = accessories;

  // ================= SAFE RENDER =================

  if (loading) return null;

  if (!store) {
    return <div className="p-10 text-center">Store not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar storeName={store.name} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <Hero
          title={store.name}
          slogan={store.slogan}
          description={store.description}
          imageUrl={store.bannerUrl}
          categories={visibleCategories}
          financeEnabled={store.financeEnabled}
          social={store.social}
          onCategorySelect={(id) => setSelectedCategoryId(id)}
        />

        {store.financeEnabled && <FinanceBanner phoneNumber="9039933984" />}

        <HomeClient
          usedPhones={filteredUsed}
          newPhones={filteredNew}
          accessories={filteredAccessories}
          accessoriesCount={filteredAccessories.length}
          initialTab={type}
        />
      </main>
    </div>
  );
}
