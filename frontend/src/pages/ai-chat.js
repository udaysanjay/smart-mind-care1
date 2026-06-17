async function renderAiChat(container) {
    const user = Store.getUser();
    if (!user) {
        container.innerHTML = `
            <div class="flex items-center justify-center h-64">
                <div class="glass p-8 rounded-2xl border border-gray-100 bg-gray-50 text-center">
                    <i class="ph ph-lock-key text-3xl text-gray-400 mb-2"></i>
                    <h3 class="text-gray-800 font-bold">Authentication Required</h3>
                    <p class="text-gray-500 text-sm">Please log in to use the AI Assistant.</p>
                </div>
            </div>`;
        return;
    }

    const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000'
        : 'https://zx8sbvxk-8000.inc1.devtunnels.ms';
    const userAvatarUrl = user.avatar_url ? `${backendUrl}${user.avatar_url}` : null;
    const isPatient = user.role === 'patient';
    const themeColor = isPatient ? 'text-blue-600' : 'text-violet-600';
    const bgTheme = isPatient ? 'bg-blue-600' : 'bg-violet-600';
    const bgThemeHover = isPatient ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
    const lightBg = isPatient ? 'bg-blue-50' : 'bg-violet-50';
    const borderTheme = isPatient ? 'border-blue-200' : 'border-violet-200';
    const ringTheme = isPatient ? 'focus:ring-blue-500' : 'focus:ring-violet-500';

    container.innerHTML = `
        <div class="fade-in max-w-4xl mx-auto w-full h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] pb-20 lg:pb-0">
            <div class="glass shadow-premium rounded-3xl border border-white/60 h-full flex flex-col overflow-hidden relative slide-up">
                
                <!-- Background decoration -->
                <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${isPatient ? 'from-blue-100 to-white' : 'from-violet-100 to-white'} rounded-full mix-blend-multiply opacity-50 blur-3xl pointer-events-none -mr-32 -mt-32"></div>

                <!-- Header -->
                <div class="p-4 sm:p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md space-y-4 z-10">
                    <div class="flex justify-between items-center gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 rounded-2xl ${bgTheme} flex items-center justify-center shadow-md">
                                <i class="ph ph-robot text-white text-2xl"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-800 tracking-tight">MindCare AI</h2>
                                <div class="flex items-center text-xs font-semibold text-green-500 mt-0.5">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button id="clear-chat-btn" class="p-2 sm:px-4 sm:py-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors border border-gray-200 flex items-center shadow-sm">
                            <i class="ph ph-trash sm:mr-2 text-lg"></i>
                            <span class="hidden sm:inline font-semibold text-sm">Clear History</span>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-[1.3fr_auto] gap-4">
                        <div class="rounded-3xl bg-gray-50 p-4 border border-gray-100 shadow-sm">
                            <p class="text-sm text-gray-500 mb-1">Logged in as</p>
                            <p class="text-sm font-semibold text-gray-900">${user.first_name || user.email.split('@')[0]} • <span class="${themeColor}">${user.role === 'patient' ? 'User' : 'Psychologist'}</span></p>
                        </div>
                        <div class="rounded-3xl bg-white p-4 border border-gray-100 shadow-sm">
                            <p class="text-sm font-medium text-gray-600">MindCare is best for guided support, self-care tips, and session prep.</p>
                        </div>
                    </div>
                </div>

                <!-- Messages Area -->
                <div id="chat-messages-area" class="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col space-y-6 z-10 scrollbar-hide bg-white/30">
                    <!-- Messages injected here -->
                </div>

                <!-- Input Area -->
                <div class="p-4 sm:p-6 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-10">
                    <div id="chat-error-msg" class="text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-lg mb-3 hidden text-center"></div>
                    <div class="relative flex items-end shadow-sm rounded-2xl bg-white border border-gray-200 focus-within:ring-2 ${ringTheme} focus-within:border-transparent transition-all">
                        <textarea id="chat-input" placeholder="Type your message here..." rows="1" class="w-full max-h-32 p-4 bg-transparent resize-none outline-none font-medium text-gray-700 custom-scrollbar"></textarea>
                        <button id="chat-send-btn" class="m-2 p-3 ${bgTheme} ${bgThemeHover} text-white rounded-xl transition-transform hover:scale-105 shadow-md flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:hover:scale-100">
                            <i class="ph ph-paper-plane-tilt text-xl"></i>
                        </button>
                    </div>
                    <div class="text-center mt-2">
                        <span class="text-xs text-gray-400 font-medium">MindCare AI can make mistakes. Consider verifying important clinical or personal information.</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const messagesArea = document.getElementById('chat-messages-area');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const clearBtn = document.getElementById('clear-chat-btn');
    const errorMsg = document.getElementById('chat-error-msg');

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // UI Render Function
    const updateUI = () => {
        const state = chatState;
        
        // Handle Error
        if (state.error) {
            errorMsg.textContent = state.error;
            errorMsg.classList.remove('hidden');
        } else {
            errorMsg.classList.add('hidden');
        }

        // Render Messages or Empty State
        if (state.messages.length === 0 && !state.loading) {
            let promptsHtml = '';
            if (isPatient) {
                promptsHtml = `
                    <div class="flex flex-wrap justify-center gap-2 mt-6 max-w-lg mx-auto">
                        <button class="prompt-btn px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">I'm feeling stressed today</button>
                        <button class="prompt-btn px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">I have trouble sleeping</button>
                        <button class="prompt-btn px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">Guide me through a breathing exercise</button>
                        <button class="prompt-btn px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">How can I manage anxiety?</button>
                    </div>
                `;
            } else {
                promptsHtml = `
                    <div class="flex flex-wrap justify-center gap-2 mt-6 max-w-lg mx-auto">
                        <button class="prompt-btn px-4 py-2 bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">Help me prep for a CBT session</button>
                        <button class="prompt-btn px-4 py-2 bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">Draft a session summary template</button>
                        <button class="prompt-btn px-4 py-2 bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 font-medium text-sm rounded-full transition-all shadow-sm hover:shadow">Latest research on exposure therapy</button>
                    </div>
                `;
            }

            messagesArea.innerHTML = `
                <div class="flex-1 flex flex-col justify-center items-center text-center px-4 slide-up">
                    <div class="w-20 h-20 rounded-3xl ${bgTheme} flex items-center justify-center shadow-lg mb-6 rotate-3">
                        <i class="ph ph-robot text-white text-4xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2 tracking-tight">How can I help you today?</h3>
                    <p class="text-gray-500 font-medium max-w-md">Start a conversation or choose a suggested topic below to begin.</p>
                    ${promptsHtml}
                </div>
            `;

            // Attach prompt button listeners
            document.querySelectorAll('.prompt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    handleSend(btn.textContent);
                });
            });
        } else {
            messagesArea.innerHTML = state.messages.map(msg => {
                const isAI = msg.role === 'assistant';
                const formattedMessage = msg.message.replace(/\\n/g, '<br>');

                if (isAI) {
                    return `
                        <div class="flex items-start max-w-[85%] sm:max-w-[75%] slide-up" style="animation-duration: 0.3s;">
                            <div class="w-10 h-10 rounded-xl ${bgTheme} flex items-center justify-center shadow-md flex-shrink-0 mr-3">
                                <i class="ph ph-robot text-white text-xl"></i>
                            </div>
                            <div class="bg-white border border-gray-100 shadow-sm text-gray-700 p-4 rounded-2xl rounded-tl-sm text-sm sm:text-base font-medium leading-relaxed">
                                ${formattedMessage}
                            </div>
                        </div>
                    `;
                } else {
                    const avatarHtml = userAvatarUrl 
                        ? `<img src="${userAvatarUrl}" class="w-full h-full object-cover">` 
                        : `<i class="ph ph-user text-gray-400 text-xl"></i>`;

                    return `
                        <div class="flex items-start self-end max-w-[85%] sm:max-w-[75%] slide-up" style="animation-duration: 0.3s;">
                            <div class="${bgTheme} text-white shadow-md p-4 rounded-2xl rounded-tr-sm text-sm sm:text-base font-medium leading-relaxed">
                                ${formattedMessage}
                            </div>
                            <div class="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm flex-shrink-0 ml-3 overflow-hidden">
                                ${avatarHtml}
                            </div>
                        </div>
                    `;
                }
            }).join('');

            // Add typing indicator if loading
            if (state.loading) {
                messagesArea.innerHTML += `
                    <div class="flex items-start max-w-[85%] sm:max-w-[75%] slide-up">
                        <div class="w-10 h-10 rounded-xl ${bgTheme} flex items-center justify-center shadow-md flex-shrink-0 mr-3">
                            <i class="ph ph-robot text-white text-xl"></i>
                        </div>
                        <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl rounded-tl-sm flex items-center space-x-1.5 h-12">
                            <div class="w-2 h-2 rounded-full ${bgTheme} animate-bounce" style="animation-delay: 0ms;"></div>
                            <div class="w-2 h-2 rounded-full ${bgTheme} animate-bounce" style="animation-delay: 150ms;"></div>
                            <div class="w-2 h-2 rounded-full ${bgTheme} animate-bounce" style="animation-delay: 300ms;"></div>
                        </div>
                    </div>
                `;
            }
        }

        // Auto-scroll to bottom smoothly
        messagesArea.scrollTo({
            top: messagesArea.scrollHeight,
            behavior: 'smooth'
        });

        // Button State
        sendBtn.disabled = state.loading || !chatInput.value.trim();
        chatInput.disabled = state.loading;
    };

    // Enable/disable send button based on input
    chatInput.addEventListener('input', () => {
        sendBtn.disabled = !chatInput.value.trim() || chatState.loading;
    });

    // Subscribe to state changes
    chatState.subscribe(updateUI);

    // Initial Data Load
    try {
        const history = await ChatbotService.getHistory(user.id);
        chatState.setMessages(history);
    } catch (err) {
        chatState.setError('Could not load chat history.');
    }

    // Handle Send
    const handleSend = async (text) => {
        const trimmedText = text.trim();
        if (!trimmedText || chatState.loading) return;

        chatInput.value = '';
        chatInput.style.height = 'auto'; // reset height
        sendBtn.disabled = true;
        chatState.clearError();
        
        // Optimistically add user message
        chatState.addMessage({ role: 'user', message: trimmedText });
        chatState.setLoading(true);

        try {
            const res = await ChatbotService.sendMessage(trimmedText);
            chatState.addMessage({ role: 'assistant', message: res.response });
        } catch (err) {
            chatState.setError(err.message || 'Failed to get response. Please try again.');
        } finally {
            chatState.setLoading(false);
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                chatInput.focus();
            }
        }
    };

    sendBtn.addEventListener('click', () => handleSend(chatInput.value));
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(chatInput.value);
        }
    });

    clearBtn.addEventListener('click', async () => {
        if(confirm('Are you sure you want to clear your conversation history? This cannot be undone.')) {
            try {
                await ChatbotService.deleteHistory(user.id);
                chatState.setMessages([]);
            } catch (err) {
                alert(err.message);
            }
        }
    });
}
