import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Event, Booking, BookingRecord, User, EventCategory, ToastMessage, Venue } from '../types';
import { authService, eventService, categoryService, bookingService, adminService } from '../services/api';

interface AppContextType {
  events: Event[];
  categories: EventCategory[];
  bookings: Booking[];
  confirmedBookingsCount: number;
  bookingsLoading: boolean;
  currentUser: User | null;
  authLoading: boolean;
  savedEventIds: number[];
  toasts: ToastMessage[];
  isLoading: boolean;
  refreshEvents: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, role?: 'CUSTOMER' | 'ORGANIZER') => Promise<User>;
  toggleSaveEvent: (eventId: number) => void;
  cancelBooking: (bookingId: string) => Promise<void>;
  addEvent: (newEvent: Omit<Event, 'id'>) => Promise<void>;
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
    venue: { id: 101, name: 'Bengaluru International Exhibition Centre', address: '10th Mile, Tumkur Road', city: 'Bengaluru', capacity: 3500 },
    dateTime: '2026-11-15T09:30:00',
    endDate: '2026-11-17T18:00:00',
    price: 7999,
    totalSeats: 500,
    availableSeats: 86,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'NextGen Tech Foundation',
    featured: true,
    tags: ['AI & ML', 'Cloud Native', 'Keynotes', 'Networking'],
    tiers: [
      { id: 't1', name: 'Standard Pass', price: 7999, description: 'Access to all main stages and expo hall', availableSeats: 50, perks: ['Full Keynotes Access', 'Expo Floor', 'Digital Swag Bag'] },
      { id: 't2', name: 'VIP All-Access', price: 14999, description: 'Front-row seating, speaker lounge & banquet dinner', availableSeats: 24, perks: ['VIP Lounge Access', 'Private Speaker Q&A', 'Banquet Dinner Included', 'Exclusive Recordings'] },
      { id: 't3', name: 'Student / Academic', price: 2999, description: 'Subsidized pass for verified students', availableSeats: 10, perks: ['Expo Floor', 'Student Workshop Track', 'Resume Review Booth'] },
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
    description: 'An electrifying two-night audio-visual celebration featuring leading Indian DJs, immersive laser installations, street-food favourites, and interactive art under the Mumbai night sky.',
    category: 'Music',
    venue: { id: 102, name: 'Mahalaxmi Racecourse', address: 'Keshavrao Khadye Marg, Mahalaxmi', city: 'Mumbai', capacity: 8000 },
    dateTime: '2026-12-04T18:00:00',
    endDate: '2026-12-05T23:59:00',
    price: 3999,
    totalSeats: 1200,
    availableSeats: 34,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Pulse Live India',
    featured: true,
    tags: ['Electronic', 'Live DJ', 'Outdoor', 'Festival'],
    tiers: [
      { id: 'm1', name: 'General Admission', price: 3999, description: 'Full access to main arena & food village', availableSeats: 25, perks: ['Main Stage Access', 'Food Village', 'Festival Wristband'] },
      { id: 'm2', name: 'Backstage & VIP Platform', price: 7999, description: 'Elevated viewing platform, express entry & private bar', availableSeats: 9, perks: ['Elevated Viewing Deck', 'Fast-track Entry', 'Dedicated Bar & Restrooms'] },
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
    venue: { id: 103, name: 'Raja Ravi Varma Art Gallery', address: 'Ghole Road, Shivajinagar', city: 'Pune', capacity: 1500 },
    dateTime: '2026-11-20T10:00:00',
    endDate: '2026-11-22T19:00:00',
    price: 999,
    totalSeats: 300,
    availableSeats: 142,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Pune Creative Collective',
    featured: false,
    tags: ['XR Art', 'Digital Sculpture', 'Exhibition', 'Design'],
    tiers: [
      { id: 'a1', name: 'Exhibition Pass', price: 999, description: 'Standard day pass for all gallery halls', availableSeats: 110, perks: ['Gallery Access', 'Audio Guide App', 'Exhibition Catalog'] },
      { id: 'a2', name: 'Curator Tour + Workshop', price: 1999, description: 'Guided 90-minute tour by chief curator + hands-on lab', availableSeats: 32, perks: ['Guided Curator Tour', 'Hands-on Generative Art Lab', 'Commemorative Print'] },
    ]
  },
  {
    id: 4,
    title: 'Global Venture & Startup Pitch Summit',
    description: 'Where founders meet Tier-1 angels, VCs, and growth partners. Featuring 60 live startup pitches, investor roundtables, and dedicated 1-on-1 deal rooms.',
    category: 'Business',
    venue: { id: 104, name: 'Bharat Mandapam', address: 'Pragati Maidan, Mathura Road', city: 'New Delhi', capacity: 2000 },
    dateTime: '2026-12-10T08:30:00',
    endDate: '2026-12-11T17:30:00',
    price: 4999,
    totalSeats: 400,
    availableSeats: 62,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'India Startup Alliance',
    featured: true,
    tags: ['Venture Capital', 'Pitching', 'Startups', 'Networking'],
    tiers: [
      { id: 'b1', name: 'Founder Pass', price: 4999, description: 'Pitch stage attendance and networking floor', availableSeats: 50, perks: ['Pitch Sessions Access', 'Networking App Access', 'Coffee & Lunch Included'] },
      { id: 'b2', name: 'Investor Pass', price: 9999, description: 'Investor lounge, private deal room, and founder directory', availableSeats: 12, perks: ['Investor Deal Room', 'Private Lounge', 'Curated Founder Pitch Deck Portfolio'] },
    ]
  },
  {
    id: 5,
    title: 'Artisan Food & Craft Wine Showcase',
    description: 'Discover regional Indian dishes from acclaimed chefs, seasonal ingredients, and craft beverages. Includes live tasting sessions and hands-on cooking masterclasses.',
    category: 'Food & Drink',
    venue: { id: 105, name: 'HITEX Exhibition Centre', address: 'Izzatnagar, Madhapur', city: 'Hyderabad', capacity: 2200 },
    dateTime: '2026-11-28T12:00:00',
    endDate: '2026-11-28T21:00:00',
    price: 1499,
    totalSeats: 350,
    availableSeats: 22,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Indian Culinary Collective',
    featured: false,
    tags: ['Wine Tasting', 'Gourmet', 'Chef Showcase', 'Masterclass'],
    tiers: [
      { id: 'f1', name: 'Tasting Ticket', price: 1499, description: 'Tasting tokens, a commemorative glass, and chef demonstrations', availableSeats: 18, perks: ['Regional Food Tastings', 'Commemorative Glass', 'Chef Demo Stages'] },
      { id: 'f2', name: 'Chef Table Experience', price: 2999, description: 'A multi-course regional tasting menu with a guest chef', availableSeats: 4, perks: ['Private Tasting Menu', 'Chef Discussion', 'Take-home Spice Selection'] },
    ]
  },
  {
    id: 6,
    title: 'Metro Half Marathon & Wellness Festival',
    description: 'Run through scenic city landmarks, coastal promenades, and lush urban parks. Followed by a high-energy post-race festival with live music, recovery zones, and healthy food vendors.',
    category: 'Sports & Fitness',
    venue: { id: 106, name: 'Jawaharlal Nehru Stadium', address: 'Sydenhams Road, Periamet', city: 'Chennai', capacity: 5000 },
    dateTime: '2026-12-18T07:00:00',
    endDate: '2026-12-18T14:00:00',
    price: 999,
    totalSeats: 800,
    availableSeats: 210,
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Chennai Runners Club',
    featured: false,
    tags: ['Marathon', 'Fitness', 'Wellness', 'Outdoor'],
    tiers: [
      { id: 's1', name: 'Runner Registration', price: 999, description: 'Bib, timing chip, finisher tee, and medal', availableSeats: 190, perks: ['RFID Timing Chip', 'Finisher Medal & Tee', 'Hydration & Snack Stations'] },
      { id: 's2', name: 'VIP Runner & Recovery Package', price: 2499, description: 'Express bag drop, recovery tent, and post-race brunch', availableSeats: 20, perks: ['Express Gear Check', 'Sports Massage', 'Post-race Brunch'] },
    ]
  }
];

