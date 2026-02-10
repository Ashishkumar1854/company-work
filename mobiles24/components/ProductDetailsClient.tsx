"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BottomCTA from "@/components/BottomCTA";
import {
  API_ENDPOINTS,
  applySoldStatus,
  normalizeAccessoryItems,
  normalizeNewPhones,
  normalizeStoreInfo,
  normalizeUsedPhone,
  type PhoneItem,
  type SoldItem,
} from "@/lib/api";
import WishlistToggle from "@/components/WishlistToggle";

const PHONE_NUMBER = "9039933984";
const WHATSAPP_NUMBER = "917803002677";
const MAP_URL =
  "https://maps.google.com/?q=Mobiles24%20Dhamtari%20Chhattisgarh";

type ProductDetailsClientProps = {
  params: { company: string; model: string; id: string };
};

export default function ProductDetailsClient({
  params,
}: ProductDetailsClientProps) {
  const [storeName, setStoreName] = useState("Mobiles24");
  const [phone, setPhone] = useState<PhoneItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        setStoreName(store.name);

        const usedPhonesRaw = Array.isArray(storeData?.used_phones)
          ? storeData.used_phones
          : Array.isArray(storeOIData?.used_phones)
          ? storeOIData.used_phones
          : [];
        const usedPhones = usedPhonesRaw.map(normalizeUsedPhone);
        const soldItems = Array.isArray(soldData) ? (soldData as SoldItem[]) : [];
        const usedPhonesWithSold = applySoldStatus(usedPhones, soldItems);

        const newPhones = normalizeNewPhones(storeNPData);
        const accessories = normalizeAccessoryItems(storeOIData);
        const allPhones = [...usedPhonesWithSold, ...newPhones, ...accessories];
        const found = allPhones.find((item) => String(item.id) === params.id);

        setPhone(found || null);
        setLoading(false);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Failed to load");
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName={storeName} />
        <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="h-80 rounded-3xl bg-zinc-200 animate-pulse" />
        </main>
      </div>
    );
  }

  if (error || !phone) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar storeName={storeName} />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm">
            <h1 className="font-display text-2xl font-semibold">
              Phone not found
            </h1>
            <p className="text-sm text-zinc-500">
              {error || "This product may have been removed."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const message = `Hi, I want to book this phone: ${phone.company} ${phone.model} ${phone.storage}. Price: ₹${phone.price}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  const condition =
    (phone.raw?.Condition as string) ||
    (phone.raw?.IsRepaired === 0 ? "Non Repaired" : "");
  const priceLabel = phone.priceHidden
    ? "Ask price"
    : phone.price
    ? `₹${phone.price}`
    : "Ask price";

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-20 sm:pb-0">
      <Navbar storeName={storeName} />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm sm:grid sm:grid-cols-2 sm:gap-6">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-100">
              {phone.image ? (
                <Image
                  src={phone.image}
                  alt={`${phone.company} ${phone.model}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                  No image
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg"
                aria-label="Call"
              >
                📞
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg"
                aria-label="Map"
              >
                📍
              </a>
            </div>
          </div>
          <div className="mt-5 space-y-4 sm:mt-0">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {phone.company}
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {phone.model}
              </h1>
              <p className="text-sm text-zinc-500">{phone.storage}</p>
              {condition && (
                <p className="text-xs font-semibold text-emerald-600">
                  {condition}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#f2b705]/10 px-4 py-3 text-lg font-semibold">
              {priceLabel}
            </div>
            {phone.isSold && (
              <div className="rounded-2xl bg-black px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Sold Out
                {phone.raw?.soldOn && (
                  <div className="mt-1 text-[10px] font-medium text-white/70">
                    Sold on {String(phone.raw.soldOn).slice(0, 10)}
                  </div>
                )}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full px-4 py-3 text-center text-sm font-semibold text-white ${
                  phone.isSold ? "bg-zinc-400 pointer-events-none" : "bg-[#16a34a]"
                }`}
              >
                Book Now
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className={`rounded-full px-4 py-3 text-center text-sm font-semibold ${
                  phone.isSold
                    ? "border border-black/10 text-zinc-400 pointer-events-none"
                    : "border border-black/10"
                }`}
              >
                Call Now
              </a>
            </div>
            <WishlistToggle phone={phone} />
            <div className="text-xs text-zinc-500">
              Easy finance available. Same‑day delivery in select areas.
            </div>
          </div>
        </div>
      </main>
      <BottomCTA
        phoneNumber={PHONE_NUMBER}
        whatsappNumber={WHATSAPP_NUMBER}
        message={message}
      />
    </div>
  );
}
