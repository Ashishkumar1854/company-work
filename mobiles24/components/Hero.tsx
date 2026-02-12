//components/Hero.tsx

"use client";

import { useState } from "react";
import { Facebook, Youtube, Phone, MapPin } from "lucide-react";

type HeroProps = {
  title: string;
  slogan: string;
  description: string;
  imageUrl?: string;
  categories?: { id: number; name: string }[];
  financeEnabled?: boolean;
  social?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    google?: string;
    whatsapp?: string;
  };
  onCategorySelect?: (id: number | null) => void;
  phoneNumber?: string;
};

export default function Hero({
  title,
  slogan,
  description,
  imageUrl,
  categories = [],
  financeEnabled,
  social,
  onCategorySelect,
  phoneNumber = "9039933984",
}: HeroProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const hasAnySocial = Boolean(
    social?.whatsapp || social?.google || social?.facebook || social?.youtube,
  );

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-black text-white shadow-lg"
      style={
        imageUrl
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.4)), url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="relative space-y-3 px-5 py-7 pr-16 sm:px-6 sm:py-10 sm:pr-24 lg:py-12">
        <h1 className="text-[2.1rem] font-semibold leading-none sm:text-4xl">
          {title}
        </h1>
        <p className="text-[1.05rem] text-white/90 sm:text-2xl">{slogan}</p>

        <div className="flex items-center gap-2 text-xs text-white/75 sm:text-sm">
          <MapPin size={16} />
          <span className="line-clamp-2">{description}</span>
        </div>

        {financeEnabled && (
          <div className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold sm:text-sm">
            Easy Finance Available
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const newId = activeCategoryId === cat.id ? null : cat.id;
                  setActiveCategoryId(newId);
                  onCategorySelect?.(newId);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition sm:px-4 ${
                  activeCategoryId === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Mobile social chips */}
        {hasAnySocial && (
          <div className="flex flex-wrap gap-2 pt-1 sm:hidden">
            {social?.google && (
              <a
                href={social.google}
                target="_blank"
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black"
              >
                Google
              </a>
            )}
            {social?.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                className="rounded-full bg-pink-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                Instagram
              </a>
            )}
            {social?.whatsapp && (
              <a
                href={social.whatsapp}
                target="_blank"
                className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      {/* Vertical social icons (mobile + desktop) */}
      {hasAnySocial && (
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2.5 sm:right-4 sm:gap-3">
          {phoneNumber && (
            <a href={`tel:${phoneNumber}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md sm:h-12 sm:w-12">
                <Phone className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
            </a>
          )}
          {social?.google && (
            <a href={social.google} target="_blank">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md sm:h-12 sm:w-12">
                <MapPin className="h-5 w-5 text-red-500 sm:h-6 sm:w-6" />
              </div>
            </a>
          )}
          {social?.facebook && (
            <a href={social.facebook} target="_blank">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md sm:h-12 sm:w-12">
                <Facebook className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
            </a>
          )}
          {social?.youtube && (
            <a href={social.youtube} target="_blank">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md sm:h-12 sm:w-12">
                <Youtube className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
              </div>
            </a>
          )}
        </div>
      )}

      {/* Desktop horizontal chips */}
      <div className="absolute bottom-4 left-6 hidden gap-3 sm:flex">
        {social?.google && (
          <a
            href={social.google}
            target="_blank"
            className="rounded-full bg-white px-4 py-2 text-sm text-black"
          >
            Google
          </a>
        )}
        {social?.instagram && (
          <a
            href={social.instagram}
            target="_blank"
            className="rounded-full bg-pink-500 px-4 py-2 text-sm"
          >
            Instagram
          </a>
        )}
        {social?.whatsapp && (
          <a
            href={social.whatsapp}
            target="_blank"
            className="rounded-full bg-green-500 px-4 py-2 text-sm"
          >
            WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
