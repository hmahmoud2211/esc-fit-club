const sharedState = {
    cart: [],

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartCount();
        }

        // Add default items if cart is empty
        if (this.cart.length === 0) {
            const defaultItems = [
                {
                    id: 1,
                    name: 'Sports Modest Set - Black',
                    price: 59.99,
                    image: '/images/So_photos/Card_1.jpg',
                    quantity: 1,
                    color: 'Black',
                    size: 'M'
                },
                {
                    id: 2,
                    name: 'Active Wear Collection',
                    price: 79.99,
                    image: '/images/So_photos/Card_2.jpg',
                    quantity: 1,
                    color: 'Blue',
                    size: 'S'
                },
                {
                    id: 3,
                    name: 'Premium Sports Hijab',
                    price: 45.99,
                    image: '/images/So_photos/Card_3.jpg',
                    quantity: 1,
                    color: 'Gray',
                    size: 'One Size'
                }
            ];
            
            defaultItems.forEach(item => this.addToCart(item));
        }
    },

    addToCart(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push({ ...item });
        }

        this.saveCart();
        this.updateCartCount();
        this.showCartMessage('Item added to cart!');
    },

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.showCartMessage('Item removed from cart.');
    },

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(i => i.id === itemId);
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
        this.showCartMessage('Cart cleared.');
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
        }
    },

    updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    },

    showCartMessage(message) {
        const existingMessage = document.querySelector('.cart-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'cart-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 500);
        }, 2000);
    }
}; 