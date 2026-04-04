"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Escalation = {
  id: string;
  createdAt: string;
  companyName: string;
  userEmail: string;
  accountNumber: string;
  complaintDetails: string;
  status: string;
  isPremium: boolean;
};

type Company = {
  id?: string;
  name: string;
  escalationEmail?: string | null;
  contact: string;
  successRate: number;
  requestCount: number;
  isActive: boolean;
};

export default function AdminPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cases" | "companies">("cases");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingCompany, setEditingCompany] = useState<Partial<Company> | null>(null);

  const router = useRouter();

  // 1. Fetch Data
  async function fetchData() {
    setLoading(true);
    try {
      const [escRes, compRes] = await Promise.all([
        fetch("/api/admin/escalation/list"),
        fetch("/api/admin/companies")
      ]);
      if (escRes.ok) setEscalations(await escRes.json());
      if (compRes.ok) setCompanies(await compRes.json());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  // 2. Logic Helpers
  const sortedEscalations = useMemo(() => {
    return [...escalations].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [escalations]);

  const paginatedEscalations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedEscalations.slice(start, start + itemsPerPage);
  }, [sortedEscalations, currentPage]);

  const selectedEscalation = escalations.find((e) => e.id === selectedId);

  // 3. Render
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Tabs */}
        <div className="flex gap-8 mb-8 border-b border-white/10">
          <button 
            onClick={() => setActiveTab("cases")}
            className={`pb-4 text-2xl font-bold transition ${activeTab === "cases" ? "text-white border-b-2 border-[#C5A059]" : "text-white/20"}`}
          >
            Cases
          </button>
          <button 
            onClick={() => setActiveTab("companies")}
            className={`pb-4 text-2xl font-bold transition ${activeTab === "companies" ? "text-white border-b-2 border-[#C5A059]" : "text-white/20"}`}
          >
            Companies
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">Loading dashboard...</div>
        ) : activeTab === "cases" ? (
          /* CASES VIEW */
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-white/40">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedEscalations.map((esc) => (
                    <tr 
                      key={esc.id} 
                      onClick={() => setSelectedId(esc.id)}
                      className={`cursor-pointer hover:bg-white/5 ${selectedId === esc.id ? 'bg-white/10' : ''}`}
                    >
                      <td className="p-4 text-sm">{new Date(esc.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">{esc.companyName}</td>
                      <td className="p-4 text-xs font-bold text-[#C5A059]">{esc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sidebar Details */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-fit sticky top-8">
              {selectedEscalation ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-white/40">Case Details</h3>
                  <p className="text-sm text-[#C5A059]">{selectedEscalation.userEmail}</p>
                  <div className="p-3 bg-black/40 rounded border border-white/5 text-xs whitespace-pre-wrap">
                    {selectedEscalation.complaintDetails}
                  </div>
                </div>
              ) : (
                <p className="text-white/20 text-center py-10">Select a case</p>
              )}
            </div>
          </div>
        ) : (
          /* COMPANIES VIEW */
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-white/40">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Success</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4 text-[#C5A059]">{c.successRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-fit">
              <h3 className="text-sm font-bold uppercase text-white/40 mb-4">Add Company</h3>
              <input 
                placeholder="Company Name"
                className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm mb-4"
              />
              <button className="w-full bg-[#C5A059] text-black font-bold py-2 rounded text-xs">
                Save Company
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}