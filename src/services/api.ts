import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { 
    username: string; 
    email: string; 
    password: string; 
    role?: string 
  }) => api.post('/auth/register', data),
};

export const movieAPI = {
  getAll: () => api.get('/movies'),
  getById: (id: number) => api.get(`/movies/${id}`),
  create: (data: any) => api.post('/movies', data),
  update: (id: number, data: any) => api.put(`/movies/${id}`, data),
  delete: (id: number) => api.delete(`/movies/${id}`),
  search: (title: string) => api.get(`/movies/search?title=${title}`),
};

export const sessionAPI = {
  getAll: () => api.get('/sessions'),
  getById: (id: number) => api.get(`/sessions/${id}`),
  getUpcoming: () => api.get('/sessions/upcoming'),
  getByMovie: (movieId: number) => api.get(`/sessions/movie/${movieId}`),
  create: (data: any) => api.post('/sessions', data),
};

export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id: number) => api.get(`/tickets/${id}`),
  getByUser: (userId: number) => api.get(`/tickets/user/${userId}`),
  getActiveByUser: (userId: number) => api.get(`/tickets/user/${userId}/active`),
  create: (data: any) => api.post('/tickets', data),
  confirm: (id: number) => api.put(`/tickets/${id}/confirm`),
  cancel: (id: number) => api.put(`/tickets/${id}/cancel`),
  checkSeat: (sessionId: number, rowNumber: number, seatNumber: number) =>
    api.get(`/tickets/check-seat?sessionId=${sessionId}&rowNumber=${rowNumber}&seatNumber=${seatNumber}`),
};

export const cinemaAPI = {
  getAll: () => api.get('/cinemas'),
  getById: (id: number) => api.get(`/cinemas/${id}`),
  getByCity: (city: string) => api.get(`/cinemas/city/${city}`),
};

export const hallAPI = {
  getAll: () => api.get('/halls'),
  getById: (id: number) => api.get(`/halls/${id}`),
  getByCinema: (cinemaId: number) => api.get(`/halls/cinema/${cinemaId}`),
};

export default api;