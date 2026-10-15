import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, User, Mail, Lock, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    register(formData.name, formData.email, formData.phone, formData.role);
    navigate(formData.role === 'ADMIN' ? '/admin' : '/events');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-xs hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-500">Join thousands of eventgoers and top-tier organizers.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="name"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
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

          {/* Role selector */}
          <div className="pt-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  formData.role === 'CUSTOMER'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  formData.role === 'ADMIN'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Event Organizer
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm mt-3"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Registration;