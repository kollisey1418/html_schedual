let data = [];
let currentIndex = 0;

function loadCarousel() {
  if (!jsonFile) {
    console.error('JSON file path not defined.');
    return;
  }

  fetch(jsonFile)
    .then(res => res.json())
    .then(json => {
      data = json;
      currentIndex = Math.floor(data.length / 2); // поставить активной центральную карточку
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

  carousel.scrollLeft = carousel.scrollWidth / 2 - carousel.clientWidth / 2;

}

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
