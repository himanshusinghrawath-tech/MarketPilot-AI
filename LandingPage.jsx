import React from 'react';

export default function LandingPage({ onStartAnalysis, onSeeDemo, onOpenAuth, currentUser }) {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-surface text-on-surface -mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* FIXED HEADER FOR LANDING PAGE */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-[20px]">radar</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              MarketPilot AI
            </span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container text-tertiary font-label-numeric-sm text-label-numeric-sm uppercase tracking-wide">
              BETA / SERPAPI LIVE
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-space-xl">
            <a href="#interactive-demo" className="font-body-md text-body-md text-on-surface font-bold hover:text-primary transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              How It Works
            </a>
            <a href="#three-outcomes" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Outcomes
            </a>
            <a href="#evidence-section" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              SerpApi Evidence
            </a>
          </nav>

          <div className="flex items-center gap-space-md">
            <button
              onClick={onSeeDemo}
              className="hidden sm:inline font-body-md text-body-md text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs transition-colors cursor-pointer"
            >
              See Live Demo
            </button>
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container border border-surface-container-high text-xs font-semibold text-primary hover:border-primary/50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span>{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center justify-center px-space-lg py-space-xs rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_-2px_rgba(192,193,255,0.3)] cursor-pointer active:scale-95"
            >
              Analyze a Market →
            </button>
          </div>
        </div>
      </header>

      {/* AMBIENT DEPTH BACKDROPS */}
      <div className="relative w-full">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-primary/10 via-secondary-container/5 to-transparent blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-96 -left-36 w-80 h-80 bg-tertiary-container/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="absolute top-[800px] -right-36 w-96 h-96 bg-primary-container/10 blur-[110px] pointer-events-none rounded-full"></div>

        {/* 1. HERO SECTION */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 py-space-2xl max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high shadow-inner text-tertiary font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest mb-space-lg transition-transform hover:scale-105 duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>✦ AI MARKET INTELLIGENCE • POWERED BY SERPAPI</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-display text-on-surface max-w-4xl tracking-tight text-4xl sm:text-[3.25rem] sm:leading-[3.5rem] font-bold">
            Know the market <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-primary-fixed to-secondary bg-clip-text text-transparent">
              before you enter it.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-space-lg font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center leading-relaxed">
            MarketPilot analyzes live competitors, pricing, demand signals, and market gaps to help you make smarter business decisions — distilled into a clear{' '}
            <span className="text-tertiary font-semibold">ENTER</span>,{' '}
            <span className="text-secondary font-semibold">INVESTIGATE</span>, or{' '}
            <span className="text-error font-semibold">AVOID</span> recommendation.
          </p>

          {/* CTAs */}
          <div className="mt-space-xl flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-space-2xl py-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold shadow-xl shadow-primary/20 hover:bg-primary-fixed-dim transition-all flex items-center justify-center gap-space-xs group cursor-pointer active:scale-95"
            >
              <span>Analyze a Market</span>
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>

            <button
              onClick={onSeeDemo}
              className="w-full sm:w-auto px-space-xl py-space-md rounded-xl bg-surface-container-high text-on-surface font-headline-sm text-headline-sm hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-space-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg text-secondary">play_circle</span>
              <span>View Live Demo</span>
            </button>
          </div>

          {/* Trust Proof */}
          <div className="mt-space-xl flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest text-[10px] flex items-center justify-center font-bold text-on-surface border border-surface-container">
                BL
              </div>
              <div className="w-6 h-6 rounded-full bg-surface-bright text-[10px] flex items-center justify-center font-bold text-secondary border border-surface-container">
                SF
              </div>
              <div className="w-6 h-6 rounded-full bg-primary-container text-[10px] flex items-center justify-center font-bold text-on-primary border border-surface-container">
                SG
              </div>
            </div>
            <span>
              Trusted by <span className="text-on-surface font-semibold">1,400+</span> entrepreneurs, investors, and local operators across India, US & SE Asia.
            </span>
          </div>

          {/* 2. HERO FLOATING PREVIEW (Interactive Dashboard Teaser) */}
          <div className="mt-space-2xl w-full max-w-4xl relative cursor-pointer" id="interactive-demo" onClick={onSeeDemo}>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-2xl filter blur-2xl -z-10"></div>
            <div className="w-full bg-surface-container rounded-2xl shadow-2xl p-space-lg sm:p-space-xl text-left transform transition-all duration-300 hover:scale-[1.01] border border-surface-container-high">
              {/* Top Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm border-b border-surface-container-high/40">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_cafe</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Specialty Coffee Shop
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-numeric-sm text-label-numeric-sm">
                        LIVE FEED
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>Indiranagar, Bangalore, IN • Radius 3.5km</span>
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                  <span className="font-label-numeric-md text-label-numeric-md font-bold tracking-wider uppercase">
                    🟢 ENTER
                  </span>
                </div>
              </div>

              {/* Main Metric Bento */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mt-space-md">
                {/* Left Score Column */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between border border-surface-container-high/50">
                  <div>
                    <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-wider text-on-surface-variant">
                      Market Opportunity Index
                    </span>
                    <div className="mt-space-xs flex items-baseline gap-space-xs">
                      <span className="font-label-numeric-lg text-4xl text-on-surface font-bold tracking-tight">
                        82
                      </span>
                      <span className="font-label-numeric-md text-label-numeric-md text-on-surface-variant font-medium">
                        / 100
                      </span>
                    </div>
                    <p className="mt-space-xs font-body-sm text-body-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span>Top 4% decile for retail F&B hospitality</span>
                    </p>
                  </div>

                  {/* Sparkline Visual */}
                  <div className="mt-space-lg pt-space-sm">
                    <div className="flex justify-between items-center text-on-surface-variant font-label-numeric-sm text-label-numeric-sm mb-1">
                      <span>90-Day Search Velocity</span>
                      <span className="text-tertiary font-bold">+34.8% YoY</span>
                    </div>
                    <svg className="w-full h-14 text-tertiary" fill="none" viewBox="0 0 240 60">
                      <path
                        d="M0 50 Q 30 45, 60 40 T 120 28 T 180 32 T 240 8"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M0 50 Q 30 45, 60 40 T 120 28 T 180 32 T 240 8 L 240 60 L 0 60 Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                    </svg>
                  </div>
                </div>

                {/* Center Metrics Grid */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-space-sm">
                  {/* Metric 1: Demand */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                      <span>Demand Signal</span>
                      <span className="material-symbols-outlined text-primary text-base">query_stats</span>
                    </div>
                    <div className="my-space-xs">
                      <div className="flex items-baseline gap-1">
                        <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">86</span>
                        <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary font-bold">↗ High</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-label-numeric-sm text-[11px]">8.2k/mo target keyword queries</span>
                  </div>

                  {/* Metric 2: Competition */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                      <span>Competitor Density</span>
                      <span className="material-symbols-outlined text-secondary text-base">storefront</span>
                    </div>
                    <div className="my-space-xs">
                      <div className="flex items-baseline gap-1">
                        <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">68</span>
                        <span className="font-label-numeric-sm text-label-numeric-sm text-secondary font-bold">Moderate</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-secondary-container rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-label-numeric-sm text-[11px]">14 active brands within 3km</span>
                  </div>

                  {/* Metric 3: Pricing */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                      <span>Pricing Room</span>
                      <span className="material-symbols-outlined text-tertiary text-base">payments</span>
                    </div>
                    <div className="my-space-xs">
                      <div className="flex items-baseline gap-1">
                        <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">79</span>
                        <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary font-bold">Favorable</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-tertiary rounded-full" style={{ width: '79%' }}></div>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-label-numeric-sm text-[11px]">Median cup ticket: ₹340 ($4.10)</span>
                  </div>

                  {/* Metric 4: Market Gap */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                      <span>Unmet Gap</span>
                      <span className="material-symbols-outlined text-primary text-base">travel_explore</span>
                    </div>
                    <div className="my-space-xs">
                      <div className="flex items-baseline gap-1">
                        <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface font-bold">91</span>
                        <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary font-bold">Prime</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-tertiary rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-label-numeric-sm text-[11px]">Zero specialty pour-over cafes north block</span>
                  </div>
                </div>
              </div>

              {/* Bottom Micro Ticker */}
              <div className="mt-space-md pt-space-sm flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant font-label-numeric-sm text-label-numeric-sm border-t border-surface-container-high/40">
                <div className="flex items-center gap-space-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  <span>SerpApi Cluster: IND-BLR-04</span>
                </div>
                <span className="hidden sm:inline text-outline-variant">|</span>
                <span>Synthesized 182 Local Serp Points & 4,110 User Reviews</span>
                <span className="hidden sm:inline text-outline-variant">|</span>
                <span className="text-primary font-medium">Confidence: 94.2%</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. PAGE 2: HOW IT WORKS SECTION */}
      <section className="w-full bg-surface-container-lowest py-space-2xl" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-space-2xl">
            <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest text-primary font-bold">
              THE ANALYSIS ENGINE
            </span>
            <h2 className="mt-space-xs font-headline-lg text-headline-lg sm:text-[2.25rem] sm:leading-[2.75rem] text-on-surface font-bold tracking-tight text-3xl">
              From idea to decision in minutes.
            </h2>
            <p className="mt-space-sm font-body-lg text-body-lg text-on-surface-variant">
              Stop relying on gut feeling or expensive consultancies. Get institutional-grade market entry data in 4 simple steps.
            </p>
          </div>

          {/* 4 Horizontal Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Step 01 */}
            <div className="bg-surface-container rounded-xl p-space-lg flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-high">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-label-numeric-lg text-label-numeric-lg text-primary font-bold">01</span>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">tune</span>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">
                  Define your market
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Specify your business category, target location, and intended customer demographics.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
                <span className="text-on-surface-variant font-label-numeric-sm text-[11px] block">
                  Takes &lt; 30 seconds
                </span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-surface-container rounded-xl p-space-lg flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-high">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-label-numeric-lg text-label-numeric-lg text-secondary font-bold">02</span>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">satellite_alt</span>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">
                  Research live data
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Our agents pull real-time competitor locations, menus, reviews, and search trends via SerpApi.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
                <span className="text-on-surface-variant font-label-numeric-sm text-[11px] block">
                  Live SERP & Maps Harvest
                </span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-surface-container rounded-xl p-space-lg flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-high">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-label-numeric-lg text-label-numeric-lg text-tertiary font-bold">03</span>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">
                  Analyze the opportunity
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Proprietary AI analyzes saturation, pricing clusters, and unmet consumer demand.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
                <span className="text-on-surface-variant font-label-numeric-sm text-[11px] block">
                  Multi-variable heuristic models
                </span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-surface-container rounded-xl p-space-lg flex flex-col justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-high">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-label-numeric-lg text-label-numeric-lg text-primary font-bold">04</span>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">assignment_turned_in</span>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">
                  Make your decision
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Receive a clear ENTER / INVESTIGATE / AVOID verdict with verified evidence and strategy.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
                <span className="text-on-surface-variant font-label-numeric-sm text-[11px] block">
                  Actionable Dossier PDF
                </span>
              </div>
            </div>
          </div>

          {/* Process Diagram Visual Strip */}
          <div className="mt-space-xl p-space-lg rounded-xl bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container-highest">
            <div className="flex items-center gap-space-md">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary flex-shrink-0">
                <span className="material-symbols-outlined text-sm">bolt</span>
              </div>
              <span className="font-body-md text-body-md text-on-surface font-medium text-sm">
                Standard consulting reports take 3-6 weeks & cost $15,000+. MarketPilot completes it in 180 seconds.
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-label-numeric-sm text-label-numeric-sm uppercase flex-shrink-0">
              <span>Latency SLA: 180ms</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE VERDICT COMPARISON SECTION */}
      <section className="w-full py-space-2xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="three-outcomes">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest text-primary font-bold">
            THREE CONCRETE OUTCOMES
          </span>
          <h2 className="mt-space-xs font-headline-lg text-headline-lg sm:text-[2.25rem] sm:leading-[2.75rem] text-on-surface font-bold tracking-tight text-3xl">
            A verdict you can stake capital on.
          </h2>
          <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
            No ambiguous consulting jargon. MarketPilot evaluates live parameters and returns a decisive operational posture.
          </p>
        </div>

        {/* The 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Card 1: ENTER */}
          <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col justify-between shadow-lg hover:shadow-tertiary/5 transition-all border border-surface-container-high">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-sm py-1 rounded bg-tertiary/10 text-tertiary font-label-numeric-sm text-label-numeric-sm font-bold uppercase tracking-wider border border-tertiary/30">
                  🟢 ENTER
                </span>
                <div className="text-right">
                  <span className="font-label-numeric-lg text-2xl font-bold text-on-surface">82</span>
                  <span className="text-on-surface-variant font-label-numeric-sm">/100</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                Specialty Coffee
              </h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm mb-space-md text-xs">
                Indiranagar • Bangalore, IN
              </p>

              <div className="space-y-space-xs">
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Demand Intensity</span>
                  <span className="text-tertiary font-label-numeric-sm font-semibold">Very High (+34%)</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">White Space</span>
                  <span className="text-on-surface font-label-numeric-sm font-semibold">Roastery gap identified</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Avg Margin Headroom</span>
                  <span className="text-tertiary font-label-numeric-sm font-semibold">68% Gross</span>
                </div>
              </div>

              <p className="mt-space-md font-body-sm text-body-sm text-on-surface-variant text-xs leading-relaxed">
                Unsaturated premium segment with growing high-income density and expanding footfall corridors.
              </p>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
              <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary uppercase flex items-center gap-1 font-semibold text-xs">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Recommendation: Greenlight Lease</span>
              </span>
            </div>
          </div>

          {/* Card 2: INVESTIGATE */}
          <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col justify-between shadow-lg hover:shadow-secondary/5 transition-all border border-surface-container-high">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-sm py-1 rounded bg-secondary-container/20 text-secondary font-label-numeric-sm text-label-numeric-sm font-bold uppercase tracking-wider border border-secondary/30">
                  🟡 INVESTIGATE
                </span>
                <div className="text-right">
                  <span className="font-label-numeric-lg text-2xl font-bold text-on-surface">64</span>
                  <span className="text-on-surface-variant font-label-numeric-sm">/100</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                Cloud Kitchen Bowls
              </h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm mb-space-md text-xs">
                Bandra West • Mumbai, IN
              </p>

              <div className="space-y-space-xs">
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Demand Intensity</span>
                  <span className="text-secondary font-label-numeric-sm font-semibold">High Order Vol</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Discount Saturation</span>
                  <span className="text-secondary font-label-numeric-sm font-semibold">Aggressive (40% OFF)</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Customer Churn</span>
                  <span className="text-on-surface font-label-numeric-sm font-semibold">52% Platform Loyalty</span>
                </div>
              </div>

              <p className="mt-space-md font-body-sm text-body-sm text-on-surface-variant text-xs leading-relaxed">
                Volume is exceptionally healthy, but platform price wars compress unit economics unless unique supplier moat exists.
              </p>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
              <span className="font-label-numeric-sm text-label-numeric-sm text-secondary uppercase flex items-center gap-1 font-semibold text-xs">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>Recommendation: Audit Unit Economics</span>
              </span>
            </div>
          </div>

          {/* Card 3: AVOID */}
          <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col justify-between shadow-lg hover:shadow-error/5 transition-all border border-surface-container-high">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="px-space-sm py-1 rounded bg-error-container/40 text-error font-label-numeric-sm text-label-numeric-sm font-bold uppercase tracking-wider border border-error/30">
                  🔴 AVOID
                </span>
                <div className="text-right">
                  <span className="font-label-numeric-lg text-2xl font-bold text-on-surface">38</span>
                  <span className="text-on-surface-variant font-label-numeric-sm">/100</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
                Generic Bubble Tea
              </h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm mb-space-md text-xs">
                Connaught Place • Delhi, IN
              </p>

              <div className="space-y-space-xs">
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Demand Trajectory</span>
                  <span className="text-error font-label-numeric-sm font-semibold">Dropping (-28%)</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Saturation Index</span>
                  <span className="text-error font-label-numeric-sm font-semibold">Severe (21 Outlets)</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between text-body-sm text-xs">
                  <span className="text-on-surface-variant">Review Sentiment</span>
                  <span className="text-on-surface font-label-numeric-sm font-semibold">Fatigue recorded</span>
                </div>
              </div>

              <p className="mt-space-md font-body-sm text-body-sm text-on-surface-variant text-xs leading-relaxed">
                Late-cycle fad dynamics with declining local search interest and severe price competition from legacy operators.
              </p>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-surface-container-high/40">
              <span className="font-label-numeric-sm text-label-numeric-sm text-error uppercase flex items-center gap-1 font-semibold text-xs">
                <span className="material-symbols-outlined text-sm">block</span>
                <span>Recommendation: Pivot Concept</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EVIDENCE & CREDIBILITY SECTION */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-b border-surface-container-high" id="evidence-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
            {/* Text details */}
            <div>
              <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest text-secondary font-bold">
                VERIFIABLE INTELLIGENCE
              </span>
              <h2 className="mt-space-xs font-headline-lg text-headline-lg sm:text-[2.25rem] sm:leading-[2.75rem] text-on-surface font-bold tracking-tight text-3xl">
                Zero Hallucinations.<br />
                100% Backed by Live SERP & Maps Evidence.
              </h2>
              <p className="mt-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed">
                MarketPilot never guesses. Every metric is linked to live search results, business reviews, operational hours, rating trends, and regional intent clusters via SerpApi's enterprise node infrastructure.
              </p>

              <div className="mt-space-lg space-y-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mt-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">api</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Real-Time Extraction via SerpApi
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Queries are dispatched concurrently to live Google Search, Google Maps, and local directory endpoints.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary mt-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">fact_check</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Citable Data Grounding
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Inspect every underlying competitor citation, user review sentiment tag, and price listing directly inside your audit view.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mt-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">security</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Institutional Grade Freshness
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Zero stale dataset lag. You analyze the exact market ecosystem as it exists at this exact moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal / JSON Proof Mockup */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-surface-container-high">
              <div className="flex items-center justify-between pb-space-sm mb-space-md text-on-surface-variant font-label-numeric-sm text-label-numeric-sm border-b border-surface-container-high/40">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="ml-space-xs font-mono">serpapi_live_node.ts</span>
                </div>
                <span className="text-tertiary font-mono">STATUS: 200 OK</span>
              </div>

              <pre className="font-mono text-xs text-on-surface-variant overflow-x-auto leading-relaxed p-space-xs">
                <span className="text-outline-variant">// LIVE GEO-QUERY PAYLOAD</span>{'\n'}
                {'{'}{'\n'}
                {'  '}<span className="text-primary">"query"</span>: <span className="text-tertiary">"specialty coffee roastery indiranagar"</span>,{'\n'}
                {'  '}<span className="text-primary">"serpapi_engine"</span>: <span className="text-tertiary">"google_maps"</span>,{'\n'}
                {'  '}<span className="text-primary">"coordinates"</span>: [<span className="text-secondary">12.9716</span>, <span className="text-secondary">77.6412</span>],{'\n'}
                {'  '}<span className="text-primary">"harvest_timestamp"</span>: <span className="text-on-surface">"2026-10-04T10:42:19Z"</span>,{'\n'}
                {'  '}<span className="text-primary">"competitor_nodes_retrieved"</span>: <span className="text-secondary">18</span>,{'\n'}
                {'  '}<span className="text-primary">"signals_extracted"</span>: {'{'}{'\n'}
                {'    '}<span className="text-primary">"median_star_rating"</span>: <span className="text-secondary">4.3</span>,{'\n'}
                {'    '}<span className="text-primary">"review_velocity_index"</span>: <span className="text-tertiary">14.2</span>,{'\n'}
                {'    '}<span className="text-primary">"frequent_complaint"</span>: <span className="text-error">"lack of seating & pour-over options"</span>,{'\n'}
                {'    '}<span className="text-primary">"unmet_demand_score"</span>: <span className="text-tertiary">0.91</span>{'\n'}
                {'  '}{'}'},{'\n'}
                {'  '}<span className="text-primary">"verdict_output"</span>: <span className="text-tertiary">"ENTER_CONVICTION_HIGH"</span>{'\n'}
                {'}'}
              </pre>

              <div className="mt-space-md p-space-sm rounded-lg bg-surface-container flex items-center justify-between text-on-surface-variant font-label-numeric-sm text-[11px] border border-surface-container-high/40">
                <span>Verified By: SerpApi Node Router #419</span>
                <span className="text-on-surface font-mono">Latency: 142ms</span>
              </div>
            </div>
          </div>

          {/* Legal Compliance Disclaimer Note */}
          <div className="mt-space-xl p-space-md rounded-xl bg-surface-container text-on-surface-variant font-body-sm text-body-sm text-center border border-surface-container-high text-xs">
            <span className="font-semibold text-on-surface">Institutional Notice:</span> MarketPilot AI provides deterministic market intelligence and comparative business viability analytics. It is not an underwriter, broker, or financial advisor. All recommendations represent quantitative decision-support models.
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="w-full py-space-2xl px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-surface-container-high to-surface-container p-space-xl sm:p-space-2xl text-center relative overflow-hidden shadow-2xl border border-surface-container-highest">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-[90px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-widest text-primary font-bold mb-space-xs">
              GET STARTED TODAY
            </span>
            <h2 className="font-display text-display text-on-surface font-bold tracking-tight max-w-2xl text-3xl sm:text-[2.75rem] sm:leading-[3.25rem]">
              Ready to validate your next business idea?
            </h2>
            <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Enter any product category and target geography to get an immediate, data-backed verdict in minutes.
            </p>

            <div className="mt-space-xl flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto">
              <button
                onClick={onStartAnalysis}
                className="w-full sm:w-auto px-space-2xl py-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold shadow-xl shadow-primary/25 hover:bg-primary-fixed-dim transition-all flex items-center justify-center gap-space-xs group cursor-pointer active:scale-95"
              >
                <span>Start Free Analysis</span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={onSeeDemo}
                className="w-full sm:w-auto px-space-xl py-space-md rounded-xl bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm hover:bg-surface-bright transition-colors cursor-pointer"
              >
                View Live Bangalore Demo
              </button>
            </div>

            <div className="mt-space-lg flex flex-wrap justify-center items-center gap-space-lg text-on-surface-variant font-label-numeric-sm text-label-numeric-sm text-xs">
              <span>✓ No Credit Card Required</span>
              <span>✓ 1 Free Deep-Scan Included</span>
              <span>✓ Live SERP Feed</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low py-space-2xl border-t border-surface-container-high mt-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
            <div className="flex items-center gap-space-md">
              <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                MP
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                MarketPilot AI
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Institutional Market Intelligence Platform
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-space-lg font-label-numeric-sm text-label-numeric-sm text-on-surface-variant text-xs">
              <span>Data Feed: SerpApi Live Nodes</span>
              <span>Latency: &lt; 200ms</span>
              <span>SOC2 Type II Certified</span>
            </div>
          </div>

          <div className="mt-space-xl pt-space-lg border-t border-surface-container-high/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant text-xs">
            <p>© 2026 MarketPilot AI Inc. All rights reserved. Real-time SERP data synthesis engine.</p>
            <div className="flex items-center gap-space-lg">
              <span className="hover:text-on-surface transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-on-surface transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-on-surface transition-colors cursor-pointer">Security Attestation</span>
              <span className="hover:text-on-surface transition-colors cursor-pointer">API Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
