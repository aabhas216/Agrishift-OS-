import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import {
  ShoppingCart,
  Factory,
  Flame,
  FileCheck2,
  Recycle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  MapPin,
  TrendingUp,
  DollarSign,
  Package
} from "lucide-react";

export default function MarketplacePage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [biocharLedgers, setBiocharLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Listing Form State
  const [showListingModal, setShowListingModal] = useState<boolean>(false);
  const [newBaleType, setNewBaleType] = useState<string>("Dry High-Density Rectangular Bales");
  const [newQuantity, setNewQuantity] = useState<number>(20.0);
  const [newMoisture, setNewMoisture] = useState<number>(12.0);
  const [newAskingPrice, setNewAskingPrice] = useState<number>(1950.0);
  const [newVillage, setNewVillage] = useState<string>("Gharaunda, Karnal");
  const [listingSuccess, setListingSuccess] = useState<string | null>(null);

  // Contract Execution State
  const [contractingListingId, setContractingListingId] = useState<number | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState<number>(1);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const loadMarketplaceData = async () => {
    try {
      const [resBuyers, resListings, resOrders, resBiochar] = await Promise.all([
        fetch("/api/marketplace/buyers"),
        fetch("/api/marketplace/listings"),
        fetch("/api/marketplace/orders"),
        fetch("/api/marketplace/biochar-ledger")
      ]);
      if (resBuyers.ok) setBuyers(await resBuyers.json());
      if (resListings.ok) setListings(await resListings.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resBiochar.ok) setBiocharLedgers(await resBiochar.json());
    } catch (e) {
      console.error("Marketplace fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: 1, // Defaulting to demo farmer
          bale_type: newBaleType,
          quantity_tons: newQuantity,
          moisture_pct: newMoisture,
          asking_price_per_ton: newAskingPrice,
          pickup_village: newVillage,
          pickup_lat: 29.54,
          pickup_lon: 76.97
        })
      });
      if (res.ok) {
        setListingSuccess(`Successfully listed ${newQuantity} tons on the industrial market!`);
        setShowListingModal(false);
        loadMarketplaceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteContract = async (listingId: number) => {
    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          buyer_id: selectedBuyerId,
          delivery_deadline: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setOrderSuccess(data);
        setContractingListingId(null);
        loadMarketplaceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReinoculateBiochar = async (voucherCode: string) => {
    try {
      const res = await fetch(`/api/marketplace/biochar/reinoculate?voucher_code=${voucherCode}`, {
        method: "POST"
      });
      if (res.ok) {
        loadMarketplaceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f0] flex flex-col font-sans">
      <Head>
        <title>B2B Biomass Off-Take Marketplace - AgriShift OS</title>
        <meta
          name="description"
          content="Connects paddy farmers selling dry baled straw directly with 2G bio-ethanol, paper, and CBG refineries."
        />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Marketplace Header Banner */}
        <div className="bg-[#1b4332] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#2d6a4f] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Module 3: Ex-Situ Industrial Off-Take Portal</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                B2B Biomass Off-Take Marketplace
              </h1>
              <p className="mt-2 text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Direct procurement bridge linking smallholder straw balers with verified 2G Bio-Ethanol refineries, paper mills, and CBG bio-energy plants. Includes closed-loop Biochar byproduct soil re-inoculation.
              </p>
            </div>

            <button
              onClick={() => setShowListingModal(!showListingModal)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md self-start"
            >
              <PlusCircle className="w-5 h-5" />
              <span>List Biomass Straw Lot</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/60 text-center">
            <div>
              <div className="text-2xl font-black text-amber-300">₹1,950 - ₹2,100</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold">Spot Rate / Ton</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">1,600 Tons</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold">Daily Plant Demand</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#52b788]">10 : 1 Ratio</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold">Biochar Byproduct Loop</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">&lt; 15%</div>
              <div className="text-[11px] text-emerald-200 uppercase font-semibold">Moisture Specification</div>
            </div>
          </div>
        </div>

        {/* Modal / Panel: List Straw Lot */}
        {showListingModal && (
          <form
            onSubmit={handleCreateListing}
            className="agri-card p-6 bg-white border-2 border-amber-400 shadow-xl rounded-2xl animate-fadeIn"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#1b4332] flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Create New Biomass Straw Bale Listing</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowListingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Bale Packaging Format
                </label>
                <select
                  value={newBaleType}
                  onChange={(e) => setNewBaleType(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-300 rounded-lg p-2.5 text-xs font-semibold"
                >
                  <option value="Dry High-Density Rectangular Bales">
                    High-Density Rectangular (450 kg)
                  </option>
                  <option value="Heavy Round Straw Bales (250 kg)">
                    Heavy Round Bales (250 kg)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Quantity (Tons)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseFloat(e.target.value))}
                  required
                  className="w-full bg-[#f4f6f0] border border-gray-300 rounded-lg p-2 text-xs font-bold text-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Moisture Content (% Target &lt; 15%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newMoisture}
                  onChange={(e) => setNewMoisture(parseFloat(e.target.value))}
                  required
                  className="w-full bg-[#f4f6f0] border border-gray-300 rounded-lg p-2 text-xs font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Pickup Location / Village
                </label>
                <input
                  type="text"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  required
                  className="w-full bg-[#f4f6f0] border border-gray-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowListingModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2d6a4f] text-white rounded-xl text-xs font-bold hover:bg-[#1b4332] shadow-sm"
              >
                Publish Lot to Off-Take Market
              </button>
            </div>
          </form>
        )}

        {/* Order Executed Success Toast */}
        {orderSuccess && (
          <div className="p-5 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center space-x-2 font-black text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Contract {orderSuccess.order.order_code} Executed!</span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Committed {orderSuccess.order.quantity_tons} Tons to {orderSuccess.order.buyer} @ ₹
                {orderSuccess.order.price_per_ton}/Ton. Payout of ₹
                {orderSuccess.order.total_payout_inr.toLocaleString()} locked.
              </p>
            </div>

            <div className="bg-white/90 p-3 rounded-xl border border-emerald-300 text-xs">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Biochar Voucher Credited:</div>
              <div className="font-mono font-bold text-[#1b4332]">{orderSuccess.order.biochar_voucher_code}</div>
              <div className="text-[11px] text-[#2d6a4f] font-bold">
                +{orderSuccess.order.biochar_tons_earned} Tons Biochar Return Loop
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Verified Industrial Off-Takers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Factory className="w-5 h-5 text-[#2d6a4f]" />
            <h2 className="text-xl font-bold text-[#1b4332]">
              Verified Industrial Off-Takers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buyers.map((b) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-2xl border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {b.industry_type}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ₹{b.offtake_price_per_ton} / Ton
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#1b4332] mt-3">
                    {b.plant_name}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{b.location}</span>
                  </div>

                  <div className="my-4 pt-3 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Demand:</span>
                      <strong className="text-gray-800">{b.daily_intake_tons} Tons / Day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality Spec:</span>
                      <strong className="text-emerald-700">Cellulose &gt; 38%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Byproduct Return:</span>
                      <strong className="text-[#2d6a4f]">{b.biochar_return_ratio}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] bg-[#f4f6f0] p-2 rounded-lg text-gray-600">
                  🌱 <strong>Closed Loop:</strong> Returns pyrolyzed biochar amendment for soil carbon recovery.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Active Farmer Biomass Bale Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-[#2d6a4f]" />
              <h2 className="text-xl font-bold text-[#1b4332]">
                Active Biomass Straw Bale Listings
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              FPO & Smallholder Supply
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => {
              const isContracted = l.status !== "open";

              return (
                <div
                  key={l.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isContracted
                      ? "bg-gray-50 border-gray-300 opacity-80"
                      : "bg-white border-[#2d6a4f]/25 shadow-sm hover:border-[#2d6a4f]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-[#1b4332] bg-[#f4f6f0] px-2.5 py-0.5 rounded-md border border-[#2d6a4f]/15">
                      Lot #{l.id} • {l.farmer_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isContracted
                          ? "bg-gray-200 text-gray-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1b4332] mt-2">
                    {l.bale_type}
                  </h3>

                  <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{l.pickup_village}</span>
                  </div>

                  {/* Lot Lab Metrics */}
                  <div className="grid grid-cols-3 gap-2 my-4 bg-[#f4f6f0] p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-gray-400">Quantity</div>
                      <div className="font-extrabold text-[#1b4332]">{l.quantity_tons} T</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">Moisture</div>
                      <div className="font-extrabold text-emerald-700">{l.moisture_pct}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">Cellulose</div>
                      <div className="font-extrabold text-[#2d6a4f]">{l.cellulose_pct}%</div>
                    </div>
                  </div>

                  {/* Financial Total */}
                  <div className="flex justify-between items-center py-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-500">Total Lot Value:</span>
                    <span className="font-black text-amber-700 text-sm">
                      ₹{l.total_estimated_value?.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Button */}
                  {!isContracted ? (
                    contractingListingId === l.id ? (
                      <div className="mt-3 space-y-2 bg-[#f4f6f0] p-3 rounded-xl border border-[#2d6a4f]/20">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase">
                          Select Off-Take Buyer:
                        </label>
                        <select
                          value={selectedBuyerId}
                          onChange={(e) => setSelectedBuyerId(parseInt(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs font-semibold"
                        >
                          {buyers.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.plant_name} (₹{b.offtake_price_per_ton}/T)
                            </option>
                          ))}
                        </select>
                        <div className="flex space-x-2 pt-1">
                          <button
                            onClick={() => handleExecuteContract(l.id)}
                            className="flex-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-1.5 rounded-lg text-xs font-bold"
                          >
                            Confirm Order
                          </button>
                          <button
                            onClick={() => setContractingListingId(null)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setContractingListingId(l.id)}
                        className="w-full mt-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Execute Off-Take Contract</span>
                      </button>
                    )
                  ) : (
                    <div className="mt-3 py-2 text-center text-xs font-semibold text-gray-400 bg-gray-100 rounded-xl">
                      Contract Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Closed-Loop Biochar Byproduct Return Tracker */}
        <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#2d6a4f]/15 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="agri-badge bg-emerald-100 text-[#1b4332]">
                  Circular Bioeconomy
                </span>
                <h2 className="text-xl font-bold text-[#1b4332]">
                  Biochar Byproduct Return & Soil Carbon Tracking Loop
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Contractual 10:1 off-take credit returning 1 ton high-grade pyrolyzed biochar for every 10 tons biomass exported.
              </p>
            </div>

            <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2">
              <Recycle className="w-4 h-4 text-emerald-700" />
              <span>Closed Nutrient Cycle</span>
            </div>
          </div>

          {/* Biochar Ledger Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f6f0] text-gray-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-lg">Voucher Code</th>
                  <th className="p-3">Farmer & Village</th>
                  <th className="p-3">Refinery Partner</th>
                  <th className="p-3">Biochar Return (Tons)</th>
                  <th className="p-3">Stable Carbon Offset</th>
                  <th className="p-3">In-Situ Re-Inoculation Status</th>
                  <th className="p-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {biocharLedgers.map((item) => {
                  const isIncorporated = item.soil_reinoculation_status === "incorporated_into_soil";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1b4332]">
                        {item.voucher_code}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {item.farmer_name} <span className="text-gray-400">({item.village})</span>
                      </td>
                      <td className="p-3 text-gray-600">{item.buyer_name}</td>
                      <td className="p-3 font-extrabold text-emerald-800">
                        {item.biochar_tons} Tons
                      </td>
                      <td className="p-3 font-bold text-amber-700">
                        {item.carbon_offset_kg.toLocaleString()} kg CO₂e
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isIncorporated
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.soil_reinoculation_status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!isIncorporated ? (
                          <button
                            onClick={() => handleReinoculateBiochar(item.voucher_code)}
                            className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all"
                          >
                            Confirm Soil Inoculation
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>SOC Locked</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

