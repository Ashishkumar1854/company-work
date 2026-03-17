"use client";

// ============================================
// FILE: Testimonials.jsx
// PURPOSE: Shows client reviews to reinforce delivery quality and trust
// USES: framer-motion, Card, testimonialsData
// ============================================

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { testimonialsData } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const buildRow = (items, length = 3) => {
  if (!items.length) return [];
  return Array.from({ length }, (_, index) => items[index % items.length]);
};

export default function Testimonials() {
  const topRow = buildRow(testimonialsData, 3);
  const bottomRow = buildRow([...testimonialsData].reverse(), 3);

  return (
    <motion.section {...motionProps} className="py-4 sm:py-6">
      {/* ── Section: Testimonials Container ── */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-2 text-center">
          {/* ── Section: Testimonials Heading ── */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
            Testimonials
          </p>
          <h2>Words of praise from teams we help grow.</h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-muted">
            Real feedback from brands who trust us with their creative delivery.
          </p>
        </div>

        {/* ── Section: Testimonials Marquee ── */}
        <div className="testimonial-wrap flex flex-col gap-4 overflow-hidden">
          {/* Desktop: marquee track | Mobile: single scrolling track */}
          <div className="testimonial-track testimonial-track-left">
            {[...topRow, ...topRow].map((item, index) => (
              <Card
                key={`${item.id}-top-${index}`}
                className="testimonial-card"
              >
                <div className="flex h-full flex-col p-4">
                  {/* ── Section: Quote Icon + Rating ── */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-brand">
                      <span className="text-xl leading-none">&ldquo;</span>
                    </div>
                    <p className="text-xs tracking-[0.2em] text-brand">
                      {"★".repeat(item.rating)}
                    </p>
                  </div>

                  <p className="testimonial-text mt-3 text-sm leading-6 text-gray-body">
                    {item.reviewText}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[0.7rem] font-bold text-ink">
                      {getInitials(item.clientName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.clientName}
                      </p>
                      <p className="text-xs text-gray-muted">
                        {item.serviceType}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Second row — hidden on mobile */}
          <div className="testimonial-track testimonial-track-right hidden sm:flex">
            {[...bottomRow, ...bottomRow].map((item, index) => (
              <Card
                key={`${item.id}-bottom-${index}`}
                className="testimonial-card"
              >
                <div className="flex h-full flex-col p-4">
                  {/* ── Section: Quote Icon + Rating ── */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-brand">
                      <span className="text-xl leading-none">&ldquo;</span>
                    </div>
                    <p className="text-xs tracking-[0.2em] text-brand">
                      {"★".repeat(item.rating)}
                    </p>
                  </div>

                  <p className="testimonial-text mt-3 text-sm leading-6 text-gray-body">
                    {item.reviewText}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[0.7rem] font-bold text-ink">
                      {getInitials(item.clientName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.clientName}
                      </p>
                      <p className="text-xs text-gray-muted">
                        {item.serviceType}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ─── Desktop styles (sm and above) ─── */
        .testimonial-wrap {
          --card-w: 300px;
          --card-gap: 20px;
          --cards: 3;
          --row-w: calc(
            (var(--card-w) * var(--cards)) +
              (var(--card-gap) * (var(--cards) - 1))
          );
          width: var(--row-w);
          margin: 0 auto;
          overflow: hidden;
        }

        .testimonial-track {
          display: flex;
          gap: var(--card-gap);
          width: calc((var(--row-w) * 2) + var(--card-gap));
          will-change: transform;
        }

        .testimonial-card {
          width: var(--card-w);
          flex: 0 0 var(--card-w);
          min-height: 160px;
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
        }

        .testimonial-wrap:hover .testimonial-track {
          animation-play-state: paused;
        }

        .testimonial-track-left {
          animation: marquee-left 28s linear infinite;
        }

        .testimonial-track-right {
          animation: marquee-right 30s linear infinite;
        }

        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-1 * (var(--row-w) + var(--card-gap))));
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(calc(-1 * (var(--row-w) + var(--card-gap))));
          }
          to {
            transform: translateX(0);
          }
        }

        .testimonial-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        /* ─── Mobile styles ─── */
        @media (max-width: 639px) {
          .testimonial-wrap {
            --card-w: calc(100vw - 48px); /* full viewport minus padding */
            --card-gap: 16px;
            --cards: 3; /* keep 3 duplicated cards in the track for seamless loop */
            --row-w: calc(
              (var(--card-w) * var(--cards)) +
                (var(--card-gap) * (var(--cards) - 1))
            );
            width: calc(100vw - 32px); /* section visible width */
            margin: 0 auto;
            overflow: hidden;
          }

          .testimonial-card {
            width: var(--card-w);
            flex: 0 0 var(--card-w);
            min-height: 160px;
          }

          /* On mobile animate one card width + gap per step */
          @keyframes marquee-left {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(
                calc(-1 * (var(--row-w) + var(--card-gap)))
              );
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-track-left,
          .testimonial-track-right {
            animation-duration: 0.01ms;
            animation-iteration-count: 1;
          }
        }
      `}</style>
    </motion.section>
  );
}
