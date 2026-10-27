import React, { useEffect, useState } from 'react';
import { adminService, getApiErrorMessage } from '../../services/api';
import type { BookingRecord } from '../../types';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    adminService.getAllBookings()
      .then(records => {
        if (active) setBookings(records);
      })
      .catch(error => {
        if (active) setErrorMessage(getApiErrorMessage(error, 'Unable to load bookings.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (bookingId: number, status: BookingRecord['status']) => {
    setErrorMessage('');
    setUpdatingId(bookingId);
    try {
      const updatedBooking = await adminService.updateBookingStatus(bookingId, status);
      setBookings(current => current.map(booking => (
        booking.id === bookingId ? updatedBooking : booking
      )));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update booking status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Booking Management</h1>
        <p className="text-sm text-slate-500 mt-1">View all customer bookings and update their status.</p>
      </header>

      {errorMessage && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className="py-12 text-center text-slate-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No bookings have been made yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Booking</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Event</th>
                <th className="px-5 py-4">Tickets / Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="text-slate-700">
                  <td className="px-5 py-4 font-mono font-semibold">EH-{booking.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{booking.customerName}</p>
                    <p className="text-xs text-slate-500">{booking.customerEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{booking.eventTitle}</p>
                    <p className="text-xs text-slate-500">{booking.eventCategory}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p>{booking.ticketCount} ticket(s)</p>
                    <p className="font-semibold">${booking.totalAmount.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      aria-label={`Update status for booking EH-${booking.id}`}
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={event => updateStatus(booking.id, event.target.value as BookingRecord['status'])}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs disabled:opacity-60"
                    >
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="ATTENDED">Attended</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminBookings;
