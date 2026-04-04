"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { serveNotice } from "./serve-notice";
import { type TrafficCompany } from "./lib/companies";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? "Serving Notice..." : "Serve Official Notice"}
    </button>
  );
}

export default function NoticeForm() {
  const [state, formAction] = useActionState(serveNotice, { success: false, error: null, id: null });
  const formRef = useRef<HTMLFormElement>(null);
  const [companies, setCompanies] = useState<TrafficCompany[]>([]);

  // Load the 50 most complained companies on mount
  useEffect(() => {
    fetch("/api/admin/companies")
      .then(res => res.json())
      .then(data => setCompanies(data.slice(0, 50)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Executive Escalation</h2>
      <p className="text-sm text-slate-500 mb-6">Bypass the bots. Reach the decision makers instantly.</p>
      
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Company</label>
          <select name="companyName" required className="w-full px-3 py-2 border border-slate-300 rounded-md">
            <option value="">Select a company...</option>
            {companies.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
            <input type="email" name="email" required className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Ref</label>
            <input type="text" name="accountNumber" required className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="CRN-12345" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Details</label>
          <textarea name="details" required rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="Summarize your issue (min 20 characters)..." />
        </div>

        <SubmitButton />

        {state?.success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
            <strong>Success!</strong> Escalation sent to CEO route. Case: {state.id}
          </div>
        )}

        {state?.error && (
          <p className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}