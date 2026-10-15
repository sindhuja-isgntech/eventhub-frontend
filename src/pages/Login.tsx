import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, undefined, role);
    navigate(role === 'ADMIN' ? '/admin' : '/events');
  };

  const handleDemoLogin = (demoRole: 'CUSTOMER' | 'ADMIN') => {
    if (demoRole === 'ADMIN') {
      login('admin@eventhub.io', 'Admin Victoria', 'ADMIN');
      navigate('/admin');
    } else {
      login('alex.morgan@example.com', 'Alex Morgan', 'CUSTOMER');
      navigate('/events');
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
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            ⚡ Quick 1-Click Evaluation Login
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="flex-1 bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 py-1.5 px-2 rounded-xl font-bold text-xs transition shadow-xs"
            >
              Attendee (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="flex-1 bg-white hover:bg-violet-50 text-violet-600 border border-slate-200 hover:border-violet-200 py-1.5 px-2 rounded-xl font-bold text-xs transition shadow-xs"
            >
              Admin Portal
            </button>
          </div>
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password reset instructions sent!'); }} className="text-[11px] text-indigo-600 hover:underline">
                Forgot password?
              </a>
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
          </div>

          {/* Role Choice */}
          <div className="pt-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  role === 'CUSTOMER'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  role === 'ADMIN'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Organizer / Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

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
