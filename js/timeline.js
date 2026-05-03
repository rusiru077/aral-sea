/* timeline.js: Swiper satellite gallery */

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 24,
    grabCursor: true,
    effect: 'slide',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
    on: {
      slideChange: function () {
        updateProgress(this.activeIndex, this.slides.length);
      },
      init: function () {
        updateProgress(this.activeIndex, this.slides.length);
      },
    },
  });

  function updateProgress(activeIndex, total) {
    const fill = document.getElementById('progress-fill');
    const pct = document.getElementById('progress-pct');
    if (!fill || !pct) return;

    // Surface data for water remaining indicator
    const surfaces = [67499, 60200, 55700, 39734, 17382, 8409, null, null, null, 8322, 12014, 8322, 8300];
    const labels = ['1985','1987','1989','1995','2000','2007','2009','(cambio satellite)','2016','2018','2020','2022','2024'];

    const slideIndex = Math.min(activeIndex, surfaces.length - 1);
    const surface = surfaces[slideIndex];
    const percentage = surface ? Math.round((surface / 67499) * 100) : null;

    const widthPct = percentage ? percentage : 12;
    fill.style.width = widthPct + '%';

    if (percentage) {
      pct.textContent = percentage + '% rimasto';
      pct.style.color = percentage > 50 ? 'var(--water-light)' : percentage > 20 ? 'var(--accent)' : 'var(--danger)';
    } else {
      pct.textContent = 'cambio satellite';
      pct.style.color = 'var(--text-muted)';
    }
  }
});
