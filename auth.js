// API configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'https://esc-backend.onrender.com/api';  // Production backend URL - change this to your actual deployed backend URL

// Display error message
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// Display success message
function showSuccess(message) {
    const successContainer = document.getElementById('success-message');
    successContainer.textContent = message;
    successContainer.style.display = 'block';

    // Hide success after 5 seconds
    setTimeout(() => {
        successContainer.style.display = 'none';
    }, 5000);
}

// Login handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        showError('Email and password are required');
        return;
    }
    
    // Show loading state
    const loginButton = document.querySelector('button[type="submit"]');
    const originalButtonText = loginButton.innerHTML;
    loginButton.disabled = true;
    loginButton.innerHTML = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        showSuccess('Login successful!');
        
        // Redirect based on role
        setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const isCheckout = params.get('checkout') === 'true';
            
            if (data.user.role === 'admin') {
                // Redirect admin to dashboard
                window.location.href = '/admin/dashboard.html';
            } else if (isCheckout) {
                // Redirect to checkout if coming from there
                window.location.href = '/checkout.html';
            } else {
                // Get redirect location or default to home
                const redirectUrl = localStorage.getItem('loginRedirect') || '/';
                window.location.href = redirectUrl;
            }
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.');
    } finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.innerHTML = originalButtonText;
    }
}

// Register handler
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!name || !email || !password) {
        showError('All fields are required');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    const registerButton = document.querySelector('button[type="submit"]');
    const originalButtonText = registerButton.innerHTML;
    registerButton.disabled = true;
    registerButton.innerHTML = 'Creating account...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.msg || 'Registration failed');
        }
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        showSuccess('Account created successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Registration failed. Please try again.');
    } finally {
        // Reset button state
        registerButton.disabled = false;
        registerButton.innerHTML = originalButtonText;
    }
}

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if login form exists on page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if register form exists on page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

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