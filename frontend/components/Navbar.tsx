import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Sprout, Tractor, ShoppingCart, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { name: "Farmer Operations", href: "/", icon: Tractor },
    { name: "B2B Biomass Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "System Benchmarks", href: "/audit", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1b4332] text-white shadow-lg border-b border-[#2d6a4f]">
      {/* Top Compliance Banner */}
      <div className="bg-[#081c15] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between text-gray-300 border-b border-[#1b4332]">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-black font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            100% Digital Scope
          </span>
          <span>Zero Biological Sprays • Pure Supply-Chain Logistics & Routing</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[#74c69d]">
            Enterprise Platform: <strong className="text-white">Paddy Residue & Soil Recovery</strong>
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-amber-400 font-semibold">Production Build</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#2d6a4f] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  AgriShift <span className="text-[#52b788]">OS</span>
                </span>
                <span className="bg-[#2d6a4f] text-[#d8f3dc] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#52b788]/30">
                  v1.0 Prod
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 -mt-0.5">
                Paddy Residue & Soil Recovery Management System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2d6a4f] text-white shadow-inner border border-[#52b788]/40"
                      : "text-emerald-100 hover:bg-[#2d6a4f]/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#52b788]" : "text-emerald-300"}`} />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Node Status */}
          <div className="hidden lg:flex items-center space-x-2 text-xs bg-[#081c15]/60 px-3 py-1.5 rounded-full border border-[#2d6a4f]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-200 font-mono">FastAPI Cluster Router: ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