// Helper to normalize backend event entity to frontend Event interface
const mapBackendEvent = (be: any): Event => {
  const categoryName = typeof be.category === 'object' && be.category !== null
    ? be.category.name
    : (be.category || 'General');

  const venueObj: Venue = typeof be.venue === 'object' && be.venue !== null
    ? {
        id: be.venue.id || 1,
        name: be.venue.name || 'Main Hall',
        address: be.venue.address || '',
        city: be.venue.city || 'Bengaluru',
        capacity: be.venue.capacity
      }
    : {
        id: 1,
        name: 'Main Hall',
        address: '',
        city: 'Bengaluru'
      };

  const priceVal = typeof be.price === 'number' ? be.price : parseFloat(be.price || '0');
  const availableVal = be.availableSeats !== undefined ? be.availableSeats : (be.totalSeats || 100);

  return {
    id: be.id,
    title: be.title,
    description: be.description || '',
    category: categoryName,
    venue: venueObj,
    dateTime: be.dateTime,
    endDate: be.endDate,
    price: priceVal,
    totalSeats: be.totalSeats || 100,
    availableSeats: availableVal,
    imageUrl: be.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: be.organizer || 'EventHub Host',
    featured: Boolean(be.featured),
    tags: be.tags || [categoryName, 'Live', 'Featured'],
    tiers: be.tiers && be.tiers.length > 0 ? be.tiers : [
      {
        id: `tier-std-${be.id}`,
        name: 'Standard Pass',
        price: priceVal,
        description: 'Full admission to event and venue floor',
        availableSeats: Math.min(availableVal, 50),
        perks: ['General Admission', 'Digital Ticket Pass', 'Venue Amenities']
      },
      {
        id: `tier-vip-${be.id}`,
        name: 'VIP All-Access',
        price: Math.round(priceVal * 1.8),
        description: 'Front-row seating, VIP lounge & commemorative gift',
        availableSeats: Math.min(availableVal, 20),
        perks: ['VIP Priority Gate', 'Lounge Access & Drinks', 'Fast-Track Check-In']
      }
    ],
    agenda: be.agenda || [
      { time: '10:00 AM', title: 'Registration & Welcome', description: 'Badge pickup, coffee and morning meet-and-greet.' },
      { time: '11:30 AM', title: 'Main Stage Keynote Session', description: 'Featured talks and interactive demonstrations.' },
      { time: '02:00 PM', title: 'Workshops & Networking', description: 'Engage with organizers, peers, and industry mentors.' }
    ]
  };
};

