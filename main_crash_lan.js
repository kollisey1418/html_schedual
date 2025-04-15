document.addEventListener('DOMContentLoaded', function() {
  // 1. Определяем язык по названию файла

  const pathname = window.location.pathname;

  // Можно использовать небольшой helper:
  let userLang = 'en'; // fallback
  if (pathname.includes('_ru')) {
    userLang = 'ru';
  } else if (pathname.includes('_me')) {
    userLang = 'me';
  }


  // 2. Функция показа попапа
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

  // 3. Загружаем active_schedule.json, проверяем crash-поля
  fetch('/active_schedule.json')
    .then(res => res.json())
    .then(schedule => {
      if (schedule.crash_SvSt === true) {
        // 4. Загружаем translations.json и берем текст
        fetch('/translations.json')
          .then(r => r.json())
          .then(trans => {
            // Если нет такого userLang в файле, берем fallback en
            const langPack = trans[userLang] || trans.en;
            showCrashPopup(langPack.crash_popup_title, langPack.crash_popup_text);
          })
          .catch(err => console.error('Error loading translations:', err));
      }
    })
    .catch(err => console.error('Error loading schedule:', err));
});
