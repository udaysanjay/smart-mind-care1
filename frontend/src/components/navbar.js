async function renderNavbar(container) {
    const user = Store.getUser();
    const isAuthenticated = !!user;

    const topHeader = document.getElementById('top-header');
    
    if (!isAuthenticated) {
        container.innerHTML = '';
        if (topHeader) topHeader.innerHTML = '';
        return;
    }

    const themeColor = user.role === 'psychologist' ? 'text-psych-600' : 'text-patient-600';
    const bgTheme = user.role === 'psychologist' ? 'bg-psych-50' : 'bg-patient-50';
    const hoverBg = user.role === 'psychologist' ? 'hover:bg-psych-100' : 'hover:bg-patient-100';

    const getIcon = (label) => {
        const icons = {
            'Home': '<i class="ph ph-house text-2xl"></i>',
            'AI Chat': '<i class="ph ph-chat-teardrop-text text-2xl"></i>',
            'Psychologists': '<i class="ph ph-users text-2xl"></i>',
            'Meetings': '<i class="ph ph-calendar-blank text-2xl"></i>',
            'Profile': '<i class="ph ph-user text-2xl"></i>',
            'Login': '<i class="ph ph-sign-in text-2xl"></i>',
            'Sign Up': '<i class="ph ph-user-plus text-2xl"></i>'
        };
        return icons[label] || '';
    };

    const navLinks = user.role === 'patient' ? [
        { href: '#/home', label: 'Home' },
        { href: '#/ai-chat', label: 'AI Chat' },
        { href: '#/psychologists', label: 'Psychologists' },
        { href: '#/profile', label: 'Profile' }
    ] : [
        { href: '#/home', label: 'Home' },
        { href: '#/meetings', label: 'Meetings' },
        { href: '#/ai-chat', label: 'AI Chat' },
        { href: '#/profile', label: 'Profile' }
    ];

    let notifHTML = '';
    let notifList = '<div class="p-4 text-sm text-gray-500 text-center">No notifications</div>';
    let unreadCount = 0;

    try {
        const notifications = await API.getNotifications();
        unreadCount = notifications.filter(n => !n.is_read).length;
        notifList = notifications.length > 0 ? notifications.map(n => `
            <div class="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${n.is_read ? 'opacity-60' : 'bg-white'}" data-id="${n.id}" id="notif-${n.id}">
                <p class="text-sm font-semibold text-gray-800">${n.title}</p>
                <p class="text-xs text-gray-500 mt-1">${n.message}</p>
            </div>
        `).join('') : '<div class="p-4 text-sm text-gray-500 text-center">No notifications</div>';
    } catch (err) {
        console.error("Failed to load notifications", err);
        notifList = '<div class="p-4 text-sm text-gray-500 text-center">Notifications unavailable</div>';
    }

    const notifBadge = unreadCount > 0 ? `<span class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">${unreadCount}</span>` : '';

    notifHTML = `
        <div class="relative">
            <button id="notif-btn" class="relative p-2 sm:p-3 text-gray-400 hover:${themeColor} ${hoverBg} rounded-full transition-all bg-white border border-gray-100 shadow-sm hover:shadow">
                <i class="ph ph-bell text-xl sm:text-2xl"></i>
                ${notifBadge}
            </button>
            <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 glass rounded-3xl shadow-premium overflow-hidden z-50 max-h-96 overflow-y-auto border border-white/40">
                <div class="p-3 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0">
                    <h3 class="font-semibold text-gray-800 text-sm">Notifications</h3>
                </div>
                <div class="bg-white/80">
                    ${notifList}
                </div>
            </div>
        </div>
    `;

    const currentHash = window.location.hash || '#/home';

    const userCardHTML = isAuthenticated ? `
        <a href="#/profile" class="flex items-center gap-3 bg-white border border-gray-100 rounded-full pl-2 pr-4 py-1.5 shadow-sm hover:shadow transition-shadow cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <i class="ph ph-user text-lg"></i>
            </div>
            <div class="hidden sm:block">
                <p class="text-sm font-semibold text-gray-800 leading-tight">${user.first_name || user.email.split('@')[0]}</p>
                <p class="text-[10px] text-gray-500 capitalize leading-tight">${user.role === 'psychologist' ? 'Psychologist' : 'User'}</p>
            </div>
        </a>
    ` : '';

    const generateNavItems = () => navLinks.map(link => {
        const isActive = currentHash.includes(link.href.replace('#', ''));
        const activeClass = isActive ? `${themeColor} ${bgTheme} font-semibold shadow-sm` : `text-gray-500 ${hoverBg}`;
        const specialClass = link.special ? 'bg-gray-900 text-white hover:bg-gray-800' : '';
        const ariaCurrent = isActive ? 'aria-current="page"' : '';
        
        return `
            <a href="${link.href}" ${ariaCurrent} class="nav-item flex items-center px-4 py-3 rounded-2xl transition-all duration-300 w-full ${activeClass} ${specialClass}">
                <div class="flex items-center justify-center mr-4 transition-transform ${isActive ? 'scale-110' : ''}">
                    ${getIcon(link.label)}
                </div>
                <span class="text-sm tracking-wide ${isActive ? '' : 'font-medium'}">${link.label}</span>
            </a>
        `;
    }).join('');

    const logoutBtn = `
        <button id="logout-btn" class="nav-item flex items-center px-4 py-3 rounded-2xl transition-all duration-300 w-full text-gray-500 ${hoverBg}">
            <div class="flex items-center justify-center mr-4 transition-transform">
                <i class="ph ph-sign-out text-2xl"></i>
            </div>
            <span class="text-sm tracking-wide font-medium">Logout</span>
        </button>
    `;

    const bottomNavItems = navLinks.map(link => {
        const isActive = currentHash.includes(link.href.replace('#', ''));
        const activeClass = isActive ? 'active' : '';
        return `
            <a href="${link.href}" class="${activeClass}">
                ${getIcon(link.label)}
                <span>${link.label}</span>
            </a>
        `;
    }).join('');

    const bottomNavLogout = `
        <a href="javascript:void(0)" id="bottom-logout-btn" class="">
            <i class="ph ph-sign-out text-2xl"></i>
            <span>Logout</span>
        </a>
    `;

    container.innerHTML = `
        <div class="side-nav hidden lg:flex z-50">
            <div class="flex items-center mb-8 shrink-0">
                <div class="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white shadow-md mr-3">
                    <i class="ph ph-heartbeat text-xl"></i>
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-500 uppercase tracking-[0.25em]">MindCare</p>
                    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
                </div>
            </div>

            <div class="flex-1 flex flex-col gap-2 overflow-y-auto">
                ${generateNavItems()}
            </div>
            
            <div class="mt-auto pt-4 shrink-0">
                ${logoutBtn}
            </div>
        </div>

        <div class="bottom-nav">
            ${bottomNavItems}
            ${bottomNavLogout}
        </div>
    `;

    if (topHeader) {
        topHeader.innerHTML = `
            ${notifHTML}
            ${userCardHTML}
        `;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
            Store.logout();
        });

        const bottomLogout = document.getElementById('bottom-logout-btn');
        if (bottomLogout) {
            bottomLogout.addEventListener('click', () => {
                Store.logout();
            });
        }

        const notifBtn = document.getElementById('notif-btn');
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifDropdown.classList.toggle('hidden');
                notifDropdown.classList.add('slide-up');
            });
            
            document.addEventListener('click', (e) => {
                if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                    notifDropdown.classList.add('hidden');
                }
            });
            
            notifDropdown.querySelectorAll('[id^="notif-"]').forEach(el => {
                el.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    try {
                        await API.markNotificationRead(id);
                        e.currentTarget.classList.remove('bg-white');
                        e.currentTarget.classList.add('opacity-60');
                        await renderNavbar(container); // Refresh nav
                    } catch(err) {
                        console.error(err);
                    }
                });
            });
        }
}
