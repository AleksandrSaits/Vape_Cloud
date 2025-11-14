// Cart functionality
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('vapeShopCart')) || [];
        this.init();
    }

    init() {
        this.setupCartToggle();
        this.updateCartUI();
        this.setupCheckout();
    }

    setupCartToggle() {
        const cartBtn = document.getElementById('cartBtn');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');

        if (cartBtn && cartSidebar) {
            cartBtn.addEventListener('click', () => {
                this.toggleCart();
            });

            if (closeCart) {
                closeCart.addEventListener('click', () => {
                    this.closeCart();
                });
            }

            // Close cart when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.cart-sidebar') && 
                    !e.target.closest('.cart-btn') && 
                    !e.target.closest('.cart-count') &&
                    !e.target.closest('.fa-shopping-cart')) {
                    this.closeCart();
                }
            });
        }
    }

    setupCheckout() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showNotification('Корзина пуста', 'error');
                    return;
                }
                this.showNotification('Заказ оформлен! С вами свяжутся для подтверждения.');
                this.clearCart();
                this.closeCart();
            });
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = this.createOverlay();
        
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
        }
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.cart-overlay');
        
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    createOverlay() {
        let overlay = document.querySelector('.cart-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'cart-overlay';
            overlay.addEventListener('click', () => this.closeCart());
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Ваша корзина пуста</p>
                    <p class="empty-cart-hint">Добавьте товары из каталога</p>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '0 ₽';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map(item => {
            const itemTotal = this.parsePrice(item.price) * item.quantity;
            total += itemTotal;

            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                        <div class="cart-item-total">${this.formatPrice(itemTotal)} ₽</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.cartId}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.cartId}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="remove-btn" onclick="cartManager.removeItem(${item.cartId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (cartTotal) cartTotal.textContent = `${this.formatPrice(total)} ₽`;
    }

    updateQuantity(cartId, change) {
        const item = this.cart.find(item => item.cartId === cartId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeItem(cartId);
        } else {
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
        }
    }

    removeItem(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.saveCart();
        this.updateCartUI();
        this.updateCartCount();
        this.showNotification('Товар удален из корзины');
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                cartId: Date.now()
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.updateCartCount();
        this.showNotification('Товар добавлен в корзину');
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    saveCart() {
        localStorage.setItem('vapeShopCart', JSON.stringify(this.cart));
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.updateCartCount();
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/\s/g, ''));
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#e53e3e' : '#e53e3e'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s;
        `;
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (this.parsePrice(item.price) * item.quantity);
        }, 0);
    }
}

// Initialize cart manager
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});