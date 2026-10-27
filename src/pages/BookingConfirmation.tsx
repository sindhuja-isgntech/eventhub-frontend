import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { bookingService, getApiErrorMessage } from '../services/api';
import type { Booking, BookingRecord } from '../types';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Ticket,
  Printer,
  Home,
  ShieldCheck
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useApp();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    const bookingId = id?.replace(/^EH-/, '');
    if (!bookingId) {
      return;
    }

    bookingService.getBooking(bookingId)
      .then((record: BookingRecord) => {
        if (active) setBooking({ ...record, id: `EH-${record.id}` });
      })
      .catch(error => {
        if (active) setErrorMessage(getApiErrorMessage(error, 'Unable to load this booking.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    if (!booking) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.id);
      showToast(`Booking reference #${booking.id} copied!`, 'info');
    }
  };

  if (!id || !id.replace(/^EH-/, '')) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p role="alert" className="text-rose-600">Booking not found.</p>
        <Link to="/my-bookings" className="text-indigo-600 font-semibold hover:underline">Back to My Bookings</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p role="alert" className="text-rose-600">{errorMessage || 'Booking not found.'}</p>
        <Link to="/my-bookings" className="text-indigo-600 font-semibold hover:underline">Back to My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full shadow-inner animate-bounce-short">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          You're All Set! Booking Confirmed
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
          Your digital ticket pass has been issued and sent to{' '}
          <strong className="text-slate-900">{booking.attendeeEmail}</strong>.
        </p>

        <button
          onClick={handleCopyRef}
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          <span>Reference #{booking.id}</span>
          <span className="text-[10px] text-slate-500 font-sans">(Click to copy)</span>
        </button>
      </div>

      {/* DIGITAL TICKET BOARDING PASS */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl max-w-2xl mx-auto">
        
        {/* Ticket Top Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              {booking.eventCategory}
            </span>
            <span className="flex items-center gap-1 bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Pass
            </span>
          </div>

          <h2 className="text-2xl font-black leading-tight">{booking.eventTitle}</h2>
          <p className="text-xs text-indigo-200">{booking.venueName}, {booking.venueCity}</p>
        </div>

        {/* Middle Section: Details & QR Code */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          <div className="sm:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase block">Attendee</span>
                <span className="text-sm font-bold text-slate-900">{booking.attendeeName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Ticket Tier</span>
                <span className="text-sm font-bold text-indigo-600">{booking.tierName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Date & Time</span>
                <span className="text-xs font-semibold text-slate-800">
                  {new Date(booking.eventDateTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Quantity</span>
                <span className="text-sm font-bold text-slate-900">{booking.ticketCount} Passes</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Amount Paid (Inc. taxes)</span>
              <span className="text-lg font-black text-slate-900">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <img
              src={booking.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${booking.id}`}
              alt={`QR code for ${booking.id}`}
              className="w-28 h-28 object-contain rounded-lg shadow-xs"
            />
            <span className="text-[10px] text-slate-400 font-mono mt-2 uppercase font-bold">
              Scan at Venue
            </span>
          </div>

        </div>

        {/* Perforated Divider Simulation */}
        <div className="relative border-t border-dashed border-slate-300 py-3 bg-slate-50 flex items-center justify-between px-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Booked on {booking.bookingDate}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            {booking.venueCity}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
        <button
          onClick={handlePrint}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Pass</span>
        </button>

        <Link
          to="/my-bookings"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-xs"
        >
          <Ticket className="w-4 h-4" />
          <span>View My Bookings</span>
        </Link>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>

    </div>
  );
};

export default BookingConfirmation;