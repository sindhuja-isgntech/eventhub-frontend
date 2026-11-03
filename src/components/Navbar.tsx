import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Ticket,
  User as UserIcon,
  Search,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  Heart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, confirmedBookingsCount, savedEventIds, logout, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      showToast('Unable to sign out. Please try again.', 'error');
    }
  };

  const bookingsLabel = currentUser?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings';
  const bookingsPath = currentUser?.role === 'ADMIN' ? '/admin/bookings' : '/my-bookings';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-slate-200/70 shadow-xs transition-all">
      {/* Top micro gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-50 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Event<span className="text-indigo-600">Hub</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
                Experiences & Passes
              </span>
            </div>
          </Link>

          {/* Quick Search Bar (Desktop) */}
          <form onSubmit={handleNavSearch} className="hidden lg:flex items-center relative flex-1 max-w-xs xl:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concerts, summits, expos..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-full border border-slate-200/60 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
            />
            <span className="absolute right-3 text-[10px] font-mono text-slate-400 bg-white/80 border border-slate-200 px-1.5 py-0.5 rounded-md pointer-events-none">
              ↵
            </span>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-sm font-semibold text-slate-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 font-bold shadow-xs'
                    : 'hover:text-indigo-600 hover:bg-slate-100/70'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 font-bold shadow-xs'
                    : 'hover:text-indigo-600 hover:bg-slate-100/70'
                }`
              }
            >
              <span>Explore Events</span>
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                HOT
              </span>
            </NavLink>

            <NavLink
              to={bookingsPath}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 relative ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 font-bold shadow-xs'
                    : 'hover:text-indigo-600 hover:bg-slate-100/70'
                }`
              }
            >
              <Ticket className="w-4 h-4 text-indigo-500" />
              <span>{bookingsLabel}</span>
              {confirmedBookingsCount > 0 && (
                <span className="bg-indigo-600 text-white text-[11px] font-extrabold px-1.5 py-0.2 rounded-full min-w-5 text-center shadow-xs">
                  {confirmedBookingsCount}
                </span>
              )}
            </NavLink>

            {currentUser?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-bold ${
                    isActive
                      ? 'text-indigo-700 bg-indigo-100 shadow-xs'
                      : 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100'
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Portal</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Saved Items Counter Icon */}
            {currentUser && (
              <Link
                to="/events?saved=true"
                className="relative p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-transparent hover:border-rose-100 transition duration-200"
                title="Saved Events"
              >
                <Heart className={`w-5 h-5 transition-transform duration-200 hover:scale-110 ${savedEventIds.length > 0 ? 'text-rose-500 fill-rose-50' : ''}`} />
                {savedEventIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white" />
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-slate-100/80 border border-slate-200/80 transition-all duration-200 focus:outline-none cursor-pointer"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/10">
                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{currentUser.role}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden xl:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in-50 duration-150 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Signed in as</p>
                      <p className="text-sm font-black text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> My Profile
                      </Link>
                      <Link
                        to={bookingsPath}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <span className="flex items-center">
                          <Ticket className="w-4 h-4 mr-2.5 text-slate-400" /> {bookingsLabel}
                        </span>
                        {confirmedBookingsCount > 0 && (
                          <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            {confirmedBookingsCount}
                          </span>
                        )}
                      </Link>
                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition"
                        >
                          <Shield className="w-4 h-4 mr-2.5 text-indigo-600" /> Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => void handleLogout()}
                        className="flex w-full items-center px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-indigo-600 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl hover:bg-slate-100/70 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-in fade-in-50 duration-200">
            <form onSubmit={handleNavSearch} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-slate-50 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </form>

            <div className="flex flex-col space-y-1 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                Home
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                Explore Events
              </Link>
              <Link
                to={bookingsPath}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition flex justify-between items-center"
              >
                <span>{bookingsLabel}</span>
                {confirmedBookingsCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {confirmedBookingsCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                User Profile
              </Link>
              {currentUser?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded-xl transition flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4 text-indigo-600" /> Admin Portal
                </Link>
              )}

              {!currentUser && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-xs"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
