const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Test login
async function login() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });
        authToken = response.data.token;
        console.log('Login successful!');
        return authToken;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Test create product
async function createProduct() {
    try {
        const response = await axios.post(`${API_URL}/products`, {
            name: 'Test Product',
            description: 'This is a test product',
            price: 99.99,
            stock: 100,
            image: 'https://example.com/image.jpg'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Product created:', response.data);
        return response.data._id;
    } catch (error) {
        console.error('Create product failed:', error.response?.data || error.message);
        return null;
    }
}

// Test update product
async function updateProduct(productId) {
    try {
        const response = await axios.put(`${API_URL}/products/${productId}`, {
            price: 89.99,
            stock: 50
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Product updated:', response.data);
    } catch (error) {
        console.error('Update product failed:', error.response?.data || error.message);
    }
}

// Test delete product
async function deleteProduct(productId) {
    try {
        const response = await axios.delete(`${API_URL}/products/${productId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Product deleted:', response.data);
    } catch (error) {
        console.error('Delete product failed:', error.response?.data || error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting admin endpoint tests...');
    
    // Login first
    await login();
    
    // Create a product
    const productId = await createProduct();
    
    if (productId) {
        // Update the product
        await updateProduct(productId);
        
        // Delete the product
        await deleteProduct(productId);
    }
    
    console.log('Tests completed!');
}

runTests(); 