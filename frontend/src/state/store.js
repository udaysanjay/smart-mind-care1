class Store {
    static setToken(token) {
        localStorage.setItem('mindcare_token', token);
    }

    static getToken() {
        return localStorage.getItem('mindcare_token');
    }

    static removeToken() {
        localStorage.removeItem('mindcare_token');
    }

    static setUser(user) {
        localStorage.setItem('mindcare_user', JSON.stringify(user));
        // Apply theme based on role
        if (user && user.role) {
            document.body.className = `theme-${user.role.toLowerCase()}`;
        }
    }

    static getUser() {
        const user = localStorage.getItem('mindcare_user');
        return user ? JSON.parse(user) : null;
    }

    static getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static logout() {
        this.removeToken();
        localStorage.removeItem('mindcare_user');
        document.body.className = ''; // remove theme
        window.location.hash = '/login';
    }
}
