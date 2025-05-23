// API configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'https://esc-backend.onrender.com/api';  // Production backend URL - change this to your actual deployed backend URL

// Shared state management
const sharedState = {
    // User authentication state
    isAuthenticated: false,
    token: localStorage.getItem('token') || null,
    user: null,

    // Cart state
    cart: [],

    // Initialize state from localStorage
    init() {
        console.log("Init called, checking auth state");
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
            this.isAuthenticated = true;
            console.log("User authenticated:", this.user);
        } else {
            console.log("No user data found, not authenticated");
        }

        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        
        // Update UI elements
        this.updateUI();
        
        // Set up navigation handlers
        this.setupNavigationHandlers();
        
        // Show login reminder if user is not authenticated and reminder hasn't been shown recently
        if (!this.isAuthenticated && !sessionStorage.getItem('loginReminderShown')) {
            setTimeout(() => {
                this.showNotification('Please login to access your profile and orders', {
                    showLoginButton: true,
                    duration: 5000
                });
                sessionStorage.setItem('loginReminderShown', 'true');
            }, 2000);
        }
    },

    // Set up navigation handlers
    setupNavigationHandlers() {
        // Handle cart button click
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToCart();
            });
        }

        // Handle login/logout button click
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    this.logout();
                } else {
                    this.navigateToLogin();
                }
            });
        }
    },

    // Navigate to cart page
    navigateToCart() {
        // Save current page for potential "continue shopping" action
        localStorage.setItem('previousPage', window.location.pathname);
        window.location.href = 'cart.html';
    },

    // Navigate to login page
    navigateToLogin() {
        // Save current page to redirect back after login
        localStorage.setItem('loginRedirect', window.location.pathname);
        // Check if this is coming from checkout page
        const isCheckout = window.location.pathname.includes('checkout.html');
        if (isCheckout) {
            window.location.href = 'login.html?checkout=true';
        } else {
            window.location.href = 'login.html';
        }
    },

    // Update UI elements based on current state
    updateUI() {
        console.log("UpdateUI called, isAuthenticated:", this.isAuthenticated);
        
        // Update cart count in header and all cart buttons
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update all cart buttons (both header and mobile menu)
        const cartButtons = document.querySelectorAll('.cart-btn');
        cartButtons.forEach(button => {
            // Create or get existing cart count element
            let countElement = button.querySelector('.cart-count');
            if (!countElement) {
                countElement = document.createElement('span');
                countElement.className = 'cart-count';
                button.appendChild(countElement);
            }
            
            // Update the count
            countElement.textContent = totalItems;
            
            // Update button text without removing the count element
            if (button.closest('.mobile-nav-buttons')) {
                button.childNodes[0].textContent = `Cart ${totalItems}`;
            } else {
                button.childNodes[0].textContent = 'Cart';
            }
        });

        // Update cart button active state
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            if (window.location.pathname.includes('cart.html')) {
                cartBtn.classList.add('active');
            } else {
                cartBtn.classList.remove('active');
            }
        }

        // Update login/logout button
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = this.isAuthenticated ? 'Logout' : 'Login';
        }

        // PROFILE ICON AND DROPDOWN HANDLING
        this.updateProfileUI();

        // Update checkout button state
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            // Remove any existing event listeners by cloning the node
            const newCheckoutBtn = checkoutBtn.cloneNode(true);
            checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);
            
            if (!this.isAuthenticated) {
                newCheckoutBtn.textContent = 'Login to Checkout';
                newCheckoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToLogin();
                });
            } else {
                newCheckoutBtn.textContent = 'Proceed to Checkout';
                newCheckoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'checkout.html';
                });
            }
        }

        // Update cart display if on cart page
        if (window.location.pathname.includes('cart.html')) {
            this.updateCartPage();
        }
    },
    
    // Update profile icon and dropdown
    updateProfileUI() {
        console.log("Updating profile UI, isAuthenticated:", this.isAuthenticated);
        
        // Get right section of header
        const rightSection = document.querySelector('.right-section');
        if (!rightSection) return;
        
        // Clean up old elements
        const oldProfileIcon = document.querySelector('.profile-icon');
        if (oldProfileIcon) oldProfileIcon.remove();
        
        const oldDropdown = document.querySelector('.profile-dropdown');
        if (oldDropdown) oldDropdown.remove();
        
        const oldLoginBtn = rightSection.querySelector('.login-btn');
        if (oldLoginBtn) oldLoginBtn.remove();
        
        // Create profile icon
        const profileIcon = document.createElement('a');
        profileIcon.href = '#';
        profileIcon.className = 'profile-icon';
        profileIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'profile-dropdown';
        
        // Set dropdown content based on auth status
        if (this.isAuthenticated) {
            // Check if user has admin role
            const isAdmin = this.user && this.user.role === 'admin';
            
            dropdown.innerHTML = `
                <div class="profile-dropdown-header">
                    <span class="welcome-text">Hello, ${this.user?.name || 'User'}</span>
                </div>
                <ul class="profile-menu">
                    ${isAdmin ? '<li><a href="admin/products.html" class="admin-link">Admin Dashboard</a></li>' : ''}
                    <li><a href="profile.html">My Profile</a></li>
                    <li><a href="orders.html">My Orders</a></li>
                    <li><a href="#" class="logout-link">Logout</a></li>
                </ul>
            `;
        } else {
            dropdown.innerHTML = `
                <div class="profile-dropdown-header">
                    <span class="welcome-text">Hello, Guest</span>
                </div>
                <ul class="profile-menu">
                    <li><a href="login.html" class="login-link">Login</a></li>
                    <li><a href="signup.html">Create Account</a></li>
                </ul>
            `;
            
            // Create login button (only for non-authenticated users)
            const loginBtn = document.createElement('a');
            loginBtn.href = 'login.html';
            loginBtn.className = 'login-btn';
            loginBtn.textContent = 'Login';
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToLogin();
            });
            rightSection.appendChild(loginBtn);
        }
        
        // Add profile icon to right section
        rightSection.appendChild(profileIcon);
        
        // Add dropdown to body
        document.body.appendChild(dropdown);
        
        // Add click event to profile icon - toggle dropdown if authenticated, redirect to login if not
        profileIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.isAuthenticated) {
                // If user is logged in, toggle the dropdown menu
                console.log("Profile icon clicked - showing dropdown menu");
                dropdown.classList.toggle('active');
            } else {
                // If user is not logged in, redirect to login page
                console.log("Profile icon clicked - redirecting to login");
                window.location.href = 'login.html';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdown.classList.contains('active') && 
                !dropdown.contains(e.target) && 
                !profileIcon.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Add event listener for logout link
        if (this.isAuthenticated) {
            const logoutLink = dropdown.querySelector('.logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }
        
        // Update mobile menu profile links
        this.updateMobileProfileLinks();
    },
    
    // Update mobile menu profile links
    updateMobileProfileLinks() {
        const mobileNavButtons = document.querySelector('.mobile-nav-buttons');
        if (!mobileNavButtons) return;
        
        // Remove any existing profile links
        const oldMobileLinks = mobileNavButtons.querySelector('.mobile-profile-links');
        if (oldMobileLinks) oldMobileLinks.remove();
        
        // Create new profile links section
        const profileLinks = document.createElement('div');
        profileLinks.className = 'mobile-profile-links';
        
        // Set content based on auth status
        if (this.isAuthenticated) {
            // Check if user has admin role
            const isAdmin = this.user && this.user.role === 'admin';
            
            profileLinks.innerHTML = `
                <div class="mobile-welcome">Hello, ${this.user?.name || 'User'}</div>
                ${isAdmin ? '<a href="admin/products.html" class="mobile-profile-link">Admin Dashboard</a>' : ''}
                <a href="profile.html" class="mobile-profile-link">My Profile</a>
                <a href="orders.html" class="mobile-profile-link">My Orders</a>
            `;
            
            // Update the login button to be a logout button
            let loginBtn = mobileNavButtons.querySelector('.login-btn');
            if (loginBtn) {
                loginBtn.textContent = 'Logout';
                loginBtn.href = '#';
                
                // Remove any existing event listeners by cloning the node
                const newLoginBtn = loginBtn.cloneNode(true);
                mobileNavButtons.replaceChild(newLoginBtn, loginBtn);
                loginBtn = newLoginBtn;
                
                // Add logout functionality
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            } else {
                // Create logout button if it doesn't exist
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'login-btn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
                mobileNavButtons.appendChild(logoutBtn);
            }
        } else {
            profileLinks.innerHTML = `
                <div class="mobile-welcome">Hello, Guest</div>
                <a href="login.html" class="mobile-profile-link">Login</a>
                <a href="signup.html" class="mobile-profile-link">Create Account</a>
            `;
            
            // Ensure login button exists
            let loginBtn = mobileNavButtons.querySelector('.login-btn');
            if (!loginBtn) {
                loginBtn = document.createElement('a');
                loginBtn.className = 'login-btn';
                mobileNavButtons.appendChild(loginBtn);
            } else {
                // Remove any existing event listeners by cloning the node
                const newLoginBtn = loginBtn.cloneNode(false); // false to not clone event listeners
                mobileNavButtons.replaceChild(newLoginBtn, loginBtn);
                loginBtn = newLoginBtn;
            }
            
            // Update login button with correct navigation
            loginBtn.textContent = 'Login';
            loginBtn.href = '#'; // Use # to prevent default navigation
            
            // Add event listener for proper navigation
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToLogin(); // Use the shared navigation function
            });
        }
        
        mobileNavButtons.appendChild(profileLinks);
    },

    // Login user
    login(userData) {
        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(userData));
        this.updateUI();
        
        // Redirect to saved page or home
        const redirectTo = localStorage.getItem('loginRedirect') || 'index.html';
        localStorage.removeItem('loginRedirect');
        window.location.href = redirectTo;
    },

    // Logout user
    logout() {
        // Clear all authentication data
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('loginRedirect');
        
        // Show logout notification
        this.showNotification('You have been logged out successfully');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    },

    // Get cart items
    getCart() {
        return this.cart;
    },

    // Add item to cart
    addToCart(item) {
        const existingItem = this.cart.find(cartItem => 
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
        
        // Save cart and update UI
        this.saveCart();
        this.updateUI();
        this.showNotification('Item added to cart!');
    },

    // Update cart item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.updateUI();
        }
    },

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateUI();
        this.showNotification('Item removed from cart');
    },

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    // Update cart display
    updateCartPage() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="cart-empty">
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <a href="collections.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            // Reset summary amounts
            document.querySelector('.subtotal-amount').textContent = 'EGP 0.00';
            document.querySelector('.tax-amount').textContent = 'EGP 0.00';
            document.querySelector('.total-amount').textContent = 'EGP 0.00';
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-size">Size: ${item.size}</p>
                    <p class="item-color">Color: ${item.color}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="sharedState.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="sharedState.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <p class="item-price">EGP ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="sharedState.removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');

        // Update totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        document.querySelector('.subtotal-amount').textContent = `EGP ${subtotal.toFixed(2)}`;
        document.querySelector('.tax-amount').textContent = `EGP ${tax.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `EGP ${total.toFixed(2)}`;
        
        // Show login prompt if user is not authenticated
        const checkoutSection = document.querySelector('.cart-summary');
        if (checkoutSection && !this.isAuthenticated) {
            // Check if login prompt already exists
            let loginPrompt = checkoutSection.querySelector('.login-prompt');
            if (!loginPrompt) {
                loginPrompt = document.createElement('div');
                loginPrompt.className = 'login-prompt';
                loginPrompt.innerHTML = `
                    <div class="login-prompt-message">
                        <p>Please login to complete your purchase</p>
                        <a href="login.html" class="login-prompt-btn">Login Now</a>
                    </div>
                `;
                // Insert before checkout button
                const checkoutBtn = checkoutSection.querySelector('.checkout-btn');
                if (checkoutBtn) {
                    checkoutSection.insertBefore(loginPrompt, checkoutBtn);
                } else {
                    checkoutSection.appendChild(loginPrompt);
                }
            }
        }
    },

    // Show notification
    showNotification(message, options = {}) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Check if we should add a login button
        if (options.showLoginButton) {
            notification.innerHTML = `
                <div class="notification-content">
                    <span>${message}</span>
                    <a href="login.html" class="notification-login-btn">Login</a>
                </div>
            `;
        } else {
            notification.textContent = message;
        }
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, options.duration || 3000);
    },

    // Clear specific items from cart
    clearCartItems() {
        // Clear the cart array
        this.cart = [];
        // Save empty cart to localStorage
        this.saveCart();
        // Update UI
        this.updateUI();
        // Show notification
        this.showNotification('Cart has been cleared');
    },

    updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `EGP ${this.getCartTotal().toFixed(2)}`;
        }
    }
};

// Check if token exists and is valid
if (sharedState.token) {
    sharedState.isAuthenticated = true;
}

// Export for use in other modules
window.sharedState = sharedState;

// Initialize shared state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    sharedState.init();
}); 