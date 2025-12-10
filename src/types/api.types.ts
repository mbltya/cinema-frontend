export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  description?: string;
  ageRating?: number;
  posterUrl?: string;
  trailerUrl?: string;
}

export interface Cinema {
  id: number;
  name: string;
  city: string;
  address: string;
}

export interface Hall {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
  cinemaId?: number;
  cinemaName?: string;
}

export interface Session {
  id: number;
  movieId: number;
  movieTitle: string;
  hallId: number;
  hallName: string;
  cinemaId?: number;
  cinemaName?: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  price: number;
  format: string;
}

export interface Ticket {
  id: number;
  userId: number;
  userName?: string;
  sessionId: number;
  movieTitle?: string;
  sessionTime?: string;
  rowNumber: number;
  seatNumber: number;
  price: number;
  purchaseTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'USED';
  qrCode?: string;
}

// DTO для запросов
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

export interface CreateTicketRequest {
  userId: number;
  sessionId: number;
  rowNumber: number;
  seatNumber: number;
}