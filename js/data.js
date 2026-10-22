// Mock Data cho website (Chuyên Phụ kiện công nghệ)
const defaultProducts = [
    {
        id: 1,
        name: "Chuột không dây Logitech MX Master 3S",
        category: "mouse_keyboard",
        price: 2490000,
        oldPrice: 2790000,
        image: "images/product_1.jpg",
        description: "Chuột công thái học cao cấp dành cho lập trình viên và designer, cuộn siêu tốc vô cực.",
        rating: 5,
        isNew: true,
        isHot: true,
        isSale: true
    },
    {
        id: 2,
        name: "Bàn phím cơ Keychron K8 Pro (Nhôm, RGB)",
        category: "mouse_keyboard",
        price: 2690000,
        oldPrice: 2990000,
        image: "images/product_2.jpg",
        description: "Bàn phím cơ không dây layout TKL, hỗ trợ QMK/VIA custom phím tiện lợi.",
        rating: 5,
        isNew: true,
        isHot: true,
        isSale: false
    },
    {
        id: 3,
        name: "Củ sạc nhanh Anker Nano II 65W",
        category: "charger_cable",
        price: 850000,
        oldPrice: 1100000,
        image: "images/product_3.jpg",
        description: "Sạc nhanh siêu nhỏ gọn công nghệ GaN II, sạc tốt cho cả Macbook và điện thoại.",
        rating: 5,
        isNew: false,
        isHot: true,
        isSale: true
    },
    {
        id: 4,
        name: "Cáp sạc Type-C to Type-C Baseus 100W (2m)",
        category: "charger_cable",
        price: 199000,
        oldPrice: 250000,
        image: "images/product_4.jpg",
        description: "Cáp bọc dù siêu bền, hỗ trợ sạc siêu nhanh 100W PD cho laptop.",
        rating: 4,
        isNew: false,
        isHot: false,
        isSale: true
    },
    {
        id: 5,
        name: "Tai nghe Bluetooth Sony WH-1000XM5",
        category: "audio",
        price: 7990000,
        oldPrice: 8590000,
        image: "images/product_5.jpg",
        description: "Tai nghe chống ồn chủ động xuất sắc nhất thế giới, âm thanh High-Res.",
        rating: 5,
        isNew: false,
        isHot: true,
        isSale: true
    },
    {
        id: 6,
        name: "Tai nghe Apple AirPods Pro 2 Type-C",
        category: "audio",
        price: 5890000,
        oldPrice: 6290000,
        image: "images/product_6.jpg",
        description: "Chống ồn thông minh, âm thanh không gian vượt trội với cổng sạc Type-C mới.",
        rating: 5,
        isNew: true,
        isHot: true,
        isSale: false
    },
    {
        id: 7,
        name: "Loa Bluetooth Marshall Emberton II",
        category: "audio",
        price: 3990000,
        oldPrice: 4590000,
        image: "images/product_7.jpg",
        description: "Thiết kế vintage cổ điển, âm thanh đa hướng True Stereophonic mạnh mẽ.",
        rating: 4,
        isNew: true,
        isHot: false,
        isSale: true
    },
    {
        id: 8,
        name: "Pin sạc dự phòng Magsafe 10000mAh",
        category: "charger_cable",
        price: 990000,
        oldPrice: 1200000,
        image: "images/product_8.jpg",
        description: "Sạc không dây tiện lợi dính chặt mặt lưng iPhone, hỗ trợ sạc nhanh 20W.",
        rating: 4,
        isNew: false,
        isHot: true,
        isSale: true
    },
    {
        id: 9,
        name: "Balo Laptop 15.6 inch Tomtoc Premium",
        category: "bag",
        price: 1890000,
        oldPrice: 2200000,
        image: "images/product_9.jpg",
        description: "Chất liệu kháng nước bền bỉ, công nghệ bảo vệ góc CornerArmor.",
        rating: 5,
        isNew: false,
        isHot: false,
        isSale: true
    },
    {
        id: 10,
        name: "Túi chống sốc Laptop/Macbook 14 inch",
        category: "bag",
        price: 450000,
        oldPrice: 600000,
        image: "images/product_10.jpg",
        description: "Đệm lót nhung mềm mại, chống va đập tuyệt đối 360 độ.",
        rating: 4,
        isNew: false,
        isHot: false,
        isSale: true
    },
    {
        id: 11,
        name: "Giá đỡ Laptop hợp kim nhôm gấp gọn",
        category: "other",
        price: 290000,
        oldPrice: 400000,
        image: "images/product_11.jpg",
        description: "Thiết kế kim loại tản nhiệt tốt, giúp chống gù lưng khi làm việc.",
        rating: 4,
        isNew: true,
        isHot: false,
        isSale: true
    },
    {
        id: 12,
        name: "Hub chuyển đổi Type-C Ugreen 6 in 1",
        category: "other",
        price: 790000,
        oldPrice: 950000,
        image: "images/product_12.jpg",
        description: "Mở rộng 6 cổng kết nối: HDMI 4K, USB 3.0, LAN, khe thẻ nhớ tiện lợi.",
        rating: 5,
        isNew: false,
        isHot: true,
        isSale: false
    },
    {
        id: 13,
        name: "Chuột không dây Logitech Pebble M350",
        category: "mouse_keyboard",
        price: 590000,
        oldPrice: 690000,
        image: "images/product_13.jpg",
        description: "Thiết kế siêu mỏng nhẹ, click êm ái chống ồn, màu sắc đa dạng.",
        rating: 4,
        isNew: false,
        isHot: false,
        isSale: true
    },
    {
        id: 14,
        name: "Củ sạc nhanh Apple 20W Type-C",
        category: "charger_cable",
        price: 550000,
        oldPrice: 690000,
        image: "images/product_14.jpg",
        description: "Sạc chính hãng Apple chuẩn PD, tương thích tối đa với iPhone/iPad.",
        rating: 5,
        isNew: false,
        isHot: true,
        isSale: false
    },
    {
        id: 15,
        name: "Bàn phím cơ Akko 3098B Multi-modes",
        category: "mouse_keyboard",
        price: 1990000,
        oldPrice: 2200000,
        image: "images/product_15.jpg",
        description: "Màu sắc nổi bật, hỗ trợ 3 chế độ kết nối, keycap PBT chất lượng cao.",
        rating: 4,
        isNew: true,
        isHot: true,
        isSale: true
    }
];

