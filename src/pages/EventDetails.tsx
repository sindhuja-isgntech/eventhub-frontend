import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Clock,
  ShieldCheck,
  Sparkles,
  Heart,
  Tag,
  CreditCard,
  Building,
  Check
} from 'lucide-react';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, bookEvent, savedEventIds, toggleSaveEvent, currentUser, showToast } = useApp();

  const event = events.find(e => e.id === Number(id)) || events[0];

  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.tiers && event.tiers.length > 0 ? event.tiers[0].id : 'default'
  );
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'about' | 'agenda' | 'venue'>('about');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Attendee form state for modal
  const [attendeeName, setAttendeeName] = useState(currentUser?.name || 'Alex Morgan');
  const [attendeeEmail, setAttendeeEmail] = useState(currentUser?.email || 'alex.morgan@example.com');
  const [attendeePhone, setAttendeePhone] = useState(currentUser?.phone || '+1 (555) 234-5678');

  const isSaved = savedEventIds.includes(event.id);

  // Determine current active tier
  const activeTier = event.tiers?.find(t => t.id === selectedTierId) || {
    id: 'default',
    name: 'General Admission',
    price: event.price,
    description: 'Standard event pass',
    availableSeats: event.availableSeats,
    perks: ['Full Event Access', 'Digital Ticket Pass', 'Venue Amenities']
  };

  const rawSubtotal = activeTier.price * ticketCount;
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const serviceFee = 4.50;
  const totalAmount = Math.max(0, rawSubtotal - discountAmount + (rawSubtotal > 0 ? serviceFee : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'EVENT15' || promoCode.trim().toUpperCase() === 'TECH20') {
      setDiscountPercent(15);
      showToast('Promo code applied: 15% discount!', 'success');
    } else {
      showToast('Invalid promo code. Try "EVENT15"', 'error');
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = bookEvent({
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDateTime: event.dateTime,
      venueName: event.venue.name,
      venueCity: event.venue.city,
      ticketCount,
      tierName: activeTier.name,
      totalAmount,
      attendeeName,
      attendeeEmail,
      attendeePhone
    });

    setIsBookingModalOpen(false);
    navigate(`/bookings/confirmation/${newBooking.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveEvent(event.id)}
            className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 Cols): Event Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hero Banner Image */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-80 sm:h-96 shadow-md">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Featured Event
                  </span>
                )}
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full">
                  Organized by {event.organizer}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Key Facts Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date & Time</p>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(event.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Venue</p>
                <p className="text-xs font-bold text-slate-900 truncate">{event.venue.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{event.venue.city}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Capacity</p>
                <p className="text-xs font-bold text-slate-900">
                  {event.availableSeats} Seats Left
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">Immediate Booking</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 flex space-x-8 text-sm font-bold">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'about'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              About Event
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'agenda'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Agenda & Schedule
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'venue'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Venue & Directions
            </button>
          </div>

          {/* Tab Content 1: About */}
          {activeTab === 'about' && (
            <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Event Overview</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {event.description}
                </p>
              </div>

              {event.tags && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tags & Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Card */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{event.organizer}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-xs text-slate-500">Verified Event Organizer on EventHub</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Inquiry sent to organizer!', 'info')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3.5 py-2 rounded-xl transition"
                >
                  Contact Host
                </button>
              </div>
            </div>
          )}

          {/* Tab Content 2: Agenda */}
          {activeTab === 'agenda' && (
            <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Program Timeline</h2>
              <div className="space-y-4 pt-2">
                {event.agenda && event.agenda.length > 0 ? (
                  event.agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.time}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Detailed timetable will be released prior to doors opening.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 3: Venue */}
          {activeTab === 'venue' && (
            <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Location & Getting There</h2>
                <p className="text-sm text-slate-600">
                  {event.venue.name} is situated in downtown {event.venue.city}, easily accessible via public transit, subway lines, and regional rideshare services.
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{event.venue.name}</h4>
                    <p className="text-xs text-slate-500">{event.venue.address}, {event.venue.city}</p>
                    {event.venue.capacity && (
                      <p className="text-xs text-slate-400 mt-1">Venue Capacity: {event.venue.capacity.toLocaleString()} guests</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1 Col): Sticky Ticket Booking Card */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg space-y-6">
            
            {/* Header: Pricing */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                  Select Ticket Tier
                </span>
                <span className="text-3xl font-black text-slate-900">
                  ${activeTier.price.toFixed(2)}
                </span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Available
              </span>
            </div>

            {/* Tier Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Admission Type
              </label>
              <div className="space-y-2">
                {event.tiers && event.tiers.length > 0 ? (
                  event.tiers.map((tier) => {
                    const isSelected = tier.id === selectedTierId;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{tier.name}</span>
                          <span className="font-black text-sm text-indigo-600">${tier.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                        <div className="mt-2 space-y-1">
                          {tier.perks.slice(0, 2).map((perk, pi) => (
                            <span key={pi} className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                              <Check className="w-3 h-3 text-emerald-500" /> {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
                    Standard Admission — ${event.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Number of Tickets
              </label>
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-10 h-10 rounded-xl bg-white text-slate-800 font-bold border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition shadow-xs text-lg"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="text-lg font-black text-slate-900">{ticketCount}</span>
                  <span className="text-[10px] text-slate-400 block -mt-1 font-semibold">TICKETS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  className="w-10 h-10 rounded-xl bg-white text-slate-800 font-bold border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition shadow-xs text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Promo Code (try EVENT15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Price Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>{activeTier.name} × {ticketCount}</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Platform Processing Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Total Due</span>
                <span className="text-xl text-indigo-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>

            {/* Trust Badges */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500 text-center">
              <p className="flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Digital Ticket Delivery Guaranteed</span>
              </p>
              <p className="text-slate-400">
                Free cancellation up to 24 hours prior to event start.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Attendee Information</h3>
                <p className="text-xs text-slate-500">Confirm where your tickets should be dispatched</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Primary Attendee Name</label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address (for Digital Passes)</label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Order summary pill */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{event.title}</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-slate-500">
                  {ticketCount} × {activeTier.name} • {event.venue.city}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/30"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay ${totalAmount.toFixed(2)}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetails;

