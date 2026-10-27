import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Layers, MapPin, Ticket } from 'lucide-react';
import { eventService, categoryService, venueService, adminService } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ events: 0, categories: 0, venues: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, categories, venues, bookings] = await Promise.all([
          eventService.getAllEvents(),
          categoryService.getAllCategories(),
          venueService.getAllVenues(),
          adminService.getAllBookings()
        ]);
        setStats({
          events: events.length,
          categories: categories.length,
          venues: venues.length,
          bookings: bookings.length
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h1>
        <p className="text-slate-500 text-sm">Manage system resources, events, categories, and bookings.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/events" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 transition space-y-2">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">{stats.events}</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Events</p>
        </Link>
        <Link to="/admin/categories" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 transition space-y-2">
          <Layers className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">{stats.categories}</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase">Categories</p>
        </Link>
        <Link to="/admin/venues" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 transition space-y-2">
          <MapPin className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">{stats.venues}</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase">Venues</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 transition space-y-2">
          <Ticket className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">{stats.bookings}</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Bookings</p>
        </Link>
      </section>
    </div>
  );
};