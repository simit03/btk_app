document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('profile-edit-btn');
    const modal = document.getElementById('profile-edit-modal');
    const closeBtn = document.getElementById('profile-modal-close');
    const form = document.getElementById('profile-edit-form');
    const alertBox = document.getElementById('profile-edit-alert');
    // Modal aç/kapa
    if (btn && modal && closeBtn) {
        btn.onclick = () => { modal.classList.add('show'); fillProfileForm(); };
        closeBtn.onclick = () => { modal.classList.remove('show'); };
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };
    }
    // Formu sessiondan doldur
    function fillProfileForm() {
        document.getElementById('edit-firstname').value = window.sessionFirstName || '';
        document.getElementById('edit-lastname').value = window.sessionLastName || '';
    }
    // Form submit
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            alertBox.style.display = 'none';
            const firstname = document.getElementById('edit-firstname').value.trim();
            const lastname = document.getElementById('edit-lastname').value.trim();
            const password = document.getElementById('edit-password').value;
            try {
                const res = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        first_name: firstname,
                        last_name: lastname,
                        password: password
                    })
                });
                const data = await res.json();
                alertBox.textContent = data.message || 'Bir hata oluştu!';
                alertBox.style.display = 'block';
                if (res.ok && data.status === 'success') {
                    alertBox.style.background = 'linear-gradient(90deg,#43e97b,#38f9d7)';
                    setTimeout(() => { window.location.reload(); }, 1200);
                } else {
                    alertBox.style.background = 'linear-gradient(90deg,#ff4e50,#f9d423)';
                }
            } catch (err) {
                alertBox.textContent = 'Sunucuya ulaşılamadı!';
                alertBox.style.background = 'linear-gradient(90deg,#ff4e50,#f9d423)';
                alertBox.style.display = 'block';
            }
        };
    }
    // Sessiondan bilgileri window'a ata (Jinja ile)
    window.sessionFirstName = '{{ session.get('first_name', '') }}';
    window.sessionLastName = '{{ session.get('last_name', '') }}';

    // Örnek istatistik verisi (ileride backend'den alınabilir)
    const questionStats = {
        toplama: 12,
        cikarma: 8,
        carpma: 5,
        bolme: 3
    };
    const correct = 22;
    const wrong = 6;
    const recentQuestions = [
        {q: '5 + 3 = ?', a: '8', correct: true, date: '2024-07-27 14:12'},
        {q: '9 - 4 = ?', a: '5', correct: true, date: '2024-07-27 14:10'},
        {q: '2 x 3 = ?', a: '5', correct: false, date: '2024-07-27 14:08'},
        {q: '12 / 4 = ?', a: '3', correct: false, date: '2024-07-27 14:05'}
    ];
    // Grafik
    const ctx = document.getElementById('questionTypeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Toplama', 'Çıkarma', 'Çarpma', 'Bölme'],
            datasets: [{
                data: [questionStats.toplama, questionStats.cikarma, questionStats.carpma, questionStats.bolme],
                backgroundColor: ['#43e97b', '#fa8bff', '#1976d2', '#ff4e50']
            }]
        },
        options: {
            plugins: {legend: {position: 'bottom'}},
            cutout: '60%'
        }
    });
    // Toplam soru ve doğru/yanlış
    const totalQuestions = correct + wrong;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('correct-wrong').textContent = correct + ' / ' + wrong;
    // Son çözülen sorular tablosu
    document.getElementById('recent-questions').innerHTML = recentQuestions.map(r =>
        `<tr><td>${r.q}</td><td>${r.a}</td><td>${r.correct ? '✔️' : '❌'}</td><td>${r.date}</td></tr>`
    ).join('');
});
