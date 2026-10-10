import React, { useState } from 'react';

export default function PreviousAnalyses({
  analyses = [],
  onOpenAnalysis,
  onNavigateNewAnalysis
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('ALL');

  const filtered = analyses.filter((item) => {
    if (!item) return false;
    const cat = String(item.category || '').toLowerCase();
    const loc = String(item.location || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();
    const matchesSearch = cat.includes(search) || loc.includes(search);
    const matchesDecision =
      selectedDecision === 'ALL' || item.recommendation === selectedDecision;
    return matchesSearch && matchesDecision;
  });

  return (
    <div className="flex flex-col gap-space-xl pb-24 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-high/60 pb-space-md">
        <div>
          <span className="font-label-numeric-sm text-xs text-primary font-mono uppercase tracking-wider">
            ARCHIVED DOSSIERS
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight mt-0.5">
            Previous Analyses
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Historical market intelligence runs across your workspace
          </p>
        </div>

        <button
          onClick={onNavigateNewAnalysis}
          className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-bold hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_rgba(192,193,255,0.25)] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ New Analysis</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by category or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container text-xs text-on-surface pl-9 pr-3 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs font-mono">
          <span className="text-outline">Filter Decision:</span>
          {['ALL', 'ENTER', 'INVESTIGATE', 'AVOID'].map((dec) => (
            <button
              key={dec}
              onClick={() => setSelectedDecision(dec)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedDecision === dec
                  ? 'bg-surface-container-high text-primary border-primary/40 font-bold'
                  : 'bg-surface-container text-on-surface-variant border-surface-container-high'
              }`}
            >
              {dec}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[24px]">folder_off</span>
          </div>
          <h3 className="font-headline-sm text-base text-on-surface font-bold">
            No market analyses found
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mt-1">
            {searchTerm || selectedDecision !== 'ALL'
              ? 'Try modifying your search filter to see archived runs.'
              : 'Start your first analysis to discover market opportunities.'}
          </p>
          <button
            onClick={onNavigateNewAnalysis}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-bold hover:bg-primary-fixed-dim transition-all"
          >
            Analyze a Market
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-surface-container-high rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-outline uppercase font-mono text-[11px] border-b border-surface-container-high">
                <tr>
                  <th className="py-3.5 px-4">Market / Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Opportunity Score</th>
                  <th className="py-3.5 px-4">Decision</th>
                  <th className="py-3.5 px-4">Data Source</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60 font-body-sm">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onOpenAnalysis(item)}
                    className="hover:bg-surface-container/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">
                          insights
                        </span>
                        <span className="group-hover:text-primary transition-colors">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-outline">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                      {item.overall_score || 82} / 100
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          item.recommendation === 'ENTER'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : item.recommendation === 'INVESTIGATE'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {item.recommendation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {item.is_demo ? (
                        <span className="text-outline">Demo Mode</span>
                      ) : (
                        <span className="text-tertiary flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                          SerpApi Live
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-primary hover:underline font-mono text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Open Dossier</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
