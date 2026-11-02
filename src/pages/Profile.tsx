import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Heart,
  Save,
  Bell,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, bookings, savedEventIds, events, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'aarav.sharma@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  const savedEventsList = events.filter(e => savedEventIds.includes(e.id));
  const activeBookingsCount = bookings.filter(b => b.status === 'CONFIRMED').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div aria-hidden="true" className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="Profile Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-50 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-slate-100" />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1 relative z-10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{name}</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-indigo-100">
              <Shield className="w-3.5 h-3.5" />
              {currentUser?.role || 'Attendee'}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">{email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" /> Member since 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified Passholder</span>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="flex gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8 text-center relative z-10">
          <div className="space-y-1">
            <p className="text-3xl font-black text-indigo-600">{activeBookingsCount}</p>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Passes</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-rose-500">{savedEventsList.length}</p>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Saved</p>
          </div>
        </div>
      </div>

      {/* Profile Form & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Personal Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal Information</h2>
            <p className="text-xs text-slate-500 mt-1">Update your public name and ticket delivery contact info.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2 text-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Right Col: Preferences */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 pt-1 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition">
                <span className="font-bold text-slate-700">Digital Pass Emails</span>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition">
                <span className="font-bold text-slate-700">Gate & Day-of Alerts</span>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-indigo-950 via-indigo-900 to-violet-950 rounded-3xl p-6 text-white space-y-3 shadow-xl border border-indigo-800/40">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> EventHub Gold Attendee
            </span>
            <h4 className="text-lg font-black tracking-tight">Enjoy 0% Booking Fees</h4>
            <p className="text-xs text-indigo-200 leading-relaxed font-normal">
              Unlock priority ticket reservations, VIP venue express lanes, and complimentary cancellation protection.
            </p>
          </div>
        </div>

      </div>

      {/* Saved Events Showcase */}
      {savedEventsList.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Your Saved Events ({savedEventsList.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Bookmarked experiences ready for when you're set.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEventsList.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
