/* nav.js: carica navbar e footer, gestisce hamburger e active link */

async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    el.innerHTML = await res.text();
  } catch {
    // Fallback se fetch non funziona (apertura da filesystem)
    if (id === 'navbar-placeholder') {
      el.innerHTML = `<nav class="site-nav">
        <div class="nav-inner">
          <a href="index.html" class="nav-logo">Mar d'Aral</a>
          <button class="nav-toggle" aria-label="Menu" id="nav-toggle">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links" id="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="timeline.html">Galleria</a></li>
            <li><a href="dati.html">Dati</a></li>
            <li><a href="cause.html">Cause</a></li>
            <li><a href="impatto.html">Impatto</a></li>
            <li><a href="oggi.html">Oggi</a></li>
            <li><a href="fonti.html">Fonti</a></li>
          </ul>
        </div>
      </nav>`;
    } else if (id === 'footer-placeholder') {
      el.innerHTML = `<footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-brand">Mar d'Aral: Il Mare Che Scompare</div>
          <div class="footer-info">
            <span>Istituto Marconi, Verona · Educazione Civica / GPI</span>
            <span>Fernando Rusiru · Diego Prati · Andrea Albertini</span>
          </div>
        </div>
      </footer>`;
    }
  }
}

function initNav() {
  // Hamburger toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Active link highlight
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('navbar-placeholder', 'components/navbar.html'),
    loadComponent('footer-placeholder', 'components/footer.html'),
  ]);
  initNav();
  initScrollAnimations();
});

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => {
    observer.observe(el);
  });
}