// Luôn dùng defaultProducts để đảm bảo hình ảnh mới nhất
let products = defaultProducts;
localStorage.setItem('techzone_products', JSON.stringify(products));

// Hàm format tiền tệ VNĐ
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Hàm tạo HTML cho 1 thẻ sản phẩm
const createProductCard = (product) => {
    let badgeHtml = '';
    if (product.isNew)  badgeHtml = `<span class="product-badge badge-new">✨ Mới</span>`;
    else if (product.isHot)  badgeHtml = `<span class="product-badge badge-hot">🔥 Hot</span>`;
    else if (product.isSale) badgeHtml = `<span class="product-badge badge-sale">⚡ Sale</span>`;

    // Tính % giảm giá
    let discountHtml = '';
    if (product.oldPrice > product.price) {
        const discount = Math.round((product.oldPrice - product.price) / product.oldPrice * 100);
        discountHtml = `<span class="product-discount">-${discount}%</span>`;
    }

    // Render sao đánh giá
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= product.rating
            ? '<i class="fas fa-star"></i>'
            : '<i class="far fa-star"></i>';
    }

    return `
        <div class="product-card">
            <!-- Image area -->
            <div class="product-card-img-wrap">
                ${badgeHtml}
                <!-- Quick overlay buttons -->
                <div class="product-card-overlay">
                    <button class="overlay-btn" title="Xem chi tiết" onclick="window.location.href='product-detail.html?id=${product.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="overlay-btn" title="Thêm vào giỏ" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-img"
                         onerror="this.onerror=null; this.src='https://placehold.co/300x200/e8f4fd/1a73e8?text=TECHZONE'">
                </a>
            </div>

            <!-- Info area -->
            <div class="product-info">
                <a href="product-detail.html?id=${product.id}">
                    <h3 class="product-name">${product.name}</h3>
                </a>
                <div class="product-price-wrapper">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    ${discountHtml}
                </div>
                <div class="product-rating">
                    ${starsHtml}
                    <span>(${product.rating * 12 + 3})</span>
                </div>
                <div class="product-actions">
                    <a href="product-detail.html?id=${product.id}" class="btn-outline">
                        <i class="fas fa-eye"></i> Chi tiết
                    </a>
                    <button class="btn-fill" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm giỏ
                    </button>
                </div>
            </div>
        </div>
    `;
};

