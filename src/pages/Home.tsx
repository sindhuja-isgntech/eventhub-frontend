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
  Award
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
    <div className="space-y-16 lg:space-y-24 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8">
        {/* Glowing Gradient Background Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Discover Top-Tier Experiences in 2026</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-none text-white max-w-4xl mx-auto">
            Experience Unforgettable Moments,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-400 bg-clip-text text-transparent">
              Curated Just For You.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Discover premier tech summits, electrifying live concerts, art expos, and VIP masterclasses with instant digital ticketing.
          </p>

          {/* Interactive Hero Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2.5"
          >
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by event title, keyword, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base pl-12 pr-4 py-3 rounded-xl sm:rounded-2xl border border-transparent focus:outline-none focus:border-indigo-400 transition"
              />
            </div>

            <div className="sm:w-48 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 text-white text-sm pl-4 pr-8 py-3 rounded-xl sm:rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-400 transition appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-white">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl sm:rounded-2xl transition shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium mr-2">Popular:</span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </div>

        {/* Hero Stats Ribbon */}
        <div className="max-w-5xl mx-auto mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">50,000+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Tickets Reserved</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-indigo-400">400+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Verified Organizers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">99.8%</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Customer Satisfaction</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-violet-400">12+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Major Metro Hubs</p>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT SECTION */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Handpicked for you</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>See All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORY EXPLORER TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse By Category
          </h2>
          <p className="text-slate-600 text-sm">
            Whatever your passion is, find the perfect gathering happening this season.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = events.filter(e => e.category === cat.name).length;
            return (
              <Link
                key={cat.id}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-2xl border border-slate-200/90 p-5 text-center flex flex-col items-center justify-center space-y-3 shadow-xs hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {count} {count === 1 ? 'Event' : 'Events'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1 block">
              Don't Miss Out
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Experiences
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* VALUE PROPOSITION / TRUST SIGNALS */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">
              Engineered For Reliability
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Why Attendees Love EventHub
            </h2>
            <p className="text-slate-600 text-sm">
              From discovering hidden gems to seamless venue check-ins, we make event booking effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Instant Digital Pass</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive digital QR passes immediately upon confirmation. Scan straight from your smartphone at the gate.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Hosts Only</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every event host and venue undergoes vetting to guarantee authentic experiences and safety.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Flexible Rescheduling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plans change! Easily manage, cancel, or reassign tickets right from your "My Bookings" portal.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">24/7 Dedicated Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our support desk is online around the clock for any venue, access, or payment inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOST AN EVENT CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <Award className="w-3.5 h-3.5" /> For Creators & Organizers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Host Your Next Event on EventHub
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Create ticket tiers, monitor seat availability in real time, and reach thousands of passionate attendees with zero setup fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/admin"
              className="bg-white text-indigo-700 hover:bg-slate-100 text-sm font-bold px-6 py-3.5 rounded-xl transition shadow-lg text-center"
            >
              Launch Admin Dashboard
            </Link>
            <Link
              to="/register"
              className="bg-indigo-900/60 hover:bg-indigo-900 text-white border border-white/20 text-sm font-semibold px-6 py-3.5 rounded-xl transition text-center"
            >
              Sign Up as Organizer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

