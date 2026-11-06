import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Info
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  initialAcres?: number;
  onAcresChange?: (acres: number) => void;
}

export default function DynamicCalculator({ initialAcres = 5, onAcresChange }: Props) {
  const [acres, setAcres] = useState<number>(initialAcres);
  const [yieldTonsPerAcre, setYieldTonsPerAcre] = useState<number>(2.2);
  const [spotPricePerTon, setSpotPricePerTon] = useState<number>(1950);
  const [isClusterPooled, setIsClusterPooled] = useState<boolean>(true);

  // Live Math calculations
  const totalStrawTons = Number((acres * yieldTonsPerAcre).toFixed(1));
  const grossStrawRevenue = Math.round(totalStrawTons * spotPricePerTon);
  const fertilizerSaved = Math.round(acres * 2300); // 1.5 bags Urea/DAP per acre
  const poolingSavings = isClusterPooled ? Math.round(acres * 800) : 0; // ₹2,000 unpooled - ₹1,200 pooled
  const netFarmerGain = grossStrawRevenue + fertilizerSaved + poolingSavings;

  // Stubble burning penalty & loss
  const ngtPenalty = acres < 2 ? 2500 : acres <= 5 ? 5000 : 15000;
  const burnedNutrientLoss = Math.round(acres * 2300);
  const totalBurnLoss = ngtPenalty + burnedNutrientLoss;

  // Environmental Metrics
  const carbonRetainedKg = Math.round(acres * 1000);
  const co2AbatedTons = Number((totalStrawTons * 1.5).toFixed(1));
  const socIncrease = "+0.15%";

  const handleSlider = (val: number) => {
    setAcres(val);
    if (onAcresChange) {
      onAcresChange(val);
    }
  };

  const chartData = [
    {
      name: "AgriShift OS",
      "Straw Market Revenue (₹)": grossStrawRevenue,
      "Fertilizer Saved (₹)": fertilizerSaved,
      "Machinery Pooling Saved (₹)": poolingSavings,
      "Burning Penalties & Loss (₹)": 0,
    },
    {
      name: "Open Burning",
      "Straw Market Revenue (₹)": 0,
      "Fertilizer Saved (₹)": 0,
      "Machinery Pooling Saved (₹)": 0,
      "Burning Penalties & Loss (₹)": totalBurnLoss,
    },
  ];

  return (
    <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2d6a4f]/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="agri-badge bg-[#2d6a4f]/10 text-[#2d6a4f] border border-[#2d6a4f]/20">
              Module 4
            </span>
            <h2 className="text-2xl font-bold text-[#1b4332]">
              Dynamic Agro-Economic & Soil Impact Calculator
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Real-time live econometric model calibrated for smallholder farm acreage (1–25 Acres).
          </p>
        </div>

        <div className="flex items-center bg-[#f4f6f0] p-1.5 rounded-lg border border-[#2d6a4f]/20 self-start">
          <button
            onClick={() => setIsClusterPooled(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isClusterPooled
                ? "bg-[#2d6a4f] text-white shadow-sm"
                : "text-gray-600 hover:text-[#1b4332]"
            }`}
          >
            Cluster Pooled (₹1,200/ac)
          </button>
          <button
            onClick={() => setIsClusterPooled(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              !isClusterPooled
                ? "bg-[#2d6a4f] text-white shadow-sm"
                : "text-gray-600 hover:text-[#1b4332]"
            }`}
          >
            Individual (₹2,000/ac)
          </button>
        </div>
      </div>

      {/* Main Interactive Controls & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* Controls: Acreage Slider & Pricing */}
        <div className="lg:col-span-5 space-y-6 bg-[#f4f6f0]/60 p-6 rounded-2xl border border-[#2d6a4f]/15">
          {/* Slider Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-[#1b4332]">
                Farm Land Area (Acres)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-[#2d6a4f]">{acres}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">Acres</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={acres}
              onChange={(e) => handleSlider(parseFloat(e.target.value))}
              className="w-full h-3 bg-[#d8f3dc] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1 font-mono">
              <span>1 Acre (Smallholder)</span>
              <span>12.5 Acres</span>
              <span>25 Acres (Upper Bound)</span>
            </div>
          </div>

          {/* Biomass Multiplier Parameters */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2d6a4f]/10">
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500">Straw Yield Density</div>
              <div className="text-base font-bold text-[#1b4332] mt-0.5">
                {yieldTonsPerAcre} Tons / Acre
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">Standard High-Tiller Rice</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500">Market Spot Rate</div>
              <div className="text-base font-bold text-[#d97706] mt-0.5">
                ₹{spotPricePerTon} / Ton
              </div>
              <div className="text-[10px] text-amber-800 font-medium">IOCL Panipat Off-Take</div>
            </div>
          </div>

          {/* Environmental Yield Badge */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <Leaf className="w-4 h-4 text-[#2d6a4f]" />
              <span>Biogeochemical Soil Recovery</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/80 p-2 rounded-lg">
                <div className="text-gray-500 text-[10px]">Total Residue</div>
                <div className="font-bold text-[#1b4332] text-sm">{totalStrawTons} T</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg">
                <div className="text-gray-500 text-[10px]">Carbon Retained</div>
                <div className="font-bold text-[#2d6a4f] text-sm">{carbonRetainedKg} kg</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg">
                <div className="text-gray-500 text-[10px]">SOC Boost</div>
                <div className="font-bold text-emerald-600 text-sm">{socIncrease}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Financial KPI Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Gross Straw Cash Revenue */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Gross Straw Revenue
                </span>
                <div className="text-2xl lg:text-3xl font-extrabold text-[#b45309] mt-1">
                  ₹{grossStrawRevenue.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              {totalStrawTons} Tons dry baled straw @ ₹{spotPricePerTon}/Ton paid directly to farmer.
            </p>
          </div>

          {/* Card 2: Fertilizer Saved */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Fertilizer Expense Saved
                </span>
                <div className="text-2xl lg:text-3xl font-extrabold text-[#2d6a4f] mt-1">
                  ₹{fertilizerSaved.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#2d6a4f]">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Retained Nitrogen & Potassium saves 1.5 bags Urea/DAP per acre (₹2,300/acre).
            </p>
          </div>

          {/* Card 3: Machinery Pooling Savings */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-2xl border border-teal-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Cluster Pooling Savings
                </span>
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-800 mt-1">
                  ₹{poolingSavings.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              {isClusterPooled
                ? `Saved ₹800/acre by clustering contiguous plots (₹2,000 → ₹1,200).`
                : "Individual hiring lacks pooling discounts (Enable toggle to save)."}
            </p>
          </div>

          {/* Card 4: Net Farmer Gain (Highlight) */}
          <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#d8f3dc]">
                  Total Net Farmer Gain
                </span>
                <div className="text-2xl lg:text-3xl font-black text-amber-300 mt-1">
                  ₹{netFarmerGain.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl text-white">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
            <div className="text-xs text-emerald-100/90 mt-3 flex items-center justify-between">
              <span>Gross Straw + Fertilizer + Pooling</span>
              <span className="font-bold text-amber-200">
                +₹{Math.round(netFarmerGain / acres).toLocaleString()}/acre
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Analytics & Chart */}
      <div className="mt-8 pt-6 border-t border-[#2d6a4f]/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1b4332]">
              Agro-Economic Outcome Comparison
            </h3>
            <p className="text-xs text-gray-500">
              AgriShift OS Digital Monetization vs. Open Field Burning NGT Penalties & Nutrient Destruction
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 mt-2 md:mt-0">
            <AlertOctagon className="w-4 h-4" />
            <span>Burning Risk: -₹{totalBurnLoss.toLocaleString()} (Penalty + Nutrient Loss)</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#1b4332" fontWeight="600" />
              <YAxis stroke="#1b4332" />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid #2d6a4f",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="Straw Market Revenue (₹)" fill="#d97706" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Fertilizer Saved (₹)" fill="#2d6a4f" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Machinery Pooling Saved (₹)" fill="#52b788" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Burning Penalties & Loss (₹)" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Takeaway Note */}
        <div className="mt-4 bg-[#f4f6f0] p-4 rounded-xl flex items-start space-x-3 text-xs text-gray-700 border border-[#2d6a4f]/15">
          <Info className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#1b4332]">Agronomic Validation: </strong>
            Every ton of paddy straw contains approximately 5.5 kg Nitrogen, 2.3 kg Phosphorus (P₂O₅), and 25 kg Potassium (K₂O). Open burning permanently vaporizes 100% of Nitrogen and 20% of Phosphorus, forcing farmers to buy synthetic Urea and DAP. AgriShift OS retains these minerals in-situ or substitutes them via returned biochar, creating an immediate ₹2,300/acre input cost reduction.
          </div>
        </div>
      </div>
    </div>
  );
}

