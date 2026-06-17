function renderProfile(container) {
    const user = Store.getUser();
    
    if (!user) {
        container.innerHTML = `<div class="flex items-center justify-center h-64"><div class="shimmer h-64 w-full rounded-2xl"></div></div>`;
        return;
    }

    const isPatient = user.role === 'patient';
    const visibleRole = user.role === 'patient' ? 'User' : user.role === 'psychologist' ? 'Psychologist' : user.role;
    const themeColor = isPatient ? 'text-blue-600' : 'text-violet-600';
    const bgTheme = isPatient ? 'bg-blue-600' : 'bg-violet-600';
    const hoverBg = isPatient ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
    const ringTheme = isPatient ? 'focus:ring-blue-500' : 'focus:ring-violet-500';
    const gradient = isPatient ? 'from-blue-500 to-blue-700' : 'from-violet-500 to-violet-700';
    const lightBg = isPatient ? 'bg-blue-50' : 'bg-violet-50';

    const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000'
        : 'https://smart-mind-care1.onrender.com';
    const avatarUrl = user.avatar_url ? `${backendUrl}${user.avatar_url}` : null;

    container.innerHTML = `
        <div class="fade-in pb-12 flex flex-col gap-8 max-w-4xl mx-auto w-full">
            <!-- Header -->
            <div class="mb-2">
                <h1 class="text-3xl font-bold text-gray-800 tracking-tight mb-2">Profile Settings</h1>
                <p class="text-gray-500 font-medium">Manage your account details and preferences.</p>
            </div>

            <div class="glass p-8 md:p-12 rounded-3xl border border-white/60 shadow-premium slide-up">
                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 mb-8">
                    <div class="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm h-full card-equal">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-500 uppercase tracking-[0.18em]">Account</p>
                                <h2 class="text-2xl font-bold text-gray-800">${user.first_name || user.email.split('@')[0]}</h2>
                            </div>
                            ${!isPatient ? `
                                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-violet-50 text-violet-700">
                                    <i class="ph ph-briefcase text-base"></i>
                                    Psychologist
                                </span>
                            ` : ''}
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="rounded-3xl bg-white p-4 border border-gray-100 shadow-sm">
                                <p class="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">Registered</p>
                                <p class="text-sm font-semibold text-gray-800">${user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
                            </div>
                            <div class="rounded-3xl bg-white p-4 border border-gray-100 shadow-sm">
                                <p class="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">Email</p>
                                <p class="text-sm font-semibold text-gray-800 truncate">${user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between h-full card-equal">
                        <div>
                            <p class="text-sm text-gray-500 mb-2">Keep your profile current for better recommendations.</p>
                            <p class="text-sm font-semibold text-gray-800">Upload your photo and bio so professionals can recognize you faster.</p>
                        </div>
                        <div class="w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center text-white">
                            <i class="ph ph-check-circle text-2xl"></i>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-12">
                    
                    <!-- Left: Avatar Section -->
                    <div class="flex flex-col items-center md:w-1/3">
                        <div class="relative group cursor-pointer mb-6">
                            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105">
                                ${avatarUrl 
                                    ? `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover">` 
                                    : `<i class="ph ph-user text-5xl text-gray-400"></i>`
                                }
                            </div>
                            <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white" id="avatar-overlay">
                                <i class="ph ph-camera text-2xl mb-1"></i>
                                <span class="text-xs font-semibold tracking-wide">Upload</span>
                            </div>
                            <input type="file" id="avatar-input" accept="image/*" class="hidden">
                        </div>
                        <h2 class="text-xl font-bold text-gray-800">${user.first_name || ''} ${user.last_name || ''}</h2>
                        <p class="text-gray-500 font-medium capitalize">${visibleRole}</p>
                        <div id="avatar-msg" class="mt-4 text-sm font-semibold text-center hidden px-3 py-1 rounded-full"></div>
                    </div>

                    <!-- Right: Form Section -->
                    <div class="md:w-2/3">
                        <form id="profile-form" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="ph ph-user text-gray-400"></i>
                                        </div>
                                        <input type="text" id="prof_first_name" value="${user.first_name || ''}" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="ph ph-users text-gray-400"></i>
                                        </div>
                                        <input type="text" id="prof_last_name" value="${user.last_name || ''}" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-envelope-simple text-gray-400"></i>
                                    </div>
                                    <input type="email" value="${user.email}" disabled class="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-medium">
                                </div>
                                <p class="text-xs text-gray-400 mt-1.5 ml-1"><i class="ph ph-info mr-1"></i>Email address cannot be changed.</p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-phone text-gray-400"></i>
                                    </div>
                                    <input type="text" id="prof_phone" value="${user.phone_number || ''}" placeholder="+1 (555) 000-0000" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>

                            ${!isPatient ? `
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-star text-gray-400"></i>
                                    </div>
                                    <input type="text" id="prof_specialization" value="${user.specialization || ''}" placeholder="e.g. Clinical Psychology, CBT" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>
                            ` : ''}

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Bio / About Me</label>
                                <textarea id="prof_bio" rows="4" placeholder="Tell us a little bit about yourself..." class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium resize-y">${user.bio || ''}</textarea>
                            </div>

                            <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div id="profile-msg" class="text-sm font-semibold hidden"></div>
                                <button type="button" id="logout-profile-btn" class="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all">
                                    <i class="ph ph-sign-out mr-2 text-lg"></i>
                                    Logout
                                </button>
                                <button type="submit" class="px-8 py-3 ${bgTheme} ${hoverBg} text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover-scale flex items-center justify-center">
                                    <i class="ph ph-floppy-disk mr-2 text-lg"></i>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Avatar Upload Logic
    document.getElementById('avatar-overlay').addEventListener('click', () => {
        document.getElementById('avatar-input').click();
    });

    document.getElementById('avatar-input').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const msgDiv = document.getElementById('avatar-msg');
        msgDiv.textContent = 'Uploading...';
        msgDiv.className = 'mt-4 text-sm font-semibold text-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 block animate-pulse';

        try {
            const updatedUser = await ApiService.uploadAvatar(file);
            Store.setUser(updatedUser);
            msgDiv.textContent = 'Upload successful!';
            msgDiv.className = 'mt-4 text-sm font-semibold text-center px-3 py-1 rounded-full bg-green-50 text-green-600 block';
            
            setTimeout(() => renderProfile(container), 1000);
        } catch (err) {
            msgDiv.textContent = err.message || 'Upload failed';
            msgDiv.className = 'mt-4 text-sm font-semibold text-center px-3 py-1 rounded-full bg-red-50 text-red-600 block';
        }
    });

    // Profile Form Logic
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const msgDiv = document.getElementById('profile-msg');
        
        btn.disabled = true;
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner animate-spin text-lg mr-2"></i> Saving...';
        msgDiv.classList.add('hidden');

        const first_name = document.getElementById('prof_first_name').value;
        const last_name = document.getElementById('prof_last_name').value;
        const phone_number = document.getElementById('prof_phone').value;
        const bio = document.getElementById('prof_bio').value;
        
        let specialization = null;
        if (!isPatient) {
            specialization = document.getElementById('prof_specialization').value;
        }

        try {
            const updatedUser = await ApiService.updateProfile({
                first_name,
                last_name,
                phone_number,
                bio,
                specialization
            });
            Store.setUser(updatedUser);
            msgDiv.textContent = 'Profile updated successfully!';
            msgDiv.className = 'text-sm font-semibold text-green-600 block';
            
            setTimeout(() => {
                msgDiv.classList.add('fade-out');
                setTimeout(() => msgDiv.classList.add('hidden'), 300);
            }, 3000);
            
        } catch (err) {
            msgDiv.textContent = err.message || 'Failed to update profile';
            msgDiv.className = 'text-sm font-semibold text-red-600 block';
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        }
    });

    document.getElementById('logout-profile-btn').addEventListener('click', () => {
        Store.logout();
    });
}
