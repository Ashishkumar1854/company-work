"use client";

import {
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Youtube,
} from "lucide-react";

type StoreFooterProps = {
  storeName: string;
  address?: string;
  phoneNumber?: string;
  social?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    google?: string;
    whatsapp?: string;
  };
};

export default function StoreFooter({
  storeName,
  address,
  phoneNumber = "9039933984",
  social,
}: StoreFooterProps) {
  const year = new Date().getFullYear();
  const hasAddress = Boolean(address?.trim());
  const mapsLink = hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address as string)}`
    : "https://maps.google.com";

  return (
    <footer className="mt-0 w-full overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-zinc-950 to-black text-white shadow-xl">
      <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
        <h3 className="text-center text-base font-semibold tracking-wide">{storeName}</h3>

        <div className="mx-auto mt-2 grid max-w-3xl grid-cols-3 gap-1.5 sm:gap-2">
          <a
            href={`tel:${phoneNumber}`}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center backdrop-blur transition hover:bg-white/10"
          >
            <Phone className="mx-auto mb-0.5 h-2.5 w-2.5 text-white/90 sm:h-3 sm:w-3" />
            <p className="text-[9px] font-semibold sm:text-[10px]">Call</p>
          </a>

          <a
            href={social?.whatsapp || `https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center backdrop-blur transition hover:bg-white/10"
          >
            <MessageCircle className="mx-auto mb-0.5 h-2.5 w-2.5 text-white/90 sm:h-3 sm:w-3" />
            <p className="text-[9px] font-semibold sm:text-[10px]">WhatsApp</p>
          </a>

          <a
            href={social?.instagram || "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center backdrop-blur transition hover:bg-white/10"
          >
            <Instagram className="mx-auto mb-0.5 h-2.5 w-2.5 text-white/90 sm:h-3 sm:w-3" />
            <p className="text-[9px] font-semibold sm:text-[10px]">Insta</p>
          </a>
        </div>

        <div className="mx-auto mt-2 flex max-w-2xl justify-center gap-1 border-t border-white/10 pt-1.5">
          {social?.facebook && (
            <a
              href={social.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/10 p-1 transition hover:bg-white/20"
            >
              <Facebook className="h-2.5 w-2.5" />
            </a>
          )}

          {social?.whatsapp && (
            <a
              href={social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/10 p-1 transition hover:bg-white/20"
            >
              <MessageCircle className="h-2.5 w-2.5" />
            </a>
          )}

          {social?.youtube && (
            <a
              href={social.youtube}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/10 p-1 transition hover:bg-white/20"
            >
              <Youtube className="h-2.5 w-2.5" />
            </a>
          )}

          {social?.google && (
            <a
              href={social.google}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/10 p-1 transition hover:bg-white/20"
            >
              <MapPin className="h-2.5 w-2.5" />
            </a>
          )}
        </div>

        <div className="mx-auto mt-2 max-w-md rounded-md border border-white/10 bg-white/5 p-1.5">
          <div className="flex items-start gap-1.5">
            <div className="rounded-full bg-white/10 p-1">
              <MapPin className="h-2.5 w-2.5 text-white/90" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-white/60">Visit Store</p>
              <p className="mt-0.5 text-[10px] font-medium text-white/90 sm:text-[11px]">
                {hasAddress ? address : "Dhamtari, Chhattisgarh, India"}
              </p>
            </div>
          </div>

          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 flex items-center justify-center gap-1 rounded-md bg-white/10 px-2 py-1 text-center text-[10px] font-semibold transition hover:bg-white/20 sm:text-[11px]"
          >
            <Navigation className="h-2.5 w-2.5" />
            Get Direction
          </a>
        </div>

        <div className="mt-2 space-y-0 text-center text-[9px] text-white/70 sm:text-[10px]">
          <p className="font-semibold text-white/85">Powered By Phoneo</p>
          <p>Copyright ©{year} PHONEO All Right Reserved</p>
        </div>
      </div>
    </footer>
  );
}
