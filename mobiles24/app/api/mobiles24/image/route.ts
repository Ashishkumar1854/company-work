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
    const fetchImage = async (url: URL) => {
      if (
        url.hostname.endsWith("phoneo.site") ||
        url.hostname.endsWith("super.phoneo.in")
      ) {
        // Phoneo assets often require a phoneo.site referer even when hosted elsewhere.
        upstreamHeaders.set("Referer", "https://phoneo.site/mobiles24/Accessories");
        upstreamHeaders.set("Origin", "https://phoneo.site");
      } else {
        upstreamHeaders.delete("Referer");
        upstreamHeaders.delete("Origin");
      }
      return fetch(url.toString(), { cache: "no-store", headers: upstreamHeaders });
    };

    const candidates: URL[] = [];
    const seen = new Set<string>();
    const pushCandidate = (url: URL) => {
      const key = url.toString();
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push(url);
    };

    pushCandidate(target);

    const isPhoneoHost =
      target.hostname.endsWith("phoneo.site") ||
      target.hostname.endsWith("super.phoneo.in");

    if (isPhoneoHost) {
      const swapped = new URL(target.toString());
      swapped.hostname = target.hostname.endsWith("phoneo.site")
        ? "super.phoneo.in"
        : "phoneo.site";
      pushCandidate(swapped);

      const path = target.pathname || "";
      if (path.startsWith("/Phoneo/") && !path.includes("/PhoneoData/Public/")) {
        const withPublicA = new URL(target.toString());
        withPublicA.pathname = `/Phoneo/PhoneoData/Public${path.slice(
          "/Phoneo".length,
        )}`;
        pushCandidate(withPublicA);

        const withPublicB = new URL(target.toString());
        withPublicB.pathname = `/PhoneoData/Public${path.slice(
          "/Phoneo".length,
        )}`;
        pushCandidate(withPublicB);

        if (swapped) {
          const withPublicASwapped = new URL(withPublicA.toString());
          withPublicASwapped.hostname = swapped.hostname;
          pushCandidate(withPublicASwapped);

          const withPublicBSwapped = new URL(withPublicB.toString());
          withPublicBSwapped.hostname = swapped.hostname;
          pushCandidate(withPublicBSwapped);
        }
      }
    }

    let res: Response | null = null;
    for (const candidate of candidates) {
      res = await fetchImage(candidate);
      if (res.ok) break;
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        { status: false, message: "upstream failed" },
        { status: res ? res.status : 502 },
      );
    }

    const contentType =
      res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { status: false, message: "upstream not image" },
        { status: 502 },
      );
    }
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
