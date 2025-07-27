// Sınıf seçimi
let selectedClass = null;
const classBtns = document.querySelectorAll('.class-btn');
classBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        classBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedClass = btn.getAttribute('data-class');
        gsap.to(btn, {scale: 1.12, yoyo: true, repeat: 1, duration: 0.15});
    });
});

// Uyarı mesajı fonksiyonu
function showAlert(message, type = 'success') {
    let alert = document.getElementById('register-alert');
    if (!alert) {
        alert = document.createElement('div');
        alert.id = 'register-alert';
        alert.style.marginBottom = '18px';
        alert.style.fontWeight = 'bold';
        alert.style.fontSize = '1.1rem';
        alert.style.borderRadius = '10px';
        alert.style.padding = '12px 18px';
        alert.style.textAlign = 'center';
        alert.style.transition = 'opacity 0.3s';
        const form = document.getElementById('register-form');
        form.parentNode.insertBefore(alert, form);
    }
    alert.textContent = message;
    alert.style.background = type === 'success' ? 'linear-gradient(90deg,#43e97b,#38f9d7)' : 'linear-gradient(90deg,#ff4e50,#f9d423)';
    alert.style.color = '#fff';
    alert.style.opacity = 1;
    gsap.fromTo(alert, {y: -20, opacity: 0}, {y: 0, opacity: 1, duration: 0.5});
}

// Form submit
const form = document.getElementById('register-form');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!selectedClass) {
        showAlert('Lütfen sınıfını seç!', 'error');
        return;
    }
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    if (!firstname || !lastname || !username || !password) {
        showAlert('Lütfen tüm alanları doldur!', 'error');
        return;
    }
    // API'ye kayıt isteği gönder
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                first_name: firstname,
                last_name: lastname,
                username: username,
                password: password,
                grade: selectedClass
            })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            showAlert('Kayıt başarılı! Giriş ekranına yönlendiriliyorsun...', 'success');
            setTimeout(() => {
                window.location.href = '/login?registered=1';
            }, 1500);
        } else {
            showAlert(data.message || 'Kayıt sırasında bir hata oluştu!', 'error');
        }
    } catch (err) {
        showAlert('Sunucuya ulaşılamadı!', 'error');
    }
});

// Kayıt ekranı animasyonu
window.onload = () => {
    gsap.from('.login-container', {y: 60, opacity: 0, duration: 0.7, ease: 'power2.out'});
}; 