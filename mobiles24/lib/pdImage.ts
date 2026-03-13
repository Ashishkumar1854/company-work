import { normalizeImageUrl } from "@/lib/api";

const PD_CACHE_TTL_MS = 10 * 60 * 1000;
const PD_FAILURE_TTL_MS = 5 * 60 * 1000;
const PD_MAX_CONCURRENT = 4;

const pdCache = new Map<string, { ts: number; value: string }>();
const pdFailures = new Map<string, number>();
const pdInflight = new Map<string, Promise<string>>();
let pdActive = 0;
const pdQueue: Array<() => void> = [];

const dequeuePd = () => {
  const next = pdQueue.shift();
  if (next) next();
};

const withPdSlot = async <T,>(fn: () => Promise<T>): Promise<T> => {
  if (pdActive >= PD_MAX_CONCURRENT) {
    await new Promise<void>((resolve) => pdQueue.push(resolve));
  }
  pdActive += 1;
  try {
    return await fn();
  } finally {
    pdActive -= 1;
    dequeuePd();
  }
};

export const getPdImage = async (
  brand: string,
  model: string,
): Promise<string> => {
  const key = `${brand.toLowerCase()}|${model.toLowerCase()}`;
  const now = Date.now();

  const cached = pdCache.get(key);
  if (cached && now - cached.ts < PD_CACHE_TTL_MS) {
    return cached.value;
  }

  const failedAt = pdFailures.get(key);
  if (failedAt && now - failedAt < PD_FAILURE_TTL_MS) {
    return "";
  }

  const inflight = pdInflight.get(key);
  if (inflight) return inflight;

  const promise = withPdSlot(async () => {
    try {
      const res = await fetch(
        `/api/mobiles24/pd?brand=${encodeURIComponent(
          brand,
        )}&model=${encodeURIComponent(model)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        pdFailures.set(key, Date.now());
        return "";
      }
      const json = await res.json();
      const candidate =
        json?.data?.thumbnail || json?.data?.phone_images?.[0] || "";
      const safe = normalizeImageUrl(candidate);
      if (safe && safe !== "/placeholder-phone.svg") {
        pdCache.set(key, { ts: Date.now(), value: safe });
        return safe;
      }
      pdFailures.set(key, Date.now());
      return "";
    } catch {
      pdFailures.set(key, Date.now());
      return "";
    } finally {
      pdInflight.delete(key);
    }
  });

  pdInflight.set(key, promise);
  return promise;
};
