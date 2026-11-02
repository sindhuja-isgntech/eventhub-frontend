import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CalendarCheck,
  Headphones,
  Laptop,
  Music,
  Palette,
  Briefcase,
  UtensilsCrossed,
  Activity,
  Award,
  Compass
} from 'lucide-react';

export const Home: React.FC = () => {
  const { events, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    navigate(`/events?${params.toString()}`);
  };

  const featuredEvents = events.filter(e => e.featured).slice(0, 3);
  const upcomingEvents = events.slice(0, 6);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'technology': return <Laptop className="w-6 h-6" />;
      case 'music': return <Music className="w-6 h-6" />;
      case 'art & design': return <Palette className="w-6 h-6" />;
      case 'business': return <Briefcase className="w-6 h-6" />;
      case 'food & drink': return <UtensilsCrossed className="w-6 h-6" />;
      case 'sports & fitness': return <Activity className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-28 pb-16">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        {/* Ambient Gradient Glows */}
        <div aria-hidden="true" className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none" />
        <div aria-hidden="true" className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-24 left-1/3 w-[28rem] h-[28rem] bg-rose-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Subtle decorative grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Discover India’s Top Experiences in 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] sm:leading-[1.05] text-white max-w-4xl mx-auto">
            Experience Unforgettable Moments,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-400 bg-clip-text text-transparent">
              Curated Just For You.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Discover India’s best tech summits, live concerts, art expos, and local experiences with instant digital ticketing.
          </p>

          {/* Interactive Hero Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-indigo-950/50 flex flex-col sm:flex-row gap-2.5"
          >
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-indigo-300 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search event title, venue, or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base pl-12 pr-4 py-3 rounded-xl sm:rounded-2xl border border-transparent focus:outline-none focus:border-indigo-400/80 transition"
              />
            </div>

            <div className="sm:w-52 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 text-white text-sm pl-4 pr-9 py-3 rounded-xl sm:rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-400 transition appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-white">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              <Compass className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Trending Tags:</span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </div>

        {/* Hero Stats Ribbon */}
        <div className="max-w-5xl mx-auto mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10 text-center">
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-white">50,000+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Tickets Reserved</p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-indigo-400">400+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Verified Hosts</p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">99.8%</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Satisfaction Rate</p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-violet-400">12+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Metro Cities</p>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED SPOTLIGHT SECTION ===================== */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Handpicked for you</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition group"
            >
              <span>See All Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      )}

      {/* ===================== CATEGORY EXPLORER TILES ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
            Explore By Interest
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse By Category
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Whatever your passion is, find the perfect gathering happening this season.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const count = events.filter(e => e.category === cat.name).length;
            return (
              <Link
                key={cat.id}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-3xl border border-slate-200/90 p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                    {count} {count === 1 ? 'Event' : 'Events'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===================== UPCOMING EVENTS CATALOG ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1 block">
              Upcoming Schedule
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trending Experiences
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition group"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* ===================== VALUE PROPOSITION ===================== */}
      <section className="bg-gradient-to-b from-white to-slate-50/80 border-y border-slate-200/90 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
              Engineered For Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Eventgoers Choose EventHub
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              From discovering hidden gems to smooth mobile gate check-ins, we make reserving event tickets completely effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-7 space-y-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold ring-4 ring-indigo-50/50">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Instant Digital Pass</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive verifiable QR tickets immediately upon reservation. Scan directly from your mobile screen at the gate.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 space-y-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold ring-4 ring-emerald-50/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Verified Hosts Only</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every event organizer, speaker, and venue partner is vetted to ensure safety, authenticity, and premium experiences.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 space-y-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold ring-4 ring-violet-50/50">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Hassle-Free Passes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Plans change! Conveniently manage, view digital receipts, or cancel passes straight from your Attendee Portal.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 space-y-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold ring-4 ring-amber-50/50">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">24/7 Dedicated Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our attendee concierge team is on standby 24/7 for venue access questions, seat transfers, or booking help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CREATOR & ORGANIZER CTA ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-700/50">
          {/* Decorative glowing backdrops */}
          <div aria-hidden="true" className="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3.5 max-w-xl text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wide border border-white/10">
              <Award className="w-3.5 h-3.5 text-amber-400" /> For Organizers & Creators
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Host Your Next Sold-Out Event on EventHub
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Create custom ticket tiers, monitor seat inventories in real time, and reach thousands of passionate eventgoers with zero hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              to="/admin"
              className="bg-white text-indigo-900 hover:bg-slate-100 text-sm font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-lg text-center cursor-pointer"
            >
              Launch Admin Dashboard
            </Link>
            <Link
              to="/register"
              className="bg-indigo-700/60 hover:bg-indigo-700 text-white border border-white/20 text-sm font-bold px-6 py-3.5 rounded-xl transition-all text-center cursor-pointer"
            >
              Register as Host
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
