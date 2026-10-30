import axios from 'axios';
import type { BookingRecord, User } from '../types';
import type { EventCategory, Venue } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_TOKEN_KEY = 'eventhub_access_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export interface AdminEventRecord {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  venue: Venue;
  dateTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  organizer: string;
  featured: boolean;
  status: string;
}

export interface EventManagementRequest {
  title: string;
  description: string;
  categoryId: number;
  venueId: number;
  dateTime: string;
  price: number;
  totalSeats: number;
  imageUrl: string;
  organizer: string;
  featured: boolean;
}

export interface CategoryManagementRequest {
  name: string;
  description: string;
  status: string;
}

export interface VenueManagementRequest {
  name: string;
  address: string;
  city: string;
  capacity: number;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `Cannot connect to the EventHub backend. Start the backend server and confirm it is available at ${backendOrigin}.`;
  }

  const responseData: unknown = error.response.data;
  if (typeof responseData === 'object' && responseData !== null) {
    const data = responseData as { message?: unknown; messages?: unknown };
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    if (typeof data.messages === 'object' && data.messages !== null) {
      const validationMessages = Object.values(data.messages)
        .filter((message): message is string => typeof message === 'string' && message.trim().length > 0);
      if (validationMessages.length > 0) {
        return validationMessages.join(' ');
      }
    }
  }

  return `The request failed (HTTP ${error.response.status}). Please try again.`;
};

export const authService = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'CUSTOMER' | 'ORGANIZER';
  }): Promise<User> => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', userData);
    sessionStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    return response.data.user;
  },
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    sessionStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    return response.data.user;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  logout: async (): Promise<void> => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  },
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};

// Event Services
export const eventService = {
  getAllEvents: async (search?: string) => {
    const url = search ? `/events?search=${encodeURIComponent(search)}` : '/events';
    const response = await api.get(url);
    return response.data;
  },
  getEventById: async (id: number | string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (eventData: EventManagementRequest): Promise<AdminEventRecord> => {
    const response = await api.post<AdminEventRecord>('/events', eventData);
    return response.data;
  }
};

// Category Services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  createCategory: async (categoryData: CategoryManagementRequest): Promise<EventCategory> => {
    const response = await api.post<EventCategory>('/categories', categoryData);
    return response.data;
  }
};

// Venue Services
export const venueService = {
  getAllVenues: async () => {
    const response = await api.get('/venues');
    return response.data;
  },
  createVenue: async (venueData: VenueManagementRequest): Promise<Venue> => {
    const response = await api.post<Venue>('/venues', venueData);
    return response.data;
  }
};

// Booking Services
export const bookingService = {
  createBooking: async (bookingData: { eventId: number; quantity: number; attendees: Array<{ name: string; email: string; phone: string }> }): Promise<BookingRecord> => {
    const response = await api.post<BookingRecord>('/bookings', bookingData);
    return response.data;
  },
  getMyBookings: async (): Promise<BookingRecord[]> => {
    const response = await api.get<BookingRecord[]>('/bookings/mine');
    return response.data;
  },
  getBooking: async (bookingId: string | number): Promise<BookingRecord> => {
    const response = await api.get<BookingRecord>(`/bookings/${bookingId}`);
    return response.data;
  },
  cancelBooking: async (bookingId: string | number): Promise<BookingRecord> => {
    const response = await api.patch<BookingRecord>(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};


// Administrative & User Profile Services
export const adminService = {
  getAllEvents: async (): Promise<AdminEventRecord[]> => (await api.get<AdminEventRecord[]>('/admin/events')).data,
  createEvent: async (event: EventManagementRequest): Promise<AdminEventRecord> =>
    (await api.post<AdminEventRecord>('/admin/events', event)).data,
  updateEvent: async (id: number, event: EventManagementRequest): Promise<AdminEventRecord> =>
    (await api.put<AdminEventRecord>(`/admin/events/${id}`, event)).data,
  deleteEvent: async (id: number): Promise<void> => { await api.delete(`/admin/events/${id}`); },

  getAllCategories: async (): Promise<EventCategory[]> =>
    (await api.get<EventCategory[]>('/admin/categories')).data,
  createCategory: async (category: CategoryManagementRequest): Promise<EventCategory> =>
    (await api.post<EventCategory>('/admin/categories', category)).data,
  updateCategory: async (id: number, category: CategoryManagementRequest): Promise<EventCategory> =>
    (await api.put<EventCategory>(`/admin/categories/${id}`, category)).data,
  deleteCategory: async (id: number): Promise<void> => { await api.delete(`/admin/categories/${id}`); },

  getAllVenues: async (): Promise<Venue[]> => (await api.get<Venue[]>('/admin/venues')).data,
  createVenue: async (venue: VenueManagementRequest): Promise<Venue> =>
    (await api.post<Venue>('/admin/venues', venue)).data,
  updateVenue: async (id: number, venue: VenueManagementRequest): Promise<Venue> =>
    (await api.put<Venue>(`/admin/venues/${id}`, venue)).data,
  deleteVenue: async (id: number): Promise<void> => { await api.delete(`/admin/venues/${id}`); },

  // Booking Operations
  getAllBookings: async (): Promise<BookingRecord[]> => (await api.get<BookingRecord[]>('/admin/bookings')).data,
  updateBookingStatus: async (id: number, status: string) =>
    (await api.patch<BookingRecord>(`/admin/bookings/${id}/status`, null, { params: { status } })).data,
  deleteBooking: async (id: number): Promise<void> => { await api.delete(`/admin/bookings/${id}`); },

  // Profile Management
  getProfile: async (userId: number): Promise<User> => (await api.get<User>(`/admin/users/${userId}`)).data,
  updateProfile: async (userId: number, userData: Partial<Pick<User, 'name' | 'phone'>>): Promise<User> =>
    (await api.put<User>(`/admin/users/${userId}`, userData)).data,
};