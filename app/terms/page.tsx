export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
            <p className="text-white/80 leading-relaxed">
              Bypass.ai provides consumer escalation services to help users communicate with
              companies more effectively. We are not a law firm and do not provide legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
            <p className="text-white/80 leading-relaxed">
              You agree to provide accurate information and use our service responsibly.
              You are responsible for the content of your complaints and communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Service Limitations</h2>
            <p className="text-white/80 leading-relaxed">
              While we strive for successful escalations, we cannot guarantee outcomes.
              Success rates are estimates based on historical data and may vary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="text-white/80 leading-relaxed">
              Premium services require payment in advance. All sales are final.
              Refunds are provided at our discretion for technical failures only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed">
              Bypass.ai is not liable for any damages arising from the use of our service.
              Our total liability is limited to the amount paid for our services.
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