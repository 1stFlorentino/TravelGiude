// 1. Dữ liệu hệ thống
const travelDatabase = {
    "LongAn": {
        tenTinh: "Long An",
        locations: [
            { name: "Di tích Ngã  Tư Đức Hòa", status: true },
            { name: "Cánh đồng bất tận", status: false },
            { name: "Di tích Nhà Trăm cột", status: false }
        ]
    },
    "DaNang": {
        tenTinh: "Đà Nẵng",
        locations: [
            { name: "Cầu Rồng", status: false },
            { name: "Bà Nà Hills", status: false }
        ]
    }
};

// 2. Xử lý khi trang web tải xong
document.addEventListener("DOMContentLoaded", () => {
    
    // --- ĐỒNG BỘ TIÊU ĐỀ TỪ URL ---
    const params = new URLSearchParams(window.location.search);
    const placeName = params.get('place');
    const titleTag = document.getElementById('placeTitle');
    if (placeName && titleTag) {
        titleTag.innerText = placeName.toUpperCase();
    }

    // --- SLIDESHOW (Dùng chung) ---
    const containers = document.querySelectorAll('.slideshow-container');
    containers.forEach(container => {
        let slideIdx = 0;
        const slides = container.querySelectorAll('.slide');
        if (slides.length === 0) return;

        function show(n) {
            slides.forEach(s => s.style.display = "none");
            slideIdx = (n + slides.length) % slides.length;
            slides[slideIdx].style.display = "block";
        }

        let autoSlide = setInterval(() => { slideIdx++; show(slideIdx); }, 5000);
        show(0);

        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        if (prevBtn) prevBtn.onclick = () => { show(--slideIdx); clearInterval(autoSlide); };
        if (nextBtn) nextBtn.onclick = () => { show(++slideIdx); clearInterval(autoSlide); };
    });

    const provinceSelect = document.getElementById('provinceSelect');
    const locationSelect = document.getElementById('locationSelect');
    const btnStart = document.getElementById('btnStart');

    if (provinceSelect && locationSelect) {
        for (const key in travelDatabase) {
            const option = document.createElement('option');
            option.value = key;
            option.text = travelDatabase[key].tenTinh;
            provinceSelect.appendChild(option);
        }

        provinceSelect.onchange = function() {
            locationSelect.innerHTML = '<option value="">-- Chọn địa điểm --</option>';
            if (!this.value) {
                locationSelect.disabled = true;
                return;
            }
            const locations = travelDatabase[this.value].locations;
            locations.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc.name;
                option.text = loc.name + (loc.status ? "" : " (Đóng cửa)");
                if (!loc.status) option.disabled = true;
                locationSelect.appendChild(option);
            });
            locationSelect.disabled = false;
        };
    }

    if (btnStart) {
    btnStart.onclick = function() {
        if (!provinceSelect.value || !locationSelect.value) {
            alert("Vui lòng chọn đầy đủ thông tin!");
            return;
        }
        const province = provinceSelect.value;
        const place = encodeURIComponent(locationSelect.value);
        
        window.location.href = `./contentPage/main.html?tinh=${province}&place=${place}`;
    };
}
});

// --- LIGHTBOX (Hàm toàn cục để gọi từ HTML) ---
function openLightbox(src) {
    const lb = document.getElementById('Lightbox');
    const lbImg = document.getElementById('LightboxImg');
    if (lb && lbImg) {
        lbImg.src = src;
        lb.style.display = 'flex';
    }
}

function closeLightbox() {
    const lb = document.getElementById('Lightbox');
    if (lb) lb.style.display = 'none';
}

// Đóng lightbox khi bấm ra ngoài ảnh
window.onclick = function(e) {
    const lb = document.getElementById('Lightbox');
    if (e.target == lb) closeLightbox();
};
