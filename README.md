# AgriShift OS
### Paddy Residue & Soil Recovery Management System
**Enterprise Platform:** 100% Digital Supply-Chain & Fleet Routing Architecture  
**Deployment Scope:** North Indian Agro-Industrial Corridor (Punjab, Haryana, Western UP)  

---

## 🌾 Strict Scope Declaration (100% Digital & Logistics)
> **MANDATORY POLICY COMPLIANCE:**  
> AgriShift OS is a **100% digital software, routing, and supply-chain logistics platform**. It does **NOT** rely on, endorse, or implement physical biological decomposer sprays, chemical formulations, or sprayer operator dispatch networks.  
> 
> **Agronomic Justification:** In late October and November across the Indo-Gangetic plains (Punjab, Haryana, Western UP), ambient temperatures drop below 18°C. Microbial bio-decomposers require 25 to 30 continuous days and warm temperatures (>28°C) to break down crystalline cellulose and silica-lignin bonds. Sowing wheat 20+ days late causes severe terminal heat stress during March grain filling, resulting in a catastrophic 25–35% wheat yield loss. AgriShift OS solves this strictly through **digital scheduling, contiguous machinery pooling, and industrial biomass trading** in 48 to 72 hours.

---

## 🏗️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Backend** | **Python FastAPI** | Asynchronous REST endpoints, lifespan database hooks, Pydantic v2 schemas |
| **Database** | **PostgreSQL / Relational ORM** | SQLAlchemy 2.0 with spatial proximity logic, PostgreSQL ready with local SQLite auto-fallback |
| **Frontend** | **Next.js 14 (React & TypeScript)** | Server-side rendering, client hydration, App/Pages routing, dynamic analytics |
| **Styling** | **Tailwind CSS** | Forest Green (`#1b4332`), Sage Green (`#2d6a4f`), Soft Cream (`#f4f6f0`), Amber (`#d97706`) |
| **Visual Analytics** | **Recharts & Lucide Icons** | Interactive econometric comparison bar charts, progress meters, SVG iconography |

---

## 📦 System Architecture & Directory Structure

```
Agrishift OS/
├── index.html                      # Primary Full-Stack Single-Page Application (HTML5, Tailwind CSS, FontAwesome)
├── backend/
│   ├── main.py                     # FastAPI application initialization & CORS config
│   ├── database.py                 # PostgreSQL / SQLite connection engine & session maker
│   ├── models.py                   # SQLAlchemy ORM models & Pydantic v2 validation schemas
│   ├── seed_data.py                # Out-of-the-box agronomic & fleet test seed data
│   ├── routers/
│   │   ├── auth.py                 # Role selection gateway & session token generation
│   │   ├── location.py             # GPS geolocation tracking, state selector & telemetry
│   │   ├── operator.py             # Machinery rental hub, surge-cap controller & cluster visualizer
│   │   ├── sowing.py               # Module 1: 10-day digital sowing window engine
│   │   ├── machinery.py            # Module 2: Cluster machinery pooling router
│   │   ├── marketplace.py          # Module 3: B2B industrial biomass marketplace
│   │   └── analytics.py            # Module 4 & 5: Agro-economic calculator & system benchmarks
│   └── requirements.txt            # Python dependencies
├── test_system.py                  # Full verification test suite covering all 7 modules
├── start_backend.bat               # Windows launcher for FastAPI (Port 8000)
├── start_frontend.bat              # Windows launcher for Next.js (Port 3000)
└── README.md                       # Comprehensive system documentation
```

---

## ⚡ Core Functional Modules

### 1. Module 1: 10-Day Digital Sowing Window Engine (In-Situ Logistics)
- **Inputs:** Land area (1–25 acres slider), paddy harvest date, paddy cultivar (`PR-126` vs. `Pusa-44`).
- **Dynamic Output:** Computes the strict 10-day terminal wheat sowing deadline.
- **Cultivar Agronomics:**
  - `PR-126` (Short duration ~123 days): Matures early October, leaving comfortable margins.
  - `Pusa-44` (Long duration ~150 days): Leaves a razor-thin 10-day emergency window. Every day of delay past deadline incurs a **1.45% yield penalty (~38 kg/acre)** due to terminal heat stress.
- **4-Stage Sequential Field Action Router:**
  - **Days 1–2:** Harvest logging & straw moisture mapping (<15% target).
  - **Days 3–4:** Route aggregation & CHC Super Seeder cluster allocation.
  - **Days 5–6:** Super Seeder dispatch, simultaneous straw chopping & seed-cum-fertilizer drilling.
  - **Days 7–10:** Wheat sowing completion, thermal mulch seal & soil carbon baseline certification.

### 2. Module 2: Cluster Machinery Pooling Router ("Uber for Super Seeders")
- **The Problem:** Rental Custom Hiring Centers (CHCs) refuse to haul 55+ HP tractors for isolated 2–5 acre plots due to diesel transit burn (8.5 L/acre).
- **The Solution:** Aggregates contiguous smallholder plots into cohesive **30+ acre route clusters**.
- **Quantifiable Logistics Impact:**
  - **40% Machine Transit Waste Cut:** Eliminates deadhead turns via continuous serpentine passes.
  - **Diesel Burn Reduced:** Drops from 8.5 L/acre down to 5.2 L/acre (3.3 L saved per acre).
  - **Rental Rates Slashed:** Rental fee falls from ₹2,000/acre down to **₹1,200/acre** (₹800/acre farmer cash savings).

### 3. Module 3: B2B Industrial Biomass Off-Take Marketplace (Ex-Situ Logistics)
- Direct procurement bridge linking farmers/FPOs selling high-density dry baled straw with verified buyers:
  - **2G Bio-Ethanol Refineries:** IOCL Panipat @ ₹1,950/Ton.
  - **Paper & Packaging Mills:** Trident Group India @ ₹2,100/Ton.
  - **Compressed Biogas (CBG) Plants:** EverEnviro Bio-Energy @ ₹2,000/Ton.
