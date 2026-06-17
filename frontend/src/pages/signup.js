function renderSignup(container) {
    let currentRole = 'patient'; // Default role

    const renderForm = () => {
        const themeColor = currentRole === 'patient' ? 'text-blue-600' : 'text-violet-600';
        const bgTheme = currentRole === 'patient' ? 'bg-blue-600' : 'bg-violet-600';
        const hoverBg = currentRole === 'patient' ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
        const ringTheme = currentRole === 'patient' ? 'focus:ring-blue-500' : 'focus:ring-violet-500';

        container.innerHTML = `
            <div class="min-h-screen flex w-full items-center justify-center fade-in font-sans py-10">
                <!-- Left Side: Branding & Illustration (Hidden on Mobile) -->
                <div class="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br ${currentRole === 'patient' ? 'from-blue-50 to-blue-100' : 'from-violet-50 to-violet-100'} justify-center items-center transition-colors duration-500">
                    <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    
                    <!-- Floating Orbs -->
                    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div class="absolute top-1/3 right-1/4 w-64 h-64 ${currentRole === 'patient' ? 'bg-blue-200' : 'bg-violet-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 transition-colors duration-500"></div>

                    <div class="relative z-10 flex flex-col items-center text-center px-12 slide-up">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br ${currentRole === 'patient' ? 'from-blue-400 to-blue-600' : 'from-violet-400 to-violet-600'} mb-8 shadow-premium flex items-center justify-center transition-colors duration-500">
                            <i class="ph ph-heartbeat text-white text-4xl"></i>
                        </div>
                        <h1 class="text-4xl font-bold text-gray-800 tracking-tight mb-4">Join MindCare</h1>
                        <p class="text-xl text-gray-600 max-w-md leading-relaxed font-medium">"Taking the first step is often the hardest. We are here to support you."</p>
                    </div>
                </div>

                <!-- Right Side: Signup Form -->
                <div class="w-full lg:w-1/2 flex items-center justify-center bg-white relative">
                    <div class="w-full max-w-2xl px-8 py-10 lg:px-12 glass rounded-2xl shadow-premium m-4 lg:m-0 border border-gray-100 relative z-10 slide-up" style="animation-delay: 100ms;">
                        
                        <div class="text-center mb-8">
                            <h2 class="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Create an Account</h2>
                            <p class="text-gray-500 font-medium">Please enter your details to register.</p>
                        </div>

                        <!-- Role Toggle -->
                        <div class="flex bg-gray-100 p-1 rounded-xl mb-6 relative">
                            <button id="toggle-patient" class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${currentRole === 'patient' ? 'text-blue-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}">User</button>
                            <button id="toggle-psych" class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${currentRole === 'psychologist' ? 'text-violet-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}">Psychologist</button>
                        </div>

                        <form id="signup-form" class="space-y-4">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex-1">
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="ph ph-user text-gray-400 text-lg"></i>
                                        </div>
                                        <input type="text" id="first_name" required placeholder="John" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                                    <input type="text" id="last_name" required placeholder="Doe" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-envelope-simple text-gray-400 text-lg"></i>
                                    </div>
                                    <input type="email" id="email" required placeholder="you@example.com" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-lock text-gray-400 text-lg"></i>
                                    </div>
                                    <input type="password" id="password" required placeholder="••••••••" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>

                            ${currentRole === 'psychologist' ? `
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="ph ph-star text-gray-400 text-lg"></i>
                                    </div>
                                    <input type="text" id="specialization" placeholder="e.g. Cognitive Behavioral Therapy" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ringTheme} focus:border-transparent transition-all outline-none font-medium">
                                </div>
                            </div>
                            ` : ''}

                            <button type="submit" class="w-full ${bgTheme} ${hoverBg} text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg mt-6 hover-scale">
                                Create Account
                            </button>
                        </form>
                        
                        <div id="signup-error" class="mt-4 text-sm text-red-500 text-center font-medium hidden bg-red-50 py-2 rounded-lg"></div>

                        <div class="mt-8 text-center">
                            <p class="text-sm text-gray-600 font-medium">
                                Already have an account? 
                                <a href="#/login" class="font-bold ${themeColor} hover:underline ml-1">Log in here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('toggle-patient').addEventListener('click', () => {
            if (currentRole !== 'patient') {
                currentRole = 'patient';
                renderForm();
            }
        });

        document.getElementById('toggle-psych').addEventListener('click', () => {
            if (currentRole !== 'psychologist') {
                currentRole = 'psychologist';
                renderForm();
            }
        });

        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const errDiv = document.getElementById('signup-error');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i>';
            errDiv.classList.add('hidden');

            try {
                const registrationPayload = {
                    email: document.getElementById('email').value,
                    first_name: document.getElementById('first_name').value,
                    last_name: document.getElementById('last_name').value,
                    password: document.getElementById('password').value,
                    role: currentRole
                };

                let specValue = null;
                if (currentRole === 'psychologist') {
                    specValue = document.getElementById('specialization').value;
                    registrationPayload.specialization = specValue;
                }

                await ApiService.register(registrationPayload);
                
                // Auto Login
                const data = await ApiService.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
                Store.setToken(data.access_token);
                let user = await ApiService.getMe();

                // Safely ensure specialization is saved even if the backend schema ignored it during registration
                if (currentRole === 'psychologist' && specValue && !user.specialization) {
                    try {
                        user = await ApiService.updateProfile({
                            first_name: user.first_name,
                            last_name: user.last_name,
                            phone_number: user.phone_number || '',
                            bio: user.bio || '',
                            specialization: specValue
                        });
                    } catch (err) {
                        console.warn("Could not save initial specialization:", err);
                    }
                }

                Store.setUser(user);
                
                window.location.hash = '#/home';
            } catch (error) {
                errDiv.textContent = error.message || "Registration failed";
                errDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerText = 'Create Account';
            }
        });
    };

    renderForm();
}
