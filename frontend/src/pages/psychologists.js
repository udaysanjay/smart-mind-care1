async function renderPsychologists(container) {
    const user = Store.getUser();
    if (!user || user.role !== 'patient') {
        container.innerHTML = `
            <div class="flex items-center justify-center h-64">
                <div class="glass p-8 rounded-2xl border border-red-100 bg-red-50 text-center">
                    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                        <i class="ph ph-lock-key text-xl"></i>
                    </div>
                    <h3 class="text-red-800 font-bold mb-2">Access Denied</h3>
                    <p class="text-red-600 text-sm">Only users with a patient account can access the discovery feature.</p>
                </div>
            </div>`;
        return;
    }

    // Basic layout shell
    container.innerHTML = `
        <div class="fade-in pb-12 flex flex-col gap-8">
            <!-- Header Section -->
            <div class="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-2">
                <div class="space-y-3 max-w-2xl">
                    <h1 class="text-3xl font-bold text-gray-800 tracking-tight mb-2">Discover Psychologists</h1>
                    <p class="text-gray-500 font-medium">Find the right professional for your mental health journey.</p>
                </div>
            </div>

            <!-- Search and Filter Bar -->
            <div class="glass p-4 rounded-2xl border border-white/60 shadow-sm mb-10 slide-up">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1 relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="ph ph-magnifying-glass text-gray-400 text-lg"></i>
                        </div>
                        <input type="text" id="search-input" placeholder="Search by name, bio, or keywords..." class="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium">
                    </div>
                    <div class="w-full md:w-64 relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="ph ph-funnel text-gray-400 text-lg"></i>
                        </div>
                        <select id="specialization-filter" class="w-full pl-11 pr-10 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium appearance-none cursor-pointer">
                            <option value="">All Specializations</option>
                            <option value="anxiety">Anxiety</option>
                            <option value="depression">Depression</option>
                            <option value="cbt">Cognitive Behavioral Therapy</option>
                            <option value="ptsd">PTSD</option>
                            <option value="relationships">Relationships</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <i class="ph ph-caret-down text-gray-400"></i>
                        </div>
                    </div>
                    <button id="search-btn" class="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover-scale flex items-center justify-center">
                        Search
                    </button>
                </div>
            </div>

            <div id="psychologists-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Skeleton Loading -->
                <div class="shimmer h-64 rounded-3xl"></div>
                <div class="shimmer h-64 rounded-3xl hidden md:block"></div>
                <div class="shimmer h-64 rounded-3xl hidden lg:block"></div>
            </div>
        </div>
    `;

    const grid = document.getElementById('psychologists-grid');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const specFilter = document.getElementById('specialization-filter');

    const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000'
        : 'https://zx8sbvxk-8000.inc1.devtunnels.ms';

    const loadPsychologists = async () => {
        grid.innerHTML = `
            <div class="shimmer h-64 rounded-3xl"></div>
            <div class="shimmer h-64 rounded-3xl hidden md:block"></div>
            <div class="shimmer h-64 rounded-3xl hidden lg:block"></div>
        `;
        
        try {
            const search = searchInput.value;
            const specialization = specFilter.value;
            const psychologists = await ApiService.getPsychologists(search, specialization);

            if (psychologists.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full py-16 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                            <i class="ph ph-magnifying-glass text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 mb-2">No professionals found</h3>
                        <p class="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = '';
            psychologists.forEach((p, index) => {
                const avatarUrl = p.avatar_url ? `${backendUrl}${p.avatar_url}` : '';
                const delay = index * 50;
                
                const card = document.createElement('div');
                card.className = 'glass p-6 rounded-3xl border border-white/60 shadow-premium flex flex-col h-full card-equal slide-up group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden';
                card.style.animationDelay = `${delay}ms`;
                
                card.innerHTML = `
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mix-blend-multiply opacity-50 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div class="flex items-start space-x-4 mb-4 relative z-10">
                        <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                            ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover">` : `<i class="ph ph-user text-2xl text-blue-300"></i>`}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800 text-lg leading-tight">${p.first_name} ${p.last_name}</h3>
                            <div class="flex items-center text-sm font-semibold text-blue-600 mt-1">
                                <i class="ph ph-star-four mr-1.5"></i>
                                ${p.specialization || 'General Psychologist'}
                            </div>
                        </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 font-medium leading-relaxed mb-6 flex-grow relative z-10 clamp-3">
                        ${p.bio || 'No biography available at this time.'}
                    </p>
                    
                    <div class="relative z-10 mt-auto">
                        <button class="request-btn w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold rounded-xl transition-colors flex items-center justify-center border border-blue-100 hover:border-transparent" data-id="${p.id}">
                            <i class="ph ph-paper-plane-tilt mr-2 text-lg"></i>
                            Send Request
                        </button>
                        <div id="req-msg-${p.id}" class="text-xs font-semibold text-center mt-2 hidden py-1 rounded-lg"></div>
                    </div>
                `;
                
                grid.appendChild(card);
            });

            // Attach listeners to request buttons
            document.querySelectorAll('.request-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const msgDiv = document.getElementById(`req-msg-${id}`);
                    const originalHTML = e.currentTarget.innerHTML;
                    
                    msgDiv.classList.remove('hidden');
                    msgDiv.className = 'text-xs font-semibold text-center mt-2 py-1 rounded-lg bg-blue-50 text-blue-600 block animate-pulse';
                    msgDiv.textContent = 'Sending...';
                    
                    e.currentTarget.disabled = true;
                    e.currentTarget.innerHTML = '<i class="ph ph-spinner animate-spin text-lg mr-2"></i> Sending...';

                    try {
                        await ApiService.createRequest(id);
                        msgDiv.className = 'text-xs font-semibold text-center mt-2 py-1 rounded-lg bg-green-50 text-green-600 block';
                        msgDiv.textContent = 'Request Sent';
                        
                        e.currentTarget.innerHTML = '<i class="ph ph-check-circle text-lg mr-2"></i> Requested';
                        e.currentTarget.classList.remove('bg-blue-50', 'hover:bg-blue-600', 'text-blue-700', 'hover:text-white');
                        e.currentTarget.classList.add('bg-green-600', 'text-white', 'cursor-not-allowed', 'shadow-md');
                    } catch (err) {
                        msgDiv.className = 'text-xs font-semibold text-center mt-2 py-1 rounded-lg bg-red-50 text-red-600 block';
                        msgDiv.textContent = err.message || 'Failed to send';
                        e.currentTarget.disabled = false;
                        e.currentTarget.innerHTML = originalHTML;
                    }
                });
            });
            
        } catch (error) {
            grid.innerHTML = `
                <div class="col-span-full py-8">
                    <div class="glass p-6 rounded-2xl border border-red-100 bg-red-50 text-center max-w-md mx-auto">
                        <i class="ph ph-warning text-3xl text-red-500 mb-2"></i>
                        <h3 class="text-red-800 font-bold mb-1">Error Loading Directory</h3>
                        <p class="text-red-600 text-sm">${error.message}</p>
                    </div>
                </div>
            `;
        }
    };

    searchBtn.addEventListener('click', loadPsychologists);
    
    // Allow pressing 'Enter' in the search box
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadPsychologists();
        }
    });

    // Initial load
    loadPsychologists();
}
