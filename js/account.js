document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Nếu là admin thì đẩy sang trang admin
    if (currentUser.role === 'admin') {
        window.location.href = "admin.html";
        return;
    }

    // Hiển thị thông tin
    document.getElementById('sidebarName').innerText = currentUser.name || 'Người dùng';
    document.getElementById('infoName').innerText  = currentUser.name  || '—';
    document.getElementById('infoEmail').innerText = currentUser.email || '—';
    document.getElementById('infoPhone').innerText = currentUser.phone || 'Chưa cập nhật';
    document.getElementById('infoRole').innerText  = currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên';

    // Đăng xuất
    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    });

    // Render đơn hàng ngay khi load để cập nhật badge
    updateOrderBadge();
});

// Cập nhật badge số đơn hàng
function updateOrderBadge() {
    const orders = JSON.parse(localStorage.getItem('techzone_orders')) || [];
    const badge = document.getElementById('orderBadge');
    if (orders.length > 0 && badge) {
        badge.textContent = orders.length;
        badge.style.display = 'inline-block';
    }
}

// Render đơn hàng — hiện TẤT CẢ đơn trong localStorage
window.renderOrders = function() {
    const allOrders = JSON.parse(localStorage.getItem('techzone_orders')) || [];

    // Cập nhật stats
    const statsEl = document.getElementById('orderStats');
    const statTotal   = document.getElementById('statTotal');
    const statDone    = document.getElementById('statDone');
    const statPending = document.getElementById('statPending');

    if (allOrders.length > 0 && statsEl) {
        statsEl.style.display = 'flex';
        statTotal.textContent   = allOrders.length;
        statDone.textContent    = allOrders.filter(o => o.status === 'done').length;
        statPending.textContent = allOrders.filter(o => !o.status || o.status === 'pending').length;
    }

    const tbody = document.getElementById('orderListBody');
    if (!tbody) return;

    if (allOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-orders">
                        <i class="fas fa-box-open"></i>
                        <h3>Chưa có đơn hàng nào</h3>
                        <p>Bạn chưa đặt đơn hàng nào. Hãy khám phá và mua sắm ngay!</p>
                        <a href="products.html"><i class="fas fa-store"></i> Mua sắm ngay</a>
                    </div>
                </td>
            </tr>`;
        return;
    }

    // Sắp xếp mới nhất trước
    const sorted = [...allOrders].reverse();

    tbody.innerHTML = sorted.map((o, idx) => {
        const date = new Date(o.date).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        let statusText  = 'Đang xử lý';
        let statusClass = 'status-pending';
        let statusIcon  = 'fas fa-clock';

        if (o.status === 'done')   { statusText = 'Hoàn thành'; statusClass = 'status-done';   statusIcon = 'fas fa-check-circle'; }
        if (o.status === 'cancel') { statusText = 'Đã hủy';     statusClass = 'status-cancel'; statusIcon = 'fas fa-times-circle'; }

        // Ảnh thumbnail sản phẩm
        const thumbs = (o.items || []).slice(0, 3).map(item =>
            `<img class="order-item-thumb" src="${item.image}" alt="${item.name}"
                  onerror="this.src='https://placehold.co/36x36/e8f4fd/1a73e8?text=SP'">`
        ).join('');
        const moreCount = (o.items || []).length > 3 ? `<span style="font-size:11px;color:#888">+${o.items.length-3}</span>` : '';

        // Tên khách hàng
        const customer = o.customer ? o.customer.name : 'Khách';

        return `
            <tr style="animation-delay:${idx*0.05}s">
                <td>
                    <div class="order-id">#${String(o.id).slice(-8).toUpperCase()}</div>
                    <div style="font-size:11px;color:#aaa;margin-top:3px">${customer}</div>
                </td>
                <td>
                    <div class="order-items-preview">${thumbs}${moreCount}</div>
                    <div style="font-size:11px;color:#999;margin-top:4px">${(o.items||[]).length} sản phẩm</div>
                </td>
                <td style="font-size:12px;color:#666">${date}</td>
                <td class="order-total">${formatPrice(o.total)}</td>
                <td><span class="status-badge ${statusClass}"><i class="${statusIcon}"></i> ${statusText}</span></td>
            </tr>
        `;
    }).join('');
};
