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
  Sparkles
} from 'lucide-react';

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

  if (bookingsLoading) {
    return <div className="py-20 text-center text-slate-500">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Attendee Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Booked Events & Passes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Access your digital tickets, manage reservations, and check venue locations.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Passes</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{confirmedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Ready for gate check-in</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Investment</p>
          <p className="text-3xl font-black text-indigo-600 mt-1">${totalSpent.toFixed(2)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across confirmed bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendee Profile</p>
          <p className="text-lg font-bold text-slate-900 mt-1 truncate">{currentUser?.name || 'Guest User'}</p>
          <span className="text-[11px] text-slate-500 truncate block">{currentUser?.email}</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'CONFIRMED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Confirmed Passes</span>
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
            {confirmedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'ALL'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Activity ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`pb-3 border-b-2 transition ${
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
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {booking.eventCategory}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Ref: #{booking.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Cancelled
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    <Link to={`/events/${booking.eventId}`} className="hover:text-indigo-600 transition">
                      {booking.eventTitle}
                    </Link>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {new Date(booking.eventDateTime).toLocaleDateString('en-US', {
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
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid</span>
                    <span className="text-xl font-black text-slate-900">${booking.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => setSelectedPass(booking)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Pass</span>
                        </button>

                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold px-3 py-2 rounded-xl transition border border-rose-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <Link
                      to={`/bookings/confirmation/${booking.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                    >
                      Receipt
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No bookings in this tab</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You don't have any {activeTab.toLowerCase()} event passes right now. Ready to explore what's happening?
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              <span>Explore Events Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* QR PASS MODAL */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Digital Gate Pass</span>
              <button
                onClick={() => setSelectedPass(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">{selectedPass.eventTitle}</h4>
              <p className="text-xs text-slate-500 mt-1">{selectedPass.tierName} • {selectedPass.ticketCount} Passes</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center">
              <img
                src={selectedPass.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedPass.id}`}
                alt="Gate QR Code"
                className="w-40 h-40 object-contain rounded-xl"
              />
              <span className="font-mono text-xs font-bold text-slate-700 mt-2">
                #{selectedPass.id}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Present this QR code on your phone to venue staff at the gate for fast check-in.
            </p>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-2xl">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cancel Reservation?</h4>
                <p className="text-xs text-slate-600">This will release your reserved seats back to other attendees.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your booking for <strong>{bookingToCancel.eventTitle}</strong> (Ref #{bookingToCancel.id})? A full refund of <strong>${bookingToCancel.totalAmount.toFixed(2)}</strong> will be credited to your original payment method.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
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
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
