const popupId = new URLSearchParams(window.location.search).get('popup');
const popupFromUrl = document.getElementById(popupId);

if (popupFromUrl) {
  popupFromUrl.style.display = 'block';
}

// Основная логика с кнопкой
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('openFeedbackBtn');
  const popupManual = document.getElementById('feedbackPopup');
  const close = popupManual?.querySelector('.close');

  if (btn && popupManual) {
    btn.onclick = () => {
      popupManual.style.display = 'block';
    };
  }

  if (close && popupManual) {
    close.onclick = () => {
      popupManual.style.display = 'none';
    };
  }

  window.onclick = e => {
    if (e.target === popupManual) popupManual.style.display = 'none';
  };
});

const feedbackBtn = document.getElementById('openFeedbackBtn');
if (feedbackBtn) {
  feedbackBtn.addEventListener('click', () => {
    gtag('event', 'click', {
      event_category: 'popup',
      event_label: 'Feedback Button',
      value: 1
    });
    console.log('gtag отправлен: Feedback Button');
  });
}
