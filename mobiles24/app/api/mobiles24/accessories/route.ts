import { NextResponse } from "next/server";

const UPSTREAM = "https://super.phoneo.in/api/v3/storeOI/mobiles24";

function hasAccessoryItems(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Record<string, unknown>;

  return (
    Array.isArray(data.items) ||
    (typeof data.data === "object" &&
      data.data !== null &&
      Array.isArray((data.data as Record<string, unknown>).items))
  );
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

  for (const init of attempts) {
    try {
      const res = await fetch(UPSTREAM, init);
      if (!res.ok) continue;

      const json = (await res.json()) as unknown;
      lastPayload = json;

      if (hasAccessoryItems(json)) {
        return NextResponse.json(json, { status: 200 });
      }
    } catch {
      // Try next strategy.
    }
  }

  return NextResponse.json(lastPayload ?? { items: [] }, { status: 200 });
}
