// Products functionality
class ProductManager {
    constructor() {
        this.products = this.getAllProducts();
        this.filters = {
            category: 'all',
            price: 'all',
            gender: 'all',
            sort: 'default'
        };
        this.currentGender = this.detectCurrentGender();
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupSorting();
        this.loadProducts();
    }

    detectCurrentGender() {
        const path = window.location.pathname;
        if (path.includes('male.html')) return 'male';
        if (path.includes('female.html')) return 'female';
        if (path.includes('unisex.html')) return 'unisex';
        return 'all';
    }

    getAllProducts() {
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
            },
            {
                id: 7,
                name: "Vaporesso Luxe X",
                category: "pod",
                description: "Премиальная pod-система с сенсорным дисплеем и продвинутыми настройками",
                price: "4 290",
                badge: "Премиум",
                icon: "fas fa-crown",
                features: ["1500mAh", "Touchscreen", "Smart Mode", "Type-C"],
                gender: "male",
                colors: ["#2d3748", "#805ad5", "#3182ce"],
                inStock: true,
                rating: 4.7,
                reviews: 145
            },
            {
                id: 8,
                name: "Uwell Caliburn A2",
                category: "pod",
                description: "Компактная и простая в использовании pod-система для начинающих",
                price: "2 190",
                icon: "fas fa-feather",
                features: ["520mAh", "Compact", "Easy Use", "Type-C"],
                gender: "female",
                colors: ["#fbb6ce", "#b794f4", "#68d391"],
                inStock: true,
                rating: 4.3,
                reviews: 89
            }
        ];
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.filter;
                const filterValue = btn.dataset.value;
                
                // Update active state for this filter group
                const filterGroup = btn.closest('.filter-group');
                if (filterGroup) {
                    filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                }
                btn.classList.add('active');
                
                // Update filters
                this.filters[filterType] = filterValue;
                this.applyFilters();
            });
        });
    }

    setupSorting() {
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filteredProducts = [...this.products];

        // Apply gender filter based on current page
        if (this.currentGender !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.gender === this.currentGender || product.gender === 'unisex'
            );
        }

        // Apply category filter
        if (this.filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.filters.category
            );
        }

        // Apply price filter
        if (this.filters.price !== 'all') {
            filteredProducts = this.filterByPrice(filteredProducts, this.filters.price);
        }

        // Apply sorting
        filteredProducts = this.sortProducts(filteredProducts, this.filters.sort);

        this.renderProducts(filteredProducts);
    }

    filterByPrice(products, priceRange) {
        const ranges = {
            'under-3000': product => this.parsePrice(product.price) < 3000,
            '3000-5000': product => {
                const price = this.parsePrice(product.price);
                return price >= 3000 && price <= 5000;
            },
            'over-5000': product => this.parsePrice(product.price) > 5000
        };

        return products.filter(ranges[priceRange] || (() => true));
    }

    sortProducts(products, sortType) {
        const sorters = {
            'price-low': (a, b) => this.parsePrice(a.price) - this.parsePrice(b.price),
            'price-high': (a, b) => this.parsePrice(b.price) - this.parsePrice(a.price),
            'name': (a, b) => a.name.localeCompare(b.name),
            'rating': (a, b) => b.rating - a.rating,
            'default': (a, b) => a.id - b.id
        };

        return products.sort(sorters[sortType] || sorters.default);
    }

    renderProducts(products) {
        const container = document.getElementById('featuredProducts') || 
                         document.getElementById('productsGrid');
        
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
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
                            <button class="wishlist-btn" onclick="productManager.toggleWishlist(${product.id})">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="btn btn-primary" 
                                    onclick="productManager.addToCart(${product.id})"
                                    ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
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

    getCategoryName(category) {
        const categories = {
            'pod': 'Pod-система',
            'mod': 'Бокс-мод',
            'starter': 'Стартовый набор',
            'accessory': 'Аксессуар'
        };
        return categories[category] || category;
    }

    addToCart(productId) {
        if (typeof vapeShop !== 'undefined') {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                vapeShop.addToCart(productId);
            }
        }
    }

    toggleWishlist(productId) {
        if (typeof vapeShop !== 'undefined') {
            vapeShop.toggleWishlist(productId);
        }
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/\s/g, ''));
    }

    loadProducts() {
        // Load products based on current gender
        let filteredProducts = [...this.products];
        
        if (this.currentGender !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.gender === this.currentGender || product.gender === 'unisex'
            );
        }
        
        this.renderProducts(filteredProducts);
    }
}

// Initialize product manager
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});