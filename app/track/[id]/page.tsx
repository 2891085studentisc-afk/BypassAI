"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

type Escalation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  userEmail: string;
  accountNumber: string;
  complaintDetails: string;
  status: string;
  isPremium: boolean;
  sentAt?: string;
  paymentId?: string;
};

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [escalation, setEscalation] = useState<Escalation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/track/${id}`);
        if (!res.ok) throw new Error("Case not found");
        const data = await res.json();
        setEscalation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-[#C5A059]" />
      </div>
    );
  }

  if (error || !escalation) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
        <p className="text-white/50 mb-8">We couldn&apos;t find a case with ID: {id}</p>
        <Link href="/" className="px-6 py-3 bg-[#C5A059] text-[#050816] font-bold rounded-xl">
          Back to Home
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Submitted", status: "PENDING", date: escalation.createdAt },
    { label: "Reviewing", status: "REVIEWING", date: null },
    { label: "Escalated to CEO", status: "ESCALATED", date: escalation.sentAt },
    { label: "Resolved", status: "RESOLVED", date: null },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === escalation.status);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold tracking-tight">Bypass.ai</Link>
          <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Case Tracker</span>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 mb-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-1">{escalation.companyName}</h1>
              <p className="text-sm text-white/40 font-mono uppercase tracking-widest">Ref: {escalation.id}</p>
            </div>
            {escalation.isPremium && (
              <span className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Priority Strike Active
              </span>
            )}
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/5" />
            
            {steps.map((step, i) => {
              const isDone = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              
              return (
                <div key={step.label} className="flex gap-6 items-start relative z-10">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                    isDone ? "bg-[#C5A059] border-[#C5A059]" : "bg-[#050816] border-white/10"
                  }`}>
                    {isDone ? (
                      <svg className="w-4 h-4 text-[#050816]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDone ? "text-white" : "text-white/30"}`}>{step.label}</p>
                    {isDone && step.date && (
                      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                        {new Date(step.date).toLocaleString()}
                      </p>
                    )}
                    {isCurrent && (
                      <p className="text-xs text-[#C5A059] mt-2 font-medium bg-[#C5A059]/5 border border-[#C5A059]/10 p-3 rounded-lg">
                        {step.status === "PENDING" && "Your case has been logged in our high-traffic database."}
                        {step.status === "REVIEWING" && "Our team is verifying the latest CEO contact route for this brand."}
                        {step.status === "ESCALATED" && "Formal legal notice has been delivered to the executive office."}
                        {step.status === "RESOLVED" && "The company has confirmed receipt and human assignment."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-bold">Account Details</h3>
            <p className="text-xs text-white/60 mb-1">Email</p>
            <p className="text-sm mb-4">{escalation.userEmail}</p>
            <p className="text-xs text-white/60 mb-1">Reference</p>
            <p className="text-sm font-mono">{escalation.accountNumber}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-bold">Proof of Delivery</h3>
            {escalation.sentAt ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Verified Sent</p>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Formal notice delivered via Bypass.ai Legal Router at {new Date(escalation.sentAt).toLocaleTimeString()}.
                </p>
              </>
            ) : (
              <p className="text-xs text-white/30 italic">Delivery proof will appear once the CEO route is triggered.</p>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center">
          <Link href="/" className="text-xs text-white/30 hover:text-white transition underline underline-offset-4">
            Return to Dashboard
          </Link>
        </footer>
      </div>
    </div>
  );
}
