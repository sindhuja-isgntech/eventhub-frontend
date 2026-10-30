import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { login } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const resetSuccessMessage = (location.state as { message?: string } | null)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setNoticeMessage('');
    setIsSubmitting(true);
    try {
      if (isForgotPassword) {
        await authService.forgotPassword(email);
        setNoticeMessage('If an account exists for this email, we have sent a password reset link.');
        return;
      }

      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/events');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to sign in. Please check your details and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 px-4 py-12 sm:px-6 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 -z-10 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl"
      />

      {/* Login Card with strict max-width constraint */}
      <div
        className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 p-7 sm:p-9 space-y-6 relative z-10 backdrop-blur-sm"
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <header className="text-center space-y-3">
          <Link
            to="/"
            aria-label="EventHub home"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 ring-4 ring-indigo-50 transition-transform hover:scale-105"
          >
            <CalendarDays className="h-7 w-7" strokeWidth={2.2} />
          </Link>

          <div>
            <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full">
              Your next experience starts here
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              {isForgotPassword
                ? 'Enter your email address and we’ll send you a link to reset your password.'
                : 'Sign in to access your tickets, saved events, and profile.'}
            </p>
          </div>

          {resetSuccessMessage && !isForgotPassword && (
            <p
              role="status"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-left text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {resetSuccessMessage}
            </p>
          )}
        </header>

        {/* Quick Demo Credentials Autofill Banner */}
        {!isForgotPassword && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
              <span className="truncate">
                Demo: <strong className="font-semibold text-indigo-900">alex.morgan@example.com</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleAutofillDemo('alex.morgan@example.com', 'demo123')}
              className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-xs border border-indigo-200 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
            >
              Autofill
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="group relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errorMessage)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Password field */}
          {!isForgotPassword && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMessage('');
                    setNoticeMessage('');
                  }}
                  className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="group relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(errorMessage)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Status feedback alerts */}
          {noticeMessage && (
            <div role="status" className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                <span>{isForgotPassword ? 'Sending reset link…' : 'Signing you in…'}</span>
              </>
            ) : (
              <>
                <span>{isForgotPassword ? 'Send Reset Link' : 'Sign in to EventHub'}</span>
                {isForgotPassword ? (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                )}
              </>
            )}
          </button>
        </form>

        {/* Back to sign in option if in forgot password mode */}
        {isForgotPassword && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMessage('');
                setNoticeMessage('');
              }}
              className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline cursor-pointer"
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline ml-1"
          >
            Create an account
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default Login;
