import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { bookingService, getApiErrorMessage } from '../services/api';
import type { Booking, BookingRecord } from '../types';
import { formatCurrency, formatIndianDateTime } from '../utils/format';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Ticket,
  Printer,
  Home,
  ShieldCheck,
  Copy
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
        <p role="alert" className="text-rose-600 font-bold">Booking not found.</p>
        <Link to="/my-bookings" className="text-indigo-600 font-bold hover:underline">Back to My Bookings</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Generating your digital boarding pass…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p role="alert" className="text-rose-600 font-bold">{errorMessage || 'Booking not found.'}</p>
        <Link to="/my-bookings" className="text-indigo-600 font-bold hover:underline">Back to My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Celebration Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          You're All Set! Booking Confirmed
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
          Your digital boarding pass has been registered and verified for{' '}
          <strong className="text-slate-900">{booking.attendeeEmail}</strong>.
        </p>

        <button
          onClick={handleCopyRef}
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          <span>Ref: #{booking.id}</span>
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] text-slate-400 font-sans">(Click to copy)</span>
        </button>
      </div>

      {/* DIGITAL TICKET BOARDING PASS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xl shadow-indigo-950/10 max-w-2xl mx-auto relative">
        
        {/* Ticket Top Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold border border-white/20">
              {booking.eventCategory}
            </span>
            <span className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full font-black text-[11px] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Pass
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight relative z-10">{booking.eventTitle}</h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium relative z-10">{booking.venueName}, {booking.venueCity}</p>
        </div>

        {/* Middle Section: Details & QR Code */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          <div className="sm:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-extrabold uppercase text-[10px] block">Attendee Name</span>
                <span className="text-sm font-black text-slate-900">{booking.attendeeName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold uppercase text-[10px] block">Ticket Tier</span>
                <span className="text-sm font-black text-indigo-600">{booking.tierName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold uppercase text-[10px] block">Date & Time</span>
                <span className="text-xs font-bold text-slate-800">
                  {formatIndianDateTime(booking.eventDateTime, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-extrabold uppercase text-[10px] block">Quantity</span>
                <span className="text-sm font-black text-slate-900">{booking.ticketCount} Passes</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Paid (Taxes included)</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-inner">
            <img
              src={booking.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${booking.id}`}
              alt={`QR code for ${booking.id}`}
              className="w-32 h-32 object-contain rounded-xl shadow-xs"
            />
            <span className="text-[10px] text-slate-400 font-mono mt-2 uppercase font-extrabold tracking-wider">
              Scan at Gate
            </span>
          </div>

        </div>

        {/* Perforated Divider Simulation */}
        <div className="relative border-t-2 border-dashed border-slate-200 py-3.5 bg-slate-50/80 flex items-center justify-between px-6 text-xs text-slate-500 font-semibold">
          {/* Authentic ticket notches */}
          <div aria-hidden="true" className="absolute -left-3.5 -top-3.5 w-7 h-7 bg-slate-50 rounded-full border border-slate-200" />
          <div aria-hidden="true" className="absolute -right-3.5 -top-3.5 w-7 h-7 bg-slate-50 rounded-full border border-slate-200" />

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
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>

        <Link
          to="/my-bookings"
          className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl transition-all text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
        >
          <Ticket className="w-4 h-4" />
          <span>My Reservations</span>
        </Link>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>

    </div>
  );
};

export default BookingConfirmation;
