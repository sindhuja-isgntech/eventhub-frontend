import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Heart,
  ArrowUpDown,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Users
} from 'lucide-react';
import { formatCurrency, formatIndianDateTime } from '../utils/format';

type PriceFilter = 'All' | 'under5000' | '5000to10000' | 'over10000';
type EventSort = 'soonest' | 'priceLow' | 'priceHigh' | 'seats';

export const EventListing: React.FC = () => {
  const { events, categories, savedEventIds, isLoading, refreshEvents } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const savedEventsCount = events.filter(event => savedEventIds.includes(event.id)).length;

  // State from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('All');
  const [sortBy, setSortBy] = useState<EventSort>('soonest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlySaved, setShowOnlySaved] = useState(searchParams.get('saved') === 'true');

  // Unique cities from backend events
  const cities = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.venue.city).filter(Boolean)));
    return ['All', ...list];
  }, [events]);

  // Filtered & sorted events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Saved filter
    if (showOnlySaved) {
      result = result.filter(e => savedEventIds.includes(e.id));
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.city.toLowerCase().includes(q) ||
          e.venue.name.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // City
    if (selectedCity !== 'All') {
      result = result.filter(e => e.venue.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Price
    if (priceFilter === 'under5000') {
      result = result.filter(e => e.price < 5000);
    } else if (priceFilter === '5000to10000') {
      result = result.filter(e => e.price >= 5000 && e.price <= 10000);
    } else if (priceFilter === 'over10000') {
      result = result.filter(e => e.price > 10000);
    }

    // Sort
    if (sortBy === 'soonest') {
      result.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (sortBy === 'priceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'seats') {
      result.sort((a, b) => b.availableSeats - a.availableSeats);
    }

    return result;
  }, [events, searchTerm, selectedCategory, selectedCity, priceFilter, sortBy, showOnlySaved, savedEventIds]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setPriceFilter('All');
    setShowOnlySaved(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All' ||
    priceFilter !== 'All' ||
    showOnlySaved;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Section */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-600 mb-2 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Database Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {showOnlySaved ? 'Your Saved Experiences' : 'Explore All Experiences'}
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
              {showOnlySaved
                ? 'Events and experiences you have saved for quick access and booking.'
                : 'Browse live events verified and synchronized directly with your Spring Boot backend.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Sync from backend button */}
            <button
              onClick={() => refreshEvents()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Sync with backend database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing…' : 'Sync Backend'}</span>
            </button>

            {/* Quick Toggle for Saved Events */}
            <button
              onClick={() => {
                setShowOnlySaved(!showOnlySaved);
                setSearchParams(prev => {
                  if (!showOnlySaved) prev.set('saved', 'true');
                  else prev.delete('saved');
                  return prev;
                });
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
                showOnlySaved
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-rose-500/10'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Saved ({savedEventsCount})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchParams(prev => { prev.delete('category'); return prev; });
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSearchParams(prev => { prev.set('category', cat.name); return prev; });
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Control / Filter Bar */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, venue, host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/80 text-slate-900 placeholder-slate-400 text-xs pl-10 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50/80 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition appearance-none cursor-pointer font-medium"
            >
              <option value="All">All Cities & Locations</option>
              {cities.filter(c => c !== 'All').map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
              className="w-full bg-slate-50/80 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition appearance-none cursor-pointer font-medium"
            >
              <option value="All">All Ticket Prices</option>
              <option value="under5000">Under ₹5,000</option>
              <option value="5000to10000">₹5,000 to ₹10,000</option>
              <option value="over10000">₹10,000 and above</option>
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as EventSort)}
              className="w-full bg-slate-50/80 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition appearance-none cursor-pointer font-medium"
            >
              <option value="soonest">Sort: Date (Upcoming first)</option>
              <option value="priceLow">Sort: Price (Low to High)</option>
              <option value="priceHigh">Sort: Price (High to Low)</option>
              <option value="seats">Sort: Available Seats</option>
            </select>
          </div>

        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">
              Showing <span className="text-indigo-600 font-extrabold">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'experience' : 'experiences'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer bg-rose-50 px-2.5 py-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 text-indigo-600 gap-2 text-xs font-bold bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Synchronizing live events catalog from backend...</span>
        </div>
      )}

      {/* Results View */}
      <section aria-label="Events Catalog">
        {filteredEvents.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <article
                  key={event.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full sm:w-48 h-36 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-600 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          {event.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {event.venue.city}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug hover:text-indigo-600 transition">
                        <Link to={`/events/${event.id}`}>{event.title}</Link>
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {formatIndianDateTime(event.dateTime, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {event.venue.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {event.availableSeats} seats left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block md:text-right">Passes from</span>
                      <span className="text-2xl font-black text-slate-900">{formatCurrency(event.price)}</span>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No experiences found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any events matching your selected criteria. Try adjusting your search term or resetting your filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventListing;
