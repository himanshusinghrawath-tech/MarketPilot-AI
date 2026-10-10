import React, { useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword
} from '../services/api';

export default function AuthPage({
  initialView = 'login', // 'login' | 'register' | 'forgot-password' | 'reset-password'
  initialResetToken = '',
  onAuthSuccess,
  onNavigateHome
}) {
  const [view, setView] = useState(initialView);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Market Strategist');
  const [resetToken, setResetToken] = useState(initialResetToken);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedResetLink, setGeneratedResetLink] = useState('');

  // Password strength meter
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'bg-transparent' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-emerald-400' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' };
  };

  const strength = getPasswordStrength(password);

  const resetFormState = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGeneratedResetLink('');
  };

  const switchView = (newView) => {
    resetFormState();
    setView(newView);
  };

  // 1-Click Fast Demo Login
  const handleDemoLogin = async () => {
    resetFormState();
    setLoading(true);
    setEmail('arjun@marketpilot.ai');
    setPassword('MarketPilot2026!');
    const res = await loginUser('arjun@marketpilot.ai', 'MarketPilot2026!');
    setLoading(false);
    if (res.success) {
      onAuthSuccess(res.user);
    } else {
      setErrorMessage(res.error || 'Demo login failed');
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFormState();

    // Validation
    if (view === 'register') {
      if (!name.trim()) {
        setErrorMessage('Full name is required.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    if (view === 'reset-password') {
      if (!resetToken.trim()) {
        setErrorMessage('Valid password reset token is required.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('New password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (view === 'login') {
        const res = await loginUser(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Invalid email or password.');
        } else {
          onAuthSuccess(res.user);
        }
      } else if (view === 'register') {
        const res = await registerUser(name, email, password, company, role);
        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed.');
        } else {
          onAuthSuccess(res.user);
        }
      } else if (view === 'forgot-password') {
        const res = await requestPasswordReset(email);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to process password reset.');
        } else {
          setSuccessMessage('Password reset instructions generated successfully.');
          setResetToken(res.reset_token);
          setGeneratedResetLink(res.reset_link || `/reset-password?token=${res.reset_token}`);
        }
      } else if (view === 'reset-password') {
        const res = await resetUserPassword(resetToken, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to reset password. Token may have expired.');
        } else {
          setSuccessMessage('Password reset successfully! Redirecting to workspace...');
          setTimeout(() => {
            onAuthSuccess(res.user);
          }, 1200);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090d15] text-[#f1f5f9] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Lighting & Radial Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/15 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-[-100px] -right-20 w-[450px] h-[450px] bg-primary/10 blur-[120px] pointer-events-none rounded-full"></div>

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-[#07006c] shadow-[0_0_20px_rgba(192,193,255,0.4)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px] font-bold">radar</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-primary transition-colors">
                MarketPilot AI
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e2535] text-primary border border-primary/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-outline text-[#8e97a8] hidden sm:block">
              Turn Market Data into Smarter Decisions
            </p>
          </div>
        </button>

        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-[#8e97a8] hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#232b3c] hover:border-primary/40 bg-[#121622]/80 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Landing</span>
        </button>
      </header>

      {/* Main Center Content Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md bg-[#0e131e]/90 border border-[#21293a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl p-6 sm:p-8">
          {/* Header depending on View */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-container/30 border border-primary/30 items-center justify-center text-primary mb-3 shadow-[0_0_16px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-2xl">
                {view === 'login' && 'login'}
                {view === 'register' && 'person_add'}
                {view === 'forgot-password' && 'lock_reset'}
                {view === 'reset-password' && 'key'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {view === 'login' && 'Sign in to MarketPilot'}
              {view === 'register' && 'Create your Account'}
              {view === 'forgot-password' && 'Reset your Password'}
              {view === 'reset-password' && 'Set New Password'}
            </h1>

            <p className="text-xs text-[#8e97a8] mt-1.5 max-w-xs mx-auto">
              {view === 'login' && 'Access SerpApi live market dossiers, location radar & opportunity telemetry.'}
              {view === 'register' && 'Turn market data into smarter decisions with AI-powered retail intelligence.'}
              {view === 'forgot-password' && "Enter your email address and we'll generate a secure password reset token."}
              {view === 'reset-password' && 'Choose a strong new password for your MarketPilot executive account.'}
            </p>
          </div>

          {/* Quick Demo Fast Login Button (Only on Login/Register) */}
          {(view === 'login' || view === 'register') && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#172033] to-[#121826] border border-primary/40 hover:border-primary text-xs font-semibold text-primary hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
              >
                <span className="material-symbols-outlined text-sm text-primary group-hover:scale-110 transition-transform">
                  bolt
                </span>
                <span>1-Click Demo Login (Arjun Mehta • PRO)</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#1e2535] w-full"></div>
                <span className="bg-[#0e131e] px-2.5 text-[10px] font-mono text-[#6d7687] uppercase tracking-wider">
                  or continue with email
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-shake">
              <span className="material-symbols-outlined text-base text-red-400 flex-shrink-0 mt-0.5">
                error
              </span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-base text-emerald-400 flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <div className="space-y-1">
                <p className="leading-relaxed">{successMessage}</p>
                {generatedResetLink && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetFormState();
                        setView('reset-password');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-[#07006c] font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Set New Password</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* FULL NAME (Register Only) */}
            {view === 'register' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141a26] border border-[#222938] text-sm text-white placeholder-[#5d6677] focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#5d6677]">
                    badge
                  </span>
                </div>
              </div>
            )}

            {/* EMAIL (Login, Register, Forgot Password) */}
            {view !== 'reset-password' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141a26] border border-[#222938] text-sm text-white placeholder-[#5d6677] focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#5d6677]">
                    mail
                  </span>
                </div>
              </div>
            )}

            {/* RESET TOKEN (Reset Password View) */}
            {view === 'reset-password' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                  Verification Reset Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste secure reset token"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141a26] border border-[#222938] text-sm text-white font-mono placeholder-[#5d6677] focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#5d6677]">
                    vpn_key
                  </span>
                </div>
              </div>
            )}

            {/* PASSWORD (Login, Register, Reset Password) */}
            {view !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8e97a8]">
                    {view === 'reset-password' ? 'New Password' : 'Password'}
                  </label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchView('forgot-password')}
                      className="text-[11px] text-primary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-[#141a26] border border-[#222938] text-sm text-white placeholder-[#5d6677] focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#5d6677]">
                    lock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[#5d6677] hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Password Strength Indicator (Register and Reset Views) */}
                {(view === 'register' || view === 'reset-password') && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#8e97a8]">
                      <span>Password strength:</span>
                      <span className="font-semibold">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#182030] rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 4 ? strength.color : 'bg-transparent'}`}></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONFIRM PASSWORD (Register and Reset Views) */}
            {(view === 'register' || view === 'reset-password') && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-10 py-2 rounded-xl bg-[#141a26] border text-sm text-white placeholder-[#5d6677] focus:outline-none transition-colors ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-red-500/70'
                        : 'border-[#222938] focus:border-primary'
                    }`}
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#5d6677]">
                    lock_check
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-[#5d6677] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {/* COMPANY & ROLE (Register Only) */}
            {view === 'register' && (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                    Firm / Brand
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Ventures"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#141a26] border border-[#222938] text-xs text-white placeholder-[#5d6677] focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e97a8] mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Partner"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#141a26] border border-[#222938] text-xs text-white placeholder-[#5d6677] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-primary via-[#b3b5ff] to-primary-fixed-dim text-[#07006c] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(192,193,255,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  <span>Processing secure authentication...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {view === 'login' && 'login'}
                    {view === 'register' && 'how_to_reg'}
                    {view === 'forgot-password' && 'send'}
                    {view === 'reset-password' && 'check'}
                  </span>
                  <span>
                    {view === 'login' && 'Sign in to Dashboard'}
                    {view === 'register' && 'Create Free Executive Account'}
                    {view === 'forgot-password' && 'Generate Reset Token'}
                    {view === 'reset-password' && 'Update Password & Sign In'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* VIEW SWITCHER FOOTER */}
          <div className="mt-6 pt-4 border-t border-[#1e2535] text-center text-xs text-[#8e97a8]">
            {view === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Sign up for free
                </button>
              </p>
            )}

            {view === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}

            {(view === 'forgot-password' || view === 'reset-password') && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Return to login
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 w-full text-center py-4 text-[11px] text-[#60697a]">
        MarketPilot AI • Enterprise Market Intelligence Platform • Bank-grade Bcrypt & JWT Protected
      </footer>
    </div>
  );
}
