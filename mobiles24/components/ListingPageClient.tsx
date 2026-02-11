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

import { useEffect, useState } from "react";
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
  type: "used" | "new" | "accessory";
};

export default function ListingPageClient({ type }: Props) {
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [usedPhones, setUsedPhones] = useState<PhoneItem[]>([]);
  const [newPhones, setNewPhones] = useState<PhoneItem[]>([]);
  const [accessories, setAccessories] = useState<PhoneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        console.log("========== API CALL START ==========");

        const [storeRes, oiRes, npRes, soldRes] = await Promise.all([
          fetch(API_ENDPOINTS.store).then((r) => r.json()),
          fetch(API_ENDPOINTS.storeOI).then((r) => r.json()), // ✅ ACCESSORIES SOURCE
          fetch(API_ENDPOINTS.storeNP).then((r) => r.json()),
          fetch(API_ENDPOINTS.sold).then((r) => r.json()),
        ]);

        if (!active) return;

        // STORE
        setStore(normalizeStoreInfo(storeRes));

        // USED
        const usedRaw = Array.isArray(storeRes?.used_phones)
          ? storeRes.used_phones
          : [];

        const used = applySoldStatus(
          usedRaw.map(normalizeUsedPhone),
          soldRes as SoldItem[]
        );

        // NEW (DON'T TOUCH)
        const newPhonesData = normalizeNewPhones(npRes);

        // ✅ ACCESSORIES (REAL + STABLE)
        const accessoriesData = normalizeAccessoryItems(
          Array.isArray(oiRes?.items) ? oiRes.items : []
        );

        console.log("🟢 ACCESSORIES FINAL COUNT:", accessoriesData.length);

        setUsedPhones(used);
        setNewPhones(newPhonesData);
        setAccessories(accessoriesData);

        console.log("========== API CALL END ==========");
      } catch (e) {
        console.error("Listing load error:", e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading || !store) return null;

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar storeName={store.name} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <Hero
          title={store.name}
          slogan={store.slogan}
          description={store.description}
          imageUrl={store.bannerUrl}
        />

        <FinanceBanner phoneNumber="9039933984" />

        <HomeClient
          usedPhones={usedPhones}
          newPhones={newPhones}
          accessories={accessories}
          accessoriesCount={accessories.length}
          initialTab={
            type === "new"
              ? "new"
              : type === "accessory"
              ? "accessories"
              : "used"
          }
        />
      </main>
    </div>
  );
}
