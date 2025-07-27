// Örnek istatistik verisi (ileride backend'den alınabilir)
const questionStats = {
    toplama: 12,
    cikarma: 8,
    carpma: 5,
    bolme: 3
};
const correct = 22;
const wrong = 6;
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

// Örnek günlere göre veri (ileride backend'den alınabilir)
const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const questionsPerDay = [10, 12, 8, 15, 9, 7, 11];
const wrongsPerDay = [2, 1, 3, 2, 0, 1, 2];

// Çözülen soru sayısı grafiği
const ctxQuestions = document.getElementById('questionsPerDayChart').getContext('2d');
new Chart(ctxQuestions, {
    type: 'bar',
    data: {
        labels: days,
        datasets: [{
            label: 'Çözülen Soru',
            data: questionsPerDay,
            backgroundColor: '#43e97b',
            borderRadius: 8
        }]
    },
    options: {
        plugins: {legend: {display: false}},
        scales: {y: {beginAtZero: true}}
    }
});

// Yanlış yapılan soru sayısı grafiği
const ctxWrongs = document.getElementById('wrongsPerDayChart').getContext('2d');
new Chart(ctxWrongs, {
    type: 'bar',
    data: {
        labels: days,
        datasets: [{
            label: 'Yanlış Sayısı',
            data: wrongsPerDay,
            backgroundColor: '#ff4e50',
            borderRadius: 8
        }]
    },
    options: {
        plugins: {legend: {display: false}},
        scales: {y: {beginAtZero: true}}
    }
}); 