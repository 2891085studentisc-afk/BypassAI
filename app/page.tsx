"use client";

import { useEffect, useMemo, useState } from "react";

const BRAND_GOLD = "#C5A059";
const BG = "#050816";

const PAYPAL_EXEC_STRIKE = "https://www.paypal.me/AnesuEmmanuel44/8GBP";

type TrafficCompany = { name: string; contact: string };

/** Top 50 high-traffic UK consumer brands + CEO / executive contact routes (built-in). */
const HIGH_TRAFFIC_COMPANIES: readonly TrafficCompany[] = [
  { name: "Sky", contact: "Exec: ann-marie.mackay@sky.uk" },
  { name: "Amazon", contact: "Exec: ajassy@amazon.com" },
  { name: "Virgin Media", contact: "Exec: lutz.schueler@virginmedia.co.uk" },
  { name: "HSBC", contact: "Exec: customerrelations@hsbc.com" },
  { name: "Barclays", contact: "CEO office: group chief executive (Barclays plc, London) — annual report governance" },
  { name: "Vodafone", contact: "Exec: ahmed.essam@vodafone.com" },
  { name: "EE", contact: "Exec: marc.allera@bt.com" },
  { name: "British Gas", contact: "Exec: chris.o'shea@centrica.com" },
  { name: "O2", contact: "CEO / MD: Virgin Media O2 (executive office, UK HQ) — regulator escalations CISAS" },
  { name: "Tesco", contact: "CEO office: Tesco PLC registered office & executive correspondence (Welwyn)" },
  { name: "Ryanair", contact: "CEO: Michael O’Leary office — investor / corporate affairs (Ryanair Holdings)" },
  { name: "BT", contact: "Group CEO office: BT Group plc (London) — Ofcom escalations where applicable" },
  { name: "TalkTalk", contact: "Executive team: TalkTalk Group — Companies House registered office route" },
  { name: "Three", contact: "CEO: Three UK (CK Hutchison) — executive complaints escalation" },
  { name: "Lloyds Bank", contact: "Group CEO: Lloyds Banking Group plc — executive complaints / FOS route" },
  { name: "NatWest", contact: "Group CEO: NatWest Group plc — executive correspondence & FOS" },
  { name: "Halifax", contact: "Part of Lloyds Banking Group — group CEO office escalations" },
  { name: "Nationwide Building Society", contact: "Chief Executive: Nationwide Building Society (Swindon HQ)" },
  { name: "Santander UK", contact: "CEO: Santander UK — executive office & FOS escalations" },
  { name: "Scottish Power", contact: "CEO: Scottish Power Ltd — energy ombudsman / executive route" },
  { name: "E.ON Next", contact: "CEO: E.ON UK / Next — energy ombudsman escalations" },
  { name: "Octopus Energy", contact: "CEO: Octopus Energy Group — executive & Ofgem escalations" },
  { name: "EDF Energy", contact: "UK CEO: EDF Energy — energy ombudsman route" },
  { name: "Ovo Energy", contact: "CEO: OVO Group — executive complaints & Ofgem" },
  { name: "Thames Water", contact: "CEO office: Thames Water — Ofwat / CCW escalations" },
  { name: "Royal Mail", contact: "CEO: International Distributions Services plc — Postal Redress scheme" },
  { name: "Evri", contact: "CEO office: Evri — retail ADR / ombudsman where applicable" },
  { name: "DPD", contact: "UK CEO: DPDgroup UK — parcel ombudsman / executive route" },
  { name: "DHL", contact: "Country management: DHL Express UK — executive escalations" },
  { name: "Currys", contact: "CEO: Currys plc — investor relations / executive correspondence" },
  { name: "Argos", contact: "Part of Sainsbury’s — group CEO office escalations" },
  { name: "John Lewis", contact: "Executive team: John Lewis Partnership — chair / partnership council route" },
  { name: "ASOS", contact: "CEO: ASOS plc — London HQ executive correspondence" },
  { name: "Openreach", contact: "CEO: Openreach (BT Group) — Ofcom escalations" },
  { name: "Plusnet", contact: "Part of BT Group — group CEO / executive complaints" },
  { name: "Shell Energy", contact: "UK executive: Shell Energy Retail — Ombudsman route" },
  { name: "Utilita", contact: "CEO: Utilita Energy — energy ombudsman escalations" },
  { name: "Co-operative Group", contact: "CEO: Co-operative Group — member / executive route" },
  { name: "Avanti West Coast", contact: "Managing Director: First Trenitalia / Avanti — Transport Focus" },
  { name: "Southeastern", contact: "Managing Director: Southeastern (Govia) — Transport Focus" },
  { name: "Southern Railway", contact: "Managing Director: GTR / Southern — Transport Focus" },
  { name: "Northern Trains", contact: "Managing Director: Northern Trains — Transport Focus" },
  { name: "Uber", contact: "UK GM: Uber UK — in-app escalations & ADR" },
  { name: "Deliveroo", contact: "CEO: Deliveroo plc — UK executive correspondence" },
  { name: "Just Eat", contact: "CEO: Just Eat Takeaway.com — UK executive route" },
  { name: "McDonald's", contact: "UK CEO: McDonald’s UK — corporate affairs / executive office" },
  { name: "British Airways", contact: "CEO: British Airways (IAG) — CAA / ADR escalations" },
  { name: "easyJet", contact: "CEO: easyJet plc — executive complaints & ADR" },
  { name: "PayPal", contact: "Executive escalations: PayPal Europe — Financial Ombudsman Service (UK)" },
  { name: "Netflix", contact: "UK public policy / member support — executive escalations via help centre" },
];

