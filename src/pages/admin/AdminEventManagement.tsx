import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import type { AdminEventRecord } from '../../services/api';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminEventManagement: React.FC = () => {
  const [events, setEvents] = useState<AdminEventRecord[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadEvents = useCallback(async () => {
    const data = await adminService.getAllEvents();
    setEvents(data);
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadEvents);
  }, [loadEvents]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await adminService.deleteEvent(id);
      await loadEvents();
      setPendingDeleteId(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete this event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>
      {errorMessage && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Seats</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(event => (
              <tr key={event.id}>
                <td className="p-4 font-semibold text-slate-900">{event.title}</td>
                <td className="p-4">${event.price}</td>
                <td className="p-4">{event.availableSeats}/{event.totalSeats}</td>
                <td className="p-4">
                  <button
                    type="button"
                    aria-label={`Delete ${event.title}`}
                    onClick={() => {
                      setErrorMessage('');
                      setPendingDeleteId(event.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingDeleteId !== null && (
        <ConfirmDialog
          title="Delete event?"
          description={`Are you sure you want to delete "${events.find(event => event.id === pendingDeleteId)?.title ?? 'this event'}"? This action cannot be undone.`}
          isConfirming={isDeleting}
          errorMessage={errorMessage}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => handleDelete(pendingDeleteId)}
        />
      )}
    </div>
  );
};