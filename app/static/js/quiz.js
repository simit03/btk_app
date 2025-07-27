// Basit matematik soruları (örnek)
const questions = [
    { q: '5 + 3 = ?', options: ['6', '7', '8', '9'], answer: 2 },
    { q: '9 - 4 = ?', options: ['3', '5', '6', '7'], answer: 1 },
    { q: '2 x 3 = ?', options: ['5', '6', '7', '8'], answer: 1 },
    { q: '12 / 4 = ?', options: ['2', '3', '4', '5'], answer: 1 },
    { q: '7 + 2 = ?', options: ['8', '9', '10', '11'], answer: 1 },
];
let current = 0;

function showQuestion(idx) {
    const q = questions[idx];
    document.getElementById('question-text').textContent = q.q;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i);
        answersDiv.appendChild(btn);
    });
    gsap.from('#question-area', {duration: 0.5, y: -30, opacity: 0});
}

function checkAnswer(selected) {
    const q = questions[current];
    const btns = document.querySelectorAll('.answer-btn');
    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === selected && i !== q.answer) btn.classList.add('wrong');
    });
}

document.getElementById('next-question').onclick = () => {
    current = (current + 1) % questions.length;
    showQuestion(current);
};

// Canvas (e-kalem ve silgi) - Responsive ve mobil uyumlu
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'pen';

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    // Oranla gerçek canvas boyutuna çevir
    x = x * (canvas.width / rect.width);
    y = y * (canvas.height / rect.height);
    return {x, y};
}

function setCanvasCursor() {
    if (tool === 'pen') {
        canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text x=\'0\' y=\'24\' font-size=\'28\'>✏️</text></svg>") 0 24, pointer';
    } else if (tool === 'eraser') {
        canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text x=\'0\' y=\'24\' font-size=\'28\'>🧽</text></svg>") 0 24, pointer';
    }
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});
canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mouseout', () => { drawing = false; });
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getCanvasPos(e);
    ctx.lineWidth = (tool === 'pen') ? 2 : 28; // Silgi daha büyük
    ctx.strokeStyle = (tool === 'pen') ? '#222' : '#fff';
    ctx.lineCap = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});
// Mobil/touch desteği
canvas.addEventListener('touchstart', (e) => {
    drawing = true;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
});
canvas.addEventListener('touchend', () => { drawing = false; });
canvas.addEventListener('touchcancel', () => { drawing = false; });
canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    const pos = getCanvasPos(e);
    ctx.lineWidth = (tool === 'pen') ? 2 : 28; // Silgi daha büyük
    ctx.strokeStyle = (tool === 'pen') ? '#222' : '#fff';
    ctx.lineCap = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
});

// İlk yüklemede ve araç değişiminde çağır
setCanvasCursor();

document.getElementById('pen-tool').onclick = () => {
    tool = 'pen';
    document.getElementById('pen-tool').classList.add('active');
    document.getElementById('eraser-tool').classList.remove('active');
    setCanvasCursor();
};
document.getElementById('eraser-tool').onclick = () => {
    tool = 'eraser';
    document.getElementById('eraser-tool').classList.add('active');
    document.getElementById('pen-tool').classList.remove('active');
    setCanvasCursor();
};
document.getElementById('clear-canvas').onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// İlk soruyu göster
showQuestion(current);

// Gemini AI'ye Sor kutusu
const aiBtn = document.getElementById('ai-ask-btn');
const aiInput = document.getElementById('ai-question');
const aiAnswer = document.getElementById('ai-answer');
if (aiBtn && aiInput && aiAnswer) {
    aiBtn.onclick = async () => {
        const question = aiInput.value.trim();
        if (!question) {
            aiAnswer.textContent = 'Lütfen bir soru yaz.';
            return;
        }
        aiAnswer.textContent = 'Gemini AI düşünüyor...';
        // Burada gerçek Gemini API çağrısı yapılabilir
        setTimeout(() => {
            aiAnswer.textContent = 'Bu bir örnek Gemini AI cevabıdır: "' + question + '" sorusunun cevabı burada gösterilecek.';
        }, 1200);
    };
}

// Mini AI Widget aç/kapa ve soru sorma
const miniAiWidget = document.getElementById('mini-ai-widget');
const miniAiHeader = document.getElementById('mini-ai-header');
const miniAiToggle = document.getElementById('mini-ai-toggle');
const miniAiBody = document.getElementById('mini-ai-body');
const miniAiInput = document.getElementById('mini-ai-question');
const miniAiAsk = document.getElementById('mini-ai-ask');
const miniAiAnswer = document.getElementById('mini-ai-answer');

if (miniAiWidget && miniAiHeader && miniAiToggle && miniAiBody && miniAiInput && miniAiAsk && miniAiAnswer) {
    // Sayfa açıldığında açık başlasın
    miniAiWidget.classList.remove('mini-ai-closed');
    miniAiWidget.classList.add('mini-ai-open');
    miniAiToggle.textContent = '▼';

    function toggleMiniAI() {
        const isClosed = miniAiWidget.classList.toggle('mini-ai-closed');
        if (!isClosed) {
            miniAiWidget.classList.add('mini-ai-open');
        } else {
            miniAiWidget.classList.remove('mini-ai-open');
        }
        miniAiToggle.textContent = miniAiWidget.classList.contains('mini-ai-closed') ? '▲' : '▼';
    }
    miniAiHeader.onclick = toggleMiniAI;
    miniAiToggle.onclick = (e) => { e.stopPropagation(); toggleMiniAI(); };
    miniAiAsk.onclick = () => {
        const question = miniAiInput.value.trim();
        if (!question) {
            miniAiAnswer.textContent = 'Lütfen bir soru yaz.';
            return;
        }
        miniAiAnswer.textContent = 'Gemini AI düşünüyor...';
        setTimeout(() => {
            miniAiAnswer.textContent = 'Bu bir örnek Gemini AI cevabıdır: "' + question + '" sorusunun cevabı burada gösterilecek.';
        }, 1200);
    };
}