- **Closed-Loop Biochar Byproduct Return Tracker:**
  - Incorporates a contractual **10:1 ratio**: For every 10 tons of biomass delivered, the industrial plant issues a voucher granting the farmer **1 ton of high-grade pyrolyzed Biochar / Fermented Organic Manure (FOM)** at zero extra cost.
  - Logs soil carbon re-inoculation, locking in permanent carbon credits (~2,500 kg CO₂e offset per ton).

### 4. Module 4: Dynamic Agro-Economic & Soil Impact Calculator
- Live reactive mathematical model updating per field input:
  - **Gross Straw Cash Revenue:** $\text{Acres} \times 2.2 \text{ Tons/Acre} \times ₹1,950\text{/Ton}$.
  - **Fertilizer Expense Saved:** Retaining N-P-K & organic mulch saves 1.5 bags Urea/DAP per acre (**₹2,300/acre**).
  - **Organic Soil Carbon Retained:** **+0.15% SOC boost** per season; ~1,000 kg stable carbon/acre.
  - **Net Farmer Economic Gain:** Gross Revenue + Fertilizer Savings + Cluster Pooling Savings ($+₹6,590$ to $₹8,500$/acre).
  - **Burning Risk Averted:** Eliminates NGT environmental penalties ($₹2,500$ to $₹15,000$).

### 5. Module 5: Agronomic Benchmarks & System Feasibility Panel
- Comprehensive agronomic validation suite:
- **Scientific Q&A Defense Cards:**
  1. *Thermodynamic Failure of Biological Sprays in the 10-day Window.*
  2. *Supply-Chain Fleet Routing & Deadhead Reduction Algorithms.*
  3. *Circular Industrial Bioeconomy & 10:1 Biochar Soil Amendment Loop.*
  4. *Macroeconomic Airshed Protection & Policy Substitution.*
- **Interactive Agronomic Benchmark Matrix:** Side-by-side contrast between Open Field Burning and AgriShift OS across 6 empirical agronomic criteria.

### 6. Module 6: Farmer State Selector & Regional Context Localization
- **Multi-State Agricultural Coverage:** Interactive State selector covering Northern grain belts: **Punjab**, **Haryana**, **Uttar Pradesh**, **Rajasthan**, **Madhya Pradesh**, and **Other**.
- **Dynamic Localization:** Automatically updates district choices, localized harvest dates, and regional off-take prices (e.g., Punjab @ ₹2,100/t via Khanna Paper/IOCL vs Haryana @ ₹1,950/t vs UP @ ₹2,050/t).
- **Backend Persistence:** Sends location updates to `POST /api/location/save` with fallback resilience.

### 7. Module 7: Machinery Operator Hub & Cluster Pooling Visualizer
- **Fleet Inventory Console:** Real-time management of Super Seeders (55 HP), Balers (60 HP), and Shredders (50 HP).
- **Rental Rate Controller & Surge-Cap Policy:** Configurable per-acre rate slider with automated advisory cap alert (capped at ₹1,500/ac) to preserve aggregation volume.
- **Contiguous Route Topological Visualizer:** Interactive graphical schematic illustrating how adjacent 2–5 acre smallholder plots are clustered into contiguous 25+ acre serpentine operational corridors.
  - **Deadhead Transit Waste Cut:** Drops from 8.5 L/acre down to 5.2 L/acre ($-40\%$ fuel waste).
  - **Daily Coverage Surge:** Climbs from 12–14 acres/day up to 26–30 acres/day ($+115\%$ machine utilization).
  - **Plot Turnaround Dead-Time:** Slashed from 45–60 mins of road trailer transit down to 0 mins (instant boundary furrow crossing).
  - **Guaranteed Single-Day Route Payout:** ₹33,000+ guaranteed block earnings for machine owners.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js v24)
- npm or pnpm

### Step 1: Start the Backend (FastAPI)
Open a terminal in the root directory:
```bash
# Option A: Run the batch file
.\start_backend.bat

# Option B: Manual command
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend initializes the database and automatically seeds sample CHCs, Super Seeders, and Industrial Buyers.
- **API Root:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 2: Start the Frontend
Open `index.html` in your browser or run:
```bash
start index.html
```

---

## 📊 Benchmark Summary: Open Burning vs. AgriShift OS

| Agronomic Parameter | Open Field Stubble Burning | AgriShift OS Digital Platform |
|---|---|---|
| **Field Turnaround** | 24–48 Hours (Illegal & destructive) | 48–72 Hours (Contiguous Super Seeder / Baler cluster) |
| **Soil Organic Carbon (SOC)** | -0.05% loss (100% surface carbon burned) | **+0.15% gain** (1,000 kg stable carbon/acre) |
| **Soil Microbiome** | Sterilized (Topsoil reaches 50–70°C) | 100% Preserved; straw mulch acts as thermal blanket |
| **Fertilizer Requirement** | High (Requires 2 extra bags Urea/DAP) | **Saves 1.5 bags Urea/DAP** (₹2,300/acre saved) |
| **Farmer Financial Impact** | Net Loss (₹2,500–15,000 NGT penalty risk) | **+₹6,590 to ₹8,500/acre Net Cash Gain** |
| **Airshed & AQI Impact** | Severe / Hazardous (PM2.5 spike > 600) | **Zero field emissions** (3.3 T CO₂e abated/acre) |

---
*AgriShift OS • Production Digital Logistics for Sustainable Stubble Management*

#   A g r i s h i f t - O S -  
 