import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Heart, Sparkles, Flame } from 'lucide-react';
import type { Event } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatIndianDateTime } from '../utils/format';

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

  const formattedDate = formatIndianDateTime(dateTime, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = formatIndianDateTime(dateTime, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const percentLeft = Math.round((availableSeats / totalSeats) * 100);
  const isCriticalSeats = availableSeats <= 15;
  const isLowSeats = availableSeats <= 45;

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-300/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 relative">
      {/* Card Media Header */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ring-1 ring-black/5">
              {category}
            </span>
            {featured && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
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
            className={`w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500 hover:scale-110'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Heart className={`w-4 h-4 transition-transform ${isSaved ? 'fill-white stroke-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner Details */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-medium z-10">
          <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[11px] font-semibold">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            {formattedDate} • {formattedTime}
          </span>
          <span className="text-slate-300 truncate max-w-[130px] text-right font-semibold text-[11px] bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
            {organizer}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            <Link to={`/events/${id}`}>{title}</Link>
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{venue.name}, {venue.city}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Availability
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                isCriticalSeats
                  ? 'text-rose-600'
                  : isLowSeats
                  ? 'text-amber-600'
                  : 'text-slate-700'
              }`}
            >
              {isCriticalSeats && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
              {availableSeats} of {totalSeats} left
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCriticalSeats
                  ? 'bg-rose-500'
                  : isLowSeats
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, percentLeft))}%` }}
            />
          </div>
        </div>

        {/* Card Footer Price & Action */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
              Passes from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{formatCurrency(price)}</span>
              <span className="text-xs text-slate-400 font-medium">/ person</span>
            </div>
          </div>

          <Link
            to={`/events/${id}`}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-indigo-600 hover:to-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/20 group/btn"
          >
            <span>Book Pass</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventCard;