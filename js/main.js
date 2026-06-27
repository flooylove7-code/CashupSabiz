// ─── NAV BURGER ───
const burger = document.querySelector('.burger');
const navMobile = document.querySelector('.nav-mobile');
if (burger && navMobile) {
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (navMobile.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── ACTIVE NAV LINK ───
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── SCROLL FADE UP ───
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => io.observe(el));
}

// ─── COUNTER ANIMATION (smooth, no flicker) ───
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = '1';

  const rawTarget = el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const target = parseFloat(rawTarget);
  const isDecimal = rawTarget.includes('.');
  const duration = 1600;

  // easeInOutQuart: slow start → fast middle → slow landing — no jarring jumps
  function ease(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function format(val) {
    if (isDecimal) return prefix + val.toFixed(1) + suffix;
    return prefix + Math.round(val) + suffix;
  }

  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    el.textContent = format(target * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + rawTarget + suffix;
  }

  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-counter]');
if (counterEls.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => cio.observe(el));
}

// ─── MODULE ACCORDION ───
document.querySelectorAll('.module-header').forEach(header => {
  header.addEventListener('click', () => {
    const module = header.closest('.module');
    module.classList.toggle('open');
  });
});

// ─── ICON DRAW ANIMATION — hover (desktop) + auto on scroll (mobile) ───
document.querySelectorAll('.card').forEach(card => {
  const paths = card.querySelectorAll('.icon-anim-draw');
  paths.forEach(p => {
    const len = p.getTotalLength ? p.getTotalLength() : 100;
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 0.6s ease';
  });

  // Desktop hover
  card.addEventListener('mouseenter', () => {
    paths.forEach(p => { p.style.strokeDashoffset = '0'; });
  });
  card.addEventListener('mouseleave', () => {
    // Only reset on hover-out if card was NOT yet scroll-triggered
    if (!card.dataset.iconPlayed) {
      paths.forEach(p => {
        const len = p.getTotalLength ? p.getTotalLength() : 100;
        p.style.strokeDashoffset = len;
      });
    }
  });
});

// Auto-trigger icon animation on scroll — fires once per card
const cardIconIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const card = e.target;
      const paths = card.querySelectorAll('.icon-anim-draw');
      // small delay so the fade-up animation leads
      setTimeout(() => {
        paths.forEach(p => { p.style.strokeDashoffset = '0'; });
        card.dataset.iconPlayed = '1';
      }, 420);
      cardIconIO.unobserve(card);
    }
  });
}, { threshold: 0.45 });

document.querySelectorAll('.card').forEach(card => cardIconIO.observe(card));
