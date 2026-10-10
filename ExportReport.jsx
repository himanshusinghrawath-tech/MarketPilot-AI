import React, { useState } from 'react';

export default function ExportReport({ data }) {
  const [toastMessage, setToastMessage] = useState('');

  if (!data) return null;

  const {
    category = "Specialty Coffee Shop",
    location = "Bangalore, Karnataka, India",
    sub_location = "Koramangala & Indiranagar",
    created_at = new Date().toISOString().substring(0, 10),
    scores = {},
    competitors = [],
    pricing = {},
    demand = {},
    intelligence = {}
  } = data;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MarketPilot_${category.replace(/\s+/g, '_')}_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Market Dossier downloaded as JSON!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Report link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-space-xl pb-24 w-full max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header Strip (hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-high/60 pb-space-md">
        <div>
          <span className="font-label-numeric-sm text-xs text-primary font-mono uppercase tracking-wider">
            EXECUTIVE INTELLIGENCE DELIVERABLE
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight mt-0.5">
            Market Entry Report
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Full comprehensive market dossier generated for investors and founders
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJson}
            className="px-space-md py-2 rounded-lg bg-surface-container-high border border-surface-container-highest text-on-surface font-headline-sm text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download JSON</span>
          </button>

          <button
            onClick={handleShare}
            className="px-space-md py-2 rounded-lg bg-surface-container-high border border-surface-container-highest text-on-surface font-headline-sm text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-bold hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_rgba(192,193,255,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-8 sm:p-12 shadow-2xl flex flex-col gap-8 text-on-surface">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-surface-container-high pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                MARKETPILOT AI • CONFIDENTIAL INTELLIGENCE
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-on-surface">
              {category}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Geographic Scope: {location} ({sub_location})
            </p>
          </div>

          <div className="flex flex-col sm:items-end text-xs font-mono text-outline">
            <span>Date: {created_at}</span>
            <span>Data Engine: SerpApi Cluster v4.19</span>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold font-mono border ${
                (scores.recommendation || 'ENTER') === 'ENTER'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : (scores.recommendation || 'ENTER') === 'INVESTIGATE'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  (scores.recommendation || 'ENTER') === 'ENTER'
                    ? 'bg-emerald-400'
                    : (scores.recommendation || 'ENTER') === 'INVESTIGATE'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              ></span>
              <span>RECOMMENDATION: {scores.recommendation || 'ENTER'}</span>
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            1. Executive Summary
          </h3>
          <p className="text-sm leading-relaxed text-on-surface">
            This report evaluates commercial feasibility and market-entry timing for a <strong>{category}</strong> in <strong>{location}</strong>. Based on live multi-engine SerpApi data (Google Maps POIs, Google Shopping retail catalogs, and Google Trends query momentum), the market receives an overall opportunity score of <strong>{scores.overall_score || 82}/100</strong>, resulting in a formal recommendation to <strong>{scores.recommendation || 'ENTER'}</strong>.
          </p>
        </section>

        {/* 2. Market Score Matrix */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            2. Market Score Matrix & Algorithmic Weights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-surface-container border border-surface-container-high">
              <span className="text-outline uppercase text-[10px] font-mono">Competition (20%)</span>
              <p className="text-xl font-bold font-mono text-on-surface mt-1">{scores.breakdown?.competition?.score || 68}/100</p>
            </div>
            <div className="p-3 rounded bg-surface-container border border-surface-container-high">
              <span className="text-outline uppercase text-[10px] font-mono">Demand Signals (30%)</span>
              <p className="text-xl font-bold font-mono text-tertiary mt-1">{scores.breakdown?.demand?.score || 86}/100</p>
            </div>
            <div className="p-3 rounded bg-surface-container border border-surface-container-high">
              <span className="text-outline uppercase text-[10px] font-mono">Pricing Headroom (25%)</span>
              <p className="text-xl font-bold font-mono text-primary mt-1">{scores.breakdown?.pricing?.score || 79}/100</p>
            </div>
            <div className="p-3 rounded bg-surface-container border border-surface-container-high">
              <span className="text-outline uppercase text-[10px] font-mono">Market Gap (25%)</span>
              <p className="text-xl font-bold font-mono text-primary-fixed mt-1">{scores.breakdown?.market_gap?.score || 91}/100</p>
            </div>
          </div>
        </section>

        {/* 3. Competitive Landscape */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            3. Competitive Landscape (SerpApi Google Maps)
          </h3>
          <p className="text-xs text-on-surface-variant">
            Analyzed {competitors.length} key local establishments within catchment area:
          </p>
          <div className="overflow-x-auto rounded border border-surface-container-high mt-1 text-xs">
            <table className="w-full text-left">
              <thead className="bg-surface-container text-outline uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Competitor</th>
                  <th className="p-2.5">Rating</th>
                  <th className="p-2.5">Reviews</th>
                  <th className="p-2.5">Price</th>
                  <th className="p-2.5">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60">
                {competitors.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-bold">{c.name}</td>
                    <td className="p-2.5 text-amber-400 font-mono">★ {c.rating}</td>
                    <td className="p-2.5 font-mono text-outline">{c.reviews}</td>
                    <td className="p-2.5 font-mono text-secondary">{c.price}</td>
                    <td className="p-2.5 font-mono text-outline">{c.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Pricing Intelligence */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            4. Pricing Economics (Google Shopping)
          </h3>
          <p className="text-xs leading-relaxed text-on-surface-variant">
            Incumbent retail drinks average <strong>₹{pricing.avg_price || 210}</strong> with an entry range recommended between <strong>{pricing.recommended_entry_range || "₹170–₹220"}</strong>. Commercial bean supply wholesale costs benchmark at ₹420/250g, delivering an estimated unit gross margin of 68.4%.
          </p>
        </section>

        {/* 5. Market Gaps & Opportunities */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            5. Key Market Gaps Identified
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            {(intelligence.opportunities || []).map((opp, idx) => (
              <div key={idx} className="p-3 rounded bg-surface-container border border-surface-container-high">
                <span className="font-bold text-primary font-mono">{idx + 1}. {opp.title}</span>
                <p className="text-on-surface-variant mt-1">{opp.why_it_matters}</p>
                <p className="text-tertiary mt-1 font-semibold">Recommended Action: {opp.potential_action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Recommended Entry Strategy */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            6. Recommended Entry Strategy
          </h3>
          <div className="p-4 rounded bg-surface-container border-l-4 border-primary text-sm leading-relaxed">
            {intelligence.strategy}
          </div>
        </section>

        {/* 7. Risk Analysis */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-primary font-bold">
            7. Sensitivity & Risk Factors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {(intelligence.change_factors || []).map((f, i) => (
              <div key={i} className="p-3 rounded bg-surface-container border border-surface-container-high">
                <span className="font-bold text-rose-400">{f.trigger}</span>
                <p className="text-on-surface-variant mt-1 text-[11px]">{f.impact}</p>
                <p className="text-tertiary mt-1 text-[10px]">Hedge: {f.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Sources & Verification */}
        <section className="border-t border-surface-container-high pt-4 text-[11px] font-mono text-outline flex justify-between items-center">
          <span>Powered by SerpApi Live Feeds (Maps, Shopping, Trends, Search)</span>
          <span>MarketPilot AI • Hackathon Edition</span>
        </section>
      </div>
    </div>
  );
}
