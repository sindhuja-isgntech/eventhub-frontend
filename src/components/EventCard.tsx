import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Heart, Sparkles } from 'lucide-react';
import type { Event } from '../types';
import { useApp } from '../context/AppContext';

export const EventCard: React.FC<Event> = ({
  id,
  title,
  category,
  venue,
  dateTime,
  price,
  availableSeats,
  totalSeats,
  imageUrl,
  organizer,
  featured,
}) => {
  const { savedEventIds, toggleSaveEvent } = useApp();
  const isSaved = savedEventIds.includes(id);

  const formattedDate = new Date(dateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const percentLeft = Math.round((availableSeats / totalSeats) * 100);
  const isLowSeats = availableSeats <= 40;

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Card Media Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {category}
            </span>
            {featured && (
              <span className="bg-amber-400 text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 fill-slate-900" /> Featured
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveEvent(id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner Details */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            {formattedDate} • {formattedTime}
          </span>
          <span className="text-slate-300 truncate max-w-[120px] text-right font-medium">
            {organizer}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            <Link to={`/events/${id}`}>{title}</Link>
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{venue.name}, {venue.city}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Available Seats
            </span>
            <span className={`font-bold ${isLowSeats ? 'text-amber-600' : 'text-slate-700'}`}>
              {availableSeats} of {totalSeats} {isLowSeats && '🔥'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLowSeats ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, percentLeft))}%` }}
            />
          </div>
        </div>

        {/* Card Footer Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
              Tickets From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">${price.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/ person</span>
            </div>
          </div>

          <Link
            to={`/events/${id}`}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs group-hover:shadow-indigo-500/25"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};