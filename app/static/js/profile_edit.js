document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('profile-edit-form');
  const btn = document.querySelector('.profile-edit-btn');
  if (form && btn) {
    form.addEventListener('submit', function() {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Kaydediliyor...';
    });
  }
}); 