const CHATBOT_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api/v1/chatbot'
    : 'https://smart-mind-care1.onrender.com/api/v1/chatbot';

class ChatbotService {
    static async sendMessage(message) {
        const token = Store.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${CHATBOT_BASE_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Tunnel-Skip-AntiPhishing-Page': 'true'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to send message');
        }

        return response.json();
    }

    static async getHistory(userId) {
        const token = Store.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${CHATBOT_BASE_URL}/history/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Tunnel-Skip-AntiPhishing-Page': 'true'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to load chat history');
        }

        return response.json();
    }

    static async deleteHistory(userId) {
        const token = Store.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${CHATBOT_BASE_URL}/history/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Tunnel-Skip-AntiPhishing-Page': 'true'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to clear chat history');
        }

        return response.json();
    }
}
