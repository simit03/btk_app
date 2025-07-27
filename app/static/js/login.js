// Giriş ekranı animasyonu
window.onload = () => {
    gsap.from('.login-container', {y: 60, opacity: 0, duration: 0.7, ease: 'power2.out'});
};
// Uyarı fonksiyonu ve fetch ile login kodu kaldırıldı. 