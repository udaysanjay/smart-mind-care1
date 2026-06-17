async function renderMeetings(container) {
    const user = Store.getUser();
    if (!user) {
        container.innerHTML = `
            <div class="flex items-center justify-center h-64">
                <div class="glass p-8 rounded-2xl border border-gray-100 bg-gray-50 text-center">
                    <i class="ph ph-lock-key text-3xl text-gray-400 mb-2"></i>
                    <h3 class="text-gray-800 font-bold">Authentication Required</h3>
                    <p class="text-gray-500 text-sm">Please log in to view your meetings.</p>
                </div>
            </div>`;
        return;
    }

    const isPatient = user.role === 'patient';
    const themeColor = isPatient ? 'text-blue-600' : 'text-violet-600';
    const bgTheme = isPatient ? 'bg-blue-600' : 'bg-violet-600';
    const hoverBg = isPatient ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
    const lightBg = isPatient ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700';
    const ringTheme = isPatient ? 'focus:ring-blue-500' : 'focus:ring-violet-500';

    container.innerHTML = `
        <div class="fade-in pb-12 flex flex-col gap-8">
            <!-- Header Section -->
            <div class="mb-2">
                <h1 class="text-3xl font-bold text-gray-800 tracking-tight mb-2">Appointments & Meetings</h1>
                <p class="text-gray-500 font-medium">Manage your scheduled sessions and connection requests.</p>
            </div>
            
            ${!isPatient ? `
                <div id="incoming-requests-section" class="mb-12 hidden slide-up" style="animation-delay: 50ms;">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-gray-800 flex items-center">
                            <i class="ph ph-bell-ringing text-orange-500 mr-2 text-2xl"></i>
                            Incoming Requests
                        </h2>
                        <span id="request-count" class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">0</span>
                    </div>
                    <div id="incoming-requests-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                </div>
            ` : ''}

            <div>
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center slide-up" style="animation-delay: 100ms;">
                    <i class="ph ph-calendar-check ${themeColor} mr-2 text-2xl"></i>
                    Your Meetings
                </h2>
                <div id="meetings-list" class="space-y-4 slide-up" style="animation-delay: 150ms;">
                    <div class="shimmer h-24 rounded-2xl w-full"></div>
                    <div class="shimmer h-24 rounded-2xl w-full"></div>
                    <div class="shimmer h-24 rounded-2xl w-full"></div>
                </div>
            </div>
        </div>
    `;

    const loadData = async () => {
        try {
            // Load Incoming Requests if psychologist
            if (!isPatient) {
                const requests = await ApiService.getRequests('psychologist', user.id);
                const pendingRequests = requests.filter(r => r.status === 'pending');
                
                const requestsSection = document.getElementById('incoming-requests-section');
                const requestsList = document.getElementById('incoming-requests-list');
                const reqCount = document.getElementById('request-count');
                
                if (pendingRequests.length > 0) {
                    requestsSection.classList.remove('hidden');
                    reqCount.textContent = pendingRequests.length;
                    requestsList.innerHTML = '';
                    
                    pendingRequests.forEach(req => {
                        const date = new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        const div = document.createElement('div');
                        div.className = 'glass p-5 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-between h-full card-equal';
                        
                        div.innerHTML = `
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-bold text-gray-800">User ID: ${req.patient_id}</h3>
                                    <p class="text-xs text-gray-500 font-medium flex items-center mt-1">
                                        <i class="ph ph-clock mr-1"></i> Requested on ${date}
                                    </p>
                                </div>
                                <div class="p-2 bg-orange-50 rounded-lg text-orange-500">
                                    <i class="ph ph-user-plus text-xl"></i>
                                </div>
                            </div>
                            <div class="flex space-x-2 mt-auto pt-4 border-t border-gray-100">
                                <button class="accept-btn flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-xl transition-colors border border-green-200" data-id="${req.id}">
                                    Accept
                                </button>
                                <button class="reject-btn flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-colors border border-red-200" data-id="${req.id}">
                                    Decline
                                </button>
                            </div>
                        `;
                        requestsList.appendChild(div);
                    });

                    // Attach handlers
                    document.querySelectorAll('.accept-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.currentTarget.innerHTML = '<i class="ph ph-spinner animate-spin"></i>';
                            await ApiService.acceptRequest(e.currentTarget.dataset.id);
                            loadData(); 
                        });
                    });
                    document.querySelectorAll('.reject-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.currentTarget.innerHTML = '<i class="ph ph-spinner animate-spin"></i>';
                            await ApiService.rejectRequest(e.currentTarget.dataset.id);
                            loadData();
                        });
                    });
                } else {
                    requestsSection.classList.add('hidden');
                }
            }

            // Load Meetings
            const meetings = await ApiService.getMeetings();
            const meetingsList = document.getElementById('meetings-list');
            
            if (meetings.length === 0) {
                meetingsList.innerHTML = `
                    <div class="glass p-10 rounded-3xl border border-gray-100 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                            <i class="ph ph-calendar-blank text-3xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 mb-2">No meetings found</h3>
                        <p class="text-gray-500 font-medium max-w-sm mx-auto">You don't have any upcoming or past meetings. ${isPatient ? 'Browse the directory to connect with a professional.' : ''}</p>
                    </div>`;
                return;
            }

            meetingsList.innerHTML = '';
            meetings.forEach(m => {
                const div = document.createElement('div');
                div.className = 'glass p-6 rounded-2xl border border-white/60 shadow-premium transition-all hover:shadow-lg relative overflow-hidden h-full card-equal';
                
                let statusColor = 'bg-gray-100 text-gray-700 border-gray-200';
                let statusIcon = 'ph-clock-countdown';
                
                if (m.status === 'scheduled') {
                    statusColor = 'bg-blue-50 text-blue-700 border-blue-200';
                    statusIcon = 'ph-calendar-check';
                }
                if (m.status === 'completed') {
                    statusColor = 'bg-green-50 text-green-700 border-green-200';
                    statusIcon = 'ph-check-circle';
                }
                if (m.status === 'cancelled') {
                    statusColor = 'bg-red-50 text-red-700 border-red-200';
                    statusIcon = 'ph-x-circle';
                }

                let scheduleHtml = '';
                if (!isPatient && (m.status === 'pending' || m.status === 'scheduled')) {
                    const dtLocal = m.scheduled_time ? new Date(new Date(m.scheduled_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
                    scheduleHtml = `
                        <div class="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-3">
                            <div class="flex-1">
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">${m.status === 'scheduled' ? 'Reschedule Date & Time' : 'Set Date & Time'}</label>
                                <input type="datetime-local" id="time-${m.id}" value="${dtLocal}" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} outline-none font-medium">
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Meeting Link</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-link text-gray-400"></i>
                                    </div>
                                    <input type="text" id="link-${m.id}" placeholder="https://zoom.us/j/..." value="${m.meeting_link || ''}" class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} outline-none font-medium">
                                </div>
                            </div>
                            <div class="flex items-end">
                                <button class="schedule-btn w-full md:w-auto px-6 py-2.5 ${bgTheme} ${hoverBg} text-white font-semibold rounded-xl transition-all shadow-md" data-id="${m.id}">
                                    ${m.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
                                </button>
                            </div>
                        </div>
                    `;
                }

                let notesHtml = '';
                if (!isPatient && (m.status === 'scheduled' || m.status === 'completed')) {
                    notesHtml = `
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Session Notes (Private)</label>
                            <textarea id="notes-${m.id}" rows="3" placeholder="Enter clinical notes, patient progress, or next steps here..." class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none font-medium resize-y">${m.notes || ''}</textarea>
                            <div class="mt-3 flex justify-end items-center gap-3">
                                <span id="notes-msg-${m.id}" class="text-xs font-semibold hidden"></span>
                                <button class="save-notes-btn px-5 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold rounded-xl transition-colors text-sm flex items-center shadow-sm" data-id="${m.id}">
                                    <i class="ph ph-floppy-disk mr-2 text-lg"></i> Save Notes
                                </button>
                            </div>
                        </div>
                    `;
                }

                const scheduledDate = m.scheduled_time ? new Date(m.scheduled_time) : null;
                const dateDisplay = scheduledDate ? scheduledDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Not scheduled yet';
                const timeDisplay = scheduledDate ? scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';

                div.innerHTML = `
                    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
                        <div class="flex items-center">
                            <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                                <i class="ph ph-user ${themeColor} text-2xl"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-800 text-lg">Meeting with ${isPatient ? `Psychologist ID: ${m.psychologist_id}` : `User ID: ${m.patient_id}`}</h3>
                                <div class="flex items-center text-sm font-medium text-gray-500 mt-1">
                                    <i class="ph ph-calendar-blank mr-1.5"></i> ${dateDisplay} 
                                    ${timeDisplay ? `<span class="mx-2">•</span> <i class="ph ph-clock mr-1.5"></i> ${timeDisplay}` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <span class="inline-flex items-center px-3 py-1 rounded-full border ${statusColor} text-xs font-bold uppercase tracking-wider">
                                <i class="ph ${statusIcon} mr-1.5 text-sm"></i>
                                ${m.status}
                            </span>
                            ${m.meeting_link && m.status === 'scheduled' ? `
                                <a href="${m.meeting_link}" target="_blank" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center">
                                    <i class="ph ph-video-camera mr-2 text-lg"></i> Join
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    ${scheduleHtml}
                    ${notesHtml}
                `;
                meetingsList.appendChild(div);
            });

            // Attach schedule handlers
            document.querySelectorAll('.schedule-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const time = document.getElementById(`time-${id}`).value;
                    const link = document.getElementById(`link-${id}`).value;
                    
                    if (!time) {
                        alert("Please select a date and time.");
                        return;
                    }
                    
                    const originalHTML = e.currentTarget.innerHTML;
                    e.currentTarget.disabled = true;
                    e.currentTarget.innerHTML = '<i class="ph ph-spinner animate-spin"></i>';

                    try {
                        await ApiService.updateMeeting(id, {
                            status: 'scheduled',
                            scheduled_time: new Date(time).toISOString(),
                            meeting_link: link
                        });
                        loadData();
                    } catch (err) {
                        alert(err.message);
                        e.currentTarget.disabled = false;
                        e.currentTarget.innerHTML = originalHTML;
                    }
                });
            });

            // Attach notes handlers
            document.querySelectorAll('.save-notes-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const notes = document.getElementById(`notes-${id}`).value;
                    const msgDiv = document.getElementById(`notes-msg-${id}`);
                    
                    const originalHTML = e.currentTarget.innerHTML;
                    e.currentTarget.disabled = true;
                    e.currentTarget.innerHTML = '<i class="ph ph-spinner animate-spin text-lg mr-2"></i> Saving...';
                    msgDiv.classList.add('hidden');

                    try {
                        await ApiService.updateMeeting(id, { notes: notes });
                        msgDiv.textContent = 'Notes saved successfully!';
                        msgDiv.className = 'text-xs font-semibold text-green-600 block';
                    } catch (err) {
                        msgDiv.textContent = err.message || 'Failed to save notes';
                        msgDiv.className = 'text-xs font-semibold text-red-600 block';
                    } finally {
                        e.currentTarget.disabled = false;
                        e.currentTarget.innerHTML = originalHTML;
                        setTimeout(() => { msgDiv.classList.add('hidden'); }, 3000);
                    }
                });
            });

        } catch (error) {
            document.getElementById('meetings-list').innerHTML = `
                <div class="glass p-6 rounded-2xl border border-red-100 bg-red-50 text-center">
                    <i class="ph ph-warning text-2xl text-red-500 mb-2"></i>
                    <p class="text-red-600 font-medium">Failed to load meetings: ${error.message}</p>
                </div>
            `;
        }
    };

    loadData();
}
