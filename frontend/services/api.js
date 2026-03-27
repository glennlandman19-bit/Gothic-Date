import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Profile APIs
export const profileAPI = {
  getProfile: (userId) => api.get(`/profiles/${userId}`),
  updateProfile: (userId, data) => api.put(`/profiles/${userId}`, data),
  uploadPhotos: (userId, formData) => 
    api.post(`/profiles/${userId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Swipe APIs
export const swipeAPI = {
  recordSwipe: (data) => api.post('/swipes/swipe', data),
  getSuggestions: (userId) => api.get(`/swipes/suggestions/${userId}`),
  getMatches: (userId) => api.get(`/matches/${userId}`),
};

// Message APIs
export const messageAPI = {
  getMessages: (matchId) => api.get(`/messages/match/${matchId}`),
  sendMessage: (data) => api.post('/messages/send', data),
  markAsRead: (matchId, data) => api.put(`/messages/read/${matchId}`, data),
};

// Subscription APIs
export const subscriptionAPI = {
  getSubscription: (userId) => api.get(`/subscriptions/${userId}`),
  createPaymentIntent: (data) => api.post('/subscriptions/create-payment-intent', data),
  updateSubscription: (data) => api.post('/subscriptions/update', data),
};

export default api;
