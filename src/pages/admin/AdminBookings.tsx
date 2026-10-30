import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { adminService, getApiErrorMessage } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { BookingRecord } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminBookings: React.FC = () => {
  const { refreshBookings, refreshEvents } = useApp();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [editedStatus, setEditedStatus] = useState<BookingRecord['status']>('CONFIRMED');
  const [pendingDelete, setPendingDelete] = useState<BookingRecord | null>(null);

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

  const updateStatus = async (bookingId: number, status: BookingRecord['status']): Promise<boolean> => {
    setErrorMessage('');
    setUpdatingId(bookingId);
    try {
      const updatedBooking = await adminService.updateBookingStatus(bookingId, status);
      setBookings(current => current.map(booking => (
        booking.id === bookingId ? updatedBooking : booking
      )));
      await Promise.all([refreshBookings(), refreshEvents()]);
      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update booking status.'));
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (booking: BookingRecord) => {
    setErrorMessage('');
    setUpdatingId(booking.id);
    try {
      await adminService.deleteBooking(booking.id);
      setBookings(current => current.filter(item => item.id !== booking.id));
      await Promise.all([refreshBookings(), refreshEvents()]);
      setPendingDelete(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to delete booking.'));
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Edit booking EH-${booking.id}`}
                        onClick={() => {
                          setEditingBooking(booking);
                          setEditedStatus(booking.status);
                        }}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`View booking EH-${booking.id}`}
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete booking EH-${booking.id}`}
                        disabled={updatingId === booking.id}
                        onClick={() => {
                          setErrorMessage('');
                          setPendingDelete(booking);
                        }}
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section role="dialog" aria-modal="true" aria-label={`Booking EH-${selectedBooking.id} details`} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <header className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Booking EH-{selectedBooking.id}</h2>
              <button type="button" onClick={() => setSelectedBooking(null)} aria-label="Close booking details" className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100">✕</button>
            </header>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase text-slate-400">Customer</dt><dd>{selectedBooking.customerName}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Email</dt><dd>{selectedBooking.customerEmail}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Event</dt><dd>{selectedBooking.eventTitle}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Status</dt><dd>{selectedBooking.status}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Tickets</dt><dd>{selectedBooking.ticketCount}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Total</dt><dd>${selectedBooking.totalAmount.toFixed(2)}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Booking date</dt><dd>{selectedBooking.bookingDate}</dd></div>
            </dl>
          </section>
        </div>
      )}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section role="dialog" aria-modal="true" aria-label={`Edit booking EH-${editingBooking.id}`} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <header className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit booking EH-{editingBooking.id}</h2>
              <button type="button" onClick={() => setEditingBooking(null)} aria-label="Close edit booking dialog" className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100">✕</button>
            </header>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Booking status</span>
              <select
                value={editedStatus}
                onChange={event => setEditedStatus(event.target.value as BookingRecord['status'])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal"
              >
                <option value="CONFIRMED">Confirmed</option>
                <option value="ATTENDED">Attended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingBooking(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button
                type="button"
                disabled={updatingId === editingBooking.id}
                onClick={() => {
                  void updateStatus(editingBooking.id, editedStatus).then(saved => {
                    if (saved) setEditingBooking(null);
                  });
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </section>
        </div>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete booking?"
          description={`Are you sure you want to delete booking EH-${pendingDelete.id} for ${pendingDelete.customerName}? This action cannot be undone.`}
          isConfirming={updatingId === pendingDelete.id}
          errorMessage={errorMessage}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => deleteBooking(pendingDelete)}
        />
      )}
    </main>
  );
};

export default AdminBookings;
