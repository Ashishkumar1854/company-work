export const API_ENDPOINTS = {
  store: "https://super.phoneo.in/api/v3/store/mobiles24",
  storeOI: "https://super.phoneo.in/api/v3/storeOI/mobiles24",
  storeNP: "https://super.phoneo.in/api/v3/storeNP/mobiles24",
  sold: "https://super.phoneo.in/api/v3/store/mobiles24/sold",
};

const STORE_URL = API_ENDPOINTS.store;
const NEW_PHONES_URL = API_ENDPOINTS.storeNP;
const SOLD_URL = API_ENDPOINTS.sold;

export type StoreInfo = {
  name: string;
  slogan: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  categories?: { id: number; Name: string }[];
  raw: unknown;
};

export type PhoneItem = {
  id: string;
  company: string;
  model: string;
  storage: string;
  price: string;
  image: string;
  isSold?: boolean;
  source: "used" | "new" | "accessory";
  priceHidden?: boolean;
  raw: Record<string, unknown>;
};

async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 120 },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

function getString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export function normalizeStoreInfo(data: any): StoreInfo {
  const name =
    getString(data?.ShopName) ||
    getString(data?.StoreName) ||
    getString(data?.store_name) ||
    getString(data?.Store) ||
    getString(data?.store) ||
    getString(data?.Name) ||
    getString(data?.name) ||
    "Mobiles24";

  const slogan =
    getString(data?.Slogan) ||
    getString(data?.Slogan) ||
    getString(data?.slogan) ||
    getString(data?.Tagline) ||
    getString(data?.tagline) ||
    "Smart phones, honest prices.";

  const description =
    getString(data?.Address) ||
    getString(data?.Description) ||
    getString(data?.description) ||
    getString(data?.address) ||
    "Original devices with trusted service and easy finance.";

  const logoUrl =
    normalizeImageUrl(getString(data?.Thumb)) ||
    getString(data?.Logo) ||
    getString(data?.logo) ||
    getString(data?.StoreLogo) ||
    getString(data?.store_logo) ||
    getString(data?.Image) ||
    getString(data?.image) ||
    "";

  const bannerUrl =
    normalizeImageUrl(getString(data?.Thumb)) ||
    getString(data?.Banner) ||
    getString(data?.banner) ||
    getString(data?.Cover) ||
    getString(data?.cover) ||
    getString(data?.Background) ||
    getString(data?.background) ||
    "";

  const categories = Array.isArray(data?.categories) ? data.categories : [];

  return { name, slogan, description, logoUrl, bannerUrl, categories, raw: data };
}

export function findArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  const keys = ["data", "items", "mobiles", "phones", "results", "Products"];
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export function normalizeImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const trimmed = url.replace(/^\/+/, "").replace(/\.$/, "");
  return `https://phoneo.in/${trimmed}`;
}

function parsePriceHide(value: any): boolean {
  if (typeof value === "string") {
    return value.toLowerCase().includes("true");
  }
  return Boolean(value);
}

function minUnitPrice(units: any[]): string {
  const unitPrices = units
    .map((unit: any) => Number(unit?.SalePrice))
    .filter((p: number) => !Number.isNaN(p) && p > 0);
  return unitPrices.length > 0 ? String(Math.min(...unitPrices)) : "";
}

function unitsSold(units: any[]): boolean {
  if (!Array.isArray(units) || units.length === 0) return false;
  return units.every(
    (unit: any) => String(unit?.Status).toLowerCase() === "sold"
  );
}

export function normalizeUsedPhone(item: any): PhoneItem {
  const id =
    getString(item?.id) ||
    getString(item?.ID) ||
    getString(item?.Product_id) ||
    getString(item?.product_id) ||
    getString(item?.pid) ||
    `${item?.Company || item?.company || "used"}-${item?.Model || item?.model || "0"}`;

  const company = getString(item?.Company) || getString(item?.company);
  const model = getString(item?.Model) || getString(item?.model);
  const storage =
    getString(item?.Variant) ||
    getString(item?.Storage) ||
    getString(item?.Ram) ||
    getString(item?.ROM) ||
    "";

  const price = getString(item?.SalePrice) || getString(item?.Price) || "";
  const image =
    normalizeImageUrl(
      getString(item?.Thumb) ||
        getString(item?.Image) ||
        getString(item?.image?.[0]?.Image) ||
        ""
    ) || "";
  const priceHidden = parsePriceHide(item?.PriceHide);

  return {
    id,
    company,
    model,
    storage,
    price,
    image,
    source: "used",
    priceHidden,
    raw: item,
  };
}

export function normalizeNewPhones(data: any): PhoneItem[] {
  const products = Array.isArray(data) ? data : findArray(data);
  const items: PhoneItem[] = [];

  for (const product of products) {
    const company = getString(product?.Company) || getString(product?.company);
    const model = getString(product?.Model) || getString(product?.model);
    const productThumb = normalizeImageUrl(
      getString(product?.Thumb) || getString(product?.DummyThumb) || ""
    );
    const variants = Array.isArray(product?.variant) ? product.variant : [];

    for (const variant of variants) {
      const variantId = getString(variant?.id) || getString(variant?.ID) || "";
      const id = variantId ? `new-${variantId}` : `new-${company}-${model}-${variant?.Storage || ""}`;
      const storage = getString(variant?.Storage) || getString(variant?.Variant) || "";
      const image = normalizeImageUrl(
        getString(variant?.Thumb) ||
          getString(variant?.DummyThumb) ||
          productThumb ||
          ""
      );
      const units = Array.isArray(variant?.units) ? variant.units : [];
      const minPrice = minUnitPrice(units);

      const salePrice =
        getString(variant?.SalePrice) ||
        getString(variant?.Price) ||
        minPrice ||
        "";
      const isSold = unitsSold(units);

      items.push({
        id,
        company,
        model,
        storage,
        price: salePrice,
        image,
        isSold,
        source: "new",
        raw: { ...product, variant },
      });
    }
  }

  return items;
}

