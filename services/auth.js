import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
    async signup(email, password, displayName, role, extraData = {}) {
        console.log('[AuthService] Signup called with:', { email, displayName, role });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, displayName, role, ...extraData });
            console.log('[AuthService] Signup response:', response.data);
            if (response.data.token) {
                localStorage.setItem('tenawell_token', response.data.token);
                localStorage.setItem('tenawell_user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('[AuthService] Signup error:', error.response?.data || error.message);
            throw error;
        }
    },

    async login(email, password) {
        console.log('[AuthService] Login called with:', { email });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            console.log('[AuthService] Login response:', response.data);
            if (response.data.token) {
                localStorage.setItem('tenawell_token', response.data.token);
                localStorage.setItem('tenawell_user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('[AuthService] Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    async googleAuth(idToken, role) {
        console.log('[AuthService] GoogleAuth called with role:', role);
        try {
            const response = await axios.post(`${API_URL}/google`, { idToken, role });
            console.log('[AuthService] GoogleAuth response:', response.data);
            if (response.data.token) {
                localStorage.setItem('tenawell_token', response.data.token);
                localStorage.setItem('tenawell_user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('[AuthService] GoogleAuth error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('tenawell_token');
        localStorage.removeItem('tenawell_user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('tenawell_user');
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        const token = localStorage.getItem('tenawell_token');
        console.log("📦 Token from storage:", token ? "EXISTS" : "NULL");
        return token;
    }
};
