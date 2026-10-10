import React, { useState, useEffect } from 'react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onQuickLoadBenchmark }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    { type: 'Page', title: 'New Analysis Pipeline', path: 'new-analysis', icon: 'add_circle' },
    { type: 'Page', title: 'Market Deep Dive (Bangalore Coffee)', path: 'market-deep-dive', icon: 'analytics' },
    { type: 'Page', title: 'Dashboard Overview', path: 'dashboard-home', icon: 'space_dashboard' },
    { type: 'Page', title: 'Previous Analyses History', path: 'previous-analyses', icon: 'history' },
    { type: 'Page', title: 'Export Reports', path: 'export-reports', icon: 'ios_share' },
    { type: 'Page', title: 'API & SerpApi Keys', path: 'api-keys', icon: 'key' },
    { type: 'Benchmark', title: 'Bangalore Specialty Coffee Shop', cat: 'Specialty Coffee Shop', loc: 'Bangalore, Karnataka, India', icon: 'local_cafe' },
    { type: 'Benchmark', title: 'Mumbai Cloud Kitchen', cat: 'Cloud Kitchen / Bowls', loc: 'Bandra West, Mumbai', icon: 'soup_kitchen' },
    { type: 'Benchmark', title: 'Delhi Boutique Gym', cat: 'Fitness Studio / CrossFit', loc: 'Hauz Khas, New Delhi', icon: 'fitness_center' },
  ];

  const filtered = quickItems.filter(item => {
    if (!item) return false;
    const title = String(item.title || '').toLowerCase();
    const type = String(item.type || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();
    return title.includes(search) || type.includes(search);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-surface-container-high gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">search</span>
          <input
            type="text"
            className="w-full bg-transparent text-on-surface placeholder-outline focus:outline-none font-body-md"
            placeholder="Search queries, analyses, pages, benchmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high font-mono text-label-numeric-sm text-outline">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-outline text-body-sm">
              No matching commands or benchmarks found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === 'Benchmark') {
                    onQuickLoadBenchmark(item.cat, item.loc);
                    onNavigate('new-analysis');
                  } else {
                    onNavigate(item.path);
                  }
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[13px] text-on-surface group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-outline">
                      {item.type}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">
                  arrow_forward
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
