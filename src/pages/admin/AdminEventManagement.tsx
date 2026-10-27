import React, { useEffect, useState } from 'react';
import { eventService, adminService } from '../../services/api';
import { Trash2 } from 'lucide-react';

export const AdminEventManagement: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await eventService.getAllEvents();
    setEvents(data);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await adminService.deleteEvent(id);
      loadEvents();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>
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
                  <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};