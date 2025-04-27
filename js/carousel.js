let originalData = [];
let data = [];

function loadCarousel() {
  if (!jsonFile) {
    console.error('JSON file path not defined.');
    return;
  }

  fetch(jsonFile)
    .then(res => res.json())
    .then(json => {
      originalData = json;

      // Сформировать новый массив
      data = [
        ...originalData.slice(-2), // последние 2 карточки
        ...originalData,
        ...originalData.slice(0, 2) // первые 2 карточки
      ];

      currentIndex = originalData.length + Math.floor(originalData.length / 2);
      renderCarousel();
    })
    .catch(err => console.error('Error loading JSON:', err));
}



function renderCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel || data.length === 0) return;

  carousel.innerHTML = '';

  data.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'card' + (i === currentIndex ? ' active' : '');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h4>${item.title}</h4>
    `;
    card.onclick = () => {
      if (i === currentIndex) openPopup(item);
      else {
        currentIndex = i;
        renderCarousel();
      }
    };
    carousel.appendChild(card);
  });

  // Центрируем сразу
  setTimeout(() => {
    carousel.scrollLeft = carousel.scrollWidth / 2 - carousel.clientWidth / 2;
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');

  carousel.addEventListener('scroll', () => {
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft <= 50) {
      // слишком влево → прыгаем в центр
      carousel.scrollLeft = maxScrollLeft / 2;
    }

    if (carousel.scrollLeft >= maxScrollLeft - 50) {
      // слишком вправо → прыгаем в центр
      carousel.scrollLeft = maxScrollLeft / 2;
    }
  });
});


function nextSlide() {
  currentIndex = (currentIndex + 1) % data.length;
  renderCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + data.length) % data.length;
  renderCarousel();
}

function openPopup(item) {
  // Открыть внутренний pop-up с инфой
  document.getElementById('popup-text').innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.info}</p>
  `;
  document.getElementById('popupInner').style.display = 'flex';
}

function closeInnerPopup() {
  // Закрывает только инфо-попап
  document.getElementById('popupInner').style.display = 'none';
}

function openExplorerPopup() {
  // Открывает только карусель
  document.getElementById('explorerPopup').classList.add('visible');
}

function closeExplorerPopup() {
  // Закрывает только карусель
  document.getElementById('explorerPopup').classList.remove('visible');
}
