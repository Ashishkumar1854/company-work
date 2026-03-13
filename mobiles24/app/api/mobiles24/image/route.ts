import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url") || "";
  let target: URL | null = null;

  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json(
      { status: false, message: "invalid url" },
      { status: 400 },
    );
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return NextResponse.json(
      { status: false, message: "unsupported protocol" },
      { status: 400 },
    );
  }

  try {
    const upstreamHeaders = new Headers({
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    });

    // Some upstream image hosts reject server-side requests without browser-like
    // navigation headers. Mirror a normal image request so real thumbnails load.
    if (target.hostname.endsWith("phoneo.site")) {
      upstreamHeaders.set("Referer", "https://phoneo.site/");
      upstreamHeaders.set("Origin", "https://phoneo.site");
    }

    const res = await fetch(target.toString(), {
      cache: "no-store",
      headers: upstreamHeaders,
    });
    if (!res.ok) {
      return NextResponse.json(
        { status: false, message: "upstream failed" },
        { status: res.status },
      );
    }

    const contentType =
      res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { status: false, message: "failed to load image" },
      { status: 500 },
    );
  }
}
