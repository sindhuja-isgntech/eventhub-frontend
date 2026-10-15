import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Event, Booking, User, EventCategory, ToastMessage } from '../types';

interface AppContextType {
  events: Event[];
  categories: EventCategory[];
  bookings: Booking[];
  currentUser: User | null;
  savedEventIds: number[];
  toasts: ToastMessage[];
  login: (email: string, name?: string, role?: 'CUSTOMER' | 'ADMIN') => void;
  logout: () => void;
  register: (name: string, email: string, phone: string, role?: 'CUSTOMER' | 'ADMIN') => void;
  toggleSaveEvent: (eventId: number) => void;
  bookEvent: (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  addEvent: (newEvent: Omit<Event, 'id'>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const INITIAL_CATEGORIES: EventCategory[] = [
  { id: 1, name: 'Technology', description: 'AI, Web Development, Cloud & Startups', color: 'indigo' },
  { id: 2, name: 'Music', description: 'Live Concerts, DJ Sets & Festivals', color: 'fuchsia' },
  { id: 3, name: 'Art & Design', description: 'Exhibitions, Galleries & Workshops', color: 'amber' },
  { id: 4, name: 'Business', description: 'Conferences, Expos & Networking', color: 'blue' },
  { id: 5, name: 'Food & Drink', description: 'Tastings, Culinary Masterclasses & Festivals', color: 'rose' },
  { id: 6, name: 'Sports & Fitness', description: 'Marathons, Tournaments & Fitness Expos', color: 'emerald' },
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Tech Innovators Global Summit 2026',
    description: 'Join over 2,000 tech visionaries, software engineers, and founders for three days of keynotes, architectural deep-dives, hands-on workshops, and startup pitches covering AI, cloud infrastructure, and modern web frameworks.',
    category: 'Technology',
    venue: { id: 101, name: 'Jacob Javits Convention Center', address: '429 11th Ave', city: 'New York', capacity: 3500 },
    dateTime: '2026-11-15T09:30:00',
    endDate: '2026-11-17T18:00:00',
    price: 89.00,
    totalSeats: 500,
    availableSeats: 84,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'NextGen Tech Foundation',
    featured: true,
    tags: ['AI & ML', 'Cloud Native', 'Keynotes', 'Networking'],
    tiers: [
      { id: 't1', name: 'Standard Pass', price: 89.00, description: 'Access to all main stages and expo hall', availableSeats: 50, perks: ['Full Keynotes Access', 'Expo Floor', 'Digital Swag Bag'] },
      { id: 't2', name: 'VIP All-Access', price: 189.00, description: 'Front-row seating, speaker lounge & banquet dinner', availableSeats: 24, perks: ['VIP Lounge Access', 'Private Speaker Q&A', 'Banquet Dinner Included', 'Exclusive Recordings'] },
      { id: 't3', name: 'Student / Academic', price: 45.00, description: 'Subsidized pass for verified students', availableSeats: 10, perks: ['Expo Floor', 'Student Workshop Track', 'Resume Review Booth'] },
    ],
    agenda: [
      { time: '09:30 AM', title: 'Opening Keynote: The Agentic Web Era', description: 'Exploring multi-agent architectures and the future of developer workflows.' },
      { time: '11:30 AM', title: 'Scaling Cloud Infrastructure in 2026', description: 'Practical lessons from handling billion-request workloads.' },
      { time: '02:00 PM', title: 'Interactive Developer Hackathon', description: 'Build and ship an AI-powered prototype in 3 hours.' },
      { time: '05:00 PM', title: 'Sunset Networking & Drinks', description: 'Meet founders, investors, and fellow engineering leaders.' }
    ]
  },
  {
    id: 2,
    title: 'Neon Horizons Electronic Music Festival',
    description: 'An electrifying two-night audio-visual celebration featuring world-class DJs, immersive laser installations, food truck villages, and interactive art domes under the California night sky.',
    category: 'Music',
    venue: { id: 102, name: 'Downtown Amphitheater', address: '1200 Grand Ave', city: 'Los Angeles', capacity: 8000 },
    dateTime: '2026-12-04T18:00:00',
    endDate: '2026-12-05T23:59:00',
    price: 110.00,
    totalSeats: 1200,
    availableSeats: 34,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Pulse Music Collective',
    featured: true,
    tags: ['Electronic', 'Live DJ', 'Outdoor', 'Festival'],
    tiers: [
      { id: 'm1', name: 'General Admission', price: 110.00, description: 'Full access to main arena & food village', availableSeats: 25, perks: ['Main Stage Access', 'Food Village', 'Festival Wristband'] },
      { id: 'm2', name: 'Backstage & VIP Platform', price: 240.00, description: 'Elevated viewing platform, express entry & private bar', availableSeats: 9, perks: ['Elevated Viewing Deck', 'Fast-track Entry', 'Dedicated Bar & Restrooms'] },
    ],
    agenda: [
      { time: '06:00 PM', title: 'Gates Open & Resident DJ Sets', description: 'Warm-up vibes with melodic house and ambient beats.' },
      { time: '08:30 PM', title: 'Headliner Act 1: CyberEchoes Live', description: 'Synthesizer performance synced with 360-degree laser mapping.' },
      { time: '10:45 PM', title: 'Headline Laser & Pyrotechnic Finale', description: 'Unforgettable 90-minute headline set.' }
    ]
  },
  {
    id: 3,
    title: 'Modern Art, XR & Generative Design Expo',
    description: 'Explore the boundaries between digital medium, spatial computing, and physical sculpture. Curated displays from 40+ international artists alongside live creative coding demonstrations.',
    category: 'Art & Design',
    venue: { id: 103, name: 'Contemporary Arts Center', address: '201 Michigan Blvd', city: 'Chicago', capacity: 1500 },
    dateTime: '2026-11-20T10:00:00',
    endDate: '2026-11-22T19:00:00',
    price: 32.00,
    totalSeats: 300,
    availableSeats: 142,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Chicago Creative Guild',
    featured: false,
    tags: ['XR Art', 'Digital Sculpture', 'Exhibition', 'Design'],
    tiers: [
      { id: 'a1', name: 'Exhibition Pass', price: 32.00, description: 'Standard day pass for all gallery halls', availableSeats: 110, perks: ['Gallery Access', 'Audio Guide App', 'Exhibition Catalog'] },
      { id: 'a2', name: 'Curator Tour + Workshop', price: 65.00, description: 'Guided 90-minute tour by chief curator + hands-on lab', availableSeats: 32, perks: ['Guided Curator Tour', 'Hands-on Generative Art Lab', 'Commemorative Print'] },
    ]
  },
  {
    id: 4,
    title: 'Global Venture & Startup Pitch Summit',
    description: 'Where founders meet Tier-1 angels, VCs, and growth partners. Featuring 60 live startup pitches, investor roundtables, and dedicated 1-on-1 deal rooms.',
    category: 'Business',
    venue: { id: 104, name: 'Palace Hotel Conference Hall', address: '2 New Montgomery St', city: 'San Francisco', capacity: 2000 },
    dateTime: '2026-12-10T08:30:00',
    endDate: '2026-12-11T17:30:00',
    price: 149.00,
    totalSeats: 400,
    availableSeats: 62,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Silicon Venture Alliance',
    featured: true,
    tags: ['Venture Capital', 'Pitching', 'Startups', 'Networking'],
    tiers: [
      { id: 'b1', name: 'Founder Pass', price: 149.00, description: 'Pitch stage attendance and networking floor', availableSeats: 50, perks: ['Pitch Sessions Access', 'Networking App Access', 'Coffee & Lunch Included'] },
      { id: 'b2', name: 'Investor Pass', price: 299.00, description: 'Investor lounge, private deal room, and founder directory', availableSeats: 12, perks: ['Investor Deal Room', 'Private Lounge', 'Curated Founder Pitch Deck Portfolio'] },
    ]
  },
  {
    id: 5,
    title: 'Artisan Food & Craft Wine Showcase',
    description: 'Savor gourmet dishes crafted by Michelin-starred guest chefs paired with rare vintages from 50+ boutique vineyards. Includes live tasting sessions and cooking masterclasses.',
    category: 'Food & Drink',
    venue: { id: 105, name: 'Waterfront Pavilion', address: '1800 Harbor Drive', city: 'San Diego', capacity: 2200 },
    dateTime: '2026-11-28T12:00:00',
    endDate: '2026-11-28T21:00:00',
    price: 65.00,
    totalSeats: 350,
    availableSeats: 22,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Pacific Culinary Society',
    featured: false,
    tags: ['Wine Tasting', 'Gourmet', 'Chef Showcase', 'Masterclass'],
    tiers: [
      { id: 'f1', name: 'Tasting Ticket', price: 65.00, description: '10 tasting tokens + commemorative crystal glass', availableSeats: 18, perks: ['10 Food & Wine Tokens', 'Crystal Wine Glass', 'Chef Demo Stages'] },
      { id: 'f2', name: 'Chef Table Experience', price: 135.00, description: '5-course paired tasting menu with Master Sommelier', availableSeats: 4, perks: ['Private 5-Course Pairing', 'Sommelier Discussion', 'Take-home Vintage Bottle'] },
    ]
  },
  {
    id: 6,
    title: 'Metro Half Marathon & Wellness Festival',
    description: 'Run through scenic city landmarks, coastal promenades, and lush urban parks. Followed by a high-energy post-race festival with live music, recovery zones, and healthy food vendors.',
    category: 'Sports & Fitness',
    venue: { id: 106, name: 'City Central Park & Boulevard', address: '1000 Park Avenue', city: 'Seattle', capacity: 5000 },
    dateTime: '2026-12-18T07:00:00',
    endDate: '2026-12-18T14:00:00',
    price: 42.00,
    totalSeats: 800,
    availableSeats: 210,
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Northwest Athletic Club',
    featured: false,
    tags: ['Marathon', 'Fitness', 'Wellness', 'Outdoor'],
    tiers: [
      { id: 's1', name: 'Runner Registration', price: 42.00, description: 'Bib, timing chip, dry-fit finisher tee, and medal', availableSeats: 190, perks: ['RFID Timing Chip', 'Finisher Medal & Tee', 'Hydration & Snack Stations'] },
      { id: 's2', name: 'VIP Runner & Recovery Package', price: 85.00, description: 'Express bag drop, massage recovery tent, and VIP brunch', availableSeats: 20, perks: ['Express Gear Check', '30-min Sports Massage', 'Post-race VIP Champagne Brunch'] },
    ]
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'EH-94820',
    eventId: 1,
    eventTitle: 'Tech Innovators Global Summit 2026',
    eventCategory: 'Technology',
    eventDateTime: '2026-11-15T09:30:00',
    venueName: 'Jacob Javits Convention Center',
    venueCity: 'New York',
    ticketCount: 2,
    tierName: 'Standard Pass',
    totalAmount: 178.00,
    bookingDate: '2026-10-14',
    status: 'CONFIRMED',
    attendeeName: 'Alex Morgan',
    attendeeEmail: 'alex.morgan@example.com',
    attendeePhone: '+1 (555) 234-5678',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=EH-94820'
  }
];

const DEFAULT_USER: User = {
  id: 101,
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 234-5678',
  role: 'CUSTOMER',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  savedEventIds: [1, 2]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const cached = localStorage.getItem('eventhub_events');
    return cached ? JSON.parse(cached) : INITIAL_EVENTS;
  });

