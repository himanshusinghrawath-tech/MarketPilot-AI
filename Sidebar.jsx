import React from 'react';

export default function Sidebar({
  currentPath,
  onNavigate,
  activeMarketName = "Bangalore Coffee Retailing",
  serpApiConnected = false,
  isOpenMobile = false,
  onCloseMobile = () => {},
  currentUser = null,
  onOpenAuth = () => {},
  onLogout = () => {}
}) {
  const navItems = [
    { id: 'dashboard-home', label: 'Dashboard Home', icon: 'space_dashboard' },
    { id: 'new-analysis', label: 'New Analysis', icon: 'add_circle' },
    { id: 'market-deep-dive', label: 'Market Deep Dive (Live)', icon: 'analytics' },
    { id: 'previous-analyses', label: 'Previous Analyses', icon: 'history' },
    { id: 'export-reports', label: 'Export Reports', icon: 'ios_share' },
    { id: 'api-keys', label: 'API & SerpApi Keys', icon: 'key' },
    { id: 'landing-page', label: 'Landing Page & Tour', icon: 'travel_explore' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Workspace header */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-surface-container-high/40">
            <div className="flex items-center gap-space-md cursor-pointer" onClick={() => onNavigate('dashboard-home')}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(192,193,255,0.2)]">
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                  MarketPilot AI
                </span>
                <span className="font-label-numeric-sm text-[10px] text-secondary tracking-widest font-semibold">
                  SERPAPI HACKATHON
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Active Market Switcher */}
          <div className="px-space-md py-space-sm">
            <div
              onClick={() => onNavigate('market-deep-dive')}
              className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-high/30"
            >
              <div className="flex items-center gap-space-sm overflow-hidden">
                <span className="material-symbols-outlined text-secondary text-[20px]">radar</span>
                <div className="flex flex-col truncate">
                  <span className="font-label-numeric-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Active Market
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface font-bold truncate">
                    {activeMarketName}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                unfold_more
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs px-space-sm mt-space-sm">
            {navItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-space-md px-space-md py-space-sm rounded text-left transition-all ${
                    isActive
                      ? 'bg-surface-container-high text-primary font-bold shadow-[0_0_12px_rgba(192,193,255,0.08)] border-l-2 border-primary'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with SerpApi Telemetry & User */}
        <div className="flex flex-col gap-space-sm p-space-sm bg-surface-container-lowest border-t border-surface-container-high/40">
          <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-surface-container-high/40">
            <div className="flex items-center justify-between font-label-numeric-sm text-label-numeric-sm">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${serpApiConnected ? 'bg-tertiary animate-pulse' : 'bg-secondary'}`}></span>
                {serpApiConnected ? 'SerpApi Live Feed' : 'SerpApi Engine'}
              </span>
              <span className="text-tertiary font-bold">
                {serpApiConnected ? 'Active' : 'Demo Ready'}
              </span>
            </div>
            <div className="flex items-center justify-between font-label-numeric-sm text-label-numeric-sm text-on-surface-variant">
              <span>Engine Latency</span>
              <span className="text-secondary font-bold font-mono">114ms</span>
            </div>
          </div>

          {/* User Profile Card or Sign In Prompt */}
          {currentUser ? (
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between group">
              <div
                onClick={onOpenAuth}
                className="flex items-center gap-space-sm overflow-hidden flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                title={`${currentUser.email} (${currentUser.role || 'Executive'})`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center flex-shrink-0 text-[#07006c] font-bold text-xs shadow">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AM'}
                </div>
                <div className="flex flex-col truncate min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface font-bold truncate">
                    {currentUser.name || 'Executive User'}
                  </span>
                  <span className="font-label-numeric-sm text-[10px] text-primary font-semibold truncate">
                    {currentUser.role || currentUser.tier || 'PRO TIER'}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                className="p-1.5 rounded-lg text-outline hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer flex-shrink-0"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[17px]">logout</span>
              </button>
            </div>
          ) : (
            <div
              onClick={onOpenAuth}
              className="p-space-sm rounded-lg bg-surface-container-low border border-dashed border-primary/40 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Sign In</span>
                  <span className="text-[10px] text-outline">Save dossiers & telemetry</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">
                arrow_forward
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
