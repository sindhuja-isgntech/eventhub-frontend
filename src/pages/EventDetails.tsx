import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  CheckCircle,
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Building,
  ShieldCheck,
  Sparkles,
  Flame,
  Minus,
  Plus,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';
import { eventService, bookingService } from '../services/api';
import { useApp } from '../context/AppContext';
import type { Event as EventModel } from '../types';
import { formatCurrency, formatIndianDateTime } from '../utils/format';

type EventDetailsData = Omit<EventModel, 'category'> & {
  category: string | { name: string };
};

export const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, currentUser, refreshBookings, showToast, savedEventIds, toggleSaveEvent } = useApp();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventById(id!);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event details', err);
        setEvent(events.find((candidate) => String(candidate.id) === id) ?? null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEventDetails();
  }, [id, events]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (ticketCount > event.availableSeats) {
      showToast(`Only ${event.availableSeats} seats available for this event.`, 'error');
      return;
    }

    try {
      setSubmitting(true);
      const bookingPayload = {
        eventId: Number(event.id),
        quantity: ticketCount,
        attendees: [
          {
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || '',
          }
        ]
      };

      const createdBooking = await bookingService.createBooking(bookingPayload);
      await refreshBookings();
      navigate(`/bookings/confirmation/EH-${createdBooking.id}`);
    } catch {
      showToast('Booking could not be processed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Loading experience details…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Experience Not Found</h2>
        <p className="text-slate-500 text-sm">The event you are looking for may have concluded or been removed.</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const categoryName = (typeof event.category === 'string' ? event.category : event.category?.name) || 'Experience';
  const isSaved = savedEventIds.includes(Number(event.id));
  const isLowSeats = event.availableSeats <= 35;
  const isCriticalSeats = event.availableSeats <= 12;
  const unitPrice = typeof event.price === 'number' ? event.price : parseFloat(String(event.price || '0'));
  const subtotal = ticketCount * unitPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Breadcrumb">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to All Events
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveEvent(Number(event.id))}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{isSaved ? 'Saved' : 'Save Event'}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Media Showcase Banner */}
      <div className="relative h-[22rem] sm:h-[28rem] lg:h-[32rem] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/80">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Hero Overlay Details */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-600 text-white px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
              {categoryName}
            </span>
            {event.featured && (
              <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Featured Event
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
              Host: {event.organizer || 'EventHub Certified'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {formatIndianDateTime(event.dateTime, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {event.venue?.name}, {event.venue?.city}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details Column vs Sticky Booking Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Description, Highlights, Schedule, Venue Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Snapshot KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Date & Time</span>
              <p className="text-sm font-black text-slate-900">
                {formatIndianDateTime(event.dateTime, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <span className="text-xs text-slate-500">
                {formatIndianDateTime(event.dateTime, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Venue Location</span>
              <p className="text-sm font-black text-slate-900 truncate">
                {event.venue?.name || 'Main Hall'}
              </p>
              <span className="text-xs text-slate-500">
                {event.venue?.city}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Seat Inventory</span>
              <p className="text-sm font-black text-emerald-600 flex items-center gap-1">
                {event.availableSeats} Available
              </p>
              <span className="text-xs text-slate-500">
                of {event.totalSeats} total
              </span>
            </div>
          </div>

          {/* About Section */}
          <article className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Event Overview</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">About This Experience</h2>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base space-y-4">
              <p>{event.description}</p>
            </div>

            {/* What's Included */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Included With Every Ticket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant verified digital mobile pass</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full stage and expo hall admission</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complimentary high-speed venue Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 Attendee concierge support</span>
                </div>
              </div>
            </div>
          </article>

          {/* Agenda Timeline (if present) */}
          {event.agenda && event.agenda.length > 0 && (
            <article className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Session Timetable</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Schedule & Sessions</h2>

              <div className="space-y-4">
                {event.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100"
                  >
                    <span className="inline-flex px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black tracking-wide shrink-0">
                      {item.time}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* Venue & Organizer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>Venue Information</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{event.venue?.name || 'Main Hall'}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {event.venue?.address ? `${event.venue.address}, ` : ''}{event.venue?.city}
              </p>
              {event.venue?.capacity && (
                <span className="inline-block text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Max Capacity: {event.venue.capacity.toLocaleString('en-IN')} attendees
                </span>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <BadgeCheck className="w-4 h-4" />
                <span>Verified Organizer</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{event.organizer || 'EventHub Host'}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official organizer with verified credentials, customer ratings, and security compliance.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Booking Station */}
        <aside aria-label="Booking Panel" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-xl shadow-slate-900/5 h-fit sticky top-24">
          
          {/* Header Price & Seats Left */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Admission Pass
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900">{formatCurrency(unitPrice)}</span>
                <span className="text-xs text-slate-400 font-medium ml-1">/ person</span>
              </div>
              
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  isCriticalSeats
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : isLowSeats
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isCriticalSeats ? <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {event.availableSeats} Seats Left
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleBooking} className="space-y-5">
            
            {/* Quantity Stepper */}
            <div className="space-y-2">
              <label htmlFor="ticketCount" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Number of Tickets
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                  className="w-12 h-12 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  id="ticketCount"
                  type="number"
                  min="1"
                  max={Math.min(10, event.availableSeats)}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Math.max(1, Math.min(Math.min(10, event.availableSeats), Number(e.target.value) || 1)))}
                  className="flex-1 h-12 text-center font-black text-lg text-slate-900 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setTicketCount(Math.min(Math.min(10, event.availableSeats), ticketCount + 1))}
                  disabled={ticketCount >= Math.min(10, event.availableSeats)}
                  className="w-12 h-12 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-right">Max 10 tickets per order</p>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-slate-50/80 rounded-2xl p-4 space-y-2.5 text-xs border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>{ticketCount} × Pass ({formatCurrency(unitPrice)})</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-base text-indigo-600">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {/* Auth note if not signed in */}
            {!currentUser && (
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                You will be asked to sign in to generate and assign your ticket passes.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || event.availableSeats <= 0}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Ticket className="w-4 h-4" aria-hidden="true" />
              <span>{submitting ? 'Confirming Reservation…' : 'Reserve Tickets'}</span>
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Guaranteed authentic ticket passes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Instant mobile digital pass with QR</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default EventDetails;
