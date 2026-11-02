import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, User, ArrowLeft, ArrowRight, Minus, Plus, Mail, Phone } from 'lucide-react';
import { eventService, bookingService, getApiErrorMessage } from '../services/api';
import { useApp } from '../context/AppContext';
import type { Event as EventModel } from '../types';
import { formatCurrency, formatIndianDateTime } from '../utils/format';

type BookingEvent = Pick<EventModel, 'id' | 'title' | 'dateTime' | 'price' | 'availableSeats'> & {
  venue?: Pick<EventModel['venue'], 'name' | 'city'>;
};

export const BookingSelection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, refreshBookings } = useApp();

  const [event, setEvent] = useState<BookingEvent | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [attendees, setAttendees] = useState<Array<{ name: string; email: string; phone: string }>>([
    { name: '', email: '', phone: '' }
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventById(id!);
        setEvent(data);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Failed to fetch event details.'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleQuantityChange = (newQty: number) => {
    const qty = Math.max(1, Math.min(newQty, event?.availableSeats || 10));
    setQuantity(qty);

    setAttendees(prev => {
      const updated = [...prev];
      if (qty > prev.length) {
        for (let i = prev.length; i < qty; i++) {
          updated.push({ name: '', email: '', phone: '' });
        }
      } else {
        return updated.slice(0, qty);
      }
      return updated;
    });
  };

  const handleAttendeeChange = (index: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], [field]: value };
    setAttendees(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        eventId: Number(id),
        quantity: quantity,
        attendees: attendees
      };

      const createdBooking = await bookingService.createBooking(payload);
      await refreshBookings();
      navigate(`/bookings/confirmation/EH-${createdBooking.id}`);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to complete booking. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Loading reservation page…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-rose-600 font-bold">Event details could not be found.</p>
        <Link to="/events" className="text-indigo-600 font-bold hover:underline">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      <nav aria-label="Breadcrumb">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Event
        </Link>
      </nav>

      {/* Header Overview Card */}
      <header className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Ticket Reservation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
        <div className="flex flex-wrap gap-5 text-xs text-slate-500 font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
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
            <MapPin className="w-4 h-4 text-indigo-500" />
            {event.venue?.name}, {event.venue?.city}
          </span>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket Quantity Selection */}
        <section aria-label="Ticket Quantity" className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" /> Select Pass Quantity
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/90 p-5 rounded-2xl bg-slate-50/50">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Standard Admission Pass</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatCurrency(event.price ?? 0)} per ticket • <span className="text-emerald-600 font-bold">{event.availableSeats} seats remaining</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-lg w-8 text-center text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= Math.min(10, event.availableSeats || 10)}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Attendee Details */}
        <section aria-label="Attendee Information" className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Attendee Credentials
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide names for individual mobile passes and badges.
            </p>
          </div>

          <div className="space-y-4">
            {attendees.map((attendee, idx) => (
              <fieldset key={idx} className="border border-slate-200/90 p-5 rounded-2xl space-y-3 bg-slate-50/30">
                <legend className="text-[10px] font-black text-indigo-600 uppercase tracking-wider px-2.5 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">
                  Attendee #{idx + 1}
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={attendee.name}
                      onChange={(e) => handleAttendeeChange(idx, 'name', e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={attendee.email}
                      onChange={(e) => handleAttendeeChange(idx, 'email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={attendee.phone}
                      onChange={(e) => handleAttendeeChange(idx, 'phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        {/* Order Summary & Complete Button */}
        <footer className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Amount Due</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{formatCurrency(quantity * event.price)}</span>
              <span className="text-xs text-slate-400 font-medium">({quantity} passes)</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">Zero booking fees</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Confirming Order…' : 'Confirm & Reserve Passes'} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </form>
    </div>
  );
};

export default BookingSelection;
