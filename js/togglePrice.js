document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth <= 550) {
    const toggleBtn = document.getElementById('togglePrice');
    const priceBlock = document.getElementById('priceSection');

    if (toggleBtn && priceBlock) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = priceBlock.style.display === 'none' || getComputedStyle(priceBlock).display === 'none';

        priceBlock.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.src = isHidden ? 'img/toggle_up.png' : 'img/toggle_down.png';
      });
    }
  }
});
