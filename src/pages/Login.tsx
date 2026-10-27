import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-xs hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to EventHub</h1>
          <p className="text-xs text-slate-500">Access your digital tickets, saved events, and profile.</p>
          {resetSuccessMessage && (
            <p role="status" className="text-sm text-emerald-700">{resetSuccessMessage}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {!isForgotPassword && <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setErrorMessage('');
                  setNoticeMessage('');
                }}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>}

          {noticeMessage && (
            <p role="status" className="text-sm text-emerald-700">{noticeMessage}</p>
          )}

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm mt-2"
          >
            <span>
              {isSubmitting
                ? (isForgotPassword ? 'Sending...' : 'Signing In...')
                : (isForgotPassword ? 'Send Reset Link' : 'Sign In')}
            </span>
            {!isForgotPassword && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {isForgotPassword && (
          <div className="text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMessage('');
                setNoticeMessage('');
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
