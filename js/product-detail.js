document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('detailContainer').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f59e0b; margin-bottom: 16px;"></i>
                <h2 style="font-size: 22px; margin-bottom: 10px; color: #1a1a2e;">Không tìm thấy sản phẩm!</h2>
                <p style="color: #666; margin-bottom: 24px;">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.</p>
                <a href="products.html" class="btn-fill" style="display: inline-block; padding: 12px 28px; text-decoration: none; border-radius: 12px;">Xem sản phẩm khác</a>
            </div>
        `;
        return;
    }

    document.title = product.name + " - TECHZONE";

    // Category display name
    const categoryNames = {
        'mouse_keyboard': 'Chuột & Bàn phím',
        'charger_cable': 'Cáp & Củ sạc',
        'audio': 'Thiết bị âm thanh',
        'bag': 'Balo & Túi chống sốc',
        'other': 'Phụ kiện công nghệ'
    };
    const catName = categoryNames[product.category] || 'Phụ kiện cao cấp';

    // Update Breadcrumb
    const breadcrumbName = document.getElementById('breadcrumbName');
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    // Badges
    let badgeHtml = '';
    if (product.isNew) badgeHtml = `<span class="detail-badge detail-badge-new">✨ HÀNG MỚI</span>`;
    else if (product.isHot) badgeHtml = `<span class="detail-badge detail-badge-hot">🔥 BÁN CHẠY</span>`;
    else if (product.isSale) badgeHtml = `<span class="detail-badge detail-badge-sale">⚡ GIẢM SỐC</span>`;

    // Discount calculate
    let discountPercent = 0;
    let savingsAmount = 0;
    if (product.oldPrice && product.oldPrice > product.price) {
        discountPercent = Math.round((product.oldPrice - product.price) / product.oldPrice * 100);
        savingsAmount = product.oldPrice - product.price;
    }

    // Rating stars
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= product.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    // Generate thumbnails
    const thumbs = [
        product.image,
        product.image,
        product.image
    ];

    const detailContainer = document.getElementById('detailContainer');
    detailContainer.innerHTML = `
        <!-- Left: Image Panel -->
        <div class="detail-image-panel">
            <div class="detail-img-main" id="mainImgWrap">
                ${badgeHtml}
                <div class="img-actions">
                    <button class="img-action-btn" title="Yêu thích" onclick="this.classList.toggle('active'); this.querySelector('i').classList.toggle('far'); this.querySelector('i').classList.toggle('fas'); this.querySelector('i').style.color = this.classList.contains('active') ? '#e53935' : '';">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="img-action-btn" title="Chia sẻ" onclick="navigator.clipboard.writeText(window.location.href); alert('Đã sao chép liên kết sản phẩm!');">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
                <img src="${product.image}" id="mainDetailImg" alt="${product.name}"
                     onerror="this.src='https://placehold.co/400x400/e8f4fd/1a73e8?text=TECHZONE'">
            </div>
            <div class="detail-thumbs">
                ${thumbs.map((img, idx) => `
                    <div class="detail-thumb ${idx === 0 ? 'active' : ''}" onclick="selectThumb(this, '${img}')">
                        <img src="${img}" alt="Góc chụp ${idx + 1}" onerror="this.src='https://placehold.co/80x80/e8f4fd/1a73e8?text=SP'">
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Right: Info Panel -->
        <div class="detail-info">
            <div class="detail-category"><i class="fas fa-tag"></i> ${catName}</div>
            <h1 class="detail-title">${product.name}</h1>

            <div class="detail-rating-row">
                <div class="stars">${starsHtml}</div>
                <span class="rating-count"><strong>${product.rating}.0</strong> (${(product.rating * 18 + 12)} đánh giá)</span>
                <span class="rating-divider">|</span>
                <span class="sold-count"><i class="fas fa-fire" style="color: #e53935;"></i> Đã bán ${(product.rating * 42 + 25)}</span>
            </div>

            <div class="detail-price-box">
                <div class="detail-price-row">
                    <span class="detail-price-main">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="detail-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    ${discountPercent > 0 ? `<span class="detail-discount-badge">-${discountPercent}%</span>` : ''}
                </div>
                ${savingsAmount > 0 ? `<div class="detail-save"><i class="fas fa-piggy-bank"></i> Tiết kiệm ${formatPrice(savingsAmount)} khi mua ngay hôm nay!</div>` : ''}
            </div>

            <div class="detail-desc">${product.description}</div>

            <div class="detail-qty-row">
                <span class="qty-label">Số lượng:</span>
                <div class="qty-control">
                    <button class="qty-btn" id="btnMinus"><i class="fas fa-minus"></i></button>
                    <input type="number" id="qtyInput" class="qty-input" value="1" min="1" max="99" readonly>
                    <button class="qty-btn" id="btnPlus"><i class="fas fa-plus"></i></button>
                </div>
                <div class="qty-stock">Tình trạng: <strong>Còn hàng trong kho</strong></div>
            </div>

            <div class="detail-actions">
                <button class="btn-add-cart" id="btnAddCart">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
                <button class="btn-buy-now" id="btnBuyNow">
                    <i class="fas fa-bolt"></i> Mua ngay
                </button>
            </div>

            <div class="detail-trust">
                <div class="trust-badge">
                    <i class="fas fa-shield-alt"></i>
                    <div>
                        Bảo hành chính hãng
                        <span>12 - 24 tháng cam kết</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-sync-alt"></i>
                    <div>
                        1 đổi 1 trong 30 ngày
                        <span>Lỗi đổi mới miễn phí</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-shipping-fast"></i>
                    <div>
                        Giao hàng siêu tốc
                        <span>Toàn quốc 1 - 3 ngày</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-headset"></i>
                    <div>
                        Hỗ trợ kỹ thuật 24/7
                        <span>Tư vấn nhiệt tình</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thumbnail selection handler
    window.selectThumb = function(el, src) {
        document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        const mainImg = document.getElementById('mainDetailImg');
        if (mainImg) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = src;
                mainImg.style.opacity = '1';
            }, 150);
        }
    };

    // Quantity events
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('btnMinus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) qtyInput.value = val - 1;
    });
    document.getElementById('btnPlus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val < 99) qtyInput.value = val + 1;
    });

    // Add to cart & buy now
    document.getElementById('btnAddCart').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        addToCart(product.id, qty);
    });

    document.getElementById('btnBuyNow').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        addToCart(product.id, qty);
        window.location.href = "cart.html";
    });

    // Populate Tabs
    const detailTabs = document.getElementById('detailTabs');
    if (detailTabs) {
        detailTabs.style.display = 'block';

        // Tab description
        const descEl = document.getElementById('productDesc');
        if (descEl) {
            descEl.innerHTML = `
                <p style="margin-bottom: 14px;"><strong>${product.name}</strong> là sản phẩm thiết bị công nghệ chính hãng chất lượng cao, được phân phối trực tiếp bởi hệ thống TECHZONE.</p>
                <p style="margin-bottom: 14px;">${product.description}</p>
                <h4 style="margin: 20px 0 10px; color: #1a1a2e; font-size: 16px;">Đặc điểm nổi bật:</h4>
                <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: #555;">
                    <li>Thiết kế công thái học hiện đại, độ hoàn thiện cao từ vật liệu cao cấp.</li>
                    <li>Hiệu năng bền bỉ, kết nối ổn định và tiết kiệm năng lượng tối ưu.</li>
                    <li>Tương thích mượt mà trên nhiều hệ điều hành: Windows, macOS, Android, iOS.</li>
                    <li>Bảo hành điện tử chính hãng kích hoạt ngay khi nhận hàng.</li>
                </ul>
            `;
        }

        // Tab specs
        const specsTable = document.getElementById('specsTable');
        if (specsTable) {
            const specItems = [
                { label: 'Thương hiệu', val: product.name.split(' ')[0] || 'TECHZONE' },
                { label: 'Mã sản phẩm', val: 'TZ-PROD-' + String(product.id).padStart(4, '0') },
                { label: 'Danh mục', val: catName },
                { label: 'Bảo hành', val: '12 - 24 Tháng chính hãng' },
                { label: 'Tình trạng', val: 'Mới 100% nguyên seal' },
                { label: 'Xuất xứ', val: 'Chính hãng phân phối' }
            ];
            specsTable.innerHTML = specItems.map(s => `
                <tr>
                    <td>${s.label}</td>
                    <td>${s.val}</td>
                </tr>
            `).join('');
        }

        // Tab reviews
        const reviewSummary = document.getElementById('reviewSummary');
        if (reviewSummary) {
            reviewSummary.innerHTML = `
                <div style="text-align: center;">
                    <div class="review-big-num">${product.rating}.0</div>
                    <div class="review-stars-big">${starsHtml}</div>
                    <div class="review-big-label">${product.rating * 18 + 12} nhận xét</div>
                </div>
                <div class="review-bars">
                    <div class="review-bar-row">
                        <span>5 sao</span>
                        <div class="review-bar-track"><div class="review-bar-fill" style="width: 85%;"></div></div>
                        <span>85%</span>
                    </div>
                    <div class="review-bar-row">
                        <span>4 sao</span>
                        <div class="review-bar-track"><div class="review-bar-fill" style="width: 12%;"></div></div>
                        <span>12%</span>
                    </div>
                    <div class="review-bar-row">
                        <span>3 sao</span>
                        <div class="review-bar-track"><div class="review-bar-fill" style="width: 3%;"></div></div>
                        <span>3%</span>
                    </div>
                    <div class="review-bar-row">
                        <span>2 sao</span>
                        <div class="review-bar-track"><div class="review-bar-fill" style="width: 0%;"></div></div>
                        <span>0%</span>
                    </div>
                    <div class="review-bar-row">
                        <span>1 sao</span>
                        <div class="review-bar-track"><div class="review-bar-fill" style="width: 0%;"></div></div>
                        <span>0%</span>
                    </div>
                </div>
            `;
        }
    }

    // Related Products
    const relatedSection = document.getElementById('relatedSection');
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (relatedSection && relatedProductsContainer) {
        const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        const finalRelated = related.length > 0 ? related : products.filter(p => p.id !== product.id).slice(0, 4);

        if (finalRelated.length > 0) {
            relatedSection.style.display = 'block';
            relatedProductsContainer.innerHTML = finalRelated.map(createProductCard).join('');
        }
    }

    // Sticky Buy Bar
    const stickyBuy = document.getElementById('stickyBuy');
    const stickyName = document.getElementById('stickyName');
    const stickyPrice = document.getElementById('stickyPrice');
    if (stickyBuy && stickyName && stickyPrice) {
        stickyName.textContent = product.name;
        stickyPrice.textContent = formatPrice(product.price);

        window.addEventListener('scroll', () => {
            const rect = detailContainer.getBoundingClientRect();
            if (rect.bottom < 100) {
                stickyBuy.classList.add('visible');
            } else {
                stickyBuy.classList.remove('visible');
            }
        });
    }
});
