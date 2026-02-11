//components/Hero.tsx
type HeroProps = {
  title: string;
  slogan: string;
  description: string;
  imageUrl?: string;
};

export default function Hero({ title, slogan, description, imageUrl }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-[#111111] px-6 py-10 text-white shadow-lg"
      style={
        imageUrl
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!imageUrl && (
        <>
          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#f2b705] opacity-80 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#0ea5e9] opacity-50 blur-3xl" />
        </>
      )}
      <div className="relative space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
          BestSellers
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-white/90">{slogan}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </section>
  );
}
