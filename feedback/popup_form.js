document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('openFeedbackBtn');
  const popup = document.getElementById('feedbackPopup');
  const close = popup.querySelector('.close');

  btn.onclick = () => popup.style.display = 'block';
  close.onclick = () => popup.style.display = 'none';
  window.onclick = e => { if (e.target === popup) popup.style.display = 'none'; };
});
