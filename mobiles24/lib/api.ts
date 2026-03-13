
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

const FALLBACK_IMAGE = "/placeholder-phone.svg";

const BRAND_IMAGE_MAP: Record<string, string> = {
  apple: "/brand/apple.png",
  asus: "/brand/asuss.png",
  blackbarry: "/brand/blackbarry.png",
  blackberry: "/brand/blackbarry.png",
  coolpad: "/brand/coolpad.png",
  gionee: "/brand/gionee.png",
  google: "/brand/google.png",
  honor: "/brand/honor.png",
  htc: "/brand/htc.png",
  huawei: "/brand/huawei.png",
  infinix: "/brand/infinix.png",
  intex: "/brand/intex.png",
  iqoo: "/brand/iqoo.png",
  itel: "/brand/itel.png",
  jio: "/brand/jio.png",
  karbon: "/brand/karbon.png",
  karbonn: "/brand/karbon.png",
  lava: "/brand/lava.png",
  lenovo: "/brand/lenovo.png",
  letv: "/brand/letv.png",
  lg: "/brand/lg.png",
  lyf: "/brand/lyf.png",
  mi: "/brand/mi.png",
  xiaomi: "/brand/mi.png",
  redmi: "/brand/mi.png",
  micromax: "/brand/micromax.png",
  motorola: "/brand/motorolaa.png",
  nokia: "/brand/nokiaa.png",
  nothing: "/brand/nothing.png",
  oneplus: "/brand/oneplus.png",
  oppo: "/brand/oppo.png",
  panasonic: "/brand/panasonic.png",
  poco: "/brand/poco.png",
  realme: "/brand/realme.png",
  samsung: "/brand/samsung.png",
  sony: "/brand/sony.png",
  tecno: "/brand/tecno.png",
  vivo: "/brand/vivo.png",
};

function normalizeBrandKey(company?: string): string {
  return String(company || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function getBrandFallbackImage(company?: string): string {
  const key = normalizeBrandKey(company);
  if (!key) return FALLBACK_IMAGE;
  return BRAND_IMAGE_MAP[key] || FALLBACK_IMAGE;
}

export function normalizeImageUrl(url?: string): string {
  if (!url) return FALLBACK_IMAGE;
  let safe = String(url).trim();
  if (!safe) return FALLBACK_IMAGE;

  if (safe.startsWith("/api/") || safe.startsWith("/placeholder-")) {
    return safe;
  }

  if (safe.startsWith("//")) {
    safe = `https:${safe}`;
  } else if (safe.startsWith("phoneo.site/")) {
    safe = `https://${safe}`;
  } else if (safe.startsWith("www.")) {
    safe = `https://${safe}`;
  }

  // Some API items return paths ending with "." (missing extension)
  // which break image loading. Add a default extension.
  if (safe.endsWith(".")) safe = `${safe}jpg`;

  // Some relative API paths have no extension at all.
  // If the final segment has no ".", add a safe default extension.
  const lastSegment = safe.split("/").pop() || "";
  if (!lastSegment.includes(".") && !safe.startsWith("http")) {
    safe = `${safe}.jpg`;
  }

  if (safe.startsWith("http")) return encodeURI(safe);
  safe = `https://phoneo.site${safe.startsWith("/") ? "" : "/"}${safe}`;
  return encodeURI(safe);
}

export function wrapImageProxy(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("/api/") || url.startsWith("/placeholder-")) return url;
  if (url.startsWith("http")) {
    return `/api/mobiles24/image?url=${encodeURIComponent(url)}`;
  }
  return url;
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

export async function getStoreInfo(): Promise<StoreInfo> {
  const res = await fetch(API_ENDPOINTS.store, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch store info: ${res.status}`);
  }

  const data = await res.json();
  return normalizeStoreInfo(data);
}

/* ================= USED PHONES  ================= */

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

/* ================= NEW PHONES ================= */

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

/* ================= ACCESSORIES  ================= */

export function normalizeAccessoryItems(items: any[]): PhoneItem[] {
  const list = Array.isArray(items) ? items : [];

  console.log("🟢 ACCESSORIES RAW items:", list.length);

  return list.map((a: any) => {
    const units = Array.isArray(a.units) ? a.units : [];

    const inStockUnit =
      units.find((u: any) => {
        const status = String(u?.Status || "")
          .toLowerCase()
          .replace(/\s+/g, "");
        return status === "instock";
      }) ||
      units.find((u: any) => {
        const price = Number(String(u?.SalePrice ?? "").replace(/[^\d]/g, ""));
        return Number.isFinite(price) && price > 0;
      }) ||
      null;

    const img =
      a?.image?.[0]?.path ||
      a?.Images?.[0]?.path ||
      a?.Images?.[0] ||
      a?.Thumb ||
      a?.DummyThumb ||
      inStockUnit?.Thumb ||
      inStockUnit?.image?.[0]?.path ||
      inStockUnit?.Images?.[0]?.path ||
      inStockUnit?.Images?.[0] ||
      "";

    const company = str(a.Company || "Accessory");
    const resolvedPrice =
      str(inStockUnit?.SalePrice) || str(a?.SalePrice) || "Ask price";
    const normalizedImage = normalizeImageUrl(img);

    return {
      id: `acc-${a.id}`,
      company,
      model: str(a.Model || a.Name || "Accessory"),
      storage: "",
      price: resolvedPrice,
      image:
        normalizedImage === FALLBACK_IMAGE
          ? getBrandFallbackImage(company)
          : normalizedImage,
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
