// Remove import and use direct fetch calls to Flask backend
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Check for checkout redirect parameter and force login parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isCheckout = urlParams.get('checkout') === 'true';
    const forceLogin = urlParams.get('force_login') === 'true';
    
    // Display checkout message if needed
    if (isCheckout && errorMessage) {
        errorMessage.textContent = 'Please log in to complete your checkout';
        errorMessage.style.display = 'block';
        errorMessage.style.backgroundColor = '#fdf2f2';
        errorMessage.style.padding = '10px';
        errorMessage.style.border = '1px solid #f8d7da';
        errorMessage.style.borderRadius = '4px';
        errorMessage.style.color = '#721c24';
    }
    
    // Check if user is already logged in and not forcing login
    const token = localStorage.getItem('token');
    if (token && !forceLogin) {
        // If coming from checkout, redirect back to checkout
        if (isCheckout) {
            window.location.href = 'checkout.html';
        } else {
            // Check if user is admin to redirect to admin page
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    window.location.href = 'admin/products.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        }
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            try {
                // Send login request to Node.js backend
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.msg || 'Login failed');
                }
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Remember user if checkbox checked
                if (remember) {
                    localStorage.setItem('rememberedUser', JSON.stringify({ email }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Redirect based on user role
                if (isCheckout) {
                    window.location.href = 'checkout.html';
                } else if (data.user && data.user.role === 'admin') {
                    window.location.href = 'admin/products.html';
                } else {
                    const redirectUrl = localStorage.getItem('loginRedirect') || 'index.html';
                    localStorage.removeItem('loginRedirect');
                    window.location.href = redirectUrl;
                }
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }

            try {
                // Send register request to Node.js backend
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        password,
                        role: 'user' // Default role for new users
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.msg || 'Registration failed');
                }
                
                alert('Registration successful! You can now log in.');
                window.location.href = 'login.html';
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        });
    }

    // Check for remembered user
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser.email;
        document.getElementById('remember').checked = true;
    }

    // Forgot password handling
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (email) {
                localStorage.setItem('resetEmail', email);
            }
            window.location.href = 'forgot-password.html';
        });
    }
}); 