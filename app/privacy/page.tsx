export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-white/80 leading-relaxed">
              We collect information you provide directly to us, including your email address,
              account numbers, and complaint details when you submit an escalation request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed">
              We use the information to process your escalation requests, communicate with companies
              on your behalf, and provide tracking services. We never sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-white/80 leading-relaxed">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
            <p className="text-white/80 leading-relaxed">
              Under GDPR, you have the right to access, rectify, erase, and restrict processing of
              your personal data. Contact us at privacy@bypass.ai to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at privacy@bypass.ai.
            </p>
          </section>

          <section className="border-t border-white/10 pt-6 mt-8">
            <p className="text-white/60 text-sm">
              Last updated: April 2026
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#C5A059] text-[#050816] font-semibold rounded-xl hover:brightness-110 transition"
          >
            ← Back to Bypass.ai
          </a>
        </div>
      </div>
    </div>
  );
}