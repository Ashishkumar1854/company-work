"use client";

// ============================================
// FILE: Services.jsx
// PURPOSE: Highlights core service offerings in a staggered editorial grid
// USES: framer-motion, react-icons, Link, Badge, Card, servicesData
// ============================================

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { servicesData } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

export default function Services() {
  const topRow = servicesData.slice(0, 3);
  const bottomRow = servicesData.slice(3);

  return (
    <motion.section {...motionProps} className="py-4 sm:py-6">
      {/* ── Section: Services Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 max-w-2xl space-y-1">
          {/* ── Section: Services Heading ── */}
          <h2>Our Services</h2>
        </div>

        <div className="space-y-4">
          {/* ── Section: Services Top Row ── */}
          <div className="grid gap-4 lg:grid-cols-3">
            {topRow.map((service) => (
              <Card key={service.id} className="hover:-translate-y-1">
                <div className="flex h-full flex-col p-5">
                  <Badge className="w-fit">{service.kicker}</Badge>
                  <h3 className="mt-4 text-[1.5rem]">{service.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-gray-muted">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-2 font-bold text-brand transition-transform duration-200 hover:translate-x-1"
                  >
                    <span>Get a quote</span>
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* ── Section: Services Bottom Row ── */}
          <div className="grid gap-4 lg:grid-cols-2">
            {bottomRow.map((service) => (
              <Card key={service.id} className="hover:-translate-y-1">
                <div className="flex h-full flex-col p-5">
                  <Badge className="w-fit">{service.kicker}</Badge>
                  <h3 className="mt-4 text-[1.5rem]">{service.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-gray-muted">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-2 font-bold text-brand transition-transform duration-200 hover:translate-x-1"
                  >
                    <span>Get a quote</span>
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
