# MarketPilot AI

> **"Know the market before you enter it."**

**SerpApi India Hackathon 2026** • **Track: Commerce & Market Intelligence**

MarketPilot AI is an autonomous, AI-powered market-entry intelligence agent designed for entrepreneurs and small businesses. Instead of generic chatbot answers, MarketPilot uses live SerpApi telemetry across Google Maps, Google Shopping, and Google Trends to evaluate competitor density, pricing elasticity, and search volume momentum, producing an explainable recommendation:

- 🟢 **ENTER** (Score 75–100)
- 🟡 **INVESTIGATE** (Score 50–74)
- 🔴 **AVOID** (Score 0–49)

---

## 🚀 Live Demo & Key Highlights

- **Stitch Design System Faithful Recreation**: Built with exact dark-theme aesthetic (`#0f131c` palette), typography (`Geist`, `JetBrains Mono`), and bespoke UI components from the Google Stitch specifications.
- **Deep SerpApi Core Integration**:
  - `google_maps`: Local competitor discovery, GPS pins, ratings, reviews, open hours, and distance.
  - `google_shopping`: Retail price distribution, wholesale equipment costs, and margin headroom.
  - `google` / `google_trends`: Search query velocity, seasonal demand momentum, and rising related queries.
- **Explainable Scoring Model**:
  $$\text{Overall Opportunity} = 0.30 \times \text{Demand} + 0.25 \times \text{MarketGap} + 0.25 \times \text{Pricing} + 0.20 \times \text{CompetitionOpportunity}$$
- **Full End-to-End User Flow**:
  1. **Landing Page**: Value proposition, technology trust strip, and interactive preview.
  2. **Market Analysis Form**: Progressive parameter input (Category benchmarks, Catchment radius slider 1–25km, Capex tiers, Mission goals, Target geo radar).
  3. **AI Agent Research Screen**: Animated multi-step agent checklist with real-time terminal telemetry stream.
  4. **Live Results Dashboard**: Large Decision Card, 4 Core Score gauges, Interactive Leaflet Competitor Map, Filterable/Sortable Competitor Table, Price Distribution Chart, Demand Trend Line Chart, Market Gaps, and Sources Panel.
  5. **Previous Analyses**: Historical dossiers archive with search and filtering.
  6. **Export Reports**: Clean printable PDF view (`window.print()`) and JSON download.
  7. **API Settings**: Safe `.env` key management and connection ping diagnostics.
- **Dual Operating Modes**:
  - **Live Mode**: Uses real-time SerpApi queries via `SERPAPI_API_KEY`.
  - **Demo Mode**: Seamless fallback to realistic pre-calibrated data when no API key is configured.
- **Enterprise Authentication & Session Security**:
  - Dedicated pages for **Sign In**, **Sign Up**, **Forgot Password**, and **Reset Password**.
  - Password encryption using salted **bcrypt** (`gensalt(rounds=12)`).
  - Stateless **JWT session tokens** (`HS256`, 7-day duration) stored securely in `localStorage` and sent via `Authorization: Bearer <token>`.
  - Secure **one-hour cryptographic password-reset tokens** (`secrets.token_urlsafe(32)`).
  - Protected dashboard route guards with automatic redirection to login for unauthenticated users.
  - Interactive executive profile drawer with role details, session management, and single-click logout.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Recharts, Leaflet, Material Symbols & Geist.
- **Backend**: Python 3.14, FastAPI, Uvicorn, Requests, Pydantic, Python-dotenv, Bcrypt, PyJWT.
- **Data Engine**: SerpApi (Google Maps, Google Shopping, Google Trends, Google Search).
- **Security**: PBKDF2/Bcrypt hash verification, HMAC-SHA256 JWTs, token-based password recovery.


---

## ⚡ Quick Start

### 1. Run the Unified Server

The FastAPI backend serves both the API endpoints and the production-built React frontend on a single port:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open your browser at **[http://localhost:8000](http://localhost:8000)**.

### 2. Frontend Development Mode (Hot Reload)

To develop with instant Vite hot-reloading:

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** (API requests are automatically proxied to port 8000).

---

## 🔑 Environment Configuration

Create or update `.env` in the root folder (or use the built-in **API & SerpApi Keys** page in the UI):

```env
# SerpApi Key for live market intelligence
SERPAPI_API_KEY=your_serpapi_key_here

# Optional LLM Key
LLM_API_KEY=
```

---

## 📊 Project Structure

```
MARKETPILOT AI/
├── backend/
│   ├── main.py                     # FastAPI application & static server
│   ├── config.py                   # Environment & settings
│   ├── services/
│   │   ├── serpapi_service.py       # Live SerpApi integration (Maps, Shopping, Trends)
│   │   ├── scoring_service.py       # Deterministic explainable scoring engine
│   │   ├── ai_agent_service.py      # Strategic synthesis & gap analysis
│   │   └── market_analysis_service.py # Orchestrator & historical storage
│   └── data/
│       └── history.json            # Analysis history database
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Route & state orchestrator
│   ├── index.css                   # Tailwind theme tokens & design system
│   ├── components/
│   │   ├── Sidebar.jsx             # Stitch-accurate navigation sidebar
│   │   ├── Header.jsx              # Stitch breadcrumb header & ⌘K search
│   │   ├── CommandPalette.jsx      # Quick search modal
│   │   ├── CompetitorMap.jsx       # Dark Leaflet map with POI pins
│   │   └── ScoreFormulaModal.jsx   # Explainable methodology modal
│   ├── pages/
│   │   ├── LandingPage.jsx         # Product landing page & trust strip
│   │   ├── DashboardHome.jsx       # Overview KPI metrics & recent runs
│   │   ├── NewAnalysis.jsx         # Stitch-exact analysis setup screen
│   │   ├── AgentResearch.jsx       # Multi-step animated agent pipeline
│   │   ├── MarketDeepDive.jsx      # Full results dashboard
│   │   ├── PreviousAnalyses.jsx    # Historical search & table
│   │   ├── ExportReport.jsx        # PDF/JSON executive deliverable
│   │   └── ApiSettings.jsx         # Credentials & live engine ping
│   └── services/
│       └── api.js                  # Frontend API client with offline fallback
├── package.json
├── vite.config.js
└── README.md
```
