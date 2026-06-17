class ChatState {
    constructor() {
        this.messages = [];
        this.loading = false;
        this.error = null;
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }

    setMessages(messages) {
        this.messages = messages;
        this.notify();
    }

    addMessage(message) {
        this.messages.push(message);
        this.notify();
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        this.notify();
    }

    setError(errorMsg) {
        this.error = errorMsg;
        this.notify();
    }

    clearError() {
        this.error = null;
        this.notify();
    }
}

// Global instance for the chat page
const chatState = new ChatState();
