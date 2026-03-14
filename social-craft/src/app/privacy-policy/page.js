// ============================================
// FILE: page.js
// PURPOSE: Shares the site privacy policy in a clean long-form reading layout
// USES: static prose content only
// ============================================

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read how Social Craft collects, uses, and protects contact details, analytics data, and inquiry information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-20">
      {/* ── Section: Privacy Policy Content ── */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="space-y-10 rounded-card border border-black/10 bg-white p-6 shadow-card sm:p-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
              Privacy policy
            </p>
            <h1>Privacy Policy</h1>
            <p className="text-sm text-gray-muted">Last updated: March 2025</p>
            <p className="text-base leading-8 text-gray-body">
              Social Craft respects your privacy and is committed to handling
              your information responsibly. This page explains what information
              we collect, how we use it, and the choices you have when you
              interact with our website or contact us.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Data Collection</h2>
            <p className="text-base leading-8 text-gray-body">
              We may collect details you submit through our forms, such as your
              name, phone number, selected service, budget range, and project
              goals. We may also collect basic website analytics information,
              including page visits and interaction events, to understand how
              visitors use the site.
            </p>
          </div>

          <div className="space-y-4">
            <h2>How We Use Data</h2>
            <p className="text-base leading-8 text-gray-body">
              We use submitted information to respond to inquiries, prepare
              proposals, schedule conversations, improve our service quality,
              and understand demand for different offerings. We may also use
              aggregated insights to improve user experience and marketing
              performance.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Cookies</h2>
            <p className="text-base leading-8 text-gray-body">
              Our website may use cookies or similar technologies for analytics,
              functionality, and performance measurement. These tools help us
              understand visitor behavior and improve the website experience.
              You can manage cookies through your browser settings.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Third Party</h2>
            <p className="text-base leading-8 text-gray-body">
              We may use third-party tools such as Google Analytics, Google
              Sheets, Google Apps Script, WhatsApp, and hosting providers to
              operate this website and process inquiries. These services may
              store or process information according to their own privacy
              policies.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Contact Us</h2>
            <p className="text-base leading-8 text-gray-body">
              If you have questions about this privacy policy or how your data
              is handled, please contact Social Craft at{" "}
              <a href="mailto:hello@socialcraft.in" className="font-semibold text-brand">
                hello@socialcraft.in
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
