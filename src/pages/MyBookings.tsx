import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Booking } from '../types';
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Wallet,
  User,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatIndianDateTime } from '../utils/format';

export const MyBookings: React.FC = () => {
  const { bookings, bookingsLoading, cancelBooking, currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('CONFIRMED');
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const totalSpent = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Reference copied to clipboard!', 'info');
    }
  };

  if (bookingsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Loading your reservations…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-600 mb-2 border border-indigo-100">
            <Ticket className="w-3.5 h-3.5" />
            <span>Attendee Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Booked Events & Passes
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
            Access your digital boarding passes, manage venue check-in QR codes, and review reservations.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Passes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{confirmedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold block">Ready for mobile gate check-in</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Investment</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-600">{formatCurrency(totalSpent)}</p>
          <span className="text-[11px] text-slate-500 block">Across confirmed passes</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Attendee Profile</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 truncate">{currentUser?.name || 'Guest User'}</p>
          <span className="text-[11px] text-slate-500 truncate block">{currentUser?.email}</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'CONFIRMED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Confirmed Passes</span>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {confirmedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Activity ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`pb-3.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'CANCELLED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Left Accent Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isConfirmed ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                />

                {/* Left Info */}
                <div className="space-y-3 flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {booking.eventCategory}
                    </span>
                    <button
                      onClick={() => handleCopy(booking.id)}
                      className="text-xs font-mono font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer bg-slate-50 px-2 py-0.5 rounded-md"
                      title="Click to copy reference"
                    >
                      <span>Ref: #{booking.id}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-400" /> Cancelled
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 hover:text-indigo-600 transition">
                    <Link to={`/events/${booking.eventId}`}>
                      {booking.eventTitle}
                    </Link>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {formatIndianDateTime(booking.eventDateTime, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      {booking.venueCity} ({booking.venueName})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-indigo-500" />
                      {booking.ticketCount} × {booking.tierName}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Total Paid</span>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(booking.totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => setSelectedPass(booking)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Pass</span>
                        </button>

                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold px-3 py-2.5 rounded-xl transition border border-rose-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <Link
                      to={`/bookings/confirmation/${booking.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1"
                    >
                      <span>Receipt</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No bookings in this tab</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You don't have any {activeTab.toLowerCase()} event passes right now. Ready to explore what's happening?
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              <span>Explore Events Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* QR PASS MODAL */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Digital Gate Pass
              </span>
              <button
                onClick={() => setSelectedPass(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-slate-900 text-lg leading-tight">{selectedPass.eventTitle}</h4>
              <p className="text-xs text-slate-500 font-medium">{selectedPass.tierName} • {selectedPass.ticketCount} Passes</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center">
              <img
                src={selectedPass.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedPass.id}`}
                alt="Gate QR Code"
                className="w-44 h-44 object-contain rounded-xl shadow-xs"
              />
              <span className="font-mono text-xs font-black text-slate-800 mt-3 bg-white px-3 py-1 rounded-lg border border-slate-200">
                Ref: #{selectedPass.id}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Present this verified QR pass to gate staff on your smartphone for rapid check-in.
            </p>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-black text-slate-900 text-sm">Cancel Reservation?</h4>
                <p className="text-xs text-slate-600">This will release your reserved seats back to other attendees.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your pass for <strong>{bookingToCancel.eventTitle}</strong> (Ref #{bookingToCancel.id})? A full credit refund of <strong>{formatCurrency(bookingToCancel.totalAmount)}</strong> will be processed.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={async () => {
                  setIsCancelling(true);
                  try {
                    await cancelBooking(bookingToCancel.id);
                    setBookingToCancel(null);
                  } catch {
                    showToast('Unable to cancel this booking. Please try again.', 'error');
                  } finally {
                    setIsCancelling(false);
                  }
                }}
                disabled={isCancelling}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling…' : 'Yes, Cancel Pass'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
