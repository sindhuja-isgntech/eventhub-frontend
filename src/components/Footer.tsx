import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast, currentUser } = useApp();
  const bookingsLabel = currentUser?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Thank you for subscribing to EventHub Weekly!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Banner */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900 rounded-3xl p-8 mb-16 border border-indigo-500/20 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Stay in the loop
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Get notified about VIP drops & early bird tickets
            </h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Curated weekly updates on tech summits, live concerts, and exclusive masterclasses directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-6 py-3 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Subscribed successfully!
              </div>
            ) : (
              <>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-72 bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-indigo-600/30 shrink-0"
                >
                  Join Newsletter
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Event<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier platform for discovering, organizing, and booking memorable experiences. Built for attendees, artists, and innovative event organizers worldwide.
            </p>
          </div>

          {/* Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/events" className="hover:text-indigo-400 transition">Browse Events</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/my-bookings" className="hover:text-indigo-400 transition">{bookingsLabel}</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">Profile</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition">Create Account</Link></li>
              {currentUser?.role === 'ADMIN' && (
                <li><Link to="/admin" className="hover:text-indigo-400 transition">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} EventHub Inc. Designed with precision for enterprise and modern ticketing.</p>
          <div className="flex items-center">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for community
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
