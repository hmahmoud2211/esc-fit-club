import { cart as cartAPI } from './js/api.js';

// Cart functionality
document.addEventListener('DOMContentLoaded', async () => {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Load cart items
    async function loadCart() {
        try {
            const cart = await cartAPI.get();
            displayCart(cart);
        } catch (error) {
            console.error('Error loading cart:', error);
            alert('Error loading cart. Please try again.');
        }
        }

    // Display cart items
    function displayCart(cart) {
        if (!cartItems) return;

        cartItems.innerHTML = '';
        let total = 0;

        cart.items.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.product.images[0]}" alt="${item.product.name}">
                <div class="item-details">
                    <h3>${item.product.name}</h3>
                    <p>$${item.product.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
                </div>
                </div>
                <button onclick="removeItem('${item.product._id}')" class="remove-btn">Remove</button>
            `;
            cartItems.appendChild(itemElement);
        });

        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Update item quantity
    window.updateQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                await removeItem(productId);
            return;
        }
            const updatedCart = await cartAPI.updateItem(productId, newQuantity);
            displayCart(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error updating quantity. Please try again.');
        }
    };
        
    // Remove item from cart
    window.removeItem = async (productId) => {
        try {
            const updatedCart = await cartAPI.removeItem(productId);
            displayCart(updatedCart);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error removing item. Please try again.');
        }
    };

    // Clear cart
    window.clearCart = async () => {
        try {
            await cartAPI.clear();
            displayCart({ items: [], total: 0 });
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Error clearing cart. Please try again.');
        }
    };

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            try {
                const cart = await cartAPI.get();
                if (cart.items.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                // Redirect to checkout page or show checkout form
                window.location.href = '/checkout.html';
            } catch (error) {
                console.error('Error during checkout:', error);
                alert('Error during checkout. Please try again.');
            }
        });
    }

    // Initial load
    loadCart();
}); 