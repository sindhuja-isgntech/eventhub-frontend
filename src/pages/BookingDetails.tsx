import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import { bookingService } from '../services/api';

export const BookingDetails: React.FC = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await (bookingService as typeof bookingService & { getBookingById: (bookingId: string) => Promise<any> }).getBookingById(id!);
        setBooking(data);
      } catch (err) {
        console.error('Failed to fetch booking details', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading booking ticket...</div>;
  if (!booking) return <div className="text-center py-20 text-slate-500">Booking reference not found.</div>;

  const event = booking.bookingItems?.[0]?.event;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <nav aria-label="Breadcrumb">
        <Link to="/my-bookings" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Link>
      </nav>

      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <header className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono text-slate-400">Booking Reference #{booking.id}</span>
            <h1 className="text-2xl font-bold text-slate-900">{event?.title}</h1>
          </div>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {booking.status}
          </span>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
          <div>
            <dt className="font-semibold text-slate-700">Date & Time</dt>
            <dd className="m-0">{event?.dateTime ? new Date(event.dateTime).toLocaleString() : 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Venue</dt>
            <dd className="m-0">{event?.venue?.name}, {event?.venue?.city}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Ticket Quantity</dt>
            <dd className="m-0">{booking.ticketCount} Tickets</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Total Amount</dt>
            <dd className="m-0 font-bold text-slate-900">${booking.totalAmount?.toFixed(2)}</dd>
          </div>
        </dl>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Registered Attendees</h2>
          <ul className="space-y-2 list-none p-0 m-0">
            {booking.attendees?.map((att: any, idx: number) => (
              <li key={idx} className="border border-slate-200 p-3 rounded-xl flex justify-between items-center text-sm">
                <span className="font-medium text-slate-900">{att.name}</span>
                <span className="text-slate-500">{att.email}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
};