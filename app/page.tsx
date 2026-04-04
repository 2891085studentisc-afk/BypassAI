"use client";

import { useEffect, useMemo, useState } from "react";
import { type TrafficCompany } from "../lib/companies";
import { useActionState } from "react";
import { serveNotice, type ActionState } from "../serve-notice";

const BRAND_GOLD = "#C5A059";
const BG = "#050816";

const PAYPAL_EXEC_STRIKE = "https://www.paypal.me/AnesuEmmanuel44/8GBP";

const BOT_BREAKER_SCRIPT = `Subject: Formal request — human review of account [YOUR REF]

Dear [Company] Complaints Team,

I am writing under the Consumer Rights Act 2015 and your own complaints handling obligations. This matter has not been resolved through standard channels.

Please escalate this case to a human complaints handler (not an automated or chatbot workflow) within 5 working days and confirm the name and direct contact route of the handler assigned.

If I do not receive a substantive human response, I will refer this to the Financial Ombudsman Service / CISAS / Ofcom (as applicable) and request a deadlock letter where appropriate.

Account reference: [INSERT]
Summary: [INSERT BRIEF FACTS]

Yours faithfully,
[YOUR NAME]`;

function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
  );
}

function StrikeButton({
  className = "",
  variant = "gold",
  escalationId = "",
}: {
  className?: string;
  variant?: "gold" | "onGold";
  escalationId?: string;
}) {
  const onGold = variant === "onGold";
  const paypalUrl = escalationId 
    ? `${PAYPAL_EXEC_STRIKE}?item_number=${escalationId}&custom=${escalationId}`
    : PAYPAL_EXEC_STRIKE;

  return (
    <a
      href={paypalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition duration-150 active:scale-[0.99] ${
        onGold ? "text-white hover:brightness-125" : "text-[#050816] hover:brightness-110"
      } ${className}`}
      style={{ backgroundColor: onGold ? "#050816" : BRAND_GOLD }}
    >
      Premium Executive Strike — £8
    </a>
  );
}

export default function Home() {
  const [state, formAction, isPending] = useActionState(serveNotice, { success: false, error: null, id: null } as ActionState);
  const [companies, setCompanies] = useState<TrafficCompany[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/admin/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    }
    loadCompanies();
  }, []);

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};
    const email = formData.get("email") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const complaintDetails = formData.get("details") as string;

    if (!accountNumber || !accountNumber.trim()) {
      errors.accountNumber = "Account/reference number is required";
    }

    if (!email || !email.trim()) {
      errors.userEmail = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.userEmail = "Please enter a valid email address";
    }

    if (!complaintDetails || !complaintDetails.trim()) {
      errors.complaintDetails = "Complaint details are required";
    } else if (complaintDetails.length < 20) {
      errors.complaintDetails = "Please provide more details (minimum 20 characters)";
    }

    if (!selectedCompany) {
      errors.company = "Please select a company from the search results";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const trimmed = query.trim();
  const queryLower = trimmed.toLowerCase();

  const filtered = useMemo(() => {
    if (!queryLower) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(queryLower));
  }, [queryLower, companies]);

  const showOffListMessage = trimmed.length > 0 && filtered.length === 0;

  async function handleRequestCompany() {
    setIsRequesting(true);
    try {
      await fetch("/api/companies/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: query }),
      });
      setRequestSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequesting(false);
    }
  }

  const selectedCompany = useMemo(() => {
    if (filtered.length > 0 && queryLower) {
      const match = filtered.find((c) => c.name.toLowerCase() === queryLower);
      if (match) return match.name;
    }
    return null;
  }, [filtered, queryLower]);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(BOT_BREAKER_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: BG, fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${BRAND_GOLD}33, transparent), radial-gradient(circle at 100% 100%, ${BRAND_GOLD}14, transparent 40%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.08] backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight">Bypass.ai</span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-white/45 sm:inline">
              Executive escalation
            </span>
          </div>
          <span className="text-xs text-white/50">UK consumer focus</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        <section className="text-center sm:text-left">
          <p
            className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70"
            style={{ borderColor: `${BRAND_GOLD}40` }}
          >
            UK Top 50 Brands Only · High-traffic database
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl md:leading-[1.1]">
            Don&apos;t Talk to the Bot.
            <br />
            <span style={{ color: BRAND_GOLD }}>Talk to the Boss.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:mx-0 sm:text-lg">
            Companies use AI bots to ignore you. We use legal backdoors to force a human response.
          </p>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl shadow-black/40">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                    Find your company
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    50 most complained-about UK brands — filters instantly as you type.
                  </p>
                </div>
                {trimmed ? (
                  <span className="text-xs font-medium tabular-nums text-white/35" aria-live="polite">
                    {showOffListMessage
                      ? "Not on list"
                      : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`}
                  </span>
                ) : (
                  <span className="text-xs text-white/35">{companies.length} in database</span>
                )}
              </div>
              <label htmlFor="company-search" className="sr-only">
                Search high-traffic companies
              </label>
              <input
                id="company-search"
                type="search"
                placeholder="e.g. Sky, Barclays, Ryanair…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="mt-4 w-full rounded-xl border border-white/10 bg-[#0a1024] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 transition duration-150 focus:border-[color:var(--gold)] focus:ring-2"
                style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
              />

              {/* Hidden input to pass selected company to Server Action */}
              <input type="hidden" name="companyName" value={selectedCompany || ""} />

              {!trimmed ? (
                <p className="mt-4 text-xs text-white/40">
                  Start typing to narrow the list, or scroll the full directory below.
                </p>
              ) : null}

              {showOffListMessage ? (
                <div
                  className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-6 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/20 mb-3">
                    <span className="text-lg font-bold">!</span>
                  </div>
                  <p className="text-sm font-medium text-white/80">Company Not Found</p>
                  <p className="mt-1.5 text-xs text-white/40 leading-relaxed max-w-[240px] mx-auto">
                    Sorry, this company is not currently on our high-traffic escalation list. 
                    We focus exclusively on the top 50 most complained-about UK brands to ensure the highest success rate.
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5">
                    {requestSent ? (
                      <p className="text-xs text-[#C5A059] font-medium animate-pulse">
                        Request logged! Our team will prioritize adding &quot;{query}&quot;.
                      </p>
                    ) : (
                      <button
                        onClick={handleRequestCompany}
                        disabled={isRequesting}
                        className="text-xs font-semibold text-white/90 bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                      >
                        {isRequesting ? "Logging request..." : `Request coverage for "${query}"`}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <ul className="mt-3 max-h-[min(28rem,55vh)] space-y-3 overflow-y-auto pr-1">
                  {filtered.map((c) => (
                    <li
                      key={c.name}
                      onClick={() => setQuery(c.name)}
                      className={`rounded-xl border p-4 transition duration-150 cursor-pointer ${selectedCompany === c.name ? 'border-[#C5A059] bg-[#0a1028]' : 'border-white/[0.08] bg-[#070c1c] hover:border-[#C5A059]/35 hover:bg-[#0a1028]'}`}
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold leading-snug text-white">{c.name}</p>
                          <p
                            className="mt-2 text-xs leading-relaxed text-[#C5A059]/80 font-medium"
                            style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                          >
                            {c.sector}
                          </p>
                        </div>
                        {c.successRate && (
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-full border border-[#C5A059]/20">
                              {c.successRate}% Success
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-white/35">
                Built-in consumer directory for speed. Not affiliated with any listed company.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl shadow-black/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                  Bot-Breaker script
                </h2>
                <button
                  type="button"
                  onClick={copyScript}
                  className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/[0.1]"
                >
                  {copied ? "Copied" : "Copy free"}
                </button>
              </div>
              <p className="mt-1 text-sm text-white/55">
                Adapt placeholders, then paste into email or secure message portals.
              </p>
              <pre
                className="mt-4 max-h-[280px] overflow-auto rounded-xl border border-white/[0.08] bg-[#070c1c] p-4 text-left text-xs leading-relaxed text-white/80"
                style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
              >
                {BOT_BREAKER_SCRIPT}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                CEO escalation intake
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Provide your reference and a concise summary. We route serious cases for human review.
              </p>
              {state.success ? (
                <div
                  className="mt-6 rounded-xl border px-4 py-4 text-sm"
                  style={{
                    borderColor: `${BRAND_GOLD}55`,
                    backgroundColor: `${BRAND_GOLD}12`,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  <p className="font-semibold text-lg">Escalation Request Sent.</p>
                  <p className="mt-2 text-white/70">
                    Your details for {selectedCompany || "your company"} have been received. 
                  </p>
                  <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Your Case Reference</p>
                    <p className="font-mono text-sm text-[#C5A059] font-bold select-all">{state.id || "PENDING..."}</p>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/80 leading-relaxed">
                      {state.autoSent 
                        ? "🚀 High-Priority Strike: We have dispatched your formal escalation directly to the executive team. Check your email for your CC'd copy." 
                        : "Our team is reviewing your case for executive routing. You will receive a confirmation email shortly."}
                    </p>
                  </div>
                  <StrikeButton variant="onGold" escalationId={state.id || ""} className="mt-4" />
                  <button 
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 text-xs font-medium underline underline-offset-4 opacity-60 hover:opacity-100"
                  >
                    Submit another
                  </button>
                </div>
              ) : (
                <form 
                  action={(formData) => {
                    if (validateForm(formData)) {
                      formAction(formData);
                    }
                  }} 
                  className="mt-6 space-y-4"
                >
                  {state.error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                      {state.error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-white/60">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      disabled={isPending}
                      className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition focus:ring-2 disabled:opacity-50 ${
                        formErrors.userEmail
                          ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                          : "border-white/10 bg-[#0a1024] focus:border-[color:var(--gold)]"
                      }`}
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                      placeholder="Where should we send your receipt?"
                    />
                    {formErrors.userEmail && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.userEmail}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="account" className="block text-xs font-medium text-white/60">
                      Account number
                    </label>
                    <input
                      id="account"
                      name="accountNumber"
                      required
                      autoComplete="off"
                      disabled={isPending}
                      className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition focus:ring-2 disabled:opacity-50 ${
                        formErrors.accountNumber
                          ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                          : "border-white/10 bg-[#0a1024] focus:border-[color:var(--gold)]"
                      }`}
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                      placeholder="Customer or account reference"
                    />
                    {formErrors.accountNumber && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.accountNumber}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="complaint" className="block text-xs font-medium text-white/60">
                      Complaint details
                    </label>
                    <textarea
                      id="complaint"
                      name="details"
                      required
                      rows={5}
                      disabled={isPending}
                      className={`mt-1.5 w-full resize-y rounded-xl border px-4 py-3 text-sm text-white outline-none transition focus:ring-2 disabled:opacity-50 ${
                        formErrors.complaintDetails
                          ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                          : "border-white/10 bg-[#0a1024] focus:border-[color:var(--gold)]"
                      }`}
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                      placeholder="Dates, amounts, what you asked for, and what went wrong."
                    />
                    {formErrors.complaintDetails && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.complaintDetails}</p>
                    )}
                  </div>
                  {formErrors.company && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                      {formErrors.company}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-[#050816] transition hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: BRAND_GOLD }}
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner className="text-[#050816]" />
                        Submitting...
                      </>
                    ) : (
                      "Submit to CEO route"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>
            Bypass.ai provides templates and escalation guidance. We are not a law firm; seek independent
            advice for regulated or legal disputes.
          </p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
