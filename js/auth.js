document.addEventListener('DOMContentLoaded', () => {
    
    // Đăng ký
    const registerForm = document.getElementById('registerForm');
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name            = document.getElementById('regName').value.trim();
            const email           = document.getElementById('regEmail').value.trim();
            const phone           = document.getElementById('regPhone').value.trim();
            const password        = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;

            // Reset lỗi
            document.querySelectorAll('.err-msg').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            const globalErr = document.getElementById('regGlobalError');
            if (globalErr) globalErr.style.display = 'none';

            function showErr(errId, inputId) {
                const errEl = document.getElementById(errId);
                const inpEl = document.getElementById(inputId);
                if (errEl) errEl.style.display = 'flex';
                if (inpEl) inpEl.classList.add('input-error');
                isValid = false;
            }

            if (name === '') showErr('errRegName', 'regName');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) showErr('errRegEmail', 'regEmail');

            const phoneRegex = /^(0|\+84)[35789][0-9]{8}$/;
            if (!phoneRegex.test(phone)) showErr('errRegPhone', 'regPhone');

            if (password.length < 6) showErr('errRegPassword', 'regPassword');

            if (password !== passwordConfirm || passwordConfirm === '') showErr('errRegPasswordConfirm', 'regPasswordConfirm');

            // Kiểm tra terms checkbox
            const terms = document.getElementById('agreeTerms');
            if (terms && !terms.checked) {
                isValid = false;
                terms.style.outline = '2px solid #e53935';
                setTimeout(() => { terms.style.outline = ''; }, 2000);
                if (globalErr) {
                    globalErr.style.display = 'flex';
                    const msgEl = document.getElementById('regGlobalMsg');
                    if (msgEl) msgEl.textContent = 'Vui lòng đồng ý với điều khoản sử dụng!';
                }
            }

            if (isValid) {
                const btn = document.getElementById('registerBtn');
                if (btn) {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.85';
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo tài khoản...';
                }

                setTimeout(() => {
                    const users = JSON.parse(localStorage.getItem('techzone_users')) || [];

                    if (users.find(u => u.email === email || u.phone === phone)) {
                        if (btn) {
                            btn.style.pointerEvents = '';
                            btn.style.opacity = '';
                            btn.innerHTML = '<i class="fas fa-user-plus"></i> Đăng ký ngay';
                        }
                        if (globalErr) {
                            globalErr.style.display = 'flex';
                            const msgEl = document.getElementById('regGlobalMsg');
                            if (msgEl) msgEl.textContent = 'Email hoặc SĐT đã được đăng ký!';
                        }
                        document.getElementById('regEmail').classList.add('input-error');
                        document.getElementById('regPhone').classList.add('input-error');
                        return;
                    }

                    users.push({ name, email, phone, password, role: 'user' });
                    localStorage.setItem('techzone_users', JSON.stringify(users));

                    const modal = document.getElementById('regSuccessModal');
                    if (modal) modal.classList.add('show');
                }, 700);
            }
        });
    }

    // Đăng nhập
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Reset errors
            document.querySelectorAll('.err-msg').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            const globalErr = document.getElementById('loginGlobalError');
            if (globalErr) globalErr.style.display = 'none';

            const usernameInput = document.getElementById('loginUsername');
            const passwordInput = document.getElementById('loginPassword');
            
            if(username === '') {
                const err = document.getElementById('errLoginUsername');
                if (err) err.style.display = 'flex';
                usernameInput.classList.add('input-error');
                isValid = false;
            }
            if(password === '') {
                const err = document.getElementById('errLoginPassword');
                if (err) err.style.display = 'flex';
                passwordInput.classList.add('input-error');
                isValid = false;
            }
            
            if(isValid) {
                // Loading state
                const btn = document.getElementById('loginBtn');
                if (btn) {
                    btn.classList.add('loading');
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
                }

                // Đảm bảo luôn có tài khoản demo
                let users = JSON.parse(localStorage.getItem('techzone_users')) || [];
                if(!users.find(u => u.email === "admin@techzone.com")) {
                    users.push({name: "Admin", email: "admin@techzone.com", phone: "0999999999", password: "123456", role: "admin"});
                }
                if(!users.find(u => u.email === "user@techzone.com")) {
                    users.push({name: "Người dùng Demo", email: "user@techzone.com", phone: "0909090909", password: "123456", role: "user"});
                }
                localStorage.setItem('techzone_users', JSON.stringify(users));

                const user = users.find(u => (u.email === username || u.phone === username) && u.password === password);
                
                setTimeout(() => {
                    if(user) {
                        localStorage.setItem('currentUser', JSON.stringify({name: user.name, email: user.email, role: user.role, phone: user.phone}));
                        if(user.role === 'admin') {
                            window.location.href = "admin.html";
                        } else {
                            window.location.href = "index.html";
                        }
                    } else {
                        if (btn) {
                            btn.classList.remove('loading');
                            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
                        }
                        if (globalErr) globalErr.style.display = 'flex';
                        usernameInput.classList.add('input-error');
                        passwordInput.classList.add('input-error');
                    }
                }, 600);
            }
        });
    }
});
