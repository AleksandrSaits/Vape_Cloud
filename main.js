// Main JavaScript functionality
class VapeShop {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupCart();
        this.loadFeaturedProducts();
    }

    setupEventListeners() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Search button
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.showNotification('Функция поиска скоро будет доступна');
            });
        }

        // Auth button
        const authBtn = document.querySelector('.auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                this.showNotification('Авторизация скоро будет доступна');
            });
        }

        // Secondary button in hero
        const secondaryBtn = document.querySelector('.btn-secondary');
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                document.querySelector('#about').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        // Update active nav link on scroll
        window.addEventListener('scroll', this.updateActiveNavLink.bind(this));
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });

            // Close mobile menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    }

    setupCart() {
        this.cart = JSON.parse(localStorage.getItem('vapeShopCart')) || [];
        this.updateCartCount();
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    }

    loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featuredProducts');
        if (!featuredContainer) return;

        const products = this.getFeaturedProducts();
        
        featuredContainer.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                ${!product.inStock ? `<div class="product-badge" style="background: #718096;">Нет в наличии</div>` : ''}
                
                <div class="product-image" style="background: linear-gradient(135deg, ${product.colors[0]}, ${product.colors[1]})">
                    <i class="${product.icon}"></i>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    
                    <div class="product-features">
                        ${product.features.map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="product-footer">
                        <div class="product-price">
                            ${product.price} ₽
                            ${product.originalPrice ? 
                                `<div class="original-price">${product.originalPrice} ₽</div>` : 
                                ''
                            }
                        </div>
                        <div class="product-actions">
                            <button class="wishlist-btn" onclick="vapeShop.toggleWishlist(${product.id})">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="btn btn-primary" 
                                    onclick="vapeShop.addToCart(${product.id})"
                                    ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getFeaturedProducts() {
        return [
            {
                id: 1,
                name: "Vaporesso XROS 3",
                category: "pod",
                description: "Компактная и мощная pod-система с регулируемой мощностью и Type-C зарядкой",
                price: "2 990",
                originalPrice: "3 490",
                badge: "Хит",
                icon: "fas fa-mobile-alt",
                features: ["1000mAh", "Type-C", "Регулировка мощности", "Auto-draw"],
                gender: "unisex",
                colors: ["#667eea", "#764ba2", "#f093fb"],
                inStock: true,
                rating: 4.8,
                reviews: 124
            },
            {
                id: 2,
                name: "GeekVape Aegis Legend 2",
                category: "mod",
                description: "Прочный бокс-мод с защитой от воды, пыли и ударов",
                price: "5 490",
                badge: "Новинка",
                icon: "fas fa-shield-alt",
                features: ["200W", "Waterproof", "Dual 18650", "TC Mode"],
                gender: "male",
                colors: ["#2d3748", "#e53e3e", "#38a169"],
                inStock: true,
                rating: 4.9,
                reviews: 89
            },
            {
                id: 3,
                name: "Uwell Caliburn G2",
                category: "pod",
                description: "Элегантная pod-система с улучшенной вкусопередачей и регулировкой воздуха",
                price: "2 790",
                icon: "fas fa-gem",
                features: ["750mAh", "Airflow Control", "Type-C", "Compact"],
                gender: "female",
                colors: ["#fbb6ce", "#9ae6b4", "#90cdf4"],
                inStock: true,
                rating: 4.7,
                reviews: 203
            },
            {
                id: 4,
                name: "Smok Nord 5",
                category: "pod",
                description: "Мощная pod-система с дисплеем и регулировкой мощности до 80W",
                price: "3 290",
                badge: "Выбор",
                icon: "fas fa-bolt",
                features: ["2000mAh", "Display", "80W", "Type-C"],
                gender: "male",
                colors: ["#1a202c", "#e53e3e", "#d69e2e"],
                inStock: false,
                rating: 4.6,
                reviews: 167
            },
            {
                id: 5,
                name: "Voopoo Drag S",
                category: "pod",
                description: "Стильная pod-система с технологией Gene.TT chip для быстрого отклика",
                price: "3 890",
                icon: "fas fa-fire",
                features: ["2500mAh", "Gene Chip", "60W", "Leather"],
                gender: "unisex",
                colors: ["#2d3748", "#e53e3e", "#d69e2e"],
                inStock: true,
                rating: 4.5,
                reviews: 98
            },
            {
                id: 6,
                name: "Aspire Flexus Q",
                category: "pod",
                description: "Ультра-компактная pod-система с плавной регулировкой воздуха",
                price: "2 490",
                badge: "Эконом",
                icon: "fas fa-wind",
                features: ["700mAh", "Compact", "Air Control", "Type-C"],
                gender: "female",
                colors: ["#fbb6ce", "#9ae6b4", "#fbd38d"],
                inStock: true,
                rating: 4.4,
                reviews: 76
            }
        ];
    }

    getCategoryName(category) {
        const categories = {
            'pod': 'Pod-система',
            'mod': 'Бокс-мод',
            'starter': 'Стартовый набор',
            'accessory': 'Аксессуар'
        };
        return categories[category] || category;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    addToCart(productId) {
        const product = this.getFeaturedProducts().find(p => p.id === productId);
        if (!product) return;

        if (!product.inStock) {
            this.showNotification('Товар временно отсутствует', 'error');
            return;
        }

        // Use cartManager if available
        if (typeof cartManager !== 'undefined') {
            cartManager.addToCart(product);
        } else {
            // Fallback to local cart
            const existingItem = this.cart.find(item => item.id === productId);
            
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
            this.updateCartCount();
            this.showNotification('Товар добавлен в корзину');
        }
    }

    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.saveCart();
        this.updateCartCount();
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

    toggleWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('vapeShopWishlist')) || [];
        const index = wishlist.indexOf(productId);
        
        const btn = document.querySelector(`[onclick="vapeShop.toggleWishlist(${productId})"]`);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            if (btn) btn.innerHTML = '<i class="far fa-heart"></i>';
            this.showNotification('Удалено из избранного');
        } else {
            wishlist.push(productId);
            if (btn) btn.innerHTML = '<i class="fas fa-heart"></i>';
            this.showNotification('Добавлено в избранное');
        }
        
        localStorage.setItem('vapeShopWishlist', JSON.stringify(wishlist));
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
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
                    max-width: 300px;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .notification i {
                    font-size: 1.2rem;
                }
                @media (max-width: 768px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to parse price
    parsePrice(priceString) {
        return parseInt(priceString.replace(/\s/g, ''));
    }

    // Utility method to format price
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

// Global function to scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        // If on category page, scroll to top of products grid
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vapeShop = new VapeShop();
    
    // Add loading animation removal
    const loadingElements = document.querySelectorAll('.loading, .skeleton');
    loadingElements.forEach(element => {
        element.classList.remove('loading', 'skeleton');
    });
});

// Add global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});