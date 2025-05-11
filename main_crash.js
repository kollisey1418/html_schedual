document.addEventListener('DOMContentLoaded', function() {
  const pathname = window.location.pathname;

  let userLang = 'en';
  if (pathname.includes('_ru')) {
    userLang = 'ru';
  } else if (pathname.includes('_me')) {
    userLang = 'me';
  }

  function showCrashPopup(title, text) {
    const popupEl  = document.getElementById('crashPopup');
    const titleEl  = document.getElementById('crashPopupTitle');
    const textEl   = document.getElementById('crashPopupText');
    const closeBtn = document.getElementById('closeCrashPopup');

    titleEl.textContent = title;
    textEl.textContent  = text;
    popupEl.style.display = 'block';

    closeBtn.addEventListener('click', () => {
      popupEl.style.display = 'none';
    });
  }

  if (typeof crashKey === 'undefined') return;

  fetch('active_schedule.json')
    .then(res => res.json())
    .then(schedule => {
      if (schedule[crashKey] === true) {
        fetch('translations.json')
          .then(r => r.json())
          .then(trans => {
            const langPack = trans[userLang] || trans['en'];
            showCrashPopup(langPack.crash_popup_title, langPack.crash_popup_text);
          })
          .catch(err => console.error('Error loading translations:', err));
      }
    })
    .catch(err => console.error('Error loading active_schedule.json:', err));
});
