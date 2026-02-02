import axios from 'axios';
import { authService } from './auth';

const API_URL = 'http://localhost:5000/api/doctor';

const getHeaders = () => ({
    headers: { 'Authorization': `Bearer ${authService.getToken()}` }
});

export const doctorService = {
    // ==================== PROFILE ====================
    async getProfile() {
        const response = await axios.get(`${API_URL}/profile`, getHeaders());
        return response.data;
    },

    async updateProfile(profileData: any) {
        const response = await axios.put(`${API_URL}/profile`, profileData, getHeaders());
        return response.data;
    },

    // ==================== DISCOVERY (For Patients) ====================
    async getDiscovery() {
        const response = await axios.get(`${API_URL}/discovery`, getHeaders());
        return response.data;
    },

    // ==================== SLOT OPERATIONS ====================
    async lockSlot(doctorId: string, date: string, slotId: string) {
        const response = await axios.post(`${API_URL}/slots/lock`,
            { doctorId, date, slotId }, getHeaders());
        return response.data;
    },

    async unlockSlot(doctorId: string, date: string, slotId: string) {
        const response = await axios.post(`${API_URL}/slots/unlock`,
            { doctorId, date, slotId }, getHeaders());
        return response.data;
    },

    async bookSlot(doctorId: string, date: string, slotId: string, sessionType?: string, clinicalFormData?: any) {
        const response = await axios.post(`${API_URL}/slots/book`,
            { doctorId, date, slotId, sessionType, clinicalFormData }, getHeaders());
        return response.data;
    },

    async cancelSlot(date: string, slotId: string) {
        const response = await axios.post(`${API_URL}/slots/cancel`,
            { date, slotId }, getHeaders());
        return response.data;
    },

    // ==================== PATIENT BOOKINGS (For Patients) ====================
    async getPatientBookings() {
        const response = await axios.get(`${API_URL}/patient/bookings`, getHeaders());
        return response.data;
    },

    // ==================== CONSULTATIONS (For Doctors) ====================
    async getConsultations() {
        const response = await axios.get(`${API_URL}/consultations`, getHeaders());
        return response.data;
    },

    async getUpcomingConsultations() {
        const response = await axios.get(`${API_URL}/consultations/upcoming`, getHeaders());
        return response.data;
    },

    async updateConsultationNotes(id: string, notes: string) {
        const response = await axios.put(`${API_URL}/consultations/${id}/notes`, { notes }, getHeaders());
        return response.data;
    },

    // ==================== STATS (For Doctors) ====================
    async getStats() {
        const response = await axios.get(`${API_URL}/stats`, getHeaders());
        return response.data;
    },

    // ==================== CLINICAL FORMS ====================
    async createForm(title: string, description: string, fields: any[]) {
        const response = await axios.post(`${API_URL}/forms`,
            { title, description, fields }, getHeaders());
        return response.data;
    },

    async activateForm(formId: string) {
        const response = await axios.put(`${API_URL}/forms/${formId}/activate`, {}, getHeaders());
        return response.data;
    },

    // ==================== PATIENT VAULT (For Doctors) ====================
    async getPatientVault() {
        const response = await axios.get(`${API_URL}/vault`, getHeaders());
        return response.data;
    },

    async getPatientSummary(patientId: string) {
        const response = await axios.get(`${API_URL}/patients/${patientId}/summary`, getHeaders());
        return response.data;
    }
};
