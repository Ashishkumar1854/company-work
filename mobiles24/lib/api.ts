// //used phones and new phones done
// /* ================= API ================= */

// export const API_ENDPOINTS = {
//   store: "https://super.phoneo.in/api/v3/store/mobiles24",
//   storeOI: "https://super.phoneo.in/api/v3/storeOI/mobiles24",
//   storeNP: "https://super.phoneo.in/api/v3/storeNP/mobiles24",
//   sold: "https://super.phoneo.in/api/v3/store/mobiles24/sold",
// };

// /* ================= TYPES ================= */

// export type StoreInfo = {
//   name: string;
//   slogan: string;
//   description: string;
//   bannerUrl?: string;
//   raw: any;
// };

// export type PhoneItem = {
//   id: string;
//   company: string;
//   model: string;
//   storage: string;
//   price: string;
//   image: string;
//   source: "used" | "new" | "accessory";
//   isSold?: boolean;
//   raw: any;
// };

// export type SoldItem = {
//   id?: string | number;
// };

// /* ================= HELPERS ================= */

// const str = (v: any) =>
//   typeof v === "string" || typeof v === "number" ? String(v) : "";

// /* ================= IMAGE ================= */

// export function normalizeImageUrl(url?: string): string {
//   if (!url) return "https://phoneo.site/placeholder-phone.png";
//   if (url.startsWith("http")) return url;
//   return `https://phoneo.site${url.startsWith("/") ? "" : "/"}${url}`;
// }

// /* ================= STORE ================= */

// export function normalizeStoreInfo(data: any): StoreInfo {
//   return {
//     name: str(data?.ShopName || "Mobiles24"),
//     slogan: str(data?.Slogan || "Best Deal Every Day 😄"),
//     description: str(data?.Address || ""),
//     bannerUrl: normalizeImageUrl(
//       data?.Banner || data?.Cover || data?.Thumb
//     ),
//     raw: data,
//   };
// }

// /* ================= USED PHONES ================= */

// export function normalizeUsedPhone(item: any): PhoneItem {
//   return {
//     id: `used-${item.id}`,
//     company: str(item.Company),
//     model: str(item.Model),
//     storage: str(item.Variant),
//     price: str(item.SalePrice),
//     image: normalizeImageUrl(
//       item?.image?.[0]?.path || item?.Thumb
//     ),
//     source: "used",
//     raw: item,
//   };
// }

// /* ================= NEW PHONES (✅ VARIANTS VISIBLE) ================= */

// function pickNewPhoneImage(p: any, v: any): string {
//   return normalizeImageUrl(
//     v?.Images?.[0]?.path ||
//     v?.Images?.[0] ||
//     v?.Thumb ||
//     p?.Thumb
//   );
// }

// export function normalizeNewPhones(storeNP: any): PhoneItem[] {
//   const products = Array.isArray(storeNP) ? storeNP : [];
//   const out: PhoneItem[] = [];

//   for (const p of products) {
//     const variants = Array.isArray(p.variant) ? p.variant : [];

//     // 🔥 EACH VARIANT = 1 CARD
//     for (const v of variants) {
//       out.push({
//         id: `new-${p.id}-${v.id}`,
//         company: str(p.Company),
//         model: str(p.Model),
//         storage: str(v.Storage || v.Variant || ""),
//         price: str(v.SalePrice || ""),
//         image: pickNewPhoneImage(p, v),
//         source: "new",
//         raw: { product: p, variant: v },
//       });
//     }
//   }

//   return out;
// }

// /* ================= ACCESSORIES (✅ REAL API) ================= */

// export function normalizeAccessoryItems(storeOI: any): PhoneItem[] {
//   const items = Array.isArray(storeOI?.items)
//     ? storeOI.items
//     : [];

//   return items.map((a: any) => {
//     const unit = Array.isArray(a.units) ? a.units[0] : null;

//     return {
//       id: `acc-${a.id}`,
//       company: str(a.Company || "Accessory"),
//       model: str(a.Model),
//       storage: "",
//       price: unit ? str(unit.SalePrice) : "",
//       image: normalizeImageUrl(a.Thumb),
//       source: "accessory",
//       raw: a,
//     };
//   });
// }

// /* ================= SOLD ================= */

// export function applySoldStatus(
//   phones: PhoneItem[],
//   soldItems: SoldItem[]
// ) {
//   const soldIds = new Set(
//     soldItems.map(s => String(s.id))
//   );

//   return phones.map(p => {
//     if (p.source !== "used") return p;
//     return {
//       ...p,
//       isSold: soldIds.has(p.id.replace("used-", "")),
//     };
//   });
// }

/* ================= API ================= */

export const API_ENDPOINTS = {
  store: "https://super.phoneo.in/api/v3/store/mobiles24",
  storeOI: "https://super.phoneo.in/api/v3/storeOI/mobiles24",
  storeOIProxy: "/api/mobiles24/accessories",
  storeNP: "https://super.phoneo.in/api/v3/storeNP/mobiles24",
  sold: "https://super.phoneo.in/api/v3/store/mobiles24/sold",
};

