import axios from 'axios';
import type { BookingRecord, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return 'Cannot connect to the EventHub backend. Start the backend server and confirm it is available at http://localhost:8080.';
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
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const response = await api.post<User>('/auth/login', credentials);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
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
  createEvent: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  }
};

// Category Services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  createCategory: async (categoryData: any) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
};

// Venue Services
export const venueService = {
  getAllVenues: async () => {
    const response = await api.get('/venues');
    return response.data;
  },
  createVenue: async (venueData: any) => {
    const response = await api.post('/venues', venueData);
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
  // Categories & Venues
  deleteCategory: async (id: number) => (await api.delete(`/admin/categories/${id}`)).data,
  deleteVenue: async (id: number) => (await api.delete(`/admin/venues/${id}`)).data,

  // Event Management
  updateEvent: async (id: number, eventData: any) => (await api.put(`/admin/events/${id}`, eventData)).data,
  deleteEvent: async (id: number) => (await api.delete(`/admin/events/${id}`)).data,

  // Booking Operations
  getAllBookings: async (): Promise<BookingRecord[]> => (await api.get<BookingRecord[]>('/admin/bookings')).data,
  updateBookingStatus: async (id: number, status: string) =>
    (await api.patch<BookingRecord>(`/admin/bookings/${id}/status`, null, { params: { status } })).data,

  // Profile Management
  getProfile: async (userId: number) => (await api.get(`/admin/users/${userId}`)).data,
  updateProfile: async (userId: number, userData: any) => (await api.put(`/admin/users/${userId}`, userData)).data,
};