export function normalizeAccessoryItems(data: any): PhoneItem[] {
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data?.items)
    ? data.data.items
    : [];

  return items.map((item: any) => {
    const id = item?.id ? `acc-${item.id}` : `acc-${item?.Company}-${item?.Model}`;
    const company = getString(item?.Company) || "Other";
    const model = getString(item?.Model) || getString(item?.Name) || "Item";
    const storage = getString(item?.Variant) || getString(item?.Storage) || "";
    const units = Array.isArray(item?.units) ? item.units : [];
    const price =
      getString(item?.SalePrice) ||
      getString(item?.Price) ||
      minUnitPrice(units) ||
      "";
    const image = normalizeImageUrl(
      getString(item?.Thumb) ||
        getString(item?.DummyThumb) ||
        getString(item?.units?.[0]?.Thumb) ||
        ""
    );
    const isSold = unitsSold(units);

    return {
      id,
      company,
      model,
      storage,
      price,
      image,
      isSold,
      source: "accessory",
      raw: item,
    };
  });
}

export async function getStoreInfo(): Promise<StoreInfo> {
  const data = await fetchJson(STORE_URL);
  return normalizeStoreInfo(data);
}

export async function getNewPhones(): Promise<PhoneItem[]> {
  const data = await fetchJson(NEW_PHONES_URL);
  return normalizeNewPhones(data);
}

export type SoldItem = {
  id?: string | number;
  Company?: string;
  Model?: string;
  Variant?: string;
  SoldDate?: string;
};

export async function getSoldItems(): Promise<SoldItem[]> {
  const data = await fetchJson(SOLD_URL);
  return findArray(data) as SoldItem[];
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

export function applySoldStatus(
  phones: PhoneItem[],
  soldItems: SoldItem[]
) {
  const soldIds = new Set<string>();
  const soldCombos = new Set<string>();
  const soldDates = new Map<string, string>();

  for (const item of soldItems) {
    const id = item?.id ? String(item.id) : "";
    const soldDate = item?.SoldDate ? String(item.SoldDate) : "";
    if (id) {
      soldIds.add(id);
      if (soldDate) soldDates.set(id, soldDate);
    }

    const company = item?.Company ? String(item.Company) : "";
    const model = item?.Model ? String(item.Model) : "";
    const storage = item?.Variant ? String(item.Variant) : "";

    if (company && model) {
      const fullKey = `${normalizeKey(company)}|${normalizeKey(
        model
      )}|${normalizeKey(storage)}`;
      const partialKey = `${normalizeKey(company)}|${normalizeKey(model)}|`;
      soldCombos.add(fullKey);
      soldCombos.add(partialKey);
      if (soldDate) {
        soldDates.set(fullKey, soldDate);
        soldDates.set(partialKey, soldDate);
      }
    }
  }

  return phones.map((phone) => {
    const comboFull = `${normalizeKey(phone.company)}|${normalizeKey(
      phone.model
    )}|${normalizeKey(phone.storage)}`;
    const comboPartial = `${normalizeKey(phone.company)}|${normalizeKey(
      phone.model
    )}|`;

    const isSold =
      soldIds.has(String(phone.id)) ||
      soldCombos.has(comboFull) ||
      soldCombos.has(comboPartial);

    const soldOn =
      soldDates.get(String(phone.id)) ||
      soldDates.get(comboFull) ||
      soldDates.get(comboPartial);

    return { ...phone, isSold, raw: { ...phone.raw, soldOn } };
  });
}

export function isAccessory(
  item: PhoneItem,
  storeCategories: { id: number; Name: string }[] = []
): boolean {
  const categoryText = String(item.raw?.Category || "").toLowerCase();
  if (categoryText.includes("access")) return true;

  const catIds = Array.isArray(item.raw?.categories)
    ? item.raw.categories.map((c: any) => c?.id).filter(Boolean)
    : [];
  if (catIds.length === 0) return false;

  const nameMap = new Map(
    storeCategories.map((c) => [Number(c.id), String(c.Name || "")])
  );
  const matched = catIds
    .map((id: number) => nameMap.get(Number(id)) || "")
    .join(" ")
    .toLowerCase();

  return (
    matched.includes("cover") ||
    matched.includes("access") ||
    matched.includes("case") ||
    matched.includes("charger")
  );
}

export function getAccessoriesCount(
  storeData: any,
  phones: PhoneItem[],
  storeCategories: { id: number; Name: string }[] = []
): number {
  if (Array.isArray(storeData?.accessories)) return storeData.accessories.length;
  if (Array.isArray(storeData?.Accessories)) return storeData.Accessories.length;
  if (Array.isArray(storeData?.items)) {
    return storeData.items.filter((item: any) =>
      String(item?.Category || "")
        .toLowerCase()
        .includes("access")
    ).length;
  }
  return phones.filter((item) => isAccessory(item, storeCategories)).length;
}
