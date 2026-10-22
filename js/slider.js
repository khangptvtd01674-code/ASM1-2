document.addEventListener('DOMContentLoaded', () => {
    // ---- SLIDER ----
    const sliderContainer = document.getElementById('sliderContainer');
    if (sliderContainer) {
        const slidesData = [
            {
                image: "images/banner_1.jpg",
                title: "KHÔNG GIAN LÀM VIỆC ĐỈNH CAO",
                link: "products.html?category=mouse_keyboard"
            },
            {
                image: "images/banner_2.jpg",
                title: "TRẢI NGHIỆM ÂM THANH SỐNG ĐỘNG",
                link: "products.html?category=audio"
            },
            {
                image: "images/banner_3.png",
                title: "PHỤ KIỆN BẢO VỆ TOÀN DIỆN",
                link: "products.html?category=bag"
            }
        ];

        // Render slides
        sliderContainer.innerHTML = slidesData.map(s => `
            <div class="slide" style="background-image: url('${s.image}')">
                <div class="slide-content">
                    <h2>${s.title}</h2>
                    <a href="${s.link}" class="btn">Mua ngay</a>
                </div>
            </div>
        `).join('');

        const sliderDots = document.getElementById('sliderDots');
        sliderDots.innerHTML = slidesData.map((_, i) => `<div class="dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');

        let currentSlide = 0;
        const totalSlides = slidesData.length;
        const dots = document.querySelectorAll('.dot');
        let autoSlideInterval;

        const updateSlider = () => {
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        };

        document.getElementById('nextBtn').addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentSlide = parseInt(e.target.dataset.index);
                updateSlider();
                resetInterval();
            });
        });

        const resetInterval = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000); // 5s auto
        };

        resetInterval();
    }

    // ---- COUNTDOWN CLOCK ----
    const countdownEl = document.getElementById('countdown') || document.getElementById('days');
    if (countdownEl) {
        // Thiết lập thời gian kết thúc (12 tiếng nữa)
        const endTime = new Date().getTime() + (12 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000);
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (distance < 0) {
                clearInterval(timer);
                const cd = document.getElementById('countdown');
                if (cd) cd.innerHTML = "<h3 style='color: var(--danger)'>FLASH SALE ĐÃ KẾT THÚC</h3>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
        }, 1000);
    }
});
