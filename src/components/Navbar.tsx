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
  const { currentUser, bookings, savedEventIds, logout, showToast } = useApp();
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

  const confirmedBookingsCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const bookingsLabel = currentUser?.role === 'ADMIN' ? 'All Bookings' : 'My Bookings';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Event<span className="text-indigo-600">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
                Discover & Book
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
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold text-slate-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition ${
                  isActive ? 'text-indigo-600 bg-indigo-50/80 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50/80 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <span>Explore Events</span>
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                HOT
              </span>
            </NavLink>

            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 relative ${
                  isActive ? 'text-indigo-600 bg-indigo-50/80 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <Ticket className="w-4 h-4 text-indigo-500" />
              <span>{bookingsLabel}</span>
              {confirmedBookingsCount > 0 && (
                <span className="bg-indigo-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                  {confirmedBookingsCount}
                </span>
              )}
            </NavLink>

            {currentUser?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                    isActive ? 'text-indigo-700 bg-indigo-100 font-bold' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Saved Items Counter Icon */}
            <Link
              to="/events?saved=true"
              className="relative p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
              title="Saved Events"
            >
              <Heart className="w-5 h-5" />
              {savedEventIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200 transition focus:outline-none"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-indigo-500"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> My Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <Ticket className="w-4 h-4 mr-2.5 text-slate-400" /> {bookingsLabel}
                      </Link>
                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <Shield className="w-4 h-4 mr-2.5 text-slate-400" /> Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => void handleLogout()}
                        className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
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
                  className="text-slate-700 hover:text-indigo-600 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition flex items-center gap-1.5"
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
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
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
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                Home
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                Explore Events
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition flex justify-between items-center"
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
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                User Profile
              </Link>
              {currentUser?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition flex items-center gap-1.5"
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
                    className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-xs"
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