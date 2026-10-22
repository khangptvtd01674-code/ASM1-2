document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "index.html";
        return;
    }

    // Hiển thị tên + avatar admin
    const nameEl = document.getElementById('adminName');
    const avatarEl = document.getElementById('adminAvatarEl');
    if (nameEl) nameEl.textContent = currentUser.name || 'Admin';
    if (avatarEl) avatarEl.textContent = (currentUser.name || 'A').charAt(0).toUpperCase();

    document.getElementById('adminLogout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = "login.html";
    });

    // Màu avatar ngẫu nhiên theo tên
    const colors = ['#3b82f6','#22c55e','#f59e0b','#e53935','#8b5cf6','#06b6d4'];
    const colorIdx = (currentUser.name || 'A').charCodeAt(0) % colors.length;
    if (avatarEl) avatarEl.style.background = `linear-gradient(135deg, ${colors[colorIdx]}, ${colors[(colorIdx+1)%colors.length]})`;

    // ===== Load Dashboard Data =====
    const loadAdminData = () => {
        const orders = JSON.parse(localStorage.getItem('techzone_orders')) || [];
        const users  = JSON.parse(localStorage.getItem('techzone_users'))  || [];

        // Thống kê
        document.getElementById('countOrders').innerText = orders.length;
        document.getElementById('countUsers').innerText  = users.filter(u => u.role !== 'admin').length;

        let revenue = 0, pending = 0;
        orders.forEach(o => {
            if (o.status === 'done') revenue += o.total;
            if (!o.status || o.status === 'pending') pending++;
        });

        document.getElementById('countRevenue').innerText = formatPrice(revenue);
        document.getElementById('countPending').innerText = pending;

        // Badge pending trên sidebar
        const badge = document.getElementById('pendingBadge');
        if (badge) {
            if (pending > 0) { badge.textContent = pending; badge.style.display = 'inline-block'; }
            else badge.style.display = 'none';
        }

        // Bảng đơn hàng
        const tbody = document.getElementById('adminOrderList');
        if (!tbody) return;

        if (orders.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><span class="empty-icon">📦</span>Chưa có đơn hàng nào</td></tr>`;
            return;
        }

        const sorted = [...orders].reverse();
        const avatarColors = ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#e53935','#06b6d4'];

        tbody.innerHTML = sorted.map((o, idx) => {
            const date   = new Date(o.date).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
            const status = o.status || 'pending';
            const ci     = (o.customer.name || 'K').charCodeAt(0) % avatarColors.length;
            const initial = (o.customer.name || 'K').charAt(0).toUpperCase();

            let statusBadge = '';
            if (status === 'pending') statusBadge = `<span class="status-badge status-pending"><i class="fas fa-clock"></i> Chờ xử lý</span>`;
            else if (status === 'done')   statusBadge = `<span class="status-badge status-done"><i class="fas fa-check-circle"></i> Hoàn thành</span>`;
            else if (status === 'cancel') statusBadge = `<span class="status-badge status-cancel"><i class="fas fa-times-circle"></i> Đã hủy</span>`;

            const shortId = String(o.id).slice(-10).toUpperCase();

            return `
                <tr style="animation-delay:${idx * 0.04}s">
                    <td>
                        <div class="order-id-cell">#${shortId}</div>
                        <div class="order-sub">${new Date(o.date).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})}</div>
                    </td>
                    <td>
                        <div class="customer-cell">
                            <div class="customer-av" style="background:${avatarColors[ci]}">${initial}</div>
                            <div>
                                <div class="customer-name">${o.customer.name}</div>
                                <div class="customer-phone">${o.customer.phone}</div>
                            </div>
                        </div>
                    </td>
                    <td style="color:#666;font-size:13px">${date}</td>
                    <td class="price-cell">${formatPrice(o.total)}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
                            <option value="pending" ${status === 'pending' ? 'selected' : ''}>⏳ Chờ xử lý</option>
                            <option value="done"    ${status === 'done'    ? 'selected' : ''}>✅ Hoàn thành</option>
                            <option value="cancel"  ${status === 'cancel'  ? 'selected' : ''}>❌ Hủy đơn</option>
                        </select>
                    </td>
                </tr>
            `;
        }).join('');
    };

    // ===== Update Order Status =====
    window.updateOrderStatus = (orderId, newStatus) => {
        let orders = JSON.parse(localStorage.getItem('techzone_orders')) || [];
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].status = newStatus;
            localStorage.setItem('techzone_orders', JSON.stringify(orders));
            loadAdminData();
        }
    };

    // ===== Switch Tab =====
    window.switchTab = (tabId, element) => {
        document.querySelectorAll('.admin-nav a').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        document.querySelectorAll('.admin-content').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${tabId}`).classList.add('active');

        // Cập nhật title header
        const titles = {
            overview: 'Dashboard <span>/ Tổng quan</span>',
            products: 'Sản phẩm <span>/ Quản lý</span>',
            users:    'Khách hàng <span>/ Quản lý</span>'
        };
        const headerTitle = document.getElementById('headerTitle');
        if (headerTitle) headerTitle.innerHTML = titles[tabId] || '';

        if (tabId === 'products') loadAdminProducts();
        if (tabId === 'users')    loadAdminUsers();
    };

    // ===== Load Products =====
    window.loadAdminProducts = () => {
        const el   = document.getElementById('adminProductList');
        const prods = JSON.parse(localStorage.getItem('techzone_products')) || [];

        if (prods.length === 0) {
            el.innerHTML = `<tr class="empty-row"><td colspan="5"><span class="empty-icon">📦</span>Chưa có sản phẩm nào</td></tr>`;
            return;
        }

        el.innerHTML = prods.map((p, idx) => `
            <tr style="animation-delay:${idx*0.04}s">
                <td style="font-weight:700;color:#3b82f6;font-size:13px">#${p.id}</td>
                <td>
                    <img class="prod-img" src="${p.image}" alt="${p.name}"
                         onerror="this.src='https://placehold.co/46x46/e8f4fd/1a73e8?text=SP'">
                </td>
                <td>
                    <div style="font-weight:600;color:#1a1a2e">${p.name}</div>
                    <div style="font-size:11px;color:#aaa;margin-top:2px">${p.category || 'Khác'}</div>
                </td>
                <td class="price-cell">${formatPrice(p.price)}</td>
                <td>
                    <div style="display:flex;gap:6px">
                        <button class="btn-action btn-edit" onclick="editProduct(${p.id})">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteProduct(${p.id})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    // ===== Load Users =====
    window.loadAdminUsers = () => {
        const el    = document.getElementById('adminUserList');
        const users = JSON.parse(localStorage.getItem('techzone_users')) || [];
        const avatarColors = ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#e53935','#06b6d4'];

        if (users.length === 0) {
            el.innerHTML = `<tr class="empty-row"><td colspan="5"><span class="empty-icon">👥</span>Chưa có khách hàng nào</td></tr>`;
            return;
        }

        el.innerHTML = users.map((u, idx) => {
            const ci = (u.name || 'K').charCodeAt(0) % avatarColors.length;
            const roleTag = u.role === 'admin'
                ? `<span class="role-admin"><i class="fas fa-crown"></i> Admin</span>`
                : `<span class="role-user"><i class="fas fa-user"></i> Khách hàng</span>`;

            return `
                <tr style="animation-delay:${idx*0.04}s">
                    <td>
                        <div class="customer-cell">
                            <div class="customer-av" style="background:${avatarColors[ci]}">${(u.name||'K').charAt(0).toUpperCase()}</div>
                            <div>
                                <div class="customer-name">${u.name}</div>
                                <div class="customer-phone">ID #${idx+1}</div>
                            </div>
                        </div>
                    </td>
                    <td style="color:#555">${u.email}</td>
                    <td style="color:#555">${u.phone || '<em style="color:#ccc">Chưa cập nhật</em>'}</td>
                    <td>${roleTag}</td>
                    <td>
                        ${u.role !== 'admin'
                            ? `<button class="btn-action btn-delete" onclick="deleteUser('${u.email}')"><i class="fas fa-trash"></i> Xóa</button>`
                            : `<span style="font-size:12px;color:#ccc;font-style:italic">Bảo vệ</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    };

    // ===== Add Product (prompt-based) =====
    window.addProduct = () => {
        const name = prompt("Nhập tên sản phẩm mới:");
        if (!name) return;
        const price = prompt("Nhập giá sản phẩm (VND):", "100000");
        if (!price || isNaN(price)) { alert("Giá không hợp lệ"); return; }

        let prods = JSON.parse(localStorage.getItem('techzone_products')) || [];
        const newId = prods.length > 0 ? Math.max(...prods.map(p => p.id)) + 1 : 1;

        prods.push({
            id: newId, name,
            category: "other",
            price: Number(price),
            image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&q=80",
            rating: 5, isNew: true
        });
        localStorage.setItem('techzone_products', JSON.stringify(prods));
        loadAdminProducts();
    };

    // ===== Edit Product =====
    window.editProduct = (id) => {
        let prods = JSON.parse(localStorage.getItem('techzone_products')) || [];
        const idx = prods.findIndex(p => p.id === id);
        if (idx === -1) return;
        const newPrice = prompt(`Nhập giá mới cho "${prods[idx].name}":`, prods[idx].price);
        if (newPrice && !isNaN(newPrice)) {
            prods[idx].price = Number(newPrice);
            localStorage.setItem('techzone_products', JSON.stringify(prods));
            loadAdminProducts();
        }
    };

    // ===== Delete Product =====
    window.deleteProduct = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            let prods = JSON.parse(localStorage.getItem('techzone_products')) || [];
            prods = prods.filter(p => p.id !== id);
            localStorage.setItem('techzone_products', JSON.stringify(prods));
            loadAdminProducts();
        }
    };

    // ===== Delete User =====
    window.deleteUser = (email) => {
        if (confirm("Xóa khách hàng này sẽ không thể khôi phục. Xóa?")) {
            let users = JSON.parse(localStorage.getItem('techzone_users')) || [];
            users = users.filter(u => u.email !== email);
            localStorage.setItem('techzone_users', JSON.stringify(users));
            loadAdminUsers();
        }
    };

    loadAdminData();
});
