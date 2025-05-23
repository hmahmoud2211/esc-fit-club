// Shared state for cart functionality
const sharedState = {
    cart: [],
    defaultItems: [
        {
            id: 1,
            name: "Modest Sport Hijab",
            price: 29.99,
            image: "/images/So_photos/hijab1.jpg",
            description: "Comfortable and stylish sport hijab for active women"
        },
        {
            id: 2,
            name: "Long Sleeve Sport Top",
            price: 39.99,
            image: "/images/So_photos/top1.jpg",
            description: "Breathable and modest sport top with long sleeves"
        },
        {
            id: 3,
            name: "Modest Sport Pants",
            price: 34.99,
            image: "/images/So_photos/pants1.jpg",
            description: "Comfortable and modest sport pants for active women"
        }
    ],

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        } else {
            // Add default items if cart is empty
            this.cart = this.defaultItems.map(item => ({
                ...item,
                quantity: 1
            }));
            this.saveCart();
        }
        this.updateCartCount();
        this.updateCartTotal();
    },

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }
        this.saveCart();
        this.updateCartCount();
        this.updateCartTotal();
        this.showCartMessage('Item added to cart');
    },

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartTotal();
        this.showCartMessage('Item removed from cart');
    },

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.updateCartCount();
            this.updateCartTotal();
        }
    },

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartTotal();
        this.showCartMessage('Cart cleared');
    },

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    },

    updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    },

    showCartMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `cart-message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
};

// Initialize shared state when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    sharedState.init();
}); 