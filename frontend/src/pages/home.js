async function renderHome(container) {
    const user = Store.getUser();
    if (!user) {
        container.innerHTML = `<div class="flex items-center justify-center h-64"><div class="shimmer h-64 w-full rounded-2xl"></div></div>`;
        return;
    }

    const isPatient = user.role === 'patient';
    const themeColor = isPatient ? 'text-blue-600' : 'text-violet-600';
    const themeBg = isPatient ? 'bg-blue-600' : 'bg-violet-600';
    const themeHover = isPatient ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
    const gradient = isPatient ? 'from-blue-500 to-blue-700' : 'from-violet-500 to-violet-700';
    
    // Greeting Header
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    container.innerHTML = `
        <div class="fade-in pb-12 flex flex-col gap-8">
            <!-- Header Section -->
            <div class="flex flex-col gap-6 lg:gap-8">
                <div class="flex flex-col lg:flex-row justify-between gap-4 lg:items-end">
                    <div class="space-y-3">
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight leading-tight">
                            ${getGreeting()}, <span class="${themeColor}">${user.first_name || user.email.split('@')[0]}</span>
                        </h1>
                        <p class="text-gray-500 text-base sm:text-lg font-medium max-w-2xl">Here is your ${isPatient ? 'wellness' : 'practice'} overview for today. Stay on top of your goals with quick insights and next steps.</p>
                    </div>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div class="px-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span class="text-sm font-medium text-gray-600">System Online</span>
                        </div>
                        <a href="#/meetings" class="inline-flex items-center gap-2 px-5 py-3 rounded-3xl ${themeBg} ${themeHover} text-white font-semibold shadow-md transition-all hover:shadow-lg">
                            <i class="ph ph-calendar-check text-lg"></i>
                            View Schedule
                        </a>
                    </div>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                    <div class="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 flex flex-col justify-between h-full">
                        <div>
                            <p class="text-sm text-gray-500 uppercase tracking-[0.24em] mb-4 font-semibold">Today’s focus</p>
                            <h2 class="text-xl font-bold text-gray-900 mb-2">Keep a steady routine</h2>
                        </div>
                        <p class="text-sm text-gray-600 font-medium">Log a mood check-in, review your schedule, and build consistency with small habits.</p>
                    </div>
                    <div class="rounded-3xl bg-gradient-to-r ${gradient} p-8 shadow-premium text-white flex flex-col justify-between h-full">
                        <div>
                            <p class="text-sm uppercase tracking-[0.24em] opacity-90 mb-4 font-semibold">Quick insight</p>
                            <h2 class="text-2xl font-bold mb-2">Wellness score</h2>
                        </div>
                        <p class="text-sm leading-relaxed font-medium">Create a reliable wellness rhythm with daily notes, and check-in on your progress from the dashboard below.</p>
                    </div>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div id="dashboard-content" class="flex flex-col gap-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="shimmer h-40 rounded-3xl"></div>
                    <div class="shimmer h-40 rounded-3xl"></div>
                    <div class="shimmer h-40 rounded-3xl"></div>
                    <div class="shimmer h-40 rounded-3xl"></div>
                </div>
            </div>
        </div>
    `;

    const contentDiv = document.getElementById('dashboard-content');

    try {
        if (isPatient) {
            const analytics = await API.getPatientAnalytics();
            const patientAnalytics = {
                avg_mood: analytics?.avg_mood ?? '--',
                avg_stress: analytics?.avg_stress ?? '--',
                avg_sleep: analytics?.avg_sleep ?? '--',
                latest_wellness_index: analytics?.latest_wellness_index ?? '--',
                entries_count: analytics?.entries_count ?? 0
            };
            
            // Patient Dashboard
            contentDiv.innerHTML = `
                <!-- Metrics Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 50ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-sun text-orange-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Average Mood</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${patientAnalytics.avg_mood}</span>
                            <span class="text-gray-400 font-semibold text-sm pb-1">/10</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 100ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-red-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-activity text-red-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Stress Level</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${patientAnalytics.avg_stress}</span>
                            <span class="text-gray-400 font-semibold text-sm pb-1">/10</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 150ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-moon-stars text-indigo-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Average Sleep</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${patientAnalytics.avg_sleep}</span>
                            <span class="text-gray-400 font-semibold text-sm pb-1">hrs</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-premium slide-up relative overflow-hidden flex flex-col justify-between h-full" style="animation-delay: 200ms;">
                        <div class="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply opacity-50"></div>
                        <div class="flex items-center gap-3 mb-4 relative z-10">
                            <div class="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-2xl flex-shrink-0">
                                <i class="ph ph-heartbeat text-blue-600 text-2xl"></i>
                            </div>
                            <h3 class="text-blue-800 text-sm font-semibold">Wellness Index</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto relative z-10">
                            <span class="text-4xl font-bold text-blue-900 leading-none">${patientAnalytics.latest_wellness_index}</span>
                            <span class="text-blue-600 font-semibold text-sm pb-1">%</span>
                        </div>
                    </div>
                </div>

                <!-- Split Content: Chart & Tracker -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <!-- Left: Wellness Journey -->
                    <div class="lg:col-span-2 glass p-8 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col h-full" style="animation-delay: 250ms;">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800 mb-1">Wellness Journey</h2>
                                <p class="text-sm text-gray-500 font-medium">Based on your ${patientAnalytics.entries_count} recorded entries</p>
                            </div>
                            <button class="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">View Details</button>
                        </div>
                        
                        <!-- Illustration Placeholder -->
                        <div class="w-full flex-1 min-h-[240px] bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center p-6">
                            <div class="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                                <i class="ph ph-chart-line-up text-3xl"></i>
                            </div>
                            <h3 class="text-gray-700 font-bold mb-2">Keep tracking your mood</h3>
                            <p class="text-gray-500 text-sm font-medium max-w-sm">Log your daily check-ins to unlock personalized insights and visualize your mental health journey over time.</p>
                        </div>
                    </div>

                    <!-- Right: Daily Check-in Form -->
                    <div class="glass p-8 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col h-full" style="animation-delay: 300ms;">
                        <div class="mb-6">
                            <h2 class="text-xl font-bold text-gray-800 mb-1">Daily Check-in</h2>
                            <p class="text-sm text-gray-500 font-medium">How are you feeling today?</p>
                        </div>

                        <form id="tracker-form" class="space-y-6 flex-1 flex flex-col justify-between">
                            <div class="space-y-5">
                                <div>
                                    <label class="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                                        <span>Mood Score</span>
                                        <span class="text-blue-600 font-bold" id="mood-val">7</span>
                                    </label>
                                    <input type="range" id="mood" min="1" max="10" value="7" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" oninput="document.getElementById('mood-val').innerText = this.value">
                                </div>

                                <div>
                                    <label class="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                                        <span>Stress Level</span>
                                        <span class="text-red-500 font-bold" id="stress-val">4</span>
                                    </label>
                                    <input type="range" id="stress" min="1" max="10" value="4" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" oninput="document.getElementById('stress-val').innerText = this.value">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Sleep Hours</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="ph ph-moon-stars text-gray-400"></i>
                                        </div>
                                        <input type="number" id="sleep" step="0.5" min="0" max="24" required placeholder="8" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium">
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg mt-6 flex items-center justify-center">
                                <i class="ph ph-check-circle text-lg mr-2"></i>
                                Save Entry
                            </button>
                        </form>
                        <div id="tracker-msg" class="mt-4 text-sm font-semibold text-center hidden py-3 rounded-xl"></div>
                    </div>
                </div>
            `;

            document.getElementById('tracker-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                const msg = document.getElementById('tracker-msg');
                btn.disabled = true;
                btn.innerHTML = '<i class="ph ph-spinner animate-spin text-lg mr-2"></i> Saving...';
                msg.classList.add('hidden');

                try {
                    await API.createTrackerEntry({
                        mood_score: parseInt(document.getElementById('mood').value),
                        stress_level: parseInt(document.getElementById('stress').value),
                        sleep_hours: parseFloat(document.getElementById('sleep').value)
                    });
                    
                    msg.textContent = 'Entry saved successfully!';
                    msg.className = 'mt-4 text-sm font-semibold text-center py-3 rounded-xl bg-green-50 text-green-600 block slide-up';
                    
                    setTimeout(() => renderHome(container), 1500);
                } catch (err) {
                    msg.textContent = err.detail || 'Failed to save entry.';
                    msg.className = 'mt-4 text-sm font-semibold text-center py-3 rounded-xl bg-red-50 text-red-500 block slide-up';
                    btn.disabled = false;
                    btn.innerHTML = '<i class="ph ph-check-circle text-lg mr-2"></i> Save Entry';
                }
            });

        } else {
            // Psychologist Dashboard
            const analytics = await API.getPsychologistAnalytics();
            const psychologistAnalytics = {
                total_patients: analytics?.total_patients ?? '--',
                active_patients: analytics?.active_patients ?? '--',
                pending_requests: analytics?.pending_requests ?? 0,
                upcoming_meetings: analytics?.upcoming_meetings ?? '--'
            };
            
            contentDiv.innerHTML = `
                <!-- Metrics Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 50ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-violet-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-users text-violet-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Total Patients</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${psychologistAnalytics.total_patients}</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 100ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-green-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-activity text-green-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Active Patients</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${psychologistAnalytics.active_patients}</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up relative overflow-hidden flex flex-col justify-between h-full" style="animation-delay: 150ms;">
                        ${psychologistAnalytics.pending_requests > 0 ? '<div class="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>' : ''}
                        <div class="flex items-center gap-3 mb-4 relative z-10">
                            <div class="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-user-plus text-orange-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Pending Requests</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto relative z-10">
                            <span class="text-4xl font-bold ${psychologistAnalytics.pending_requests > 0 ? 'text-orange-600' : 'text-gray-800'} leading-none">${psychologistAnalytics.pending_requests}</span>
                        </div>
                    </div>

                    <div class="glass p-6 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col justify-between h-full" style="animation-delay: 200ms;">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-2xl flex-shrink-0">
                                <i class="ph ph-calendar-check text-blue-500 text-2xl"></i>
                            </div>
                            <h3 class="text-gray-500 text-sm font-semibold">Upcoming Meetings</h3>
                        </div>
                        <div class="flex items-end space-x-1 mt-auto">
                            <span class="text-4xl font-bold text-gray-800 leading-none">${psychologistAnalytics.upcoming_meetings}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Action Area -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Quick Actions -->
                    <div class="glass p-8 rounded-3xl border border-white/60 shadow-premium slide-up flex flex-col h-full" style="animation-delay: 250ms;">
                        <h2 class="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                        <div class="space-y-4 flex-1">
                            <a href="#/meetings" class="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-violet-200 hover:shadow-md transition-all group">
                                <div class="flex items-center">
                                    <div class="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-violet-100 transition-colors">
                                        <i class="ph ph-video-camera text-violet-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-gray-800">Manage Meetings</h3>
                                        <p class="text-sm font-medium text-gray-500">View and start scheduled sessions</p>
                                    </div>
                                </div>
                                <i class="ph ph-caret-right text-gray-400 group-hover:text-violet-500"></i>
                            </a>

                            <a href="#/profile" class="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-violet-200 hover:shadow-md transition-all group">
                                <div class="flex items-center">
                                    <div class="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-violet-100 transition-colors">
                                        <i class="ph ph-identification-card text-violet-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-gray-800">Update Profile</h3>
                                        <p class="text-sm font-medium text-gray-500">Keep your practice details current</p>
                                    </div>
                                </div>
                                <i class="ph ph-caret-right text-gray-400 group-hover:text-violet-500"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Welcome / Tip -->
                    <div class="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-3xl shadow-premium text-white relative overflow-hidden slide-up flex flex-col justify-center h-full" style="animation-delay: 300ms;">
                        <div class="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                            <i class="ph ph-flower-lotus text-[16rem]"></i>
                        </div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                                <i class="ph ph-lightbulb text-white text-3xl"></i>
                            </div>
                            <h2 class="text-2xl font-bold mb-4">Empowering Mental Health</h2>
                            <p class="text-violet-100 font-medium leading-relaxed mb-6 text-lg max-w-sm">
                                "The most beautiful people we have known are those who have known defeat, known suffering, known struggle, and have found their way out of the depths."
                            </p>
                            <div class="text-sm text-violet-200 font-bold uppercase tracking-wider">
                                — Elisabeth Kübler-Ross
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        contentDiv.innerHTML = `
            <div class="glass p-8 rounded-3xl border border-red-100 bg-red-50 text-center max-w-lg mx-auto">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 text-red-500 mb-4">
                    <i class="ph ph-warning text-3xl"></i>
                </div>
                <h3 class="text-red-800 font-bold text-xl mb-2">Failed to load dashboard data</h3>
                <p class="text-red-600 font-medium">${err.message}</p>
                <button onclick="renderHome(document.getElementById('main-content'))" class="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md">Try Again</button>
            </div>
        `;
    }
}
