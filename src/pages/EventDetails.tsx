import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, CheckCircle, ArrowLeft } from 'lucide-react';
import { eventService, bookingService } from '../services/api';

export const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
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
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEventDetails();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Construct payload matching your Booking entity structure
      const bookingPayload = {
        user: { id: 1 }, // Default user reference for demonstration
        totalAmount: ticketCount * event.price,
        ticketCount: ticketCount,
        status: 'CONFIRMED',
        bookingItems: [
          {
            event: { id: event.id },
            quantity: ticketCount,
            unitPrice: event.price,
            subtotal: ticketCount * event.price
          }
        ]
      };

      const response = await bookingService.createBooking(bookingPayload);
      navigate(`/bookings/confirmation/${response.id || 'EH-94820'}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed. Please check seat availability.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading event information...</div>;
  if (!event) return <div className="text-center py-20 text-slate-500">Event not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <nav aria-label="Breadcrumb">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Events
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <header className="space-y-4">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {event.category?.name || 'Event'}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">{event.title}</h1>
          </header>

          <hr className="border-slate-100" />

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
              <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-slate-700">Date & Time</dt>
                <dd className="text-slate-600 m-0">{new Date(event.dateTime).toLocaleString()}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
              <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-slate-700">Location</dt>
                <dd className="text-slate-600 m-0">{event.venue?.name}, {event.venue?.city}</dd>
              </div>
            </div>
          </dl>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About This Event</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{event.description}</p>
          </section>
        </article>

        <aside aria-label="Booking Panel" className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm h-fit sticky top-24">
          <header className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900">${event.price?.toFixed(2)}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> {event.availableSeats} Seats Left
            </span>
          </header>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ticketCount" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Tickets
              </label>
              <input
                id="ticketCount"
                type="number"
                min="1"
                max={Math.min(10, event.availableSeats)}
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full text-center font-bold text-slate-900 border border-slate-200 rounded-xl py-2 focus:outline-none bg-slate-50"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total Amount</span>
                <span>${(ticketCount * event.price).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || event.availableSeats <= 0}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Ticket className="w-4 h-4" aria-hidden="true" /> {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};