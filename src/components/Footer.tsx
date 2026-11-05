import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, CheckCircle2, Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast, currentUser } = useApp();
  const bookingsLabel = currentUser?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings';
  const bookingsPath = currentUser?.role === 'ADMIN' ? '/admin/bookings' : '/my-bookings';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Thank you for subscribing to EventHub Weekly!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20 relative overflow-hidden">
      {/* Background ambient light */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[15rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Highlight Newsletter Banner */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900 rounded-3xl p-8 sm:p-10 mb-16 border border-indigo-500/20 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2.5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Stay In The Loop
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Get Notified About VIP Drops & Early Passes
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Curated weekly updates on tech summits, live concerts, and exclusive masterclasses directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-6 py-3.5 rounded-2xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Subscribed successfully!
              </div>
            ) : (
              <>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-72 bg-slate-900/90 text-white placeholder-slate-500 text-xs pl-10 pr-4 py-3.5 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
                >
                  Join Newsletter
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1 & 2: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Event<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Discover, organize, and book memorable experiences across India. Built for local attendees, creators, and event organizers.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Hosts</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-indigo-400" /> Instant QR Pass</span>
            </div>
          </div>

          {/* Account & Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to={bookingsPath} className="hover:text-indigo-400 transition">{bookingsLabel}</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">User Profile</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition">Create Account</Link></li>
              {currentUser?.role === 'ADMIN' && (
                <li><Link to="/admin" className="text-indigo-400 font-bold hover:underline transition">Admin Console</Link></li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} EventHub Inc. All rights reserved. Built for seamless digital ticketing.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for event communities</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
