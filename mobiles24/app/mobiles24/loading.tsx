export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="border-b border-black/10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg text-white sm:h-11 sm:w-11">
            📱
          </span>
          <span className="text-3xl font-light tracking-[0.08em] text-white sm:text-5xl">
            MOBILES24
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
            ♡
          </span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-black" />
        <p className="mt-6 text-2xl font-semibold text-zinc-900">
          Searching products...
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Loading used phones, new phones, and accessories.
        </p>
      </div>
    </div>
  );
}
