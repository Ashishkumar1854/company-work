type BottomCTAProps = {
  phoneNumber: string;
  whatsappNumber: string;
  message: string;
};

export default function BottomCTA({
  phoneNumber,
  whatsappNumber,
  message,
}: BottomCTAProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/90 px-4 py-3 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="flex-1 rounded-full bg-black px-4 py-3 text-center text-xs font-semibold text-white"
        >
          Call
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-full bg-[#16a34a] px-4 py-3 text-center text-xs font-semibold text-white"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
