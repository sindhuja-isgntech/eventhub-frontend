export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity?: number;
}

export interface EventCategory {
  id: number;
  name: string;
  description?: string;
  status?: string;
  icon?: string;
  color?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  availableSeats: number;
  perks: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: Venue;
  dateTime: string;
  endDate?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  organizer: string;
  featured?: boolean;
  tags?: string[];
  tiers?: TicketTier[];
  agenda?: { time: string; title: string; description: string }[];
}

export interface Booking {
  id: string;
  eventId: number;
  eventTitle: string;
  eventCategory: string;
  eventDateTime: string;
  venueName: string;
  venueCity: string;
  ticketCount: number;
  tierName: string;
  totalAmount: number;
  bookingDate: string;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  qrCodeUrl?: string;
}

export interface BookingRecord extends Omit<Booking, 'id'> {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
  avatarUrl?: string;
  savedEventIds?: number[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
