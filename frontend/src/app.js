class App {
    constructor() {
        this.routes = {
            '/': { render: renderHome, protected: true },
            '/home': { render: renderHome, protected: true },
            '/login': { render: renderLogin, protected: false },
            '/signup': { render: renderSignup, protected: false },
            '/profile': { render: renderProfile, protected: true },
            '/ai-chat': { render: renderAiChat, protected: true },
            '/psychologists': { render: renderPsychologists, protected: true },
            '/meetings': { render: renderMeetings, protected: true }
        };
        this.init();
    }

    async init() {
        // Auto-login logic
        if (Store.isAuthenticated()) {
            try {
                const user = await ApiService.getMe();
                Store.setUser(user);
            } catch (error) {
                console.error("Auto-login failed:", error);
                Store.logout();
                return; // logout will handle navigation
            }
        } else {
            // Restore theme if user is in localStorage but no token (edge case) or just clear it
            document.body.className = '';
        }

        window.addEventListener('hashchange', () => this.navigate());
        this.navigate(); // Handle initial load
    }

    async router() {
        const hash = window.location.hash || '#/home';
        const path = hash.replace('#', '');
        
        // Handle global theme
        const user = Store.getUser();
        const appDiv = document.getElementById('app');
        if (user && user.role === 'psychologist') {
            appDiv.className = 'min-h-screen bg-psych-50 text-psych-900 transition-colors duration-300';
        } else {
            appDiv.className = 'min-h-screen bg-patient-50 text-patient-900 transition-colors duration-300';
        }

        const container = document.getElementById('main-content');
        container.innerHTML = '<div class="shimmer h-64 w-full rounded-2xl"></div>';

        await renderNavbar(document.getElementById('navbar'));
        this.navigate();
    }

    async navigate() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes[path];
        
        const mainContent = document.getElementById('main-content');
        const wrapper = document.getElementById('content-wrapper');
        
        if (Store.isAuthenticated()) {
            wrapper.classList.add('lg:pl-[320px]');
        } else {
            wrapper.classList.remove('lg:pl-[320px]');
        }
        
        // Handle global theme
        const user = Store.getUser();
        const appDiv = document.getElementById('app');
        if (user && user.role === 'psychologist') {
            appDiv.className = 'min-h-screen bg-psych-50 text-psych-900 transition-colors duration-300';
        } else {
            appDiv.className = 'min-h-screen bg-patient-50 text-patient-900 transition-colors duration-300';
        }

        if (!route) {
            mainContent.innerHTML = '<div class="glass p-8 rounded-2xl"><h2>404 - Page Not Found</h2></div>';
            await renderNavbar(document.getElementById('navbar'));
            return;
        }

        // Protected Route Logic
        if (route.protected && !Store.isAuthenticated()) {
            window.location.hash = '/login';
            return;
        }

        // Redirect away from auth pages if already logged in
        if (!route.protected && Store.isAuthenticated() && path !== '/logout') {
            window.location.hash = '/';
            return;
        }

        mainContent.innerHTML = '<div class="shimmer h-64 w-full rounded-2xl"></div>';
        
        // Render content
        await route.render(mainContent);
        
        // Re-render navbar to reflect current state
        await renderNavbar(document.getElementById('navbar'));
    }
}

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
