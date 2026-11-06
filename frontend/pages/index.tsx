import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import DynamicCalculator from "../components/DynamicCalculator";
import SowingTimeline from "../components/SowingTimeline";
import MachineryPooling from "../components/MachineryPooling";
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Fuel,
  Leaf,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [currentAcres, setCurrentAcres] = useState<number>(5.0);

  return (
    <div className="min-h-screen bg-[#f4f6f0] flex flex-col font-sans">
      <Head>
        <title>AgriShift OS - Paddy Residue & Soil Recovery Management System</title>
        <meta
          name="description"
          content="100% digital supply-chain, machinery cluster routing, and agro-economic recovery for North Indian paddy stubble."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#52b788]/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Digital Supply-Chain & Agro-Logistics Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Paddy Residue & Soil Recovery <br />
              <span className="text-[#52b788]">Management System</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Replacing open stubble burning with precision algorithmics: Strict 10-day terminal sowing window enforcement, contiguous 30+ acre cluster machinery routing, and industrial biomass marketplace off-take with circular biochar soil re-inoculation.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                href="/marketplace"
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md"
              >
                <span>B2B Biomass Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/audit"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider border border-white/20 flex items-center space-x-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Faculty Audit Defense</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-emerald-700/60 text-center">
            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
              <div className="text-2xl font-black text-amber-300">40%</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold mt-0.5">
                Machine Transit Cut
              </div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
              <div className="text-2xl font-black text-emerald-300">₹1,200/ac</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold mt-0.5">
                Pooled Rental Rate
              </div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
              <div className="text-2xl font-black text-white">+0.15%</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold mt-0.5">
                Soil Carbon (SOC) Boost
              </div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
              <div className="text-2xl font-black text-amber-400">10 Days</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold mt-0.5">
                Terminal Sowing Window
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: Dynamic Agro-Economic & Soil Impact Calculator */}
        <section id="calculator">
          <DynamicCalculator
            initialAcres={currentAcres}
            onAcresChange={(a) => setCurrentAcres(a)}
          />
        </section>

        {/* Module 1: 10-Day Digital Sowing Window Engine */}
        <section id="sowing">
          <SowingTimeline acres={currentAcres} />
        </section>

        {/* Module 2: Cluster Machinery Pooling Router */}
        <section id="machinery">
          <MachineryPooling acres={currentAcres} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1b4332] text-white py-8 border-t border-[#2d6a4f] mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-[#52b788]" />
            <span className="font-extrabold tracking-tight">AgriShift OS</span>
            <span className="text-gray-400">|</span>
            <span className="text-emerald-200">
              Department of Agricultural Engineering & Software Architecture
            </span>
          </div>

          <div className="text-center md:text-right text-gray-300">
            <div>
              Platform Status: <strong className="text-white">Active Production Build</strong>
            </div>
            <div className="text-emerald-300 font-semibold">100% Digital Supply-Chain & Fleet Logistics</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

