document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('techzone_cart')) || [];
    if(cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    // Render items in summary
    const checkoutItems = document.getElementById('checkoutItems');
    const coItemCount   = document.getElementById('coItemCount');
    const coSubtotal    = document.getElementById('coSubtotal');
    const totalEl       = document.getElementById('checkoutTotal');

    let total = 0;
    const totalQty = cart.reduce((s,i) => s + i.quantity, 0);

    checkoutItems.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="co-item" style="animation-delay:${idx*0.07}s">
                <img class="co-item-img" src="${item.image}" alt="${item.name}"
                     onerror="this.src='https://placehold.co/52x52/e8f4fd/1a73e8?text=SP'">
                <div class="co-item-info">
                    <div class="co-item-name">${item.name}</div>
                    <div class="co-item-qty">x ${item.quantity}</div>
                </div>
                <div class="co-item-price">${formatPrice(itemTotal)}</div>
            </div>
        `;
    }).join('');

    if (coItemCount) coItemCount.textContent = totalQty + ' sp';
    if (coSubtotal)  coSubtotal.textContent  = formatPrice(total);
    if (totalEl)     totalEl.textContent     = formatPrice(total);

    // Form validation & submit
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const name    = document.getElementById('cusName').value.trim();
        const phone   = document.getElementById('cusPhone').value.trim();
        const email   = document.getElementById('cusEmail').value.trim();
        const address = document.getElementById('cusAddress').value.trim();

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

        if(name === '') {
            document.getElementById('errName').style.display = 'flex';
            document.getElementById('cusName').focus();
            isValid = false;
        }

        const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if(!phoneRegex.test(phone)) {
            document.getElementById('errPhone').style.display = 'flex';
            if(isValid) document.getElementById('cusPhone').focus();
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            document.getElementById('errEmail').style.display = 'flex';
            if(isValid) document.getElementById('cusEmail').focus();
            isValid = false;
        }

        if(address === '') {
            document.getElementById('errAddress').style.display = 'flex';
            if(isValid) document.getElementById('cusAddress').focus();
            isValid = false;
        }

        if(isValid) {
            const orderId = 'TZ' + new Date().getTime();

            // Animate button
            const btn = document.getElementById('placeOrderBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            btn.disabled = true;

            setTimeout(() => {
                try {
                // Save order
                const order = {
                    id: orderId,
                    date: new Date().toISOString(),
                    customer: { name, phone, email, address },
                    items: cart,
                    total: total,
                    paymentMethod: document.querySelector('input[name="payment"]:checked').value
                };
                
                const orders = JSON.parse(localStorage.getItem('techzone_orders')) || [];
                orders.push(order);
                localStorage.setItem('techzone_orders', JSON.stringify(orders));
                localStorage.removeItem('techzone_cart');

                // Show order ID in modal
                const orderIdEl = document.getElementById('successOrderId');
                if (orderIdEl) orderIdEl.textContent = 'Mã đơn hàng: #' + orderId;

                // Show success modal
                const modal = document.getElementById('successModal');
                modal.classList.add('show');
                } catch(err) {
                    console.error('Order error:', err);
                    btn.innerHTML = '<i class="fas fa-lock"></i> Đặt hàng ngay <span class="btn-arrow"><i class="fas fa-arrow-right"></i></span>';
                    btn.disabled = false;
                    alert('Có lỗi xảy ra, vui lòng thử lại!');
                }
            }, 600);
        }
    });

    // Input shake animation on invalid
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
            const errId = 'err' + input.id.replace('cus','');
            const err = document.getElementById(errId);
            if (err) err.style.display = 'none';
        });
    });
});
