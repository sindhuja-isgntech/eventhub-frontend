import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ToastContainer } from '../components/Toast';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Enhanced Navigation */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Rich Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;