const BOT_BREAKER_SCRIPT = `Subject: Formal request — human review of account [YOUR REF]

Dear [Company] Complaints Team,

I am writing under the Consumer Rights Act 2015 and your own complaints handling obligations. This matter has not been resolved through standard channels.

Please escalate this case to a human complaints handler (not an automated or chatbot workflow) within 5 working days and confirm the name and direct contact route of the handler assigned.

If I do not receive a substantive human response, I will refer this to the Financial Ombudsman Service / CISAS / Ofcom (as applicable) and request a deadlock letter where appropriate.

Account reference: [INSERT]
Summary: [INSERT BRIEF FACTS]

Yours faithfully,
[YOUR NAME]`;

type CompanyIntel = {
  companyName: string;
  companyNumber: string | null;
  directors: string[];
  summary: string | null;
};

const GEMINI_DEBOUNCE_MS = 480;

function StrikeButton({
  className = "",
  variant = "gold",
}: {
  className?: string;
  variant?: "gold" | "onGold";
}) {
  const onGold = variant === "onGold";
  return (
    <a
      href={PAYPAL_EXEC_STRIKE}
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
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "sent">("idle");
  const [intel, setIntel] = useState<CompanyIntel | null>(null);
  const [intelStatus, setIntelStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [intelError, setIntelError] = useState<string | null>(null);

  const trimmed = query.trim();
  const queryLower = trimmed.toLowerCase();

  const filtered = useMemo(() => {
    if (!queryLower) return [...HIGH_TRAFFIC_COMPANIES];
    return HIGH_TRAFFIC_COMPANIES.filter((c) => c.name.toLowerCase().includes(queryLower));
  }, [queryLower]);

  const showManualStrike = trimmed.length > 0 && filtered.length === 0;

  useEffect(() => {
    if (!showManualStrike || !trimmed) {
      setIntel(null);
      setIntelStatus("idle");
      setIntelError(null);
      return;
    }

    const ac = new AbortController();
    const timer = setTimeout(async () => {
      setIntelStatus("loading");
      setIntelError(null);
      setIntel(null);
      try {
        const res = await fetch("/api/gemini/company-intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed }),
          signal: ac.signal,
        });
        const payload = (await res.json()) as { data?: CompanyIntel; error?: string };
        if (ac.signal.aborted) return;
        if (!res.ok) {
          setIntelStatus("error");
          setIntelError(payload.error ?? "Intelligence lookup failed.");
          return;
        }
        if (payload.data) {
          setIntel(payload.data);
          setIntelStatus("success");
        } else {
          setIntelStatus("error");
          setIntelError("No structured data returned.");
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setIntelStatus("error");
        setIntelError("Network error. Try again.");
      }
    }, GEMINI_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [trimmed, showManualStrike]);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(BOT_BREAKER_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sent");
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
            High-traffic database · Gemini intel off-list
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
                    {showManualStrike
                      ? intelStatus === "loading"
                        ? "AI lookup…"
                        : "Off-list"
                      : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`}
                  </span>
                ) : (
                  <span className="text-xs text-white/35">{HIGH_TRAFFIC_COMPANIES.length} in database</span>
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

              {!trimmed ? (
                <p className="mt-4 text-xs text-white/40">
                  Start typing to narrow the list, or scroll the full directory below.
                </p>
              ) : null}

              {showManualStrike ? (
                <div
                  className="mt-4 rounded-xl border-2 px-4 py-5 text-sm leading-relaxed text-[#050816]"
                  style={{
                    borderColor: BRAND_GOLD,
                    backgroundColor: BRAND_GOLD,
                    boxShadow: `0 0 0 1px ${BRAND_GOLD}40, 0 16px 40px -12px rgba(197, 160, 89, 0.45)`,
                  }}
                >
                  {intelStatus === "loading" ? (
                    <>
                      <p className="font-semibold">Running executive intelligence…</p>
                      <p className="mt-2 text-[#050816]/90">
                        Gemini + Google Search for{" "}
                        <span className="font-medium text-[#050816]">&ldquo;{trimmed}&rdquo;</span>
                      </p>
                      <div className="mt-4 space-y-2 animate-pulse">
                        <div className="h-3 rounded bg-[#050816]/15" />
                        <div className="h-3 w-[80%] rounded bg-[#050816]/12" />
                        <div className="h-3 w-[55%] rounded bg-[#050816]/10" />
                      </div>
                    </>
                  ) : intelStatus === "success" && intel ? (
                    <>
                      <p className="font-semibold">
                        Executive Intelligence confirmed. Backdoor active for{" "}
                        {intel.directors[0] ?? intel.companyName}. Proceed to Strike.
                      </p>
                      <div className="mt-4 space-y-2 rounded-lg border border-[#050816]/15 bg-[#050816]/[0.06] px-3 py-3 text-left">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#050816]/70">
                          Registry snapshot
                        </p>
                        <p className="text-[13px] font-semibold text-[#050816]">{intel.companyName}</p>
                        {intel.companyNumber ? (
                          <p
                            className="text-xs text-[#050816]/85"
                            style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                          >
                            Company no. {intel.companyNumber}
                          </p>
                        ) : (
                          <p className="text-xs text-[#050816]/70">Company number not verified — confirm at Companies House.</p>
                        )}
                        {intel.directors.length > 0 ? (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-[#050816]/70">Current directors</p>
                            <ul className="mt-1 list-inside list-disc text-xs text-[#050816]/90">
                              {intel.directors.map((d) => (
                                <li key={d}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {intel.summary ? (
                          <p className="mt-2 border-t border-[#050816]/10 pt-2 text-xs leading-relaxed text-[#050816]/80">
                            {intel.summary}
                          </p>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[11px] leading-relaxed text-[#050816]/65">
                        AI + web search — verify all details on official UK registers before relying on them.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Company Identity Verified. Proceed to Executive Strike.</p>
                      <p className="mt-2 text-[#050816]/90">
                        Your search: <span className="font-medium text-[#050816]">&ldquo;{trimmed}&rdquo;</span>
                      </p>
                      {intelError ? (
                        <p className="mt-2 text-xs text-[#050816]/80" role="alert">
                          {intelError}
                          {intelError.includes("GEMINI_API_KEY") ? " Add GEMINI_API_KEY in .env.local." : ""}
                        </p>
                      ) : null}
                    </>
                  )}
                  <StrikeButton variant="onGold" className="mt-4" />
                </div>
              ) : (
                <ul className="mt-3 max-h-[min(28rem,55vh)] space-y-3 overflow-y-auto pr-1">
                  {filtered.map((c) => (
                    <li
                      key={c.name}
                      className="rounded-xl border border-white/[0.08] bg-[#070c1c] p-4 transition duration-150 hover:border-[color:var(--gold)]/35 hover:bg-[#0a1028]"
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                    >
                      <p className="text-sm font-semibold leading-snug text-white">{c.name}</p>
                      <p
                        className="mt-2 text-xs leading-relaxed text-white/60"
                        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                      >
                        {c.contact}
                      </p>
                      <StrikeButton className="mt-4" />
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
              {formStatus === "sent" ? (
                <div
                  className="mt-6 rounded-xl border px-4 py-4 text-sm"
                  style={{
                    borderColor: `${BRAND_GOLD}55`,
                    backgroundColor: `${BRAND_GOLD}12`,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  Thank you. Your details have been received and will be reviewed by our team. If you
                  used the Premium Executive Strike, include your PayPal receipt reference in any follow-up
                  email.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="account" className="block text-xs font-medium text-white/60">
                      Account number
                    </label>
                    <input
                      id="account"
                      name="account"
                      required
                      autoComplete="off"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0a1024] px-4 py-3 text-sm text-white outline-none transition focus:border-[color:var(--gold)] focus:ring-2"
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                      placeholder="Customer or account reference"
                    />
                  </div>
                  <div>
                    <label htmlFor="complaint" className="block text-xs font-medium text-white/60">
                      Complaint details
                    </label>
                    <textarea
                      id="complaint"
                      name="complaint"
                      required
                      rows={5}
                      value={complaintDetails}
                      onChange={(e) => setComplaintDetails(e.target.value)}
                      className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-[#0a1024] px-4 py-3 text-sm text-white outline-none transition focus:border-[color:var(--gold)] focus:ring-2"
                      style={{ "--gold": BRAND_GOLD } as React.CSSProperties}
                      placeholder="Dates, amounts, what you asked for, and what went wrong."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-[#050816] transition hover:brightness-110"
                    style={{ backgroundColor: BRAND_GOLD }}
                  >
                    Submit to CEO route
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/[0.08] pt-8 text-center text-xs text-white/40 sm:text-left">
          <p>
            Bypass.ai provides templates and escalation guidance. We are not a law firm; seek independent
            advice for regulated or legal disputes.
          </p>
        </footer>
      </main>
    </div>
  );
}
