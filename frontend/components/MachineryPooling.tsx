import React, { useState, useEffect } from "react";
import {
  Tractor,
  Layers,
  Fuel,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Truck
} from "lucide-react";

interface Props {
  acres: number;
}

export default function MachineryPooling({ acres }: Props) {
  const [clusters, setClusters] = useState<any[]>([]);
  const [chcs, setChcs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Farmer Match Form State
  const [farmerName, setFarmerName] = useState<string>("Baljit Sandhu");
  const [phone, setPhone] = useState<string>("+91-98721-99882");
  const [village, setVillage] = useState<string>("Taraori");
  const [district, setDistrict] = useState<string>("Karnal");
  const [plotAcres, setPlotAcres] = useState<number>(acres);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matching, setMatching] = useState<boolean>(false);

  // CHC Register Form State
  const [showChcForm, setShowChcForm] = useState<boolean>(false);
  const [newChcName, setNewChcName] = useState<string>("");
  const [newChcPhone, setNewChcPhone] = useState<string>("");
  const [newChcVillage, setNewChcVillage] = useState<string>("");
  const [newChcDistrict, setNewChcDistrict] = useState<string>("Karnal");

  useEffect(() => {
    setPlotAcres(acres);
  }, [acres]);

  const loadData = async () => {
    try {
      const [resClusters, resChcs] = await Promise.all([
        fetch("/api/machinery/clusters"),
        fetch("/api/machinery/chcs")
      ]);
      if (resClusters.ok) {
        setClusters(await resClusters.json());
      }
      if (resChcs.ok) {
        setChcs(await resChcs.json());
      }
    } catch (e) {
      console.error("Failed to load machinery data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatching(true);
    setMatchResult(null);

    try {
      const res = await fetch("/api/machinery/match-cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmerName,
          phone: phone,
          village: village,
          district: district,
          latitude: 29.8000,
          longitude: 76.9300,
          acres: plotAcres,
          target_date: new Date().toISOString().split("T")[0]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMatchResult(data);
        loadData(); // refresh clusters list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  const handleChcRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/machinery/chcs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChcName,
          contact_person: "CHC Manager",
          phone: newChcPhone,
          village: newChcVillage,
          district: newChcDistrict,
          latitude: 29.80,
          longitude: 76.93,
          base_rate_per_acre: 2000.0,
          pooled_rate_per_acre: 1200.0
        })
      });
      if (res.ok) {
        setShowChcForm(false);
        setNewChcName("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2d6a4f]/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="agri-badge bg-[#2d6a4f]/10 text-[#2d6a4f] border border-[#2d6a4f]/20">
              Module 2
            </span>
            <h2 className="text-2xl font-bold text-[#1b4332]">
              Cluster Machinery Pooling Router ("Uber for Super Seeders")
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Aggregating smallholder plots (2–5 acres) into contiguous 30+ acre route clusters to cut transit deadhead waste.
          </p>
        </div>

        <button
          onClick={() => setShowChcForm(!showChcForm)}
          className="flex items-center space-x-2 bg-[#f4f6f0] hover:bg-[#e8ece0] text-[#1b4332] border border-[#2d6a4f]/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all self-start"
        >
          <PlusCircle className="w-4 h-4 text-[#2d6a4f]" />
          <span>{showChcForm ? "Close CHC Registration" : "Register CHC / Fleet"}</span>
        </button>
      </div>

      {/* CHC Registration Form Dropdown */}
      {showChcForm && (
        <form onSubmit={handleChcRegister} className="my-6 p-5 bg-[#f4f6f0] rounded-2xl border border-[#2d6a4f]/30">
          <h4 className="font-bold text-sm text-[#1b4332] mb-3">Register Custom Hiring Center (CHC)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="CHC Name (e.g. Kisan Seva Kendra)"
              value={newChcName}
              onChange={(e) => setNewChcName(e.target.value)}
              required
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium"
            />
            <input
              type="text"
              placeholder="Phone (+91-...)"
              value={newChcPhone}
              onChange={(e) => setNewChcPhone(e.target.value)}
              required
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium"
            />
            <input
              type="text"
              placeholder="Village / Location"
              value={newChcVillage}
              onChange={(e) => setNewChcVillage(e.target.value)}
              required
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium"
            />
            <button
              type="submit"
              className="bg-[#2d6a4f] text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-[#1b4332]"
            >
              Save CHC
            </button>
          </div>
        </form>
      )}

      {/* Strategic Value Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-[#2d6a4f]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Rental Rate Cut</div>
              <div className="text-xl font-black text-[#1b4332]">
                ₹1,200 <span className="text-xs font-normal text-gray-500 line-through">₹2,000</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">40% Cost Reduction / Acre</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Transit Deadhead Waste</div>
              <div className="text-xl font-black text-amber-800">
                -40% <span className="text-xs font-normal text-gray-500">Transit Burn</span>
              </div>
              <div className="text-[11px] text-amber-700 font-bold">3.3 L Diesel Saved / Acre</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-xl border border-teal-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Optimal Cluster Size</div>
              <div className="text-xl font-black text-teal-800">
                30+ Acres <span className="text-xs font-normal text-gray-500">Contiguous</span>
              </div>
              <div className="text-[11px] text-teal-700 font-bold">Continuous Tractor Pass</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking & Match Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: Instant Request Form */}
        <div className="lg:col-span-5 bg-[#f4f6f0]/70 p-6 rounded-2xl border border-[#2d6a4f]/20">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-[#2d6a4f]" />
            <h3 className="font-bold text-base text-[#1b4332]">
              Request Cluster Machinery Match
            </h3>
          </div>

          <form onSubmit={handleMatchRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Farmer / Plot Holder Name
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Mobile Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Plot Land Area
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="25"
                    value={plotAcres}
                    onChange={(e) => setPlotAcres(parseFloat(e.target.value) || 1)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-black text-[#2d6a4f]"
                  />
                  <span className="text-xs font-bold text-gray-500">Ac</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800"
                >
                  <option value="Karnal">Karnal</option>
                  <option value="Panipat">Panipat</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Sangrur">Sangrur</option>
                  <option value="Patiala">Patiala</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={matching}
              className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md mt-2"
            >
              {matching ? (
                <span>Routing to Nearest Super Seeder...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Pool Plot & Cut ₹800/Acre Now</span>
                </>
              )}
            </button>
          </form>

          {/* Instant Match Notification */}
          {matchResult && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-100/90 border border-emerald-400 text-xs text-emerald-950 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Cluster Matched Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-800 mb-2">
                Your {plotAcres} acres are pooled into Route Cluster{" "}
                <strong className="font-mono bg-white px-1.5 py-0.5 rounded text-black">
                  {matchResult.cluster.cluster_code}
                </strong>
              </p>
              <div className="grid grid-cols-2 gap-2 text-center bg-white/70 p-2 rounded-lg text-[10px]">
                <div>
                  <span className="text-gray-500">Rental Fee:</span>
                  <div className="font-bold text-[#1b4332]">₹1,200/acre (Saved ₹800/ac)</div>
                </div>
                <div>
                  <span className="text-gray-500">Farmer Cash Saved:</span>
                  <div className="font-bold text-emerald-700">
                    +₹{matchResult.cluster.cost_saved_for_farmer_inr}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Active Clusters Route Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1b4332] flex items-center space-x-2">
              <Truck className="w-5 h-5 text-[#2d6a4f]" />
              <span>Contiguous Regional Route Clusters</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              Live Fleet Dispatches
            </span>
          </div>

          <div className="space-y-3">
            {clusters.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-[#f4f6f0] rounded-xl text-xs">
                No active clusters forming right now. Submit the form on the left to initialize a new route cluster!
              </div>
            )}

            {clusters.map((c: any) => {
              const progressPct = Math.min(100, Math.round((c.total_acres / 30.0) * 100));
              const isThresholdMet = c.total_acres >= 30.0;

              return (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-[#2d6a4f]/20 shadow-sm hover:border-[#2d6a4f]/50 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm bg-gray-100 text-[#1b4332] px-2.5 py-0.5 rounded-md border border-gray-200">
                        {c.cluster_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isThresholdMet
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {isThresholdMet ? "Contiguous 30+ Achieved" : "Forming Cluster"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">
                      Target Date: <strong className="text-gray-800">{c.target_date}</strong>
                    </div>
                  </div>

                  {/* Progress Bar towards 30 contiguous acres */}
                  <div className="my-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-600">
                        {c.farmer_count} Smallholders Pooled:{" "}
                        <strong className="text-[#1b4332]">{c.total_acres} Acres</strong>
                      </span>
                      <span className="font-bold text-[#2d6a4f]">
                        {progressPct}% of 30 Acre Target
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isThresholdMet ? "bg-[#2d6a4f]" : "bg-amber-500"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px]">Assigned Equipment:</span>
                      <div className="font-medium text-gray-800 truncate">{c.machine_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">Rental Rate:</span>
                      <div className="font-bold text-[#2d6a4f]">₹{c.rental_rate_per_acre}/acre (Pooled)</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">Diesel Saved:</span>
                      <div className="font-bold text-amber-700">{c.diesel_saved_liters} Liters</div>
                    </div>
                  </div>

                  {/* Route Summary */}
                  {c.route_summary && (
                    <div className="mt-2 text-[11px] text-gray-500 italic bg-[#f4f6f0] p-2 rounded-lg">
                      🗺️ {c.route_summary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

