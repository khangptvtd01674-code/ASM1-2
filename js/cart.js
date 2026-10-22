// Lấy giỏ hàng từ localStorage
const getCart = () => {
    const cart = localStorage.getItem('techzone_cart');
    return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng
const saveCart = (cart) => {
    localStorage.setItem('techzone_cart', JSON.stringify(cart));
    updateCartCount();
    if(typeof renderCart === 'function') renderCart();
};

// Cập nhật số lượng trên header
const updateCartCount = () => {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = count;
        // Animation nhảy khi cập nhật
        badge.style.animation = 'none';
        badge.offsetHeight; // reflow
        badge.style.animation = 'badge-bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
};

// ========== TOAST NOTIFICATION SYSTEM ==========
const showToast = (product, isNew = true) => {
    // Xóa toast cũ nếu còn
    const oldToast = document.getElementById('cartToast');
    if (oldToast) {
        oldToast.classList.add('toast-hiding');
        setTimeout(() => oldToast.remove(), 300);
    }

    const totalItems = getCart().reduce((s, i) => s + i.quantity, 0);

    const toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.innerHTML = `
        <div class="toast-inner">
            <div class="toast-icon-wrap">
                <div class="toast-checkmark">
                    <svg viewBox="0 0 52 52"><circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                </div>
            </div>
            <div class="toast-img-wrap">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.src='https://placehold.co/60x60/e8f4fd/1a73e8?text=SP'">
            </div>
            <div class="toast-content">
                <div class="toast-title">
                    <i class="fas fa-shopping-cart"></i>
                    ${isNew ? 'Đã thêm vào giỏ hàng!' : 'Cập nhật giỏ hàng!'}
                </div>
                <div class="toast-product-name">${product.name}</div>
                <div class="toast-meta">
                    <span class="toast-price">${formatPrice(product.price)}</span>
                    <span class="toast-count">${totalItems} sản phẩm trong giỏ</span>
                </div>
            </div>
            <div class="toast-actions">
                <a href="cart.html" class="toast-btn-cart">
                    <i class="fas fa-shopping-bag"></i> Xem giỏ
                </a>
                <button class="toast-close" onclick="this.closest('#cartToast').classList.add('toast-hiding'); setTimeout(()=>this.closest('#cartToast').remove(),300)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="toast-progress-bar"></div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('toast-show'));
    });

    // Tự đóng sau 3.5s
    const timer = setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3500);

    // Pause timer khi hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        const bar = toast.querySelector('.toast-progress-bar');
        if (bar) bar.style.animationPlayState = 'paused';
    });
    toast.addEventListener('mouseleave', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 400);
    });
};

// ========== INJECT TOAST STYLES ==========
const injectToastStyles = () => {
    if (document.getElementById('toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        #cartToast {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 99999;
            min-width: 360px;
            max-width: 420px;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,123,255,0.12);
            border: 1px solid rgba(0,123,255,0.1);
            overflow: hidden;
            transform: translateY(120%) scale(0.9);
            opacity: 0;
            transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        opacity 0.35s ease;
        }
        #cartToast.toast-show {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        #cartToast.toast-hiding {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .toast-inner {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 16px 14px 16px;
        }
        .toast-icon-wrap {
            flex-shrink: 0;
        }
        .toast-checkmark {
            width: 40px;
            height: 40px;
        }
        .toast-checkmark svg {
            width: 40px;
            height: 40px;
        }
        .checkmark-circle {
            stroke: #22c55e;
            stroke-width: 2.5;
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: stroke-circle 0.5s ease-out 0.1s forwards;
        }
        .checkmark-check {
            stroke: #22c55e;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke-check 0.35s ease-out 0.5s forwards;
        }
        @keyframes stroke-circle {
            to { stroke-dashoffset: 0; }
        }
        @keyframes stroke-check {
            to { stroke-dashoffset: 0; }
        }
        .toast-img-wrap {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            overflow: hidden;
            background: #f0f7ff;
            border: 2px solid #e8f0fe;
        }
        .toast-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 4px;
        }
        .toast-content {
            flex: 1;
            min-width: 0;
        }
        .toast-title {
            font-size: 12px;
            font-weight: 700;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .toast-title i { font-size: 11px; }
        .toast-product-name {
            font-size: 13.5px;
            font-weight: 600;
            color: #1a1a2e;
            line-height: 1.35;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .toast-meta {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .toast-price {
            font-size: 13px;
            font-weight: 700;
            color: #e53935;
        }
        .toast-count {
            font-size: 11px;
            color: #888;
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 20px;
        }
        .toast-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
            align-items: flex-end;
        }
        .toast-btn-cart {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 7px 13px;
            background: linear-gradient(135deg, #007bff, #0056d2);
            color: #fff;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            white-space: nowrap;
            box-shadow: 0 3px 10px rgba(0,123,255,0.3);
        }
        .toast-btn-cart:hover {
            background: linear-gradient(135deg, #0069d9, #004ab3);
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(0,123,255,0.4);
            color: #fff;
        }
        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #bbb;
            font-size: 13px;
            padding: 2px 4px;
            border-radius: 6px;
            transition: all 0.2s;
            line-height: 1;
        }
        .toast-close:hover {
            color: #666;
            background: #f5f5f5;
        }
        .toast-progress-bar {
            height: 3px;
            background: linear-gradient(90deg, #007bff, #22c55e);
            animation: progress-shrink 3.5s linear forwards;
            border-radius: 0 0 20px 20px;
        }
        @keyframes progress-shrink {
            from { width: 100%; }
            to   { width: 0%; }
        }
        @keyframes badge-bounce {
            0%   { transform: scale(0.5); }
            60%  { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
};

// Thêm vào giỏ
window.addToCart = (productId, quantity = 1) => {
    injectToastStyles();

    if(typeof products === 'undefined') {
        showErrorToast('Lỗi dữ liệu sản phẩm!');
        return;
    }
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    const isNew = !existingItem;

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(product, isNew);
};

// Toast lỗi nhỏ
const showErrorToast = (msg) => {
    injectToastStyles();
    const t = document.createElement('div');
    t.id = 'cartToast';
    t.innerHTML = `<div class="toast-inner"><div class="toast-content"><div class="toast-title" style="color:#e53935"><i class="fas fa-exclamation-circle"></i> Lỗi</div><div class="toast-product-name">${msg}</div></div></div>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('toast-show')));
    setTimeout(() => { t.classList.add('toast-hiding'); setTimeout(() => t.remove(), 400); }, 3000);
};

