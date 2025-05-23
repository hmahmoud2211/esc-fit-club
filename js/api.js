// Helper function to find available backend port
async function findBackendPort() {
    const ports = [5000, 5001, 5002, 5003, 5004];
    for (const port of ports) {
        try {
            const response = await fetch(`http://localhost:${port}/api/health`);
            if (response.ok) {
                return port;
            }
        } catch (error) {
            continue;
        }
    }
    throw new Error('Backend server not found');
}

// API configuration
const API_BASE_URL = 'http://localhost:5002/api';

// Initialize API URL
findBackendPort()
    .then(port => {
        console.log(`Connected to backend on port ${port}`);
    })
    .catch(error => {
        console.error('Failed to connect to backend:', error);
    });

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Auth API calls
export const auth = {
    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Incorrect email or password. Please try again.');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Incorrect email or password. Please try again.');
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

// Products API calls
export const products = {
    getAll: () => apiCall('/products'),
    getById: (id) => apiCall(`/products/${id}`),
    create: (productData) => apiCall('/products', 'POST', productData),
    update: (id, productData) => apiCall(`/products/${id}`, 'PUT', productData),
    delete: (id) => apiCall(`/products/${id}`, 'DELETE')
};

// Cart API calls
export const cart = {
    get: () => apiCall('/cart'),
    addItem: (productId, quantity) => apiCall('/cart/add', 'POST', { productId, quantity }),
    updateItem: (productId, quantity) => apiCall(`/cart/update/${productId}`, 'PUT', { quantity }),
    removeItem: (productId) => apiCall(`/cart/remove/${productId}`, 'DELETE'),
    clear: () => apiCall('/cart/clear', 'DELETE')
};

// Orders API calls
export const orders = {
    getAll: () => apiCall('/orders'),
    getMyOrders: () => apiCall('/orders/my'),
    getById: (id) => apiCall(`/orders/${id}`),
    create: (orderData) => apiCall('/orders', 'POST', orderData),
    updateStatus: (id, status) => apiCall(`/orders/${id}`, 'PUT', { status })
}; 