import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Tractor,
  Wheat,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react";

interface Props {
  acres: number;
}

export default function SowingTimeline({ acres }: Props) {
  const [harvestDate, setHarvestDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [variety, setVariety] = useState<string>("PR-126");
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch or calculate schedule
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sowing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          land_acres: acres,
          harvest_date: harvestDate,
          paddy_variety: variety,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScheduleData(data);
      } else {
        fallbackCalculation();
      }
    } catch (e) {
      fallbackCalculation();
    } finally {
      setLoading(false);
    }
  };

  const fallbackCalculation = () => {
    const harvestDt = new Date(harvestDate);
    const deadlineDt = new Date(harvestDt);
    deadlineDt.setDate(deadlineDt.getDate() + 10);

    const today = new Date();
    const diffTime = deadlineDt.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isPusa = variety === "Pusa-44";

    const addDays = (d: Date, n: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + n);
      return copy.toISOString().split("T")[0];
    };

    setScheduleData({
      land_acres: acres,
      harvest_date: harvestDate,
      paddy_variety: isPusa ? "Pusa-44 (Long Duration)" : "PR-126 (Short Duration)",
      wheat_sowing_deadline: deadlineDt.toISOString().split("T")[0],
      days_remaining: daysRemaining,
      window_status: daysRemaining > 5 ? "Optimal" : daysRemaining >= 0 ? "Critical Alert" : "Window Closed",
      yield_loss_risk_per_day_pct: isPusa ? 1.45 : 1.05,
      scientific_rationale: isPusa
        ? "Pusa-44 is a long-duration cultivar (145–150 days) that matures late, leaving a razor-thin 10-day emergency window. Every day of delay past Nov 15 incurs a 35-40 kg/acre (1.45%) terminal wheat yield penalty due to heat stress."
        : "PR-126 is a short-duration cultivar (120–123 days) from PAU that matures ~25 days earlier, allowing relaxed, orderly Super Seeder dispatch and optimal seedbed moisture retention.",
      daily_schedule: [
        {
          day_number: 1,
          day_range: "Days 1–2",
          stage_title: "Harvest Logging & Moisture Assessment",
          action_description: `Log combine harvester exit. Measure straw moisture (Target: 12-16%). Compute residue load (${(acres * 2.2).toFixed(1)} Tons across ${acres} acres).`,
          target_date: addDays(harvestDt, 1),
          status: "Completed",
          alert_level: "low",
        },
        {
          day_number: 3,
          day_range: "Days 3–4",
          stage_title: "Route Aggregation & Cluster Machinery Booking",
          action_description: `AgriShift OS proximity router pools your ${acres} acres with neighboring plots into a 30+ acre contiguous cluster, reducing rental fee to ₹1,200/acre.`,
          target_date: addDays(harvestDt, 3),
          status: "In Progress",
          alert_level: "medium",
        },
        {
          day_number: 5,
          day_range: "Days 5–6",
          stage_title: "Super Seeder Dispatch & In-Situ Precision Mulching",
          action_description: `55+ HP tractor-driven Super Seeder arrives on site. Chopping standing paddy stubble, simultaneously mixing it in topsoil, and drilling wheat seeds in one pass.`,
          target_date: addDays(harvestDt, 5),
          status: "Pending",
          alert_level: "high",
        },
        {
          day_number: 7,
          day_range: "Days 7–10",
          stage_title: "Wheat Sowing Complete & Soil Carbon Baseline Lock",
          action_description: `Wheat drilling verified. Soil mulch cover creates thermal insulation against early frosts. In-situ carbon baseline (+0.15% SOC) certified on AgriShift ledger.`,
          target_date: addDays(harvestDt, 9),
          status: "Pending",
          alert_level: "critical",
        },
      ],
    });
  };

  useEffect(() => {
    fetchSchedule();
  }, [acres, harvestDate, variety]);

  return (
    <div className="agri-card p-6 md:p-8 bg-white border border-[#2d6a4f]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2d6a4f]/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="agri-badge bg-[#2d6a4f]/10 text-[#2d6a4f] border border-[#2d6a4f]/20">
              Module 1
            </span>
            <h2 className="text-2xl font-bold text-[#1b4332]">
              10-Day Digital Sowing Window Engine
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Dynamic in-situ supply-chain router enforcing the strict terminal wheat planting deadline.
          </p>
        </div>

        {scheduleData && (
          <div className="flex items-center space-x-3">
            <div
              className={`px-4 py-2 rounded-xl font-bold text-sm border flex items-center space-x-2 ${
                scheduleData.window_status === "Optimal"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : scheduleData.window_status === "Critical Alert"
                  ? "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
                  : "bg-red-50 text-red-800 border-red-300"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {scheduleData.days_remaining >= 0
                  ? `${scheduleData.days_remaining} Days Remaining`
                  : "Window Closed"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Parameters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 bg-[#f4f6f0] p-4 rounded-xl border border-[#2d6a4f]/15">
        {/* Land Acres (read from slider or synced) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase">
            Active Farm Plot
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xl font-extrabold text-[#1b4332]">{acres}</span>
            <span className="text-xs text-gray-500 font-semibold">Acres</span>
            <span className="text-[11px] text-[#2d6a4f] bg-white px-2 py-0.5 rounded border border-[#2d6a4f]/20">
              Slider Linked
            </span>
          </div>
        </div>

        {/* Harvest Date Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase">
            Paddy Harvest Date
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>
        </div>

        {/* Paddy Variety Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase">
            Paddy Variety Comparison
          </label>
          <div className="flex space-x-2 mt-1">
            <button
              onClick={() => setVariety("PR-126")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                variety === "PR-126"
                  ? "bg-[#2d6a4f] text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              PR-126 (123 Days)
            </button>
            <button
              onClick={() => setVariety("Pusa-44")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                variety === "Pusa-44"
                  ? "bg-[#d97706] text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Pusa-44 (150 Days)
            </button>
          </div>
        </div>
      </div>

      {/* Deadline & Variety Impact Alert */}
      {scheduleData && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-4 rounded-xl border border-[#2d6a4f]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#2d6a4f] text-white rounded-xl">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Strict Wheat Sowing Deadline
              </div>
              <div className="text-lg font-extrabold text-[#1b4332]">
                {scheduleData.wheat_sowing_deadline}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 max-w-xl">
            <strong className="text-[#1b4332]">Yield Risk Factor: </strong>
            Every day of delay past deadline costs{" "}
            <span className="font-bold text-red-600">
              {scheduleData.yield_loss_risk_per_day_pct}% (~38 kg/acre)
            </span>{" "}
            in final grain yield due to March terminal heat shock.
          </div>
        </div>
      )}

      {/* 4-Stage Action Router Cards */}
      {scheduleData && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b4332] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#2d6a4f]" />
              <span>Digital Field Action Router (10-Day Sequential Dispatch)</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              In-Situ Machinery Logistics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scheduleData.daily_schedule.map((step: any) => {
              const isDone = step.status === "Completed";
              const isInProgress = step.status === "In Progress";

              return (
                <div
                  key={step.day_number}
                  className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isDone
                      ? "bg-emerald-50/50 border-emerald-300 text-gray-800"
                      : isInProgress
                      ? "bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-300/40"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  {/* Top Day Range Tag */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isDone
                            ? "bg-emerald-200 text-emerald-900"
                            : isInProgress
                            ? "bg-amber-400 text-black font-extrabold"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {step.day_range}
                      </span>

                      {isDone && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      {isInProgress && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-[#1b4332] leading-snug">
                      {step.stage_title}
                    </h4>

                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {step.action_description}
                    </p>
                  </div>

                  {/* Target Date Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">Target Date:</span>
                    <span className="font-mono font-bold text-gray-700">{step.target_date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scientific Rationale Callout */}
          <div className="mt-6 p-4 rounded-xl bg-[#2d6a4f]/5 border border-[#2d6a4f]/20 text-xs text-gray-700 leading-relaxed">
            <span className="font-bold text-[#1b4332]">Agronomic Analysis ({variety}): </span>
            {scheduleData.scientific_rationale}
          </div>
        </div>
      )}
    </div>
  );
}

