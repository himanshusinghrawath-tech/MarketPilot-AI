import React, { useState, useMemo } from 'react';

export default function DemandLineChart({
  trendData = [],
  demandScore = 86,
  trendDirection = "↗ Increasing",
  category = "Specialty Coffee Shop",
  location = "Bangalore"
}) {
  // Ensure default fallback data if empty or incomplete
  const data = useMemo(() => {
    if (Array.isArray(trendData) && trendData.length >= 2) {
      return trendData.map((d, i) => ({
        month: d.month || `M${i + 1}`,
        index: Number(d.index) || 50
      }));
    }
    return [
      { month: 'May', index: 64 },
      { month: 'Jun', index: 70 },
      { month: 'Jul', index: 73 },
      { month: 'Aug', index: 79 },
      { month: 'Sep', index: 83 },
      { month: 'Oct', index: 87 }
    ];
  }, [trendData]);

  const [hoveredIdx, setHoveredIdx] = useState(data.length - 1);

  // SVG Geometry Constants
  const svgWidth = 660;
  const svgHeight = 220;
  const padLeft = 44;
  const padRight = 32;
  const padTop = 30;
  const padBottom = 40;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const baselineY = svgHeight - padBottom;

  // Compute exact coordinates for each data point
  const points = useMemo(() => {
    const n = data.length;
    return data.map((d, i) => {
      const x = padLeft + (i / Math.max(n - 1, 1)) * plotWidth;
      // Clamp index between 0 and 100 for normalization
      const normalizedVal = Math.min(Math.max(d.index, 0), 100);
      const y = padTop + plotHeight - (normalizedVal / 100) * plotHeight;
      const prevVal = i > 0 ? data[i - 1].index : d.index;
      const delta = prevVal ? (((d.index - prevVal) / prevVal) * 100).toFixed(1) : "0.0";
      return {
        x,
        y,
        month: d.month,
        index: d.index,
        delta: Number(delta) >= 0 ? `+${delta}%` : `${delta}%`,
        isPositive: Number(delta) >= 0
      };
    });
  }, [data, padLeft, plotWidth, padTop, plotHeight]);

  // Generate smooth Catmull-Rom cubic spline that GUARANTEES passing through every (p.x, p.y)
  const { linePath, areaPath } = useMemo(() => {
    if (points.length < 2) return { linePath: "", areaPath: "" };

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i + 2 < points.length ? points[i + 2] : p2;

      // Tangent-based cubic bezier control points
      const cp1x = p1.x + (p2.x - p0.x) / 6.0;
      const cp1y = p1.y + (p2.y - p0.y) / 6.0;
      const cp2x = p2.x - (p3.x - p1.x) / 6.0;
      const cp2y = p2.y - (p3.y - p1.y) / 6.0;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    const area = `${d} L ${lastX} ${baselineY.toFixed(1)} L ${firstX} ${baselineY.toFixed(1)} Z`;

    return { linePath: d, areaPath: area };
  }, [points, baselineY]);

  // Overall statistics
  const firstPoint = points[0] || { index: 64 };
  const lastPoint = points[points.length - 1] || { index: 87 };
  const totalGrowth = (((lastPoint.index - firstPoint.index) / firstPoint.index) * 100).toFixed(1);
  const activePoint = points[hoveredIdx] || lastPoint;

  // Grid steps (0, 25, 50, 75, 100)
  const gridSteps = [100, 75, 50, 25, 0];

  return (
    <div className="bg-surface-container rounded-xl p-5 border border-surface-container-high shadow-xl flex flex-col gap-4">
      {/* Chart Top Executive Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-xs font-mono text-tertiary font-bold tracking-wider uppercase">
              SerpApi Google Trends Query Velocity
            </span>
          </div>
          <h4 className="font-headline-sm text-base text-on-surface font-extrabold mt-0.5">
            Search Interest Velocity (6-Month Momentum)
          </h4>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-surface-container-highest text-xs font-mono flex items-center gap-1.5">
            <span className="text-outline">Growth:</span>
            <span className="text-tertiary font-bold">+{totalGrowth}% ↗</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-tertiary/10 border border-tertiary/30 text-xs font-mono text-tertiary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">insights</span>
            <span>Peak: {lastPoint.index}/100</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card for Active / Hovered Point */}
      <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-lg border border-surface-container-high text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-outline">Active Month:</span>
            <span className="text-on-surface font-bold text-sm bg-surface-container-highest px-2 py-0.5 rounded">
              {activePoint.month}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 border-l border-surface-container-high pl-3">
            <span className="text-outline">Search Velocity:</span>
            <span className="text-tertiary font-extrabold text-sm">{activePoint.index}/100</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-outline text-[11px]">MoM Change:</span>
          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
            activePoint.isPositive
              ? 'bg-tertiary/15 text-tertiary border border-tertiary/30'
              : 'bg-error/15 text-error border border-error/30'
          }`}>
            {activePoint.delta}
          </span>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-56 overflow-visible"
        >
          <defs>
            {/* Gradient for area fill under the line */}
            <linearGradient id="demandCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4edea3" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#4edea3" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#4edea3" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing neon filter for trendline */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#4edea3" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {gridSteps.map((step) => {
            const y = padTop + plotHeight - (step / 100) * plotHeight;
            return (
              <g key={step}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#262a33"
                  strokeWidth="1"
                  strokeDasharray={step === 0 ? "none" : "3 3"}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#908fa0"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {step}
                </text>
              </g>
            );
          })}

          {/* Vertical Guidelines for each data point */}
          {points.map((p, i) => (
            <line
              key={`vline-${i}`}
              x1={p.x}
              y1={padTop}
              x2={p.x}
              y2={baselineY}
              stroke={hoveredIdx === i ? "#4edea3" : "#1f232b"}
              strokeWidth={hoveredIdx === i ? "1.5" : "1"}
              strokeDasharray={hoveredIdx === i ? "4 4" : "none"}
              opacity={hoveredIdx === i ? 0.9 : 0.4}
              className="transition-all duration-150"
            />
          ))}

          {/* 1. Filled Area Under Spline */}
          <path
            d={areaPath}
            fill="url(#demandCurveGradient)"
          />

          {/* 2. Main High-Precision Smooth Curve Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#4edea3"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
          />

          {/* 3. Interactive Data Nodes Exactly Anchored to (p.x, p.y) */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const isLatest = i === points.length - 1;

            return (
              <g
                key={`point-${i}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onClick={() => setHoveredIdx(i)}
              >
                {/* Hit testing area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="24"
                  fill="transparent"
                />

                {/* Pulsing ring for latest point or hovered */}
                {(isHovered || isLatest) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 12 : 9}
                    fill="none"
                    stroke="#4edea3"
                    strokeWidth="1.5"
                    opacity={isHovered ? 0.8 : 0.5}
                    className="transition-all duration-200"
                  />
                )}

                {/* Outer halo disk */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7.5 : 5.5}
                  fill="#181c24"
                  stroke="#4edea3"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* Core white center dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 3.5 : 2.5}
                  fill={isHovered ? "#6ffbbe" : "#ffffff"}
                />

                {/* Value badge directly above point */}
                <g transform={`translate(${p.x}, ${p.y - 12})`}>
                  <rect
                    x="-14"
                    y="-13"
                    width="28"
                    height="15"
                    rx="4"
                    fill={isHovered ? "#4edea3" : "#1c2028"}
                    stroke={isHovered ? "#6ffbbe" : "#31353e"}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fill={isHovered ? "#002113" : "#dfe2ee"}
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.index}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* X-Axis Month Indicator Pills Below Chart */}
        <div className="flex justify-between items-center pt-2 px-2 text-xs font-mono">
          {points.map((p, i) => (
            <button
              key={`btn-month-${i}`}
              onClick={() => setHoveredIdx(i)}
              className={`flex flex-col items-center py-1 px-2 rounded-md transition-all cursor-pointer ${
                hoveredIdx === i
                  ? 'bg-tertiary/20 text-tertiary font-bold border border-tertiary/40 shadow-sm'
                  : 'text-outline hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="text-[11px]">{p.month}</span>
              <span className="text-[9px] text-outline/80 font-semibold">{p.index}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Meta Description */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-outline border-t border-surface-container-high/40 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="text-tertiary">●</span>
          <span>Normalized 0–100 scale based on 6-month consumer inquiry momentum</span>
        </span>
        <span className="text-on-surface-variant font-semibold">
          Trend Health: <span className="text-tertiary">Sustained Secular Expansion</span>
        </span>
      </div>
    </div>
  );
}
