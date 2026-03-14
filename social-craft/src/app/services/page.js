// ============================================
// FILE: page.js
// PURPOSE: Presents detailed service offerings and closes with a booking CTA
// USES: react-icons, Button, Badge, Card, BookingForm, servicesData, serviceFeatures
// ============================================

import { FaArrowRight } from "react-icons/fa";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import BookingForm from "@/components/sections/BookingForm";
import { serviceFeatures, servicesData } from "@/lib/constants";

export const metadata = {
  title: "Services",
  description:
    "Explore Social Craft services for graphics, video editing, social media management, digital marketing, and web development.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Section: Services Page Hero ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
              Service stack
            </p>
            <h1>Our Services</h1>
            <p className="text-base leading-8 text-gray-muted sm:text-lg">
              Every offer is designed to help brands stay consistent, move
              faster, and make sharper decisions across creative and growth.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section: Expanded Services Grid ── */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4">
          {servicesData.map((service) => (
            <Card key={service.id}>
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.75fr] lg:items-start">
                <div className="space-y-5">
                  <Badge className="w-fit">{service.kicker}</Badge>
                  <div className="space-y-4">
                    <h2 className="text-[2rem]">{service.title}</h2>
                    <p className="max-w-2xl text-base leading-8 text-gray-muted">
                      {service.description}
                    </p>
                  </div>
                  <Button href="#booking" icon={<FaArrowRight />} className="w-full sm:w-auto">
                    Book this service
                  </Button>
                </div>

                <div className="rounded-card border border-black/10 bg-slate-50 p-5">
                  <h3 className="mb-4 text-xl">What&apos;s included</h3>
                  <ul className="space-y-3 text-sm leading-7 text-gray-body">
                    {serviceFeatures[service.title].map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Section: Services Booking CTA ── */}
      <BookingForm />
    </>
  );
}
