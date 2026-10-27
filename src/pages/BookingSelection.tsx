import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { eventService, bookingService, getApiErrorMessage } from '../services/api';
import { useApp } from '../context/AppContext';
import type { Event as EventModel } from '../types';

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

  if (loading) return <div className="text-center py-20 text-slate-500">Loading booking page...</div>;
  if (!event) return <div className="text-center py-20 text-slate-500">Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav aria-label="Breadcrumb">
        <Link to={`/events/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Event
        </Link>
      </nav>

      <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-indigo-500" /> {new Date(event.dateTime).toLocaleString()}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-indigo-500" /> {event.venue?.name}, {event.venue?.city}</span>
        </div>
      </header>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket Quantity Selection */}
        <section aria-label="Ticket Quantity" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" /> Select Ticket Quantity
          </h2>
          <div className="flex items-center justify-between border border-slate-200 p-4 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">Standard Admission Ticket</p>
              <p className="text-sm text-slate-500">${event.price?.toFixed(2)} per ticket • {event.availableSeats} seats remaining</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 rounded-lg border border-slate-200 text-lg font-bold hover:bg-slate-100"
              >-</button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-slate-200 text-lg font-bold hover:bg-slate-100"
              >+</button>
            </div>
          </div>
        </section>

        {/* Attendee Details */}
        <section aria-label="Attendee Information" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Attendee Details
          </h2>
          {attendees.map((attendee, idx) => (
            <fieldset key={idx} className="border border-slate-200 p-4 rounded-xl space-y-3">
              <legend className="text-xs font-bold text-slate-500 uppercase px-2">Attendee #{idx + 1}</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={attendee.name}
                  onChange={(e) => handleAttendeeChange(idx, 'name', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={attendee.email}
                  onChange={(e) => handleAttendeeChange(idx, 'email', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={attendee.phone}
                  onChange={(e) => handleAttendeeChange(idx, 'phone', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </fieldset>
          ))}
        </section>

        {/* Order Summary & Complete Button */}
        <footer className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Amount</span>
            <span className="text-2xl font-extrabold text-slate-900">${(quantity * event.price).toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Processing Order...' : 'Confirm & Book Now'} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </form>
    </div>
  );
};