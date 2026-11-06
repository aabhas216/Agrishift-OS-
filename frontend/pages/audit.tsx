import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import {
  ShieldCheck,
  Award,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  FileText,
  Binary,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AuditDefensePage() {
  const [auditData, setAuditData] = useState<any>(null);
  const [expandedQa, setExpandedQa] = useState<number | null>(1);

  useEffect(() => {
    fetch("/api/analytics/audit-defense-data")
      .then((res) => res.json())
      .then((data) => setAuditData(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleQa = (id: number) => {
    setExpandedQa(expandedQa === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f0] flex flex-col font-sans">
      <Head>
        <title>Agronomic Benchmarks & System Feasibility - AgriShift OS</title>
        <meta
          name="description"
          content="Agronomic benchmarks, machinery economics, and emissions abatement validation for AgriShift OS."
        />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Benchmarks Header Card */}
        <div className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-[#52b788]/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Agronomic Benchmarks & System Feasibility</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                System Feasibility & Agronomics
              </h1>
              <p className="mt-2 text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Empirical justification of AgriShift OS: Strict mathematical & agronomic validation of digital scheduling, machinery fleet clustering, and industrial biomass economics without chemical or biological spray dependencies.
              </p>
            </div>

            {/* Platform Status Badge */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0">
              <div>
                <span className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">
                  Platform Architecture:
                </span>
                <div className="text-base font-black text-white">
                  100% Software Logistics
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between gap-4">
                <div>
                  <span className="text-gray-400 text-[10px]">Methodology:</span>
                  <div className="font-extrabold text-amber-400">Cluster Pooling</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px]">Verification:</span>
                  <div className="font-bold text-emerald-200">Production Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Scientific Q&A Defense Cards */}
        <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#2d6a4f]/15 mb-6">
            <HelpCircle className="w-5 h-5 text-[#2d6a4f]" />
            <h2 className="text-xl font-bold text-[#1b4332]">
              Scientific & Agronomic Q&A Defense Cards
            </h2>
          </div>

          <div className="space-y-4">
            {auditData?.scientific_qa ? (
              auditData.scientific_qa.map((item: any) => {
                const isOpen = expandedQa === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? "bg-[#f4f6f0]/70 border-[#2d6a4f] shadow-sm"
                        : "bg-white border-gray-200 hover:border-[#2d6a4f]/40"
                    }`}
                  >
                    <button
                      onClick={() => toggleQa(item.id)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="bg-[#2d6a4f] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                          Q{item.id}
                        </span>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                            {item.tag}
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-[#1b4332]">
                            {item.question}
                          </h3>
                        </div>
                      </div>

                      <div className="p-1 rounded-full bg-gray-100 text-gray-500 shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-200/50">
                        <p className="bg-white p-4 rounded-xl border border-[#2d6a4f]/15 text-gray-800">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-500">Loading Defense Questions...</div>
            )}
          </div>
        </div>

        {/* Section 2: Interactive Agronomic Benchmark Matrix */}
        <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#2d6a4f]/15 mb-6">
            <BarChart3 className="w-5 h-5 text-[#2d6a4f]" />
            <h2 className="text-xl font-bold text-[#1b4332]">
              Benchmark Matrix: Open Field Burning vs. AgriShift OS
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f6f0] text-gray-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Agronomic Metric</th>
                  <th className="p-3.5 text-red-700 bg-red-50/50">Open Field Burning (Baseline)</th>
                  <th className="p-3.5 text-emerald-900 bg-emerald-50/60">AgriShift OS Digital Solution</th>
                  <th className="p-3.5 rounded-r-xl">Outcome Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {auditData?.comparison_matrix ? (
                  auditData.comparison_matrix.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-[#1b4332]">{row.metric}</td>
                      <td className="p-3.5 text-red-600 bg-red-50/20 flex items-center space-x-1.5">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{row.open_burning}</span>
                      </td>
                      <td className="p-3.5 text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{row.agrishift_os}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-gray-700">
                        <span className="bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-md text-[11px]">
                          {row.impact_verdict}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">
                      Loading benchmark matrix...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Technical Software Architecture Overview */}
        <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#2d6a4f]/15 mb-6">
            <Binary className="w-5 h-5 text-[#2d6a4f]" />
            <h2 className="text-xl font-bold text-[#1b4332]">
              Software Architecture & Logistics Dataflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Backend Tier */}
            <div className="bg-[#f4f6f0] p-5 rounded-2xl border border-[#2d6a4f]/15 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-sm text-[#1b4332]">
                <span className="w-2 h-2 rounded-full bg-[#2d6a4f]"></span>
                <span>FastAPI Async Engine</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Asynchronous Python backend with Pydantic v2 validation. Implements Haversine proximity clustering algorithms to group smallholder plots within a 10 km radius into contiguous 30+ acre route nodes.
              </p>
              <div className="font-mono text-[10px] text-emerald-800 bg-white p-2 rounded-lg border border-gray-200">
                POST /api/machinery/match-cluster
              </div>
            </div>

            {/* Database & Persistence Tier */}
            <div className="bg-[#f4f6f0] p-5 rounded-2xl border border-[#2d6a4f]/15 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-sm text-[#1b4332]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Relational ORM & Geospatial Ledger</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                SQLAlchemy schema with dual PostgreSQL and local SQLite auto-fallback. Tracks farmer plots, CHC tractor locations, industrial off-take purchase orders, and the circular biochar credit voucher ledger.
              </p>
              <div className="font-mono text-[10px] text-amber-800 bg-white p-2 rounded-lg border border-gray-200">
                models.py: MachineryCluster & BiocharLedger
              </div>
            </div>

            {/* Frontend Reactive Tier */}
            <div className="bg-[#f4f6f0] p-5 rounded-2xl border border-[#2d6a4f]/15 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-sm text-[#1b4332]">
                <span className="w-2 h-2 rounded-full bg-[#52b788]"></span>
                <span>Next.js Dynamic UI</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Responsive React with TypeScript, Tailwind CSS, and Recharts. Live acreage slider recalculates economic gains and soil carbon in real time without page reloads.
              </p>
              <div className="font-mono text-[10px] text-[#2d6a4f] bg-white p-2 rounded-lg border border-gray-200">
                DynamicCalculator.tsx & SowingTimeline.tsx
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

