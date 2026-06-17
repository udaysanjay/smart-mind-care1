const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api/v1' // Uses local backend when testing locally
    : 'https://smart-mind-care1.onrender.com/api/v1'; // Uses Render backend when deployed

class ApiService {
    static async request(endpoint, options = {}) {
        const token = Store.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Handle URL encoded forms (like OAuth2PasswordRequestForm)
        let body = options.body;
        if (options.isForm) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            body = new URLSearchParams(options.body).toString();
        } else if (body) {
            body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
                body
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'API Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            isForm: true,
            body: {
                username: email,
                password: password
            }
        });
    }

    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
    }

    static async getMe() {
        return this.request('/auth/me', {
            method: 'GET'
        });
    }

    static async updateProfile(userData) {
        return this.request('/users/me', {
            method: 'PUT',
            body: userData
        });
    }

    static async uploadAvatar(file) {
        const token = Store.getToken();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Do not set Content-Type here, let browser set it with boundary for FormData
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Avatar upload failed');
            }
            return data;
        } catch (error) {
            console.error('Avatar Upload Error:', error);
            throw error;
        }
    }

    static async getPsychologists(search = '', specialization = '') {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (specialization) queryParams.append('specialization', specialization);
        
        const queryString = queryParams.toString();
        const url = `/psychologists${queryString ? `?${queryString}` : ''}`;
        
        return this.request(url, { method: 'GET' });
    }

    static async getPsychologistById(id) {
        return this.request(`/psychologists/${id}`, { method: 'GET' });
    }

    static async createRequest(psychologistId) {
        return this.request('/requests/create', {
            method: 'POST',
            body: { psychologist_id: parseInt(psychologistId) }
        });
    }

    static async getRequests(role, id) {
        const endpoint = role === 'patient' ? `/requests/user/${id}` : `/requests/psychologist/${id}`;
        return this.request(endpoint, { method: 'GET' });
    }

    static async acceptRequest(id) {
        return this.request(`/requests/${id}/accept`, { method: 'PATCH' });
    }

    static async rejectRequest(id) {
        return this.request(`/requests/${id}/reject`, { method: 'PATCH' });
    }

    static async getMeetings() {
        return this.request('/meetings', { method: 'GET' });
    }

    static async updateMeeting(id, data) {
        return this.request(`/meetings/${id}`, {
            method: 'PATCH',
            body: data
        });
    }

    static async getTrackerEntries() { return this.request('/tracker', { method: 'GET' }); }
    static async createTrackerEntry(data) { return this.request('/tracker', { method: 'POST', body: data }); }
    static async getNotifications() { return this.request('/notifications', { method: 'GET' }); }
    static async markNotificationRead(id) { return this.request(`/notifications/${id}/read`, { method: 'PATCH' }); }
    static async getPatientAnalytics() { return this.request('/analytics/patient', { method: 'GET' }); }
    static async getPsychologistAnalytics() { return this.request('/analytics/psychologist', { method: 'GET' }); }
}

window.ApiService = ApiService;
window.API = ApiService;