  const [categories] = useState<EventCategory[]>(INITIAL_CATEGORIES);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const cached = localStorage.getItem('eventhub_bookings');
    return cached ? JSON.parse(cached) : INITIAL_BOOKINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('eventhub_user');
    return cached ? JSON.parse(cached) : DEFAULT_USER;
  });

  const [savedEventIds, setSavedEventIds] = useState<number[]>(() => {
    const cached = localStorage.getItem('eventhub_saved_events');
    return cached ? JSON.parse(cached) : [1, 2];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('eventhub_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('eventhub_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eventhub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eventhub_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('eventhub_saved_events', JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (email: string, name?: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') => {
    const user: User = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      savedEventIds: [1]
    };
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have signed out successfully.', 'info');
  };

  const register = (name: string, email: string, phone: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') => {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      email,
      phone,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      savedEventIds: []
    };
    setCurrentUser(newUser);
    showToast(`Account created! Welcome to EventHub, ${name}.`, 'success');
  };

  const toggleSaveEvent = (eventId: number) => {
    setSavedEventIds(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast('Event removed from your saved list.', 'info');
        return prev.filter(id => id !== eventId);
      } else {
        showToast('Event saved to your favorites!', 'success');
        return [...prev, eventId];
      }
    });
  };

  const bookEvent = (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>): Booking => {
    const newId = `EH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${newId}`
    };

    setBookings(prev => [newBooking, ...prev]);

    // Deduct available seats
    setEvents(prev => prev.map(ev => {
      if (ev.id === bookingData.eventId) {
        return {
          ...ev,
          availableSeats: Math.max(0, ev.availableSeats - bookingData.ticketCount)
        };
      }
      return ev;
    }));

    showToast(`Booking confirmed for ${newBooking.eventTitle}!`, 'success');
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));

    // Restore seats
    setEvents(prev => prev.map(ev => {
      if (ev.id === booking.eventId) {
        return {
          ...ev,
          availableSeats: ev.availableSeats + booking.ticketCount
        };
      }
      return ev;
    }));

    showToast(`Reservation #${bookingId} has been cancelled.`, 'info');
  };

  const addEvent = (newEventData: Omit<Event, 'id'>) => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    const event: Event = {
      ...newEventData,
      id: newId
    };
    setEvents(prev => [event, ...prev]);
    showToast(`Event "${event.title}" published successfully!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        events,
        categories,
        bookings,
        currentUser,
        savedEventIds,
        toasts,
        login,
        logout,
        register,
        toggleSaveEvent,
        bookEvent,
        cancelBooking,
        addEvent,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