window.removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
};

window.updateQuantity = (productId, change) => {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart(cart);
    }
};

// Render Cart Page
const renderCart = () => {
    const tbody = document.getElementById('cartTableBody');
    if(!tbody) return;
    
    const cart = getCart();

    // Sync summary counts
    const count = cart.reduce((s,i) => s + i.quantity, 0);
    const total = cart.reduce((s,i) => s + i.price * i.quantity, 0);
    const countSumEl = document.getElementById('cartCountSum');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl    = document.getElementById('cartTotal');
    const badgeEl    = document.getElementById('cartCountBadge');
    if (countSumEl) countSumEl.textContent = count;
    if (subtotalEl) subtotalEl.textContent = formatPrice(total);
    if (totalEl)    totalEl.textContent    = formatPrice(total);
    if (badgeEl)    badgeEl.textContent    = count + ' sản phẩm';

    if(cart.length === 0) {
        tbody.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Giỏ hàng của bạn đang trống</h3>
                <p>Hãy khám phá hàng ngàn sản phẩm công nghệ tuyệt vời!</p>
                <a href="products.html">
                    <i class="fas fa-store"></i> Khám phá ngay
                </a>
            </div>`;
        return;
    }

    tbody.innerHTML = cart.map((item, idx) => `
        <div class="cart-row" style="animation-delay: ${idx * 0.06}s">
            <div class="cart-product-info">
                <div class="cart-product-img-wrap">
                    <img src="${item.image}" alt="${item.name}"
                         onerror="this.src='https://placehold.co/80x80/e8f4fd/1a73e8?text=SP'">
                </div>
                <div>
                    <div class="cart-product-name">${item.name}</div>
                    <div class="cart-product-cat"><i class="fas fa-tag"></i> Phụ kiện công nghệ</div>
                </div>
            </div>
            <div class="cart-unit-price">${formatPrice(item.price)}</div>
            <div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-line-total">${formatPrice(item.price * item.quantity)}</div>
            <div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})" title="Xóa">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', () => {
    injectToastStyles();
    updateCartCount();
    renderCart();
});
