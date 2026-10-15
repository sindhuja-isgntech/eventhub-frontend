import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Heart,
  ArrowUpDown,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

export const EventListing: React.FC = () => {
  const { events, categories, savedEventIds } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'under50' | '50to100' | 'over100'>('All');
  const [sortBy, setSortBy] = useState<'soonest' | 'priceLow' | 'priceHigh' | 'seats'>('soonest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlySaved, setShowOnlySaved] = useState(searchParams.get('saved') === 'true');

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setSelectedCategory(urlCategory);

    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) setSearchTerm(urlSearch);

    const urlSaved = searchParams.get('saved');
    if (urlSaved === 'true') setShowOnlySaved(true);
  }, [searchParams]);

  // Unique cities from events
  const cities = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.venue.city)));
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
    if (priceFilter === 'under50') {
      result = result.filter(e => e.price < 50);
    } else if (priceFilter === '50to100') {
      result = result.filter(e => e.price >= 50 && e.price <= 100);
    } else if (priceFilter === 'over100') {
      result = result.filter(e => e.price > 100);
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
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Event Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {showOnlySaved ? 'Your Saved Events' : 'Explore All Experiences'}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {showOnlySaved
                ? 'Events and experiences you have bookmarked for later.'
                : 'Browse conferences, festivals, exhibits, and workshops across top cities.'}
            </p>
          </div>

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
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition shadow-xs ${
              showOnlySaved
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${showOnlySaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Saved ({savedEventIds.length})</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchParams(prev => { prev.delete('category'); return prev; });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Control / Filter Bar */}
      <section className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, venue, host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
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
              className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none cursor-pointer"
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
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="All">All Ticket Prices</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 to $100</option>
              <option value="over100">$100 and above</option>
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="soonest">Sort: Date (Upcoming first)</option>
              <option value="priceLow">Sort: Price (Low to High)</option>
              <option value="priceHigh">Sort: Price (High to Low)</option>
              <option value="seats">Sort: Available Seats</option>
            </select>
          </div>

        </div>

        {/* Status Bar: Count, Active Filters & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">
              Showing <span className="text-indigo-600">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

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
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full sm:w-44 h-32 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {event.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {event.venue.city}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight hover:text-indigo-600 transition">
                        <Link to={`/events/${event.id}`}>{event.title}</Link>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {new Date(event.dateTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {event.venue.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3 shrink-0">
                    <div>
                      <span className="text-xs text-slate-400 block md:text-right">From</span>
                      <span className="text-xl font-black text-slate-900">${event.price.toFixed(2)}</span>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                    >
                      Book Ticket
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No events found</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We couldn't find any events matching your selected criteria. Try adjusting your search term or resetting your filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-xs"
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