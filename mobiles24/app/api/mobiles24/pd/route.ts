import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get("brand")?.trim();
  const model = request.nextUrl.searchParams.get("model")?.trim();

  if (!brand || !model) {
    return NextResponse.json(
      { status: false, message: "brand and model are required" },
      { status: 400 },
    );
  }

  const upstream = `https://super.phoneo.in/api/PD/${encodeURIComponent(
    brand.toLowerCase(),
  )}/${encodeURIComponent(model)}`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { status: false, message: "upstream failed" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { status: false, message: "failed to load phone details" },
      { status: 500 },
    );
  }
}
