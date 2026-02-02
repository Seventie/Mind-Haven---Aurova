import axios from 'axios';
import { authService } from './auth';

const API_URL = 'http://localhost:5000/api/journal';

export const journalService = {
    async createEntry(content: string, aiAnalysis: any) {
        const token = authService.getToken();
        const response = await axios.post(API_URL,
            { content, aiAnalysis },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    },

    async getEntries() {
        const token = authService.getToken();
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
};
