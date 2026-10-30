import React, { useEffect, useState } from 'react';
import { Building, Calendar, Eye, Layers, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService, getApiErrorMessage } from '../services/api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type {
  AdminEventRecord,
  CategoryManagementRequest,
  EventManagementRequest,
  VenueManagementRequest,
} from '../services/api';
import type { BookingRecord, EventCategory, Venue } from '../types';
import { useApp } from '../context/AppContext';

type AdminTab = 'events' | 'categories' | 'venues' | 'bookings';
type FormKind = 'event' | 'category' | 'venue';
type ViewRecord =
  | { kind: 'event'; value: AdminEventRecord }
  | { kind: 'category'; value: EventCategory }
  | { kind: 'venue'; value: Venue }
  | { kind: 'booking'; value: BookingRecord };
type DeleteRecord = { kind: FormKind | 'booking'; value: AdminEventRecord | EventCategory | Venue | BookingRecord };

interface EventFormState {
  title: string;
  description: string;
  categoryId: string;
  venueId: string;
  dateTime: string;
  price: string;
  totalSeats: string;
  imageUrl: string;
  organizer: string;
  featured: boolean;
}

interface CategoryFormState {
  name: string;
  description: string;
  status: string;
}

interface VenueFormState {
  name: string;
  address: string;
  city: string;
  capacity: string;
}

const nextEventDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const ActionButton: React.FC<{
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  destructive?: boolean;
}> = ({ label, onClick, children, destructive = false }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
      destructive
        ? 'text-rose-600 hover:bg-rose-50'
        : 'text-indigo-600 hover:bg-indigo-50'
    }`}
  >
    {children}
  </button>
);

export const AdminDashboard: React.FC<{ initialTab?: AdminTab }> = ({ initialTab = 'events' }) => {
  const { refreshEvents, refreshBookings, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [events, setEvents] = useState<AdminEventRecord[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formKind, setFormKind] = useState<FormKind | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewRecord, setViewRecord] = useState<ViewRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeleteRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventForm, setEventForm] = useState<EventFormState>({
    title: '',
    description: '',
    categoryId: '',
    venueId: '',
    dateTime: nextEventDate(),
    price: '',
    totalSeats: '',
    imageUrl: '',
    organizer: '',
    featured: false,
  });
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [venueForm, setVenueForm] = useState<VenueFormState>({
    name: '',
    address: '',
    city: '',
    capacity: '',
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      adminService.getAllEvents(),
      adminService.getAllCategories(),
      adminService.getAllVenues(),
      adminService.getAllBookings(),
    ])
      .then(([eventRecords, categoryRecords, venueRecords, bookingRecords]) => {
        if (!active) return;
        setEvents(eventRecords);
        setCategories(categoryRecords);
        setVenues(venueRecords);
        setBookings(bookingRecords);
      })
      .catch(error => {
        if (active) setErrorMessage(getApiErrorMessage(error, 'Unable to load admin records.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateForm = (kind: FormKind) => {
    setEditingId(null);
    setErrorMessage('');
    setFormKind(kind);
    if (kind === 'event') {
      setEventForm({
        title: '',
        description: '',
        categoryId: categories[0] ? String(categories[0].id) : '',
        venueId: venues[0] ? String(venues[0].id) : '',
        dateTime: nextEventDate(),
        price: '',
        totalSeats: '',
        imageUrl: '',
        organizer: '',
        featured: false,
      });
    } else if (kind === 'category') {
      setCategoryForm({ name: '', description: '', status: 'ACTIVE' });
    } else {
      setVenueForm({ name: '', address: '', city: '', capacity: '' });
    }
  };

  const openEditForm = (kind: FormKind, record: AdminEventRecord | EventCategory | Venue) => {
    setEditingId(record.id);
    setErrorMessage('');
    setFormKind(kind);
    if (kind === 'event') {
      const event = record as AdminEventRecord;
      setEventForm({
        title: event.title,
        description: event.description || '',
        categoryId: String(event.category.id),
        venueId: String(event.venue.id),
        dateTime: event.dateTime.slice(0, 16),
        price: String(event.price),
        totalSeats: String(event.totalSeats),
        imageUrl: event.imageUrl || '',
        organizer: event.organizer || '',
        featured: Boolean(event.featured),
      });
    } else if (kind === 'category') {
      const category = record as EventCategory;
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        status: category.status || 'ACTIVE',
      });
    } else {
      const venue = record as Venue;
      setVenueForm({
        name: venue.name,
        address: venue.address || '',
        city: venue.city,
        capacity: venue.capacity ? String(venue.capacity) : '',
      });
    }
  };

  const saveForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formKind) return;
    setIsSaving(true);
    setErrorMessage('');

    try {
      if (formKind === 'event') {
        const request: EventManagementRequest = {
          ...eventForm,
          categoryId: Number(eventForm.categoryId),
          venueId: Number(eventForm.venueId),
          dateTime: eventForm.dateTime.length === 16 ? `${eventForm.dateTime}:00` : eventForm.dateTime,
          price: Number(eventForm.price),
          totalSeats: Number(eventForm.totalSeats),
        };
        const saved = editingId === null
          ? await adminService.createEvent(request)
          : await adminService.updateEvent(editingId, request);
        setEvents(current => editingId === null
          ? [saved, ...current]
          : current.map(item => item.id === saved.id ? saved : item));
        await refreshEvents();
      } else if (formKind === 'category') {
        const request: CategoryManagementRequest = categoryForm;
        const saved = editingId === null
          ? await adminService.createCategory(request)
          : await adminService.updateCategory(editingId, request);
        setCategories(current => editingId === null
          ? [...current, saved]
          : current.map(item => item.id === saved.id ? saved : item));
        await refreshEvents();
      } else {
        const request: VenueManagementRequest = {
          ...venueForm,
          capacity: Number(venueForm.capacity),
        };
        const saved = editingId === null
          ? await adminService.createVenue(request)
          : await adminService.updateVenue(editingId, request);
        setVenues(current => editingId === null
          ? [...current, saved]
          : current.map(item => item.id === saved.id ? saved : item));
        await refreshEvents();
      }

      showToast(`${formKind[0].toUpperCase()}${formKind.slice(1)} ${editingId === null ? 'created' : 'updated'} successfully.`, 'success');
      setFormKind(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, `Unable to save ${formKind}.`));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!pendingDelete) return;
    const { kind, value: record } = pendingDelete;
    setErrorMessage('');
    setIsDeleting(true);
    try {
      if (kind === 'event') {
        await adminService.deleteEvent(record.id);
        setEvents(current => current.filter(item => item.id !== record.id));
        await refreshEvents();
      } else if (kind === 'category') {
        await adminService.deleteCategory(record.id);
        setCategories(current => current.filter(item => item.id !== record.id));
        await refreshEvents();
      } else if (kind === 'venue') {
        await adminService.deleteVenue(record.id);
        setVenues(current => current.filter(item => item.id !== record.id));
        await refreshEvents();
      } else {
        await adminService.deleteBooking(record.id);
        setBookings(current => current.filter(item => item.id !== record.id));
        await Promise.all([refreshBookings(), refreshEvents()]);
      }
      showToast(`${kind[0].toUpperCase()}${kind.slice(1)} deleted successfully.`, 'success');
      setPendingDelete(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, `Unable to delete ${kind}.`));
    } finally {
      setIsDeleting(false);
    }
  };

  const requestDelete = (kind: DeleteRecord['kind'], value: DeleteRecord['value']) => {
    setErrorMessage('');
    setPendingDelete({ kind, value });
  };

  const deleteDescription = pendingDelete?.kind === 'event'
    ? (pendingDelete.value as AdminEventRecord).title
    : pendingDelete?.kind === 'category'
      ? (pendingDelete.value as EventCategory).name
      : pendingDelete?.kind === 'venue'
        ? (pendingDelete.value as Venue).name
        : pendingDelete
          ? `booking EH-${(pendingDelete.value as BookingRecord).id}`
          : '';

  const updateBookingStatus = async (booking: BookingRecord, status: BookingRecord['status']) => {
    setErrorMessage('');
    try {
      const saved = await adminService.updateBookingStatus(booking.id, status);
      setBookings(current => current.map(item => item.id === saved.id ? saved : item));
      await Promise.all([refreshBookings(), refreshEvents()]);
      showToast(`Booking EH-${booking.id} updated.`, 'success');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update booking.'));
    }
  };

  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: 'events', label: 'Events', count: events.length },
    { id: 'categories', label: 'Categories', count: categories.length },
    { id: 'venues', label: 'Venues', count: venues.length },
    { id: 'bookings', label: 'Bookings', count: bookings.length },
  ];

  const confirmedBookings = bookings.filter(booking => booking.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalTickets = confirmedBookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
  const singular = activeTab === 'events' ? 'event' : activeTab === 'bookings' ? 'booking' : activeTab.slice(0, -1);
  const activeFormKind: FormKind | null = activeTab === 'events'
    ? 'event'
    : activeTab === 'categories'
      ? 'category'
      : activeTab === 'venues'
        ? 'venue'
        : null;

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Shield className="h-4 w-4" /> Management Console
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">EventHub Operations Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage events, categories, venues, and bookings.</p>
        </div>
        {activeTab !== 'bookings' && (
          <button
            type="button"
            onClick={() => activeFormKind && openCreateForm(activeFormKind)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add {singular[0].toUpperCase()}{singular.slice(1)}
          </button>
        )}
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Management summary">
        <SummaryCard icon={<Calendar className="h-5 w-5" />} label="Events" value={String(events.length)} />
        <SummaryCard icon={<Layers className="h-5 w-5" />} label="Categories" value={String(categories.length)} />
        <SummaryCard icon={<Users className="h-5 w-5" />} label="Confirmed Tickets" value={String(totalTickets)} />
        <SummaryCard icon={<Building className="h-5 w-5" />} label="Confirmed Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      </section>

      <nav className="flex gap-2 overflow-x-auto border-b border-slate-200" aria-label="Admin management sections">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{tab.count}</span>
          </button>
        ))}
      </nav>

      {errorMessage && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className="py-16 text-center text-slate-500">Loading admin records...</p>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {activeTab === 'events' && (
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                <th className="px-5 py-4">Event</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Venue</th>
                <th className="px-5 py-4">Date</th><th className="px-5 py-4">Seats</th><th className="px-5 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {events.map(event => <tr key={event.id}>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{event.title}</p><p className="text-xs text-slate-500">${event.price.toFixed(2)}</p></td>
                  <td className="px-5 py-4">{event.category.name}</td>
                  <td className="px-5 py-4">{event.venue.name}, {event.venue.city}</td>
                  <td className="px-5 py-4">{new Date(event.dateTime).toLocaleString()}</td>
                  <td className="px-5 py-4">{event.availableSeats} / {event.totalSeats}</td>
                  <td className="px-5 py-4"><RowActions
                    onView={() => setViewRecord({ kind: 'event', value: event })}
                    onEdit={() => openEditForm('event', event)}
                    onDelete={() => requestDelete('event', event)}
                  /></td>
                </tr>)}
              </tbody>
            </table>
          )}

          {activeTab === 'categories' && (
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                <th className="px-5 py-4">Category</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(category => <tr key={category.id}>
                  <td className="px-5 py-4 font-semibold text-slate-900">{category.name}</td><td className="px-5 py-4">{category.description || '—'}</td>
                  <td className="px-5 py-4">{category.status || 'ACTIVE'}</td>
                  <td className="px-5 py-4"><RowActions
                    onView={() => setViewRecord({ kind: 'category', value: category })}
                    onEdit={() => openEditForm('category', category)}
                    onDelete={() => requestDelete('category', category)}
                  /></td>
                </tr>)}
              </tbody>
            </table>
          )}

          {activeTab === 'venues' && (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                <th className="px-5 py-4">Venue</th><th className="px-5 py-4">Address</th><th className="px-5 py-4">City</th><th className="px-5 py-4">Capacity</th><th className="px-5 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {venues.map(venue => <tr key={venue.id}>
                  <td className="px-5 py-4 font-semibold text-slate-900">{venue.name}</td><td className="px-5 py-4">{venue.address || '—'}</td>
                  <td className="px-5 py-4">{venue.city}</td><td className="px-5 py-4">{venue.capacity ?? '—'}</td>
                  <td className="px-5 py-4"><RowActions
                    onView={() => setViewRecord({ kind: 'venue', value: venue })}
                    onEdit={() => openEditForm('venue', venue)}
                    onDelete={() => requestDelete('venue', venue)}
                  /></td>
                </tr>)}
              </tbody>
            </table>
          )}

          {activeTab === 'bookings' && (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                <th className="px-5 py-4">Reference</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Event</th>
                <th className="px-5 py-4">Tickets / Total</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => <tr key={booking.id}>
                  <td className="px-5 py-4 font-mono font-semibold">EH-{booking.id}</td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{booking.customerName}</p><p className="text-xs text-slate-500">{booking.customerEmail}</p></td>
                  <td className="px-5 py-4">{booking.eventTitle}</td>
                  <td className="px-5 py-4">{booking.ticketCount} ticket(s) · ${booking.totalAmount.toFixed(2)}</td>
                  <td className="px-5 py-4"><select
                    aria-label={`Update status for booking EH-${booking.id}`}
                    value={booking.status}
                    onChange={event => void updateBookingStatus(booking, event.target.value as BookingRecord['status'])}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                  >
                    <option value="CONFIRMED">Confirmed</option><option value="ATTENDED">Attended</option><option value="CANCELLED">Cancelled</option>
                  </select></td>
                  <td className="px-5 py-4"><div className="flex items-center gap-1">
                    <ActionButton label={`View booking EH-${booking.id}`} onClick={() => setViewRecord({ kind: 'booking', value: booking })}><Eye className="h-4 w-4" /> View</ActionButton>
                    <ActionButton label={`Delete booking EH-${booking.id}`} destructive onClick={() => requestDelete('booking', booking)}><Trash2 className="h-4 w-4" /> Delete</ActionButton>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          )}

          {!isLoading && ((activeTab === 'events' && events.length === 0)
            || (activeTab === 'categories' && categories.length === 0)
            || (activeTab === 'venues' && venues.length === 0)
            || (activeTab === 'bookings' && bookings.length === 0)) && (
            <p className="p-10 text-center text-sm text-slate-500">No {activeTab} found.</p>
          )}
        </section>
      )}

      {formKind && (
        <Modal title={`${editingId === null ? 'Create' : 'Edit'} ${formKind}`} onClose={() => setFormKind(null)}>
          <form onSubmit={event => void saveForm(event)} className="space-y-4">
            {formKind === 'event' && (
              <>
                <TextField label="Title" required value={eventForm.title} onChange={value => setEventForm(current => ({ ...current, title: value }))} />
                <TextField label="Description" value={eventForm.description} onChange={value => setEventForm(current => ({ ...current, description: value }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Category" required value={eventForm.categoryId} onChange={value => setEventForm(current => ({ ...current, categoryId: value }))}>
                    {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </SelectField>
                  <SelectField label="Venue" required value={eventForm.venueId} onChange={value => setEventForm(current => ({ ...current, venueId: value }))}>
                    {venues.map(item => <option key={item.id} value={item.id}>{item.name}, {item.city}</option>)}
                  </SelectField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Date and time" type="datetime-local" required value={eventForm.dateTime} onChange={value => setEventForm(current => ({ ...current, dateTime: value }))} />
                  <TextField label="Price" type="number" min="0.01" step="0.01" required value={eventForm.price} onChange={value => setEventForm(current => ({ ...current, price: value }))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Total seats" type="number" min="1" required value={eventForm.totalSeats} onChange={value => setEventForm(current => ({ ...current, totalSeats: value }))} />
                  <TextField label="Organizer" value={eventForm.organizer} onChange={value => setEventForm(current => ({ ...current, organizer: value }))} />
                </div>
                <TextField label="Image URL" type="url" value={eventForm.imageUrl} onChange={value => setEventForm(current => ({ ...current, imageUrl: value }))} />
                <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={eventForm.featured} onChange={event => setEventForm(current => ({ ...current, featured: event.target.checked }))} /> Featured event</label>
                {(categories.length === 0 || venues.length === 0) && <p className="text-sm text-amber-700">Add at least one category and venue before saving events.</p>}
              </>
            )}
            {formKind === 'category' && <>
              <TextField label="Name" required value={categoryForm.name} onChange={value => setCategoryForm(current => ({ ...current, name: value }))} />
              <TextField label="Description" value={categoryForm.description} onChange={value => setCategoryForm(current => ({ ...current, description: value }))} />
              <SelectField label="Status" value={categoryForm.status} onChange={value => setCategoryForm(current => ({ ...current, status: value }))}>
                <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
              </SelectField>
            </>}
            {formKind === 'venue' && <>
              <TextField label="Name" required value={venueForm.name} onChange={value => setVenueForm(current => ({ ...current, name: value }))} />
              <TextField label="Address" value={venueForm.address} onChange={value => setVenueForm(current => ({ ...current, address: value }))} />
              <TextField label="City" required value={venueForm.city} onChange={value => setVenueForm(current => ({ ...current, city: value }))} />
              <TextField label="Capacity" type="number" min="1" required value={venueForm.capacity} onChange={value => setVenueForm(current => ({ ...current, capacity: value }))} />
            </>}
            {(formKind === 'event' && (categories.length === 0 || venues.length === 0)) && <p className="text-sm text-amber-700">Create a category and venue first to add an event.</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setFormKind(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button
                type="submit"
                disabled={isSaving || (formKind === 'event' && (!categories.length || !venues.length))}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {viewRecord && (
        <Modal title={`${viewRecord.kind[0].toUpperCase()}${viewRecord.kind.slice(1)} details`} onClose={() => setViewRecord(null)}>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {viewRecord.kind === 'event' && <>
              <Detail label="Title" value={viewRecord.value.title} /><Detail label="Category" value={viewRecord.value.category.name} />
              <Detail label="Venue" value={`${viewRecord.value.venue.name}, ${viewRecord.value.venue.city}`} />
              <Detail label="Date" value={new Date(viewRecord.value.dateTime).toLocaleString()} />
              <Detail label="Price" value={`$${viewRecord.value.price.toFixed(2)}`} />
              <Detail label="Seats available" value={`${viewRecord.value.availableSeats} / ${viewRecord.value.totalSeats}`} />
              <Detail label="Organizer" value={viewRecord.value.organizer || '—'} />
              <Detail label="Description" value={viewRecord.value.description || '—'} />
              <Link className="font-semibold text-indigo-600 hover:underline" to={`/events/${viewRecord.value.id}`}>Open event page</Link>
            </>}
            {viewRecord.kind === 'category' && <>
              <Detail label="Name" value={viewRecord.value.name} /><Detail label="Status" value={viewRecord.value.status || 'ACTIVE'} />
              <Detail label="Description" value={viewRecord.value.description || '—'} />
            </>}
            {viewRecord.kind === 'venue' && <>
              <Detail label="Name" value={viewRecord.value.name} /><Detail label="Address" value={viewRecord.value.address || '—'} />
              <Detail label="City" value={viewRecord.value.city} /><Detail label="Capacity" value={String(viewRecord.value.capacity ?? '—')} />
            </>}
            {viewRecord.kind === 'booking' && <>
              <Detail label="Reference" value={`EH-${viewRecord.value.id}`} /><Detail label="Customer" value={viewRecord.value.customerName} />
              <Detail label="Email" value={viewRecord.value.customerEmail} /><Detail label="Event" value={viewRecord.value.eventTitle} />
              <Detail label="Tickets" value={String(viewRecord.value.ticketCount)} /><Detail label="Total" value={`$${viewRecord.value.totalAmount.toFixed(2)}`} />
              <Detail label="Status" value={viewRecord.value.status} /><Detail label="Booking date" value={viewRecord.value.bookingDate} />
            </>}
          </dl>
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Confirm deletion"
          description={`Are you sure you want to delete ${deleteDescription}? This action cannot be undone.`}
          isConfirming={isDeleting}
          errorMessage={errorMessage}
          onCancel={() => setPendingDelete(null)}
          onConfirm={deleteRecord}
        />
      )}
    </main>
  );
};

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">{icon}</div>
    <div><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="text-xl font-black text-slate-900">{value}</p></div>
  </div>
);

const RowActions: React.FC<{
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onView, onEdit, onDelete }) => (
  <div className="flex items-center gap-1">
    <ActionButton label="View" onClick={onView}><Eye className="h-4 w-4" /> View</ActionButton>
    <ActionButton label="Edit" onClick={onEdit}><Pencil className="h-4 w-4" /> Edit</ActionButton>
    <ActionButton label="Delete" destructive onClick={onDelete}><Trash2 className="h-4 w-4" /> Delete</ActionButton>
  </div>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" role="presentation">
    <section role="dialog" aria-modal="true" aria-label={title} className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <header className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100">✕</button>
      </header>
      {children}
    </section>
  </div>
);

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
}> = ({ label, value, onChange, type = 'text', required = false, min, step }) => (
  <label className="block space-y-1 text-sm font-semibold text-slate-700">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      required={required}
      min={min}
      step={step}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    />
  </label>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, value, onChange, required = false, children }) => (
  <label className="block space-y-1 text-sm font-semibold text-slate-700">
    <span>{label}</span>
    <select
      value={value}
      onChange={event => onChange(event.target.value)}
      required={required}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    >
      {children}
    </select>
  </label>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><dt className="text-xs font-bold uppercase text-slate-400">{label}</dt><dd className="mt-1 break-words text-slate-800">{value}</dd></div>
);

export default AdminDashboard;
