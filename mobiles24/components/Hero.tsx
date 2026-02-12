//components/Hero.tsx
// "use client";

// import { useState } from "react";
// import { Facebook, Youtube, Phone, MapPin } from "lucide-react";

// type HeroProps = {
//   title: string;
//   slogan: string;
//   description: string;
//   imageUrl?: string;

//   categories?: { id: number; name: string }[];
//   financeEnabled?: boolean;

//   social?: {
//     instagram?: string;
//     youtube?: string;
//     facebook?: string;
//     google?: string;
//     whatsapp?: string;
//   };

//   onCategorySelect?: (id: number | null) => void;
// };

// export default function Hero({
//   title,
//   slogan,
//   description,
//   imageUrl,
//   categories = [],
//   financeEnabled,
//   social,
//   onCategorySelect,
// }: HeroProps) {
//   const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

//   return (
//     <section
//       className="relative overflow-hidden rounded-3xl bg-black text-white shadow-lg"
//       style={
//         imageUrl
//           ? {
//               backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.4)), url(${imageUrl})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }
//           : undefined
//       }
//     >
//       <div className="relative px-6 py-12 space-y-4">
//         <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
//         <p className="text-2xl text-white/90">{slogan}</p>

//         <div className="flex items-center gap-2 text-white/70 text-sm">
//           <MapPin size={16} />
//           {description}
//         </div>

//         {financeEnabled && (
//           <div className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold">
//             Easy Finance Available
//           </div>
//         )}

//         {/* CATEGORY CHIPS (AUTO HIDE IF NO PRODUCT) */}
//         {categories.length > 0 && (
//           <div className="flex flex-wrap gap-2 pt-3">
//             {categories.map((cat) => (
//               <button
//                 key={cat.id}
//                 onClick={() => {
//                   const newId = activeCategoryId === cat.id ? null : cat.id;

//                   setActiveCategoryId(newId);
//                   onCategorySelect?.(newId);
//                 }}
//                 className={`px-4 py-1 rounded-full text-xs font-medium transition ${
//                   activeCategoryId === cat.id
//                     ? "bg-white text-black"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* RIGHT VERTICAL ICONS */}
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
//         {social?.whatsapp && (
//           <a href={social.whatsapp} target="_blank">
//             <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <Phone className="text-green-600" />
//             </div>
//           </a>
//         )}

//         {social?.google && (
//           <a href={social.google} target="_blank">
//             <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <MapPin className="text-red-500" />
//             </div>
//           </a>
//         )}

//         {social?.facebook && (
//           <a href={social.facebook} target="_blank">
//             <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <Facebook className="text-blue-600" />
//             </div>
//           </a>
//         )}

//         {social?.youtube && (
//           <a href={social.youtube} target="_blank">
//             <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <Youtube className="text-red-600" />
//             </div>
//           </a>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { Facebook, Youtube, Phone, MapPin } from "lucide-react";

type HeroProps = {
  title: string;
  slogan: string;
  description: string;
  imageUrl?: string;
  categories?: { id: number; name: string }[];
  financeEnabled?: boolean;
  social?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    google?: string;
    whatsapp?: string;
  };
  onCategorySelect?: (id: number | null) => void;
};

export default function Hero({
  title,
  slogan,
  description,
  imageUrl,
  categories = [],
  financeEnabled,
  social,
  onCategorySelect,
}: HeroProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-black text-white shadow-lg"
      style={
        imageUrl
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.4)), url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="relative px-6 py-12 space-y-4">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-2xl text-white/90">{slogan}</p>

        <div className="flex items-center gap-2 text-white/70 text-sm">
          <MapPin size={16} />
          {description}
        </div>

        {financeEnabled && (
          <div className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold">
            Easy Finance Available
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const newId = activeCategoryId === cat.id ? null : cat.id;
                  setActiveCategoryId(newId);
                  onCategorySelect?.(newId);
                }}
                className={`px-4 py-1 rounded-full text-xs font-medium transition ${
                  activeCategoryId === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Icons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {social?.whatsapp && (
          <a href={social.whatsapp} target="_blank">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center">
              <Phone className="text-green-600" />
            </div>
          </a>
        )}
        {social?.google && (
          <a href={social.google} target="_blank">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center">
              <MapPin className="text-red-500" />
            </div>
          </a>
        )}
        {social?.facebook && (
          <a href={social.facebook} target="_blank">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center">
              <Facebook className="text-blue-600" />
            </div>
          </a>
        )}
        {social?.youtube && (
          <a href={social.youtube} target="_blank">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center">
              <Youtube className="text-red-600" />
            </div>
          </a>
        )}
      </div>

      {/* Horizontal Icons ALWAYS visible */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {social?.google && (
          <a
            href={social.google}
            target="_blank"
            className="bg-white text-black px-4 py-2 rounded-full text-sm"
          >
            Google
          </a>
        )}
        {social?.instagram && (
          <a
            href={social.instagram}
            target="_blank"
            className="bg-pink-500 px-4 py-2 rounded-full text-sm"
          >
            Instagram
          </a>
        )}
        {social?.whatsapp && (
          <a
            href={social.whatsapp}
            target="_blank"
            className="bg-green-500 px-4 py-2 rounded-full text-sm"
          >
            WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
