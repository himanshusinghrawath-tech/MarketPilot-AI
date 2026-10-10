import React from 'react';

export default function ScoreFormulaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl max-w-xl w-full p-space-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-space-xs text-primary mb-space-sm">
          <span className="material-symbols-outlined text-[20px]">functions</span>
          <span className="font-label-numeric-sm text-label-numeric-sm uppercase tracking-wider">Methodology & Explainability</span>
        </div>

        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          How MarketPilot Calculates Opportunity Scores
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
          MarketPilot synthesizes real-time signals from SerpApi across Google Maps, Google Shopping, and Google Trends into a transparent, multi-factor deterministic model.
        </p>

        {/* Formula Box */}
        <div className="my-space-md p-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high font-mono text-body-sm text-primary leading-relaxed shadow-inner">
          <span className="text-secondary font-bold">Overall Opportunity =</span><br />
          &nbsp;&nbsp;(0.30 × Demand Score)<br />
          + (0.25 × Market Gap Score)<br />
          + (0.25 × Pricing Opportunity)<br />
          + (0.20 × Competition Opportunity)
        </div>

        {/* Weight Breakdown */}
        <div className="grid grid-cols-2 gap-space-sm mb-space-md">
          <div className="p-space-sm rounded bg-surface-container border border-surface-container-high">
            <span className="font-label-numeric-sm text-label-numeric-sm text-secondary font-bold">0.30 • Demand Signals</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Google Trends velocity, monthly search query volume, and keyword growth YoY.</p>
          </div>
          <div className="p-space-sm rounded bg-surface-container border border-surface-container-high">
            <span className="font-label-numeric-sm text-label-numeric-sm text-tertiary font-bold">0.25 • Market Gap Score</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">NLP analysis of Google review complaints, unserved dayparts, and missing product categories.</p>
          </div>
          <div className="p-space-sm rounded bg-surface-container border border-surface-container-high">
            <span className="font-label-numeric-sm text-label-numeric-sm text-primary font-bold">0.25 • Pricing Headroom</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Google Shopping supply prices vs. incumbent retail menus; gross margin elasticity.</p>
          </div>
          <div className="p-space-sm rounded bg-surface-container border border-surface-container-high">
            <span className="font-label-numeric-sm text-label-numeric-sm text-outline font-bold">0.20 • Competition Factor</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">POIs per km², geographic cluster clustering, and review concentration ratio.</p>
          </div>
        </div>

        {/* Decision Bands */}
        <div className="flex items-center justify-between p-space-sm rounded bg-surface-container-lowest text-label-numeric-sm text-label-numeric-sm mb-space-md">
          <span className="text-tertiary flex items-center gap-1 font-bold">🟢 ENTER: 75–100</span>
          <span className="text-secondary flex items-center gap-1 font-bold">🟡 INVESTIGATE: 50–74</span>
          <span className="text-error flex items-center gap-1 font-bold">🔴 AVOID: 0–49</span>
        </div>

        {/* Disclaimer */}
        <div className="p-space-sm rounded bg-surface-container text-body-sm text-outline flex items-start gap-space-xs">
          <span className="material-symbols-outlined text-[18px] text-outline flex-shrink-0 mt-0.5">verified_user</span>
          <p className="text-[12px] leading-relaxed">
            <strong>Important Transparency Note:</strong> MarketPilot is a data-driven market validation agent that analyzes real-time signals. These scores do not guarantee business or investment success.
          </p>
        </div>

        <div className="mt-space-md flex justify-end">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
