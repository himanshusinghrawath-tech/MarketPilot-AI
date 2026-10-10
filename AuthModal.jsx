import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Market Analyst');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in. Please check your credentials.');
        } else {
          onAuthSuccess(res.user);
          onClose();
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await registerUser(name, email, password, company, role);
        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed. Please try again.');
        } else {
          onAuthSuccess(res.user);
          onClose();
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = async () => {
    setEmail('arjun@marketpilot.ai');
    setPassword('MarketPilot2026!');
    setErrorMessage('');
    setLoading(true);
    const res = await loginUser('arjun@marketpilot.ai', 'MarketPilot2026!');
    setLoading(false);
    if (res.success) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.error || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0e131d] border border-[#232b3d] rounded-2xl shadow-2xl p-6 sm:p-8 text-on-surface">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-[#1a2130] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[22px]">shield_person</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              {mode === 'login' ? 'Sign In to MarketPilot AI' : 'Create Executive Workspace'}
            </h2>
            <p className="text-xs text-outline">
              {mode === 'login'
                ? 'Access your saved market dossiers, dossiers telemetry & live feeds'
                : 'Start screening retail markets with live SerpApi intelligence'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 mb-5 rounded-xl bg-[#141a26] border border-[#222938]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-primary text-[#07006c] shadow'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-primary text-[#07006c] shadow'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-red-400">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-outline mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 rounded-xl bg-[#141a26] border border-[#242c3d] text-sm text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary/80 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-outline mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3 py-2 rounded-xl bg-[#141a26] border border-[#242c3d] text-sm text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary/80 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-outline">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#forgot-password';
                    window.dispatchEvent(new CustomEvent('marketpilot:navigate', { detail: 'forgot-password' }));
                  }}
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-[#141a26] border border-[#242c3d] text-sm text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary/80 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-outline mb-1">
                  Firm / Brand
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Blue Peak Capital"
                  className="w-full px-3 py-2 rounded-xl bg-[#141a26] border border-[#242c3d] text-xs text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary/80"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-outline mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Venture Partner"
                  className="w-full px-3 py-2 rounded-xl bg-[#141a26] border border-[#242c3d] text-xs text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary/80"
                />
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-primary via-[#b3b5ff] to-primary-fixed-dim text-[#07006c] font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">
                  {mode === 'login' ? 'login' : 'how_to_reg'}
                </span>
                <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[#222938] w-full"></div>
          <span className="bg-[#0e131d] px-2 text-[10px] font-mono text-outline uppercase tracking-wider">
            OR DEMO ACCESS
          </span>
        </div>

        <button
          type="button"
          onClick={handleUseDemoAccount}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[#141a26] border border-[#2a3346] hover:border-primary/50 text-xs font-semibold text-on-surface hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-primary">bolt</span>
          <span>1-Click Demo Login (Arjun Mehta • PRO)</span>
        </button>

        <p className="mt-4 text-center text-[11px] text-outline">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