/* ================= TYPES ================= */

export type StoreInfo = {
  name: string;
  slogan: string;
  description: string;
  bannerUrl?: string;

  categories: { id: number; name: string }[];
  financeEnabled: boolean;

  social: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    google?: string;
    whatsapp?: string;
  };

  raw: any;
};

export type PhoneItem = {
  id: string;
  company: string;
  model: string;
  storage: string;
  price: string;
  image: string;
  source: "used" | "new" | "accessory";
  isSold?: boolean;
  raw: any;
};

export type SoldItem = {
  id?: string | number;
};

/* ================= HELPERS ================= */

const str = (v: any) =>
  typeof v === "string" || typeof v === "number" ? String(v) : "";

/* ================= IMAGE NORMALIZER ================= */

export function normalizeImageUrl(url?: string): string {
  if (!url) return "https://phoneo.site/placeholder-phone.png";
  if (url.startsWith("http")) return url;
  return `https://phoneo.site${url.startsWith("/") ? "" : "/"}${url}`;
}

/* ================= PWEB PARSE ================= */

function parsePWeb(raw?: string) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/* ================= STORE ================= */

export function normalizeStoreInfo(data: any): StoreInfo {
  const pweb = parsePWeb(data?.PWebDetails);

  return {
    name: str(data?.ShopName || "Mobiles24"),
    slogan: str(data?.Slogan || ""),
    description: str(data?.Address || ""),
    bannerUrl: normalizeImageUrl(
      data?.Banner || data?.Cover || data?.Thumb
    ),

    categories: Array.isArray(data?.categories)
      ? data.categories.map((c: any) => ({
          id: c.id,
          name: str(c.Name),
        }))
      : [],

    financeEnabled: str(data?.Finance) === "1",

    social: {
      instagram: data?.InstaLink,
      youtube: pweb?.YoutubeLink,
      facebook: pweb?.FacebookLink,
      google: pweb?.GoogleReviewLink,
      whatsapp: pweb?.WhatsAppChannelLink,
    },

    raw: data,
  };
}

/* ================= USED PHONES (UNCHANGED WORKING) ================= */

export function normalizeUsedPhone(item: any): PhoneItem {
  const img =
    item?.image?.[0]?.path ||
    item?.Thumb ||
    item?.DummyThumb;

  return {
    id: `used-${item.id}`,
    company: str(item.Company),
    model: str(item.Model),
    storage: str(item.Variant),
    price: str(item.SalePrice),
    image: normalizeImageUrl(img),
    source: "used",
    raw: item,
  };
}

/* ================= NEW PHONES (UNCHANGED) ================= */

function pickNewPhoneImage(p: any, v: any): string {
  return normalizeImageUrl(
    v?.Images?.[0]?.path ||
    v?.Images?.[0] ||
    v?.Thumb ||
    p?.Thumb
  );
}

export function normalizeNewPhones(storeNP: any): PhoneItem[] {
  const products = Array.isArray(storeNP) ? storeNP : [];
  const out: PhoneItem[] = [];

  for (const p of products) {
    const variants = Array.isArray(p.variant) ? p.variant : [];

    for (const v of variants) {
      out.push({
        id: `new-${p.id}-${v.id}`,
        company: str(p.Company),
        model: str(p.Model),
        storage: str(v.Storage || v.Variant || ""),
        price: str(v.SalePrice || ""),
        image: pickNewPhoneImage(p, v),
        source: "new",
        raw: { product: p, variant: v },
      });
    }
  }

  return out;
}

/* ================= ACCESSORIES (⚠️ EXACT SAME AS YOUR OLD WORKING CODE) ================= */

export function normalizeAccessoryItems(items: any[]): PhoneItem[] {
  const list = Array.isArray(items) ? items : [];

  console.log("🟢 ACCESSORIES RAW items:", list.length);

  return list.map((a: any) => {
    const unit = Array.isArray(a.units)
      ? a.units.find((u: any) => u.Status === "InStock")
      : null;

    const img =
      a.Thumb ||
      a.DummyThumb ||
      unit?.Thumb;

    return {
      id: `acc-${a.id}`,
      company: str(a.Company || "Accessory"),
      model: str(a.Model || a.Name || "Accessory"),
      storage: "",
      price: unit ? str(unit.SalePrice) : "Ask price",
      image: normalizeImageUrl(img),
      source: "accessory",
      raw: a,
    };
  });
}

/* ================= SOLD ================= */

export function applySoldStatus(
  phones: PhoneItem[],
  soldItems: SoldItem[]
) {
  const soldIds = new Set(
    soldItems.map((s) => String(s.id))
  );

  return phones.map((p) => {
    if (p.source !== "used") return p;
    return {
      ...p,
      isSold: soldIds.has(p.id.replace("used-", "")),
    };
  });
}
