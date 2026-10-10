import React, { useState } from 'react';

export default function Header({
  onNavigate,
  onOpenCommandPalette,
  onToggleMobileSidebar,
  currentCategory = "Specialty Coffee Shop",
  currentLocation = "Bangalore, India",
  serpApiConnected = false,
  currentUser = null,
  onOpenAuth = () => {},
  onLogout = () => {}
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const city = String(currentLocation).split(',')[0].trim() || 'Local';

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#0a0e16]/85 backdrop-blur-2xl z-40 flex items-center justify-between px-3 sm:px-6 border-b border-[#202530] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
      {/* LEFT: Mobile Menu Button & Executive Market Workspace Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#141822] border border-[#262c3a] text-on-surface hover:bg-[#1c2230] transition-colors flex-shrink-0 cursor-pointer shadow-sm"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-[19px]">menu</span>
        </button>

        {/* Modern Workspace Context Pill */}
        <div
          onClick={() => onNavigate('market-deep-dive')}
          className="group flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-xl bg-[#121622]/90 border border-[#262d3d] hover:border-primary/50 transition-all cursor-pointer shadow-sm min-w-0"
          title={`Active Market: ${currentCategory} (${city})`}
        >
          {/* Glowing Beacon Icon */}
          <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[15px]">analytics</span>
          </div>

          {/* Text Info */}
          <div className="flex flex-col min-w-0 truncate">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline uppercase tracking-wider leading-none">
              <span className="hidden sm:inline">WORKSPACE</span>
              <span className="hidden sm:inline text-outline/40">•</span>
              <span className="text-secondary/90">{city}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <span className="text-xs sm:text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px] xl:max-w-xs">
                {currentCategory}
              </span>
              <span className="material-symbols-outlined text-[14px] text-outline/60 group-hover:text-primary transition-colors flex-shrink-0">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Search Command Bar, Telemetry Stream, Primary Action, Utilities */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Raycast-style Quick Search Box (Desktop & Tablet) */}
        <div
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#121622] border border-[#262d3d] hover:border-primary/50 text-outline hover:text-on-surface transition-all cursor-pointer w-40 lg:w-52 xl:w-60 shadow-inner group"
          title="Search queries, POIs or benchmarks (⌘K / Ctrl+K)"
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="material-symbols-outlined text-[16px] text-secondary group-hover:scale-110 transition-transform flex-shrink-0">
              search
            </span>
            <span className="text-xs font-sans text-outline group-hover:text-on-surface-variant truncate">
              Search or jump to...
            </span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[#1c2230] border border-[#2b3345] text-[10px] font-mono text-outline group-hover:text-on-surface flex-shrink-0">
            ⌘K
          </kbd>
        </div>

        {/* Mobile Search Icon Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl bg-[#121622] border border-[#262d3d] text-secondary hover:text-on-surface hover:bg-[#1a2030] transition-colors flex-shrink-0 cursor-pointer"
          title="Search (⌘K)"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
        </button>

        {/* Live SERP Telemetry Stream Status Badge */}
        <div
          onClick={() => onNavigate('api-keys')}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono shadow-sm flex-shrink-0 cursor-pointer transition-colors ${
            serpApiConnected
              ? 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300'
              : 'bg-sky-950/30 border-sky-500/30 hover:border-sky-500/60 text-sky-300'
          }`}
          title={serpApiConnected ? "SerpApi live connection active" : "Using simulated demo telemetry. Click to add API key."}
        >
          {/* Animated beacon dot */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            {serpApiConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                serpApiConnected ? 'bg-emerald-400' : 'bg-sky-400'
              }`}
            ></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider">
            {serpApiConnected ? 'SERP LIVE' : 'DEMO FEED'}
          </span>
        </div>

        {/* Subtle Vertical Divider */}
        <div className="hidden sm:block h-6 w-[1px] bg-[#222736] flex-shrink-0"></div>

        {/* Primary CTA: "+ New Analysis" */}
        <button
          onClick={() => onNavigate('new-analysis')}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-primary via-[#b3b5ff] to-primary-fixed-dim text-[#07006c] font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_16px_rgba(192,193,255,0.3)] cursor-pointer whitespace-nowrap"
          title="Launch new market entry analysis"
        >
          <span className="material-symbols-outlined text-[17px] font-extrabold">add</span>
          <span className="hidden sm:inline">New Analysis</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Previous Analyses Quick Link Icon */}
        <button
          onClick={() => onNavigate('previous-analyses')}
          className="hidden md:flex p-2 rounded-xl bg-[#121622] border border-[#262d3d] text-outline hover:text-on-surface hover:bg-[#1a2030] transition-colors flex-shrink-0 cursor-pointer shadow-sm"
          title="Archived Analyses History"
        >
          <span className="material-symbols-outlined text-[17px]">history</span>
        </button>

        {/* API Settings Quick Link */}
        <button
          onClick={() => onNavigate('api-keys')}
          className="p-2 rounded-xl bg-[#121622] border border-[#262d3d] text-outline hover:text-primary hover:border-primary/40 hover:bg-[#1a2030] transition-all flex-shrink-0 cursor-pointer shadow-sm"
          title="API Configuration & Keys"
        >
          <span className="material-symbols-outlined text-[17px]">tune</span>
        </button>

        {/* User Account Pill & Dropdown / Sign In Button */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#121622] border border-[#262d3d] hover:border-primary/40 transition-all cursor-pointer shadow-sm"
              title={`${currentUser.name} (${currentUser.role || 'Pro'}) - Click to manage session`}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-primary-container text-[#07006c] font-bold text-[11px] flex items-center justify-center shadow-inner">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-on-surface truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono text-tertiary">
                  {currentUser.tier || 'PRO'}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-outline">
                {isProfileOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e131e] border border-[#232b3d] shadow-2xl p-3 z-50 animate-fade-in text-on-surface">
                {/* User Info Header */}
                <div className="p-2 border-b border-[#1f2637] mb-2">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-[#8e97a8] truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                      {currentUser.tier || 'PRO TIER'}
                    </span>
                    <span className="text-[10px] text-[#6d7687] truncate">
                      {currentUser.role || 'Market Strategist'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigate('api-keys');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#8e97a8] hover:text-white hover:bg-[#161d2b] transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-base">settings</span>
                    <span>API & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#8e97a8] hover:text-white hover:bg-[#161d2b] transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-base">switch_account</span>
                    <span>Switch Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141a26] border border-[#2b3447] text-outline hover:text-primary hover:border-primary/50 text-xs font-semibold transition-all cursor-pointer"
            title="Sign in to your account"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
