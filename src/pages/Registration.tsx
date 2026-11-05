import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CalendarDays, User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { getApiErrorMessage } from '../services/api';

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const user = await register(
        formData.name,
        formData.email,
        `+91${formData.phone}`,
        formData.password,
        'CUSTOMER',
      );
      navigate(user.role === 'ADMIN' ? '/admin' : '/events');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-4 py-12 sm:px-6 overflow-hidden">
      {/* Decorative background: glows + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] [background-image:radial-gradient(#a5b4fc_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      {/* Registration Card with strict max-width constraint */}
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
              Get Started with EventHub
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Create an Account
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Join thousands of eventgoers and top-tier organizers worldwide.
            </p>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Full Name
            </label>
            <div className="group relative">
              <User
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              />
              <input
                type="text"
                name="name"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="group relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone Number
            </label>
            <div className="group relative">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              />
              <span className="absolute left-10 top-1/2 -translate-y-1/2 border-r border-slate-200 pr-2 text-sm font-medium text-slate-600">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                minLength={10}
                title="Enter a valid 10-digit Indian mobile number."
                required
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => {
                  const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone });
                }}
                aria-label="10-digit Indian mobile number"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-[4.25rem] pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <p className="text-xs text-slate-500">Enter 10 digits; the +91 country code is added automatically.</p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="group relative">
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
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
            className="group w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>{isSubmitting ? 'Creating Account…' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer */}
        <footer className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline ml-1"
          >
            Sign in
          </Link>
          <div className="mt-3">
            <Link to="/" className="font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline">
              Return to Homepage
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Registration;
