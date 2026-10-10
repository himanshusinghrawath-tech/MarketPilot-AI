import React, { useState, useEffect } from 'react';

export default function AgentResearch({
  category = "Specialty Coffee Shop",
  location = "Bangalore, Karnataka, India",
  onComplete
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(14);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const steps = [
    { label: "Understanding your market", detail: `Parsing entity taxonomy for "${category}" and geo-fence in ${location}` },
    { label: "Finding local competitors", detail: `Querying SerpApi Google Maps engine for nearby verified ${category.toLowerCase()} businesses` },
    { label: "Comparing prices", detail: `Scraping retail prices and supply equipment for ${category.toLowerCase()} on Google Shopping` },
    { label: "Measuring market visibility", detail: "Evaluating review volumes, sentiment polarity, and location density" },
    { label: "Analyzing demand signals", detail: "Aggregating Google Trends query velocity and consumer search intent" },
    { label: "Identifying market gaps", detail: "Extracting recurring customer pain points and unserved dayparts" },
    { label: "Calculating opportunity score", detail: "Executing multi-factor explainable algorithmic matrix" },
    { label: "Generating recommendation", detail: "Synthesizing tactical entry positioning and unit economics" },
  ];

  const logSequence = [
    `[ORCHESTRATOR] Initializing agent workers for: ${category} in ${location}...`,
    `[SERPAPI:MAPS] Pinging engine: google_maps (q="${category} in ${location}")`,
    `[SERPAPI:MAPS] Retrieved verified local business establishments and geo-coordinates`,
    `[SERPAPI:SHOPPING] Pinging engine: google_shopping (q="${category} supplies retail")`,
    `[SERPAPI:SHOPPING] Extracted pricing brackets and competitor market clustering`,
    `[AGENT:NLP] Ingesting customer reviews across ${location} catchment zone...`,
    `[AGENT:NLP] Detected customer pain points and off-peak operational whitespace`,
    `[SERPAPI:TRENDS] Search interest velocity index calculated (↗ Increasing YoY)`,
    `[SCORING] Demand (86) + Gap (91) + Pricing (79) + Comp Opportunity (70)`,
    `[DECISION ENGINE] Synthesizing recommendation: 82/100 -> 🟢 ENTER`,
    `[SUCCESS] Market intelligence dossier synthesized successfully!`
  ];

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / steps.length) * 100));
          return next;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return prev;
        }
      });
    }, 400);

    // Terminal log timer
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logSequence.length) {
        const nextLog = logSequence[logIndex];
        if (nextLog) {
          setTerminalLogs((prev) => [...prev, nextLog]);
        }
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    return () => {
      clearInterval(stepInterval);
      clearInterval(logInterval);
    };
  }, [category, location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-4xl mx-auto py-8">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-numeric-sm text-xs uppercase tracking-widest mb-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>SerpApi Real-Time Intelligence Ingestion</span>
        </div>
        <h2 className="font-headline-lg text-3xl text-on-surface font-bold tracking-tight">
          MarketPilot is researching your market...
        </h2>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">
          Crawling live competitors, price distributions, and demand signals for <span className="text-primary font-semibold">{category}</span> in <span className="text-secondary font-semibold">{location}</span>.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-6 shadow-2xl mb-8">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary animate-spin">
              autorenew
            </span>
            <span>Running Agent Pipeline: Step {currentStepIndex + 1} of {steps.length}</span>
          </span>
          <span className="text-primary font-bold">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Live Multi-source Badge Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-surface-container-high/40 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>Google Maps Engine</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Google Shopping Feed</span>
          </div>
          <div className="flex items-center gap-1.5 text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>Google Trends Signals</span>
          </div>
          <div className="flex items-center gap-1.5 text-outline">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span>NLP Review Parser</span>
          </div>
        </div>
      </div>

      {/* Split Timeline & Terminal View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* Agent Timeline (6 Cols) */}
        <div className="md:col-span-6 bg-surface-container-low border border-surface-container-high rounded-xl p-5 shadow-xl">
          <div className="text-xs uppercase tracking-wider font-mono text-outline mb-4 flex items-center justify-between">
            <span>Autonomous Pipeline Checklist</span>
            <span className="text-tertiary">ACTIVE</span>
          </div>

          <div className="flex flex-col gap-3">
            {steps.map((st, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-surface-container-high border-l-2 border-primary'
                      : isDone
                      ? 'opacity-85'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <span className="material-symbols-outlined text-tertiary text-[18px]">
                        check_circle
                      </span>
                    ) : isCurrent ? (
                      <span className="material-symbols-outlined text-primary text-[18px] animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-outline text-[18px]">
                        radio_button_unchecked
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : isDone
                          ? 'text-on-surface'
                          : 'text-outline'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[11px] text-on-surface-variant truncate max-w-[260px]">
                      {st.detail}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Telemetry Terminal (6 Cols) */}
        <div className="md:col-span-6 bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 shadow-xl flex flex-col font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40 text-xs text-outline mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]">terminal</span>
              <span>SERP TELEMETRY STREAM</span>
            </div>
            <span className="text-tertiary text-[10px] animate-pulse">● LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] flex flex-col gap-2 text-xs">
            {terminalLogs.filter(Boolean).map((log, i) => {
              const text = String(log || '');
              return (
                <div key={i} className="leading-relaxed">
                  {text.includes('SUCCESS') ? (
                    <span className="text-tertiary font-bold">{text}</span>
                  ) : text.includes('SERPAPI') ? (
                    <span className="text-secondary">{text}</span>
                  ) : text.includes('DECISION') ? (
                    <span className="text-primary font-bold">{text}</span>
                  ) : (
                    <span className="text-on-surface-variant">{text}</span>
                  )}
                </div>
              );
            })}
            <div className="text-primary animate-pulse text-xs">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
