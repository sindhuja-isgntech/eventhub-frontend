import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getUserBookings: async (userId: number | string) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  }
};