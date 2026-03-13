import { NextResponse } from "next/server";

const UPSTREAM = "https://super.phoneo.in/api/v3/storeOI/mobiles24";
let lastGoodPayload: { items: unknown[] } | null = null;

function extractAccessoryItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;

  const nestedData =
    typeof data.data === "object" && data.data !== null
      ? (data.data as Record<string, unknown>)
      : null;

  const nestedResult =
    typeof data.result === "object" && data.result !== null
      ? (data.result as Record<string, unknown>)
      : null;

  const candidates = [
    data.items,
    nestedData?.items,
    nestedData,
    data.other_items,
    nestedData?.other_items,
    nestedResult?.items,
  ];

  for (const value of candidates) {
    if (Array.isArray(value)) return value;
  }

  return [];
}

export async function GET() {
  const attempts: RequestInit[] = [
    {
      cache: "no-store",
      headers: {
        "User-Agent": "curl/8.7.1",
        Accept: "*/*",
      },
    },
    {
      cache: "no-store",
      headers: {
        "User-Agent": "curl/8.7.1",
      },
    },
    {
      cache: "no-store",
    },
  ];

  let lastPayload: unknown = null;

  for (let i = 0; i < attempts.length; i += 1) {
    const init = attempts[i];
    const url = `${UPSTREAM}${UPSTREAM.includes("?") ? "&" : "?"}_=${Date.now()}-${i}`;

    try {
      const res = await fetch(url, init);
      if (!res.ok) continue;

      const json = (await res.json()) as unknown;
      lastPayload = json;

      const items = extractAccessoryItems(json);
      if (items.length > 0) {
        const stable = { items };
        lastGoodPayload = stable;
        return NextResponse.json(stable, { status: 200 });
      }
    } catch {
      // Try next strategy.
    }
  }

  // If current request fails, prefer last known good payload over empty response.
  if (lastGoodPayload && lastGoodPayload.items.length > 0) {
    return NextResponse.json(lastGoodPayload, { status: 200 });
  }

  const fallbackItems = extractAccessoryItems(lastPayload);
  return NextResponse.json({ items: fallbackItems }, { status: 200 });
}