const mapBookingRecord = (record: BookingRecord): Booking => ({
  ...record,
  id: `EH-${record.id}`,
  bookingDate: record.bookingDate,
});

const savedEventsStorageKey = (user: User) => `eventhub_saved_events_user_${user.id}`;

const readSavedEventIds = (user: User): number[] => {
  try {
    const stored = localStorage.getItem(savedEventsStorageKey(user));
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is number => Number.isInteger(id)))]
      : [];
  } catch (error) {
    console.error('Unable to load saved experiences.', error);
    return [];
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const cached = localStorage.getItem('eventhub_events_inr_v1');
    return cached ? JSON.parse(cached) : INITIAL_EVENTS;
  });

  const [categories, setCategories] = useState<EventCategory[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [savedEventIds, setSavedEventIds] = useState<number[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Function to fetch events and categories from Spring Boot backend
  const refreshEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [backendEvents, backendCategories] = await Promise.allSettled([
        eventService.getAllEvents(),
        categoryService.getAllCategories()
      ]);

      if (backendEvents.status === 'fulfilled' && Array.isArray(backendEvents.value)) {
        const mapped = backendEvents.value.map(mapBackendEvent);
        setEvents(mapped);
        localStorage.setItem('eventhub_events_inr_v1', JSON.stringify(mapped));
      }

      if (backendCategories.status === 'fulfilled' && Array.isArray(backendCategories.value)) {
        setCategories(backendCategories.value);
      }
    } catch (err) {
      console.warn('Backend synchronization warning, keeping cached state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from backend on initial mount
  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    localStorage.setItem('eventhub_events_inr_v1', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    let active = true;
    authService.getCurrentUser()
      .then(user => {
        if (active) {
          setCurrentUser(user);
          setSavedEventIds(readSavedEventIds(user));
        }
      })
      .catch(error => {
        if (active) {
          if (error?.response?.status !== 401) {
            console.error('Unable to restore the current session.', error);
          }
          setSavedEventIds([]);
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

  const refreshBookings = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    setBookingsLoading(true);
    try {
      if (currentUser.role === 'ADMIN') {
        const summary = await adminService.getBookingSummary();
        setBookings([]);
        setConfirmedBookingsCount(summary.confirmedBookings);
      } else {
        const records = await bookingService.getMyBookings();
        const mappedBookings = records.map(mapBookingRecord);
        setBookings(mappedBookings);
        setConfirmedBookingsCount(mappedBookings.filter(booking => booking.status === 'CONFIRMED').length);
      }
    } finally {
      setBookingsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authLoading || !currentUser) return;
    Promise.resolve()
      .then(() => refreshBookings())
      .catch(error => {
        console.error('Unable to load bookings for the signed-in user.', error);
      });
  }, [authLoading, currentUser, refreshBookings]);

  const login = async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    setBookings([]);
    setConfirmedBookingsCount(0);
    setSavedEventIds(readSavedEventIds(user));
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setSavedEventIds([]);
    setBookings([]);
    setConfirmedBookingsCount(0);
    setBookingsLoading(false);
    showToast('You have signed out successfully.', 'info');
  };

  const register = async (name: string, email: string, phone: string, password: string, role: 'CUSTOMER' | 'ORGANIZER' = 'CUSTOMER') => {
    const newUser = await authService.register({
      name,
      email,
      phone,
      password,
      role,
    });
    setBookings([]);
    setConfirmedBookingsCount(0);
    setSavedEventIds(readSavedEventIds(newUser));
    setCurrentUser(newUser);
    showToast(`Account created! Welcome to EventHub, ${name}.`, 'success');
    return newUser;
  };

  const toggleSaveEvent = (eventId: number) => {
    if (!currentUser) {
      showToast('Please sign in to save experiences.', 'info');
      return;
    }

    const isSaved = savedEventIds.includes(eventId);
    const updatedIds = isSaved
      ? savedEventIds.filter(id => id !== eventId)
      : [...savedEventIds, eventId];

    try {
      localStorage.setItem(savedEventsStorageKey(currentUser), JSON.stringify(updatedIds));
    } catch (error) {
      console.error('Unable to save experiences for this account.', error);
      showToast('Unable to save this experience. Please check your browser storage.', 'error');
      return;
    }

    setSavedEventIds(updatedIds);
    showToast(
      isSaved ? 'Event removed from your saved list.' : 'Event saved to your favorites!',
      isSaved ? 'info' : 'success'
    );
  };

  const cancelBooking = async (bookingId: string) => {
    const numericId = Number(bookingId.replace(/^EH-/, ''));
    await bookingService.cancelBooking(numericId);
    await refreshBookings();
    await refreshEvents();
    showToast(`Reservation #${bookingId} has been cancelled.`, 'info');
  };

  const addEvent = async (newEventData: Omit<Event, 'id'>) => {
    try {
      const cat = categories.find(c => c.name.toLowerCase() === newEventData.category.toLowerCase()) || categories[0];
      const payload = {
        title: newEventData.title,
        description: newEventData.description,
        categoryId: cat ? cat.id : 1,
        venueId: newEventData.venue?.id || 1,
        dateTime: newEventData.dateTime,
        price: newEventData.price,
        totalSeats: newEventData.totalSeats,
        imageUrl: newEventData.imageUrl,
        organizer: newEventData.organizer,
        featured: newEventData.featured || false
      };

      const saved = await eventService.createEvent(payload);
      if (saved && saved.id) {
        const mapped = mapBackendEvent(saved);
        setEvents(prev => [mapped, ...prev.filter(e => e.id !== mapped.id)]);
        showToast(`Event "${saved.title}" saved to backend database!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend event creation failed, creating locally:', err);
    }

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
        confirmedBookingsCount,
        bookingsLoading,
        currentUser,
        authLoading,
        savedEventIds,
        toasts,
        isLoading,
        refreshEvents,
        refreshBookings,
        login,
        logout,
        register,
        toggleSaveEvent,
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
