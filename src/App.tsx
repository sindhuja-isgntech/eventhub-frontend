import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CustomerLayout } from './layouts/CustomerLayout';
import { Home } from './pages/Home';
import { EventListing } from './pages/EventListing';
import { EventDetails } from './pages/EventDetails';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { AdminDashboard } from './pages/AdminDashboard';
import { Home as HomeIcon, AlertCircle } from 'lucide-react';
import './App.css';

// 404 Fallback Component
const NotFound: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
    <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
      <AlertCircle className="w-8 h-8" />
    </div>
    <div className="space-y-2">
      <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
      <p className="text-xl font-bold text-slate-800">Experience or Page Not Found</p>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
    </div>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition shadow-md shadow-indigo-600/30"
    >
      <HomeIcon className="w-4 h-4" />
      <span>Return to EventHub Home</span>
    </Link>
  </div>
);

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Main Layout Pages with Header & Footer */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventListing />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/bookings/confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-bookings/:id" element={<BookingConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminDashboard />} />
            <Route path="/admin/venues" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Authentication Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;