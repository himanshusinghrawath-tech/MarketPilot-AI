import React from 'react';

export default function DashboardHome({
  onNavigateNewAnalysis,
  onOpenAnalysis,
  analyses = []
}) {
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((acc, a) => acc + (a.overall_score || 80), 0) / analyses.length)
    : 80;

  const quickStarters = [
    {
      title: "Bangalore Specialty Coffee",
      location: "Koramangala, Bangalore",
      category: "Specialty Coffee Shop",
      score: 82,
      rec: "ENTER",
      recColor: "text-emerald-400",
      icon: "local_cafe"
    },
    {
      title: "Mumbai Cloud Kitchen",
      location: "Bandra West, Mumbai",
      category: "Cloud Kitchen / Bowls",
      score: 71,
      rec: "INVESTIGATE",
      recColor: "text-amber-400",
      icon: "soup_kitchen"
    },
    {
      title: "Delhi Boutique CrossFit",
      location: "Hauz Khas, New Delhi",
      category: "Fitness Studio / CrossFit",
      score: 46,
      rec: "AVOID",
      recColor: "text-rose-400",
      icon: "fitness_center"
    }
  ];

  return (
    <div className="flex flex-col gap-space-xl pb-24 w-full">
      {/* Welcome Banner */}
      <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="font-label-numeric-sm text-xs text-primary font-mono uppercase tracking-wider">
              ENTERPRISE MARKET VALIDATION
            </span>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">
              Welcome back, Arjun
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mt-1">
              Ready to analyze your next market? Run an autonomous live crawl powered by SerpApi across Google Maps, Shopping prices, and local demand signals.
            </p>
          </div>

          <button
            onClick={onNavigateNewAnalysis}
            className="px-space-xl py-3.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-space-sm hover:bg-primary-fixed-dim transition-all shadow-[0_0_20px_rgba(192,193,255,0.3)] flex-shrink-0 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ New Market Analysis</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-md flex flex-col justify-between shadow-md">
          <span className="font-label-numeric-sm text-xs uppercase tracking-wider text-outline font-mono">
            MARKETS ANALYZED
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-headline-lg text-3xl font-bold font-mono text-on-surface">
              {analyses.length}
            </span>
            <span className="text-xs text-secondary font-mono">verified dossiers</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-md flex flex-col justify-between shadow-md">
          <span className="font-label-numeric-sm text-xs uppercase tracking-wider text-outline font-mono">
            AVG OPPORTUNITY SCORE
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-headline-lg text-3xl font-bold font-mono text-primary">
              {avgScore}
            </span>
            <span className="text-xs text-outline font-mono">/ 100</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-md flex flex-col justify-between shadow-md">
          <span className="font-label-numeric-sm text-xs uppercase tracking-wider text-outline font-mono">
            ACTIVE FEEDS
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-headline-lg text-3xl font-bold font-mono text-tertiary">
              4
            </span>
            <span className="text-xs text-tertiary font-mono">SerpApi Engines</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-md flex flex-col justify-between shadow-md">
          <span className="font-label-numeric-sm text-xs uppercase tracking-wider text-outline font-mono">
            AVG PIPELINE RUNTIME
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-headline-lg text-3xl font-bold font-mono text-secondary">
              2.4s
            </span>
            <span className="text-xs text-outline font-mono">sub-second caching</span>
          </div>
        </div>
      </div>

      {/* Quick Archetype Launchers */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-numeric-sm text-xs text-outline uppercase tracking-wider font-mono">
            Quick Market Starters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          {quickStarters.map((qs, i) => (
            <div
              key={i}
              onClick={() => onOpenAnalysis(qs)}
              className="bg-surface-container-low border border-surface-container-high hover:border-primary/40 rounded-xl p-space-md flex flex-col justify-between cursor-pointer transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{qs.icon}</span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${qs.recColor}`}>
                    {qs.rec}
                  </span>
                </div>

                <h3 className="font-headline-sm text-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                  {qs.title}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  {qs.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-high/40 flex items-center justify-between text-xs font-mono">
                <span className="text-outline">Score: <strong className="text-on-surface">{qs.score}/100</strong></span>
                <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View dossier</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Analyses Table */}
      <section className="bg-surface-container-low border border-surface-container-high rounded-xl p-space-xl shadow-xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-lg text-on-surface font-bold">
              Recent Analyses
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Dossiers generated across your workspace
            </p>
          </div>
          <button
            onClick={onNavigateNewAnalysis}
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <span>+ New Analysis</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-surface-container-high">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-outline uppercase font-mono text-[11px] border-b border-surface-container-high">
              <tr>
                <th className="py-3 px-4">Market</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60 font-body-sm">
              {analyses.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => onOpenAnalysis(a)}
                  className="hover:bg-surface-container/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {a.category}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {a.location}
                  </td>
                  <td className="py-3 px-4 font-mono text-outline">
                    {a.date}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-on-surface">
                    {a.overall_score || 82}/100
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        a.recommendation === 'ENTER'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : a.recommendation === 'INVESTIGATE'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {a.recommendation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-primary hover:underline font-mono text-xs inline-flex items-center gap-1">
                      <span>Open</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
