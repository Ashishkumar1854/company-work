"use client";

// ============================================
// FILE: BookingForm.jsx
// PURPOSE: Captures booking inquiries, sends them to Google Sheets, and opens WhatsApp
// USES: useState, framer-motion, react-icons, Badge, Button, Card, servicesData, siteConfig, saveToSheet
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { saveToSheet } from "@/lib/googleSheets";
import { servicesData, siteConfig } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

const initialFormData = {
  name: "",
  phone: "",
  service: servicesData[0]?.title || "",
  budget: "Mid",
  goal: "",
};

const nextSteps = [
  "We review your message",
  "We reply within 24hrs",
  "We lock scope + timeline",
  "We start delivery",
];

export default function BookingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    saveToSheet("Bookings", {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      budget: formData.budget,
      goal: formData.goal,
    });

    const message = `Hi Social Craft! 👋
Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Budget: ${formData.budget}
Goal: ${formData.goal}`;

    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsSubmitting(false);
    setFormData(initialFormData);
  };

  return (
    <motion.section {...motionProps} id="booking" className="py-10 sm:py-12 lg:py-14">
      {/* ── Section: Booking Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 max-w-2xl space-y-2">
          {/* ── Section: Booking Heading ── */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
            Start here
          </p>
          <h2>Ready to grow your brand?</h2>
          <p className="text-base leading-7 text-gray-muted">
            Fill the form — we&apos;ll connect on WhatsApp
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* ── Section: Booking Form Fields ── */}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-ink">Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-btn border border-black/10 bg-white px-4 py-3 text-gray-body outline-none transition-colors duration-200 focus:border-brand"
                    placeholder="Your name"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-ink">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-btn border border-black/10 bg-white px-4 py-3 text-gray-body outline-none transition-colors duration-200 focus:border-brand"
                    placeholder="Your phone number"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-ink">Service</span>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="rounded-btn border border-black/10 bg-white px-4 py-3 text-gray-body outline-none transition-colors duration-200 focus:border-brand"
                  >
                    {servicesData.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-ink">Budget</span>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="rounded-btn border border-black/10 bg-white px-4 py-3 text-gray-body outline-none transition-colors duration-200 focus:border-brand"
                  >
                    <option value="Tight">Tight</option>
                    <option value="Mid">Mid</option>
                    <option value="Open">Open</option>
                  </select>
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-ink">Goal</span>
                  <textarea
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="min-h-[100px] rounded-btn border border-black/10 bg-white px-4 py-3 text-gray-body outline-none transition-colors duration-200 focus:border-brand"
                    placeholder="Tell us what you want to achieve"
                  />
                </label>
              </div>

              {/* ── Section: Booking Form Actions ── */}
              <div className="mt-6 space-y-4">
                <Button
                  type="submit"
                  variant="whatsapp"
                  loading={isSubmitting}
                  icon={<FaWhatsapp />}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send on WhatsApp"}
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <div className="h-full p-6 sm:p-8">
              {/* ── Section: Booking Info Card ── */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3>What happens next</h3>
                  <p className="text-sm leading-7 text-gray-muted">
                    We keep the process quick and clear so you know exactly what
                    happens after you reach out.
                  </p>
                </div>

                <div className="space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-brand">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-sm font-medium text-gray-body">{step}</p>
                    </div>
                  ))}
                </div>

                <Badge className="w-fit">Response time: Within 24 hours</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
