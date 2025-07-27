// Örnek yanlış sorular verisi
const wrongQuestions = [
    {
        soru: '12 + 7 = ?',
        verdiginCevap: '18',
        dogruCevap: '19',
        tarih: '2024-06-01',
        detay: 'Toplama işlemi, 12 ile 7 toplanır. Doğru cevap 19 olmalı.'
    },
    {
        soru: '9 x 3 = ?',
        verdiginCevap: '27',
        dogruCevap: '27',
        tarih: '2024-06-02',
        detay: 'Çarpma işlemi, 9 ile 3 çarpılır. Doğru cevap 27.'
    },
    {
        soru: '15 - 8 = ?',
        verdiginCevap: '6',
        dogruCevap: '7',
        tarih: '2024-06-03',
        detay: 'Çıkarma işlemi, 15’ten 8 çıkarılır. Doğru cevap 7.'
    }
];

const table = document.getElementById('wrong-questions-table');
const detailBox = document.getElementById('question-detail-content');

function showDetail(idx) {
    const q = wrongQuestions[idx];
    detailBox.innerHTML = `
        <div><strong>Soru:</strong> ${q.soru}</div>
        <div><strong>Verdiğin Cevap:</strong> ${q.verdiginCevap}</div>
        <div><strong>Doğru Cevap:</strong> ${q.dogruCevap}</div>
        <div><strong>Tarih:</strong> ${q.tarih}</div>
        <div class="mt-2">${q.detay}</div>
    `;
}

table.innerHTML = '';
wrongQuestions.forEach((q, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${q.soru}</td>
        <td>${q.verdiginCevap}</td>
        <td>${q.dogruCevap}</td>
        <td>${q.tarih}</td>
        <td>
            <button class="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1 view-question-btn" onclick="showDetail(${i})" style="transition:box-shadow .2s;">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='currentColor' viewBox='0 0 16 16'><path d='M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5c-3.314 0-6-3.134-6-4.5s2.686-4.5 6-4.5 6 3.134 6 4.5-2.686 4.5-6 4.5zm0-7A2.5 2.5 0 1 0 8 11a2.5 2.5 0 0 0 0-5zm0 4A1.5 1.5 0 1 1 8 6a1.5 1.5 0 0 1 0 3z'/></svg>
                Soruyu Gör
            </button>
        </td>
    `;
    table.appendChild(tr);
});

// Varsayılan olarak ilk sorunun detayını göster
if (wrongQuestions.length > 0) showDetail(0);

// Hover efekti için (isteğe bağlı, ekstra şıklık)
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.view-question-btn')) {
        e.target.closest('.view-question-btn').style.boxShadow = '0 0 0 0.2rem #43e97b55';
    }
});
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.view-question-btn')) {
        e.target.closest('.view-question-btn').style.boxShadow = '';
    }
}); 