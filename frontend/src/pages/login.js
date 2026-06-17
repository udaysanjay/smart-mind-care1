function renderLogin(container) {
    let currentRole = 'patient'; // Default role

    const renderForm = () => {
        const themeColor = currentRole === 'patient' ? 'text-blue-600' : 'text-violet-600';
        const bgTheme = currentRole === 'patient' ? 'bg-blue-600' : 'bg-violet-600';
        const hoverBg = currentRole === 'patient' ? 'hover:bg-blue-700' : 'hover:bg-violet-700';
        const ringTheme = currentRole === 'patient' ? 'focus:ring-blue-500' : 'focus:ring-violet-500';

        container.innerHTML = `
            <div class="min-h-[85vh] flex w-full items-center justify-center fade-in font-sans py-4 sm:py-10">
                <div class="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row relative z-10 slide-up">
                    
                    <!-- Left Side: Branding / Illustration -->
                    <div class="hidden lg:flex w-full lg:w-5/12 relative overflow-hidden bg-gradient-to-br ${currentRole === 'patient' ? 'from-blue-50 via-blue-100 to-blue-50' : 'from-violet-50 via-violet-100 to-violet-50'} flex-col justify-center items-center p-12 transition-colors duration-500">
                        <div class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        
                        <!-- Floating Orbs -->
                        <div class="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
                        <div class="absolute -bottom-20 -right-20 w-64 h-64 ${currentRole === 'patient' ? 'bg-blue-300' : 'bg-violet-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 transition-colors duration-500"></div>

                        <div class="relative z-10 flex flex-col items-center text-center">
                            <div class="w-24 h-24 rounded-[2rem] bg-gradient-to-br ${currentRole === 'patient' ? 'from-blue-500 to-blue-600' : 'from-violet-500 to-violet-600'} mb-8 shadow-xl flex items-center justify-center transition-colors duration-500 transform hover:scale-105">
                                <i class="ph ph-heartbeat text-white text-5xl"></i>
                            </div>
                            <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">MindCare</h1>
                            <p class="text-lg text-gray-600 leading-relaxed font-medium max-w-xs">Your sanctuary for mental wellness and professional care.</p>
                        </div>
                    </div>

                    <!-- Right Side: Login Form -->
                    <div class="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
                        <div class="mb-8 text-center sm:text-left">
                            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
                            <p class="text-gray-500 font-medium text-lg">Please enter your details to sign in.</p>
                        </div>

                        <!-- Role Toggles -->
                        <div class="flex p-1.5 bg-gray-50/80 rounded-2xl mb-8 border border-gray-100 shadow-inner">
                            <button id="toggle-user" class="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${currentRole === 'patient' ? 'bg-white text-blue-600 shadow-md border border-gray-200/60 transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}">
                                <i class="ph ph-user-heart text-lg"></i>
                                User
                            </button>
                            <button id="toggle-psych" class="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${currentRole === 'psychologist' ? 'bg-white text-violet-600 shadow-md border border-gray-200/60 transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}">
                                <i class="ph ph-stethoscope text-lg"></i>
                                Psychologist
                            </button>
                        </div>

                        <form id="login-form" class="space-y-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-gray-700">Email Address</label>
                                <div class="relative group">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:${themeColor}">
                                        <i class="ph ph-envelope-simple text-gray-400 group-focus-within:${themeColor} text-xl transition-colors"></i>
                                    </div>
                                    <input type="email" id="email" required placeholder="you@example.com" class="w-full pl-11 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 ${ringTheme} focus:ring-opacity-20 focus:border-${currentRole === 'patient' ? 'blue' : 'violet'}-500 transition-all outline-none font-semibold text-gray-800 placeholder-gray-400">
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <label class="block text-sm font-bold text-gray-700">Password</label>
                                    <a href="#" class="text-sm font-bold ${themeColor} hover:underline transition-colors">Forgot password?</a>
                                </div>
                                <div class="relative group">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:${themeColor}">
                                        <i class="ph ph-lock text-gray-400 group-focus-within:${themeColor} text-xl transition-colors"></i>
                                    </div>
                                    <input type="password" id="password" required placeholder="••••••••" class="w-full pl-11 pr-12 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 ${ringTheme} focus:ring-opacity-20 focus:border-${currentRole === 'patient' ? 'blue' : 'violet'}-500 transition-all outline-none font-semibold text-gray-800 tracking-wider placeholder-gray-400 placeholder:tracking-normal">
                                    <div class="absolute inset-y-0 right-0 pr-2 flex items-center">
                                        <button type="button" id="toggle-password" class="p-2 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none rounded-xl hover:bg-gray-200 active:bg-gray-300">
                                            <i class="ph ph-eye text-xl" id="eye-icon"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="w-full ${bgTheme} ${hoverBg} text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl mt-8 flex items-center justify-center gap-2 hover-scale text-lg">
                                Sign In
                                <i class="ph ph-arrow-right font-bold text-xl"></i>
                            </button>
                        </form>
                        
                        <div id="login-error" class="mt-6 text-sm text-red-600 text-center font-bold hidden bg-red-50 border border-red-100 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                            <i class="ph ph-warning-circle text-xl"></i>
                            <span id="login-error-text"></span>
                        </div>

                        <div class="mt-10 text-center">
                            <p class="text-gray-500 font-medium">
                                Don't have an account? 
                                <a href="#/signup" class="font-bold ${themeColor} hover:underline ml-1.5 transition-colors">Create Account</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('toggle-user').addEventListener('click', () => {
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

        // Password visibility toggle
        const passwordInput = document.getElementById('password');
        const togglePasswordBtn = document.getElementById('toggle-password');
        const eyeIcon = document.getElementById('eye-icon');

        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('ph-eye');
                eyeIcon.classList.add('ph-eye-slash');
                passwordInput.classList.remove('tracking-wider');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('ph-eye-slash');
                eyeIcon.classList.add('ph-eye');
                passwordInput.classList.add('tracking-wider');
            }
        });

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const errDiv = document.getElementById('login-error');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner animate-spin text-2xl"></i> Signing in...';
            errDiv.classList.add('hidden');

            try {
                const response = await ApiService.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
                
                Store.setToken(response.access_token);
                const user = await ApiService.getMe();
                Store.setUser(user);
                
                window.location.hash = '#/home';
            } catch (error) {
                console.error("Login attempt failed:", error); // Add this for better debugging
                document.getElementById('login-error-text').textContent = error.message || "Invalid credentials";
                errDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Sign In <i class="ph ph-arrow-right font-bold text-xl"></i>';
            }
        });
    };

    renderForm();
}
