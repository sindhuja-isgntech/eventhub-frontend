import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Plus,
  Calendar,
  Users,
  DollarSign,
  Ticket,
  CheckCircle2,
  XCircle,
  Eye,
  Building,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { events, bookings, categories, addEvent, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'categories'>('events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [venueName, setVenueName] = useState('Metropolitan Convention Center');
  const [venueCity, setVenueCity] = useState('San Francisco');
  const [dateTime, setDateTime] = useState('2026-11-25T10:00');
  const [price, setPrice] = useState('75.00');
  const [seats, setSeats] = useState('250');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('EventHub Premier Host');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
  );

  const totalRevenue = bookings.reduce((sum, b) => (b.status === 'CONFIRMED' ? sum + b.totalAmount : sum), 0);
  const totalTicketsSold = bookings.reduce((sum, b) => (b.status === 'CONFIRMED' ? sum + b.ticketCount : sum), 0);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !seats) return;

    addEvent({
      title,
      description: description || 'An exclusive summit featuring world-renowned keynotes and networking.',
      category,
      venue: {
        id: Math.floor(Math.random() * 500) + 200,
        name: venueName,
        address: '100 Main Street',
        city: venueCity,
        capacity: Number(seats) * 2
      },
      dateTime: new Date(dateTime).toISOString(),
      price: Number(price),
      totalSeats: Number(seats),
      availableSeats: Number(seats),
      imageUrl,
      organizer,
      featured: true,
      tags: [category, 'Featured', 'Networking'],
      tiers: [
        {
          id: `t_${Date.now()}`,
          name: 'General Admission',
          price: Number(price),
          description: 'Standard event access',
          availableSeats: Number(seats),
          perks: ['Main Stage Access', 'Digital Ticket Pass', 'Networking Expo']
        }
      ]
    });

    setIsCreateModalOpen(false);
    // Reset
    setTitle('');
    setDescription('');
    showToast('New event published and live on catalog!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Management Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            EventHub Operations Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Monitor real-time reservations, ticket inventory, and publish new experiences.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Events</span>
            <span className="text-2xl font-black text-slate-900">{events.length} Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Gross Revenue</span>
            <span className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Tickets Sold</span>
            <span className="text-2xl font-black text-slate-900">{totalTicketsSold} Passes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Bookings</span>
            <span className="text-2xl font-black text-slate-900">{bookings.length} Orders</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-8 text-sm font-bold">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'events' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Active Events Catalog ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'bookings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Attendee Reservations ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories & Venues</span>
        </button>
      </div>

      {/* TAB 1: Events Table */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Event Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Available Seats</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img src={event.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="line-clamp-1">{event.title}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{event.organizer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-4">{event.venue.city}</td>
                    <td className="p-4">
                      {new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-bold text-slate-900">${event.price.toFixed(2)}</td>
                    <td className="p-4 font-bold text-emerald-600">
                      {event.availableSeats} / {event.totalSeats}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Reference</th>
                  <th className="p-4">Attendee</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Tier & Passes</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 pl-6 font-mono font-bold text-indigo-600">#{booking.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{booking.attendeeName}</p>
                      <p className="text-[11px] text-slate-400">{booking.attendeeEmail}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{booking.eventTitle}</td>
                    <td className="p-4">
                      {booking.ticketCount} × {booking.tierName}
                    </td>
                    <td className="p-4 font-black text-slate-900">${booking.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] inline-flex items-center gap-1 ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {booking.status === 'CONFIRMED' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Cancelled
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right text-slate-400">{booking.bookingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Categories & Venues */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Event Categories</span>
            </h3>
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-slate-400">{c.description}</span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Affiliated Venues</span>
            </h3>
            <div className="space-y-3 text-xs">
              {Array.from(new Set(events.map(e => e.venue.name))).map((vName, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900">{vName}</span>
                  <span className="text-slate-500">Verified Partner</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Publish New Event</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Cloud Developer Conference 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Venue City</label>
                  <input
                    type="text"
                    required
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Ticket Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Available Seats</label>
                  <input
                    type="number"
                    required
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Event Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell prospective attendees what to anticipate..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md shadow-indigo-600/30"
                >
                  Publish Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
