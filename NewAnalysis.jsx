import React, { useState } from 'react';

export default function NewAnalysis({
  initialCategory = "Specialty Coffee Shop",
  initialLocation = "Bangalore, Karnataka, India",
  onStartAnalysis
}) {
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [subLocation, setSubLocation] = useState("Koramangala & Indiranagar");
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [demographic, setDemographic] = useState(
    "College students, remote software engineers & young professionals"
  );
  const [budgetTier, setBudgetTier] = useState("₹5,00,000 - ₹15,00,000");
  const [goal, setGoal] = useState("Start a Brand-New Business");
  const [serpApiLive, setSerpApiLive] = useState(true);

  const budgetOptions = [
    {
      tier: "MICRO / BOOTSTRAP",
      amount: "₹2,00,000 - ₹5,00,000",
      desc: "Kiosk / pop-up scale"
    },
    {
      tier: "MID-MARKET RETAIL",
      amount: "₹5,00,000 - ₹15,00,000",
      desc: "Full-service boutique retail"
    },
    {
      tier: "EXPANSION SCALE",
      amount: "₹15,00,000+",
      desc: "Roastery & multi-counter"
    }
  ];

  const goalOptions = [
    {
      id: "Start a Brand-New Business",
      title: "Start a Brand-New Business",
      desc: "Zero-to-one feasibility, initial customer acquisition, and unit economics validation.",
      icon: "rocket_launch"
    },
    {
      id: "Expand an Existing Business",
      title: "Expand an Existing Business",
      desc: "Secondary outlet scouting, geographic cannibalization defense, and scale viability.",
      icon: "domain_add"
    },
    {
      id: "Find an Underserved Market Gap",
      title: "Find an Underserved Market Gap",
      desc: "Identify negative review clusters, catalog gaps, and unmet high-ticket services.",
      icon: "troubleshoot"
    },
    {
      id: "Compare Multi-Location Viability",
      title: "Compare Multi-Location Viability",
      desc: "Run comparative index across 2 to 4 zip codes simultaneously for highest IRR.",
      icon: "balance"
    }
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onStartAnalysis({
      category,
      location,
      sub_location: subLocation,
      radius_km: radiusKm,
      demographic,
      budget: budgetTier,
      goal,
      use_live_serpapi: serpApiLive
    });
  };

  const loadArchetype = (cat, loc, sub, rad, bud, dem, g) => {
    setCategory(cat);
    setLocation(loc);
    setSubLocation(sub);
    setRadiusKm(rad);
    setBudgetTier(bud);
    setDemographic(dem);
    if (g) setGoal(g);
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Top Diagnostic / Status Strip */}
      <div className="flex flex-wrap items-center justify-between py-space-sm mb-space-md border-b-0 gap-2">
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-wider text-outline">
            WORKSPACE RUNTIME:
          </span>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-label-numeric-sm text-label-numeric-sm text-secondary">
            AGENT-ORCHESTRATOR v4.19
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1 font-label-numeric-sm text-label-numeric-sm text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            SERPAPI CLUSTER STANDBY
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-space-md font-label-numeric-sm text-label-numeric-sm text-on-surface-variant">
          <span>TOKEN ALLOCATION: <span className="text-on-surface font-bold">14,200 / 25,000</span></span>
          <span className="text-outline-variant">|</span>
          <span>INDEX LATENCY: <span className="text-secondary font-bold font-mono">114ms</span></span>
        </div>
      </div>

      {/* Header Area */}
      <div className="relative mb-space-xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded bg-primary/10 text-primary font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest mb-space-sm">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          <span>Target Intelligence Pipeline</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight text-3xl font-bold">
          Analyze a New Market
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-space-xs">
          Tell MarketPilot what you want to explore. Our AI agents will analyze live competitor pricing, demand signals, and market saturation in seconds.
        </p>
      </div>

      {/* Core Layout Grid (Split Bento Composition) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Main Progressive Form Container (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <div className="bg-surface-container-low rounded-xl p-space-xl shadow-xl relative overflow-hidden border border-surface-container-high">
            {/* Subtle Interior Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <form className="flex flex-col gap-space-xl relative z-10" onSubmit={handleSubmit}>
              {/* FIELD 1: PRODUCT / BUSINESS CATEGORY */}
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <label className="font-label-numeric-md text-label-numeric-md uppercase tracking-wider text-on-surface flex items-center gap-space-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-surface-container-high text-primary font-label-numeric-sm text-label-numeric-sm">
                      01
                    </span>
                    Product / Business Category
                  </label>
                  <span className="font-label-numeric-sm text-label-numeric-sm text-outline">PRIMARY SECTOR ENTITY</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-primary text-[20px]">
                    storefront
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest text-on-surface pl-11 pr-space-md py-3 rounded-lg font-headline-sm text-headline-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-surface-container-high transition-all"
                    placeholder="e.g. Specialty Coffee Shop, Artisan Bakery, Padel Club..."
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>

                {/* Quick Suggestions Chips */}
                <div className="flex flex-wrap items-center gap-space-xs pt-1">
                  <span className="font-label-numeric-sm text-label-numeric-sm text-on-surface-variant pr-1">Try benchmark:</span>
                  {[
                    "Specialty Coffee Shop",
                    "Artisan Bakery",
                    "Fitness Studio / CrossFit",
                    "Coworking Space",
                    "Cloud Kitchen / Bowls"
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setCategory(chip)}
                      className={`px-space-sm py-1 rounded font-body-sm text-body-sm transition-all shadow-sm ${
                        category === chip
                          ? 'bg-surface-container-high text-primary font-bold border border-primary/30'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* FIELD 2: LOCATION & TARGET RADIUS */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-numeric-md text-label-numeric-md uppercase tracking-wider text-on-surface flex items-center gap-space-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-surface-container-high text-primary font-label-numeric-sm text-label-numeric-sm">
                      02
                    </span>
                    Location & Target Geo-Fence
                  </label>
                  <span className="font-label-numeric-sm text-label-numeric-sm text-secondary">SERP LOCAL ENGINE READY</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                      pin_drop
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest text-on-surface pl-11 pr-space-md py-3 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-secondary shadow-inner border border-surface-container-high transition-all"
                      placeholder="City, State, Country"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                      near_me
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest text-on-surface pl-11 pr-space-md py-3 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-secondary shadow-inner border border-surface-container-high transition-all"
                      placeholder="Sub-zones or neighborhoods"
                      type="text"
                      value={subLocation}
                      onChange={(e) => setSubLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Radius Range Slider Widget */}
                <div className="p-space-md rounded-lg bg-surface-container mt-1 flex flex-col gap-space-xs shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">trip_origin</span>
                      Search Catchment Radius
                    </span>
                    <span className="font-label-numeric-md text-label-numeric-md text-secondary font-bold font-mono">
                      {parseFloat(radiusKm).toFixed(1)} km
                    </span>
                  </div>
                  <input
                    className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-[#7bd0ff]"
                    max="25"
                    min="1"
                    step="0.5"
                    type="range"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between font-label-numeric-sm text-label-numeric-sm text-outline">
                    <span>Hyperlocal (1 km)</span>
                    <span>District Core (5 km)</span>
                    <span>Metropolitan (25 km)</span>
                  </div>
                </div>
              </div>

              {/* FIELD 3: TARGET CUSTOMER DEMOGRAPHIC */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-numeric-md text-label-numeric-md uppercase tracking-wider text-on-surface flex items-center gap-space-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-surface-container-high text-primary font-label-numeric-sm text-label-numeric-sm">
                      03
                    </span>
                    Target Customer Demographic
                  </label>
                  <span className="font-label-numeric-sm text-label-numeric-sm text-outline">AUDIENCE INTENT SYNTAX</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-space-md top-3 text-primary text-[20px]">
                    groups
                  </span>
                  <textarea
                    className="w-full bg-surface-container-lowest text-on-surface pl-11 pr-space-md py-2.5 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary shadow-inner resize-none border border-surface-container-high transition-all"
                    placeholder="Specify income tiers, habits, professions, or consumption patterns..."
                    rows={2}
                    value={demographic}
                    onChange={(e) => setDemographic(e.target.value)}
                  />
                </div>
              </div>

              {/* FIELD 4: PLANNED STARTUP BUDGET */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-numeric-md text-label-numeric-md uppercase tracking-wider text-on-surface flex items-center gap-space-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-surface-container-high text-primary font-label-numeric-sm text-label-numeric-sm">
                      04
                    </span>
                    Planned Startup Capital / Capex Tier
                  </label>
                  <span className="font-label-numeric-sm text-label-numeric-sm text-outline">CAPEX SIZING</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {budgetOptions.map((opt, i) => {
                    const isSelected = budgetTier === opt.amount;
                    return (
                      <div
                        key={i}
                        onClick={() => setBudgetTier(opt.amount)}
                        className={`cursor-pointer p-space-md rounded-lg flex flex-col gap-1 transition-all border ${
                          isSelected
                            ? 'bg-surface-container-high border-primary/50 shadow-[0_0_16px_rgba(192,193,255,0.1)]'
                            : 'bg-surface-container border-surface-container-high hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-label-numeric-sm text-label-numeric-sm ${isSelected ? 'text-primary font-bold' : 'text-outline'}`}>
                            {isSelected ? 'SELECTED TIER' : opt.tier}
                          </span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                          )}
                        </div>
                        <span className="font-label-numeric-md text-label-numeric-md text-on-surface font-bold">
                          {opt.amount}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {opt.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 5: PRIMARY BUSINESS GOAL */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-numeric-md text-label-numeric-md uppercase tracking-wider text-on-surface flex items-center gap-space-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-surface-container-high text-primary font-label-numeric-sm text-label-numeric-sm">
                      05
                    </span>
                    Primary Business Goal & Strategic Angle
                  </label>
                  <span className="font-label-numeric-sm text-label-numeric-sm text-outline">MISSION DIRECTIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                  {goalOptions.map((g) => {
                    const isSelected = goal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`cursor-pointer p-space-md rounded-lg flex items-start gap-space-md transition-all border ${
                          isSelected
                            ? 'bg-surface-container-high border-primary/40 shadow-[0_0_12px_rgba(192,193,255,0.08)]'
                            : 'bg-surface-container border-surface-container-high hover:bg-surface-container-high'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-primary/20 text-primary'
                              : 'bg-surface-container-lowest text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{g.icon}</span>
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                              {g.title}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full transition-all ${
                                isSelected
                                  ? 'bg-primary shadow-[0_0_8px_rgba(192,193,255,0.8)]'
                                  : 'bg-outline-variant'
                              }`}
                            ></span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
                            {g.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 6: DATA ENGINE TOGGLE */}
              <div className="p-space-md rounded-lg bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-inner border border-surface-container-high">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                        SerpApi Live Integration Feed
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary/15 text-tertiary font-label-numeric-sm text-label-numeric-sm font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        ACTIVE
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Live Maps, Google Shopping, Local Pack, Search Query Volume & Sentiment feeds enabled.
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={serpApiLive}
                    onChange={(e) => setSerpApiLive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary-container"></div>
                </label>
              </div>

              {/* CTA Area */}
              <div className="flex flex-col gap-space-sm pt-space-sm">
                <button
                  type="submit"
                  className="w-full py-4 px-space-xl rounded-lg bg-primary text-on-primary font-headline-md text-headline-md font-bold flex items-center justify-center gap-space-sm hover:bg-primary-fixed-dim transition-all shadow-[0_0_24px_rgba(192,193,255,0.35)] active:scale-[0.99] cursor-pointer"
                >
                  <span>Start Market Analysis</span>
                  <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                </button>

                <div className="flex items-start gap-space-xs text-outline px-1">
                  <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">
                    verified_user
                  </span>
                  <p className="font-label-numeric-sm text-label-numeric-sm leading-relaxed text-xs">
                    MarketPilot analyzes real-time market data via SerpApi. Market intelligence, opportunity indices, and saturation scores provide deterministic decision support, not financial guarantees.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Diagnostic / Quick Load Column (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Live Map Pre-Scout Radar Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-xl border border-surface-container-high">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs font-label-numeric-sm text-label-numeric-sm text-on-surface uppercase">
                <span className="material-symbols-outlined text-secondary text-[16px]">location_searching</span>
                <span>Target Geo Context</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-numeric-sm text-label-numeric-sm text-tertiary font-mono">
                LAT: 12.9352 | LNG: 77.6245
              </span>
            </div>

            {/* Location Map Preview */}
            <div
              className="w-full h-44 rounded-lg bg-cover bg-center relative overflow-hidden flex flex-col justify-between p-space-sm shadow-inner border border-surface-container-highest"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80')"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/40 to-surface-container-lowest/20 pointer-events-none"></div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur font-label-numeric-sm text-label-numeric-sm text-on-surface">
                  {radiusKm}km Scan Zone
                </span>
                <span className="px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary backdrop-blur font-label-numeric-sm text-label-numeric-sm font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                  Pinging G-Maps
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold drop-shadow">
                    {subLocation || "Bangalore Core District"}
                  </p>
                  <p className="font-label-numeric-sm text-label-numeric-sm text-on-surface-variant drop-shadow">
                    Est. 48 competing cafes within radius
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary text-[24px]">radar</span>
              </div>
            </div>

            {/* Metric Pulse Strip */}
            <div className="grid grid-cols-2 gap-space-xs pt-1">
              <div className="p-space-sm rounded bg-surface-container flex flex-col border border-surface-container-high">
                <span className="font-label-numeric-sm text-label-numeric-sm text-outline">FOOTFALL DENSITY</span>
                <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">
                  92.4 <span className="text-tertiary font-body-sm text-body-sm">/ 100</span>
                </span>
                <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary mt-0.5">High Evening Peaks</span>
              </div>
              <div className="p-space-sm rounded bg-surface-container flex flex-col border border-surface-container-high">
                <span className="font-label-numeric-sm text-label-numeric-sm text-outline">COMMERCIAL RENT EST.</span>
                <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">
                  ₹140 <span className="text-on-surface-variant font-body-sm text-body-sm">/sq ft</span>
                </span>
                <span className="font-label-numeric-sm text-label-numeric-sm text-secondary mt-0.5">Avg Koramangala</span>
              </div>
            </div>
          </div>

          {/* Quick Load Templates Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-xl border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-wider text-outline">
                SAVED ARCHETYPES
              </span>
              <span className="font-label-numeric-sm text-label-numeric-sm text-primary">Pre-calibrated</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Pre-calibrated parameter sets for instant one-click pipeline spin-up:
            </p>

            <div className="flex flex-col gap-space-xs mt-1">
              {/* Archetype 1 */}
              <div
                className="group p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-between border border-surface-container-high/40"
                onClick={() =>
                  loadArchetype(
                    "Cloud Kitchen / Bowls",
                    "Bandra West, Mumbai, India",
                    "Pali Hill & Hill Road",
                    3.0,
                    "₹5,00,000 - ₹15,00,000",
                    "Affluent working couples ordering weekday dinners",
                    "Start a Brand-New Business"
                  )
                }
              >
                <div className="flex items-center gap-space-sm overflow-hidden">
                  <div className="w-7 h-7 rounded bg-surface-container-highest text-secondary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-body-sm text-body-sm text-on-surface font-bold truncate group-hover:text-primary transition-colors text-xs">
                      Mumbai Cloud Kitchen
                    </span>
                    <span className="font-label-numeric-sm text-label-numeric-sm text-outline truncate text-[10px]">
                      Bandra West • ₹10L Capex
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">
                  arrow_forward
                </span>
              </div>

              {/* Archetype 2 */}
              <div
                className="group p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-between border border-surface-container-high/40"
                onClick={() =>
                  loadArchetype(
                    "Fitness Studio / CrossFit",
                    "Hauz Khas, New Delhi, India",
                    "Green Park & SDA Market",
                    4.0,
                    "₹15,00,000+",
                    "High net-worth urbanites & fitness influencers",
                    "Find an Underserved Market Gap"
                  )
                }
              >
                <div className="flex items-center gap-space-sm overflow-hidden">
                  <div className="w-7 h-7 rounded bg-surface-container-highest text-tertiary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-body-sm text-body-sm text-on-surface font-bold truncate group-hover:text-primary transition-colors text-xs">
                      Delhi Boutique Gym
                    </span>
                    <span className="font-label-numeric-sm text-label-numeric-sm text-outline truncate text-[10px]">
                      Hauz Khas • ₹25L Capex
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">
                  arrow_forward
                </span>
              </div>

              {/* Archetype 3 */}
              <div
                className="group p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-between border border-surface-container-high/40"
                onClick={() =>
                  loadArchetype(
                    "Specialty Coffee Shop",
                    "Madhapur, Hyderabad, India",
                    "Hitec City & Jubilee Hills",
                    3.5,
                    "₹5,00,000 - ₹15,00,000",
                    "IT corridor tech employees & Gen Z tea enthusiasts",
                    "Start a Brand-New Business"
                  )
                }
              >
                <div className="flex items-center gap-space-sm overflow-hidden">
                  <div className="w-7 h-7 rounded bg-surface-container-highest text-primary-fixed group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">local_cafe</span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-body-sm text-body-sm text-on-surface font-bold truncate group-hover:text-primary transition-colors text-xs">
                      Hyderabad Bubble Tea & Cafe
                    </span>
                    <span className="font-label-numeric-sm text-label-numeric-sm text-outline truncate text-[10px]">
                      Madhapur • ₹8L Capex
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>

          {/* Execution Pipeline Visual Preview */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-xl border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-wider text-outline">
                EXECUTION TELEMETRY
              </span>
              <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary font-mono">
                EST: ~6.4s RUNTIME
              </span>
            </div>
            <div className="flex flex-col gap-space-xs font-label-numeric-sm text-label-numeric-sm text-xs">
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container border border-surface-container-high/30">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                  Agent 1: SerpApi Geospatial Crawl
                </span>
                <span className="text-on-surface font-mono">50 POIs</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container border border-surface-container-high/30">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
                  Agent 2: Price Elasticity Scraper
                </span>
                <span className="text-on-surface font-mono">Live Menus</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container border border-surface-container-high/30">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">pending</span>
                  Agent 3: Sentiment & Review Gap NLP
                </span>
                <span className="text-secondary font-mono">Queued</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container border border-surface-container-high/30">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-outline">hourglass_empty</span>
                  Agent 4: Unit Economic Synthesis
                </span>
                <span className="text-outline font-mono">Waiting</span>
              </div>
            </div>
          </div>

          {/* Historical Insight Context Image */}
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-surface-container-high">
            <img
              className="w-full h-32 object-cover brightness-75"
              alt="Artisanal coffee shop"
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent p-space-sm flex flex-col justify-end">
              <span className="font-label-numeric-sm text-label-numeric-sm text-primary uppercase font-bold text-[10px]">
                BENCHMARK INTELLIGENCE
              </span>
              <p className="font-body-sm text-body-sm text-on-surface font-semibold text-xs leading-snug">
                Specialty coffee gross margins in Koramangala cluster average 68.4% with ₹340 AOV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
