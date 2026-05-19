/* timeline.js — fullscreen image viewer (no Swiper) */

document.addEventListener('DOMContentLoaded', () => {

  const slides = [
    { type: 'img', year: '1985', src: 'images/1985.jpg', satellite: 'Landsat 5', note: 'Lago ancora parzialmente integro. La superficie totale supera i 60.000 km².', surface: 67499 },
    { type: 'img', year: '1987', src: 'images/1987.jpg', satellite: 'Landsat 5', note: 'Inizia la divisione tra il bacino nord e quello sud. Il calo si accelera.', surface: 60200 },
    { type: 'img', year: '1989', src: 'images/1989.jpg', satellite: 'Landsat 5', note: 'Split tra Nord e Sud completato. La superficie è già al 59% del valore del 1960.', surface: 55700 },
    { type: 'img', year: '1995', src: 'images/1995.jpg', satellite: 'Landsat 5', note: 'Il bacino sud diventa sempre più salato. Le ultime specie ittiche scompaiono.', surface: 39734 },
    { type: 'img', year: '2000', src: 'images/2000.jpg', satellite: 'Landsat 5', note: 'La parte orientale comincia a prosciugarsi rapidamente. 17.382 km² totali.', surface: 17382 },
    { type: 'img', year: '2007', src: 'images/2007.jpg', satellite: 'Landsat 5', note: 'Minimo storico: il lago è ridotto al 10% della superficie originale del 1960.', surface: 6800 },
    { type: 'img', year: '2009', src: 'images/2009.jpg', satellite: 'Landsat 5', note: 'Il bacino orientale è praticamente scomparso. Solo 8.409 km² rimangono.', surface: 8409 },
    { type: 'transition', surface: null },
    { type: 'img', year: '2016', src: 'images/2016.png', satellite: 'Sentinel-2 L2A', note: 'Post-diga Kokaral: il Piccolo Aral (nord) si è parzialmente ripreso. Il sud continua a ridursi.', surface: 9800 },
    { type: 'img', year: '2018', src: 'images/2018.png', satellite: 'Sentinel-2 L2A', note: 'Il bacino sud continua a restringersi. La superficie totale è ~8.322 km² (−87,85% dal 1960).', surface: 8322 },
    { type: 'img', year: '2020', src: 'images/2020.png', satellite: 'Sentinel-2 L2A', note: 'Il deserto Aralkum è ora chiaramente visibile: sabbia salata dove un tempo c\'era acqua.', surface: 8100 },
    { type: 'img', year: '2022', src: 'images/2022.png', satellite: 'Sentinel-2 L2A', note: 'Situazione stabile al nord, critica al sud. Il bacino est è praticamente scomparso.', surface: 8050 },
    { type: 'img', year: '2024', src: 'images/2024.png', satellite: 'Sentinel-2 L2A', note: 'Stato attuale. Il Grande Aral sud è ridotto a una striscia. Solo l\'Aral nord sopravvive.', surface: 8300 },
  ];

  const BASE = 67499; // superficie 1960 come riferimento 100%

  let current = 0;

  // ---- BUILD DOM ----
  const viewer = document.getElementById('fs-viewer');
  const dotsContainer = document.getElementById('fs-dots');
  const counter = document.getElementById('fs-counter');
  const fill = document.getElementById('progress-fill');
  const pct = document.getElementById('progress-pct');

  // Build slides
  slides.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'fs-slide' + (i === 0 ? ' active' : '');
    el.dataset.index = i;

    if (s.type === 'transition') {
      el.innerHTML = `
        <div class="fs-slide-transition">
          <div class="icon">🛰️</div>
          <h3>Cambio Satellite</h3>
          <p>Landsat 5 ha cessato le operazioni nel 2013.<br>
          Le immagini successive provengono da <strong>Sentinel-2 L2A</strong> (ESA Copernicus, lancio 2015).
          La risoluzione migliora da 30m a 10m per pixel.</p>
        </div>`;
    } else {
      const yearColor = s.year === '2024' ? 'var(--accent2)' : '#fff';
      el.innerHTML = `
        <img src="${s.src}" alt="Mar d'Aral ${s.year}" loading="${i < 2 ? 'eager' : 'lazy'}" />
        <div class="fs-overlay">
          <div class="fs-year" style="color:${yearColor}">${s.year}</div>
          <span class="fs-satellite">${s.satellite}</span>
          <p class="fs-note">${s.note}</p>
        </div>`;
    }

    viewer.appendChild(el);
  });

  // Build dots
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'fs-dot' + (s.type === 'transition' ? ' transition-dot' : '') + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', s.type === 'transition' ? 'cambio satellite' : s.year);
    btn.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(btn);
  });

  // ---- NAVIGATE ----
  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    const allSlides = viewer.querySelectorAll('.fs-slide');
    const allDots = dotsContainer.querySelectorAll('.fs-dot');

    allSlides[current].classList.remove('active');
    allDots[current].classList.remove('active');

    current = index;

    allSlides[current].classList.add('active');
    allDots[current].classList.add('active');

    updateProgress();
    updateCounter();
  }

  document.getElementById('fs-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('fs-next').addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  viewer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // ---- PROGRESS ----
  function updateProgress() {
    if (!fill || !pct) return;
    const surface = slides[current].surface;

    if (surface === null) {
      // slide di transizione
      fill.style.width = '12%';
      pct.textContent = 'cambio satellite';
      pct.style.color = 'var(--text-muted)';
      return;
    }

    const percentage = Math.round((surface / BASE) * 100);
    fill.style.width = percentage + '%';
    pct.textContent = percentage + '% rimasto';
    pct.style.color = percentage > 50 ? 'var(--water-light)' : percentage > 20 ? 'var(--accent)' : 'var(--danger)';
  }

  function updateCounter() {
    if (!counter) return;
    const imgSlides = slides.filter(s => s.type !== 'transition');
    const imgIndex = slides.slice(0, current + 1).filter(s => s.type !== 'transition').length;
    const total = imgSlides.length;

    if (slides[current].type === 'transition') {
      counter.textContent = '— / ' + total;
    } else {
      counter.textContent = imgIndex + ' / ' + total;
    }
  }

  // Init
  updateProgress();
  updateCounter();
});
