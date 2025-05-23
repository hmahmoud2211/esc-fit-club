// Cart page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shared state
    sharedState.init();
    
    // Render cart items
    renderCart();
    
    // Update order summary
    updateOrderSummary();
    
    // Add event listeners for quantity controls
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const itemId = parseInt(e.target.dataset.itemId);
            const newQuantity = parseInt(e.target.value);
            sharedState.updateQuantity(itemId, newQuantity);
            renderCart();
            updateOrderSummary();
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.itemId);
            sharedState.removeFromCart(itemId);
            renderCart();
            updateOrderSummary();
        });
    });
    
    // Add event listener for promo code
    const promoForm = document.querySelector('.promo-code form');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const promoInput = promoForm.querySelector('input');
            const promoCode = promoInput.value.trim();
            
            if (promoCode === 'WELCOME10') {
                // Apply 10% discount
                const subtotal = sharedState.getCartTotal();
                const discount = subtotal * 0.1;
                const total = subtotal - discount;
                
                document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.querySelector('.discount').textContent = `-$${discount.toFixed(2)}`;
                document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
                
                sharedState.showCartMessage('Promo code applied successfully!');
                promoInput.value = '';
            } else {
                sharedState.showCartMessage('Invalid promo code', 'error');
            }
        });
    }
    
    // Add event listener for checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (sharedState.cart.length === 0) {
                sharedState.showCartMessage('Your cart is empty', 'error');
                return;
            }
            // Here you would typically redirect to a checkout page
            sharedState.showCartMessage('Proceeding to checkout...');
        });
    }
});

function renderCart() {
    const cartItems = document.querySelector('.cart-items');
    const emptyMessage = document.querySelector('.empty-cart-message');
    
    if (sharedState.cart.length === 0) {
        cartItems.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    cartItems.style.display = 'block';
    emptyMessage.style.display = 'none';
    
    cartItems.innerHTML = sharedState.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-item-id="${item.id}">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-item" data-item-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const subtotal = sharedState.getCartTotal();
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.shipping').textContent = `$${shipping.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(itemId, newQuantity) {
    sharedState.updateQuantity(itemId, newQuantity);
    renderCart();
    updateOrderSummary();
} 