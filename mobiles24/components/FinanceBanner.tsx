//components/FinanceBanner.tsx
type FinanceBannerProps = {
  phoneNumber: string;
  imageUrl?: string;
};

export default function FinanceBanner({ phoneNumber, imageUrl }: FinanceBannerProps) {
  return (
    <section className="relative flex items-center justify-between overflow-hidden rounded-3xl bg-[#e5e7eb] px-5 py-5">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#111827]">
          Easy Finances Available
        </p>
        <p className="text-xs text-[#111827]/70">Quick approval in minutes</p>
      </div>
      <a
        href={`tel:${phoneNumber}`}
        className="rounded-full bg-[#28c4d1] px-5 py-2 text-xs font-semibold text-white shadow"
      >
        Call Now
      </a>
      {imageUrl && (
        <div
          className="pointer-events-none absolute right-4 top-2 hidden h-16 w-28 rounded-xl bg-white/70 sm:block"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </section>
  );
}
