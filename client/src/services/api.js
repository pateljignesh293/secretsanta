import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    requestLogin: (email) => api.post('/auth/request-login', { email }),
    verifyToken: (token) => api.post('/auth/verify-token', { token }),
    simulateOTP: (email, otp) => api.post('/auth/simulate-otp', { email, otp }),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    getAllUsers: () => api.get('/users'),
};

// Pairing API
export const pairingAPI = {
    getMyAssignment: () => api.get('/pairings/my-assignment'),
    reveal: () => api.get('/pairings/reveal'),
    getStatus: () => api.get('/pairings/status'),
};

// Gift API
export const giftAPI = {
    submitGift: (formData) => api.post('/gifts/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getMyGift: () => api.get('/gifts/my-gift'),
    deleteMyGift: () => api.delete('/gifts/my-gift'),
};

// Settings API
export const settingsAPI = {
    getSettings: () => api.get('/settings'),
};

// Admin API
export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    createUser: (data) => api.post('/admin/users', data),
    updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    generatePairings: () => api.post('/admin/generate-pairings'),
    getPairings: () => api.get('/admin/pairings'),
    deletePairings: () => api.delete('/admin/pairings'),
    getGifts: () => api.get('/admin/gifts'),
    updateSettings: (data) => api.put('/admin/settings', data),
    exportPairings: () => api.get('/admin/export-pairings', { responseType: 'blob' }),
    sendRevealReminders: () => api.post('/admin/send-reveal-reminders'),
    getStats: () => api.get('/admin/stats'),
};

export default api;
