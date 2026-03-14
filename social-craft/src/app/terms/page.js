// ============================================
// FILE: page.js
// PURPOSE: Shares the Social Craft service terms in a readable legal summary layout
// USES: static prose content only
// ============================================

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Review Social Craft terms covering service scope, payments, revisions, intellectual property, and termination.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="py-20">
      {/* ── Section: Terms Content ── */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="space-y-10 rounded-card border border-black/10 bg-white p-6 shadow-card sm:p-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
              Terms
            </p>
            <h1>Terms &amp; Conditions</h1>
            <p className="text-base leading-8 text-gray-body">
              These terms outline the general basis on which Social Craft
              provides creative, marketing, and web services. By engaging our
              team, you agree to the scope, communication process, and delivery
              structure defined in your proposal or project agreement.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Services</h2>
            <p className="text-base leading-8 text-gray-body">
              Services are provided according to the agreed scope, timeline, and
              deliverables shared during onboarding or proposal approval. Any
              additions beyond the approved scope may require revised timelines
              or updated pricing.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Payment Terms</h2>
            <p className="text-base leading-8 text-gray-body">
              Payment schedules, deposits, and billing milestones will be
              defined in the service proposal or invoice. Work may begin only
              after the required advance payment is received. Delayed payments
              may affect delivery schedules.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Revisions</h2>
            <p className="text-base leading-8 text-gray-body">
              Reasonable revisions are included within the agreed workflow.
              Additional revision rounds, major strategy shifts, or changes
              after approval may be billed separately depending on effort and
              impact.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Intellectual Property</h2>
            <p className="text-base leading-8 text-gray-body">
              Final approved deliverables are transferred according to the terms
              of the project agreement once payment obligations are completed.
              Social Craft retains the right to showcase non-confidential work
              in portfolios, presentations, and marketing materials unless
              otherwise agreed in writing.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Termination</h2>
            <p className="text-base leading-8 text-gray-body">
              Either party may pause or terminate an engagement with written
              notice. Fees for work completed up to the termination date remain
              payable, and any partially completed deliverables may be released
              at Social Craft&apos;s discretion based on payment status.
            </p>
          </div>

          <div className="space-y-4">
            <h2>Contact</h2>
            <p className="text-base leading-8 text-gray-body">
              For questions about these terms, please contact us at{" "}
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
