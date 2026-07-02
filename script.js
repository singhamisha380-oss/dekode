/* ============================================
   DEKODE — MAIN SCRIPT
   ============================================ */

/* ---- NAVBAR ---- */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerClose');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  function openMenu() {
    hamburger.classList.add('open');
    mobileOverlay.classList.add('open');
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) closeMenu(); else openMenu();
  });
  mobileOverlay.addEventListener('click', closeMenu);
  closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.target;
      if (target) {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  function updateActiveLink() {
    const sections = ['home','about','services','products','clients','blogs','contact'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.target === current);
    });
  }
  updateActiveLink();
})();

/* ---- HERO BINARY RAIN ---- */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const cols = () => Math.floor(canvas.width / 18);
  let drops = [];
  function initDrops() {
    drops = Array.from({ length: cols() }, () => Math.random() * -100);
  }
  initDrops();
  window.addEventListener('resize', initDrops);

  function draw() {
    ctx.fillStyle = 'rgba(5,5,8,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,212,255,0.18)';
    ctx.font = '12px monospace';
    drops.forEach((y, i) => {
      const char = Math.random() > 0.5 ? '1' : '0';
      ctx.fillText(char, i * 18, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.97) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 75);
})();

/* ---- BANNER SLIDER ---- */
(function () {
  const total = 3;
  const slides = Array.from({ length: total }, (_, i) => document.getElementById('bslide-' + i));
  const dots   = document.querySelectorAll('.banner-dot-item');
  const progress = document.getElementById('bannerProgress');
  let current = 0;
  let timer, progressTimer;
  let isAnimating = false;

  function resetProgress() {
    if (progress) {
      progress.classList.remove('running');
      void progress.offsetWidth; // reflow
      progress.classList.add('running');
    }
  }

  function goTo(n) {
    if (isAnimating) return;
    isAnimating = true;

    const prev = current;
    current = (n + total) % total;

    // Mark previous as leaving
    slides[prev].classList.add('leaving');
    slides[prev].classList.remove('active');

    // Activate new
    slides[current].classList.add('active');

    // Update dots
    dots[prev].classList.remove('active');
    dots[current].classList.add('active');

    // Clean up after transition
    setTimeout(() => {
      slides[prev].classList.remove('leaving');
      isAnimating = false;
    }, 1000);

    // Reset progress bar
    resetProgress();
    restartTimer();
  }

  function restartTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => goTo(current + 1), 6000);
  }

  // Init first slide
  resetProgress();
  restartTimer();

  // Arrow buttons
  const prev = document.getElementById('bannerPrev');
  const next = document.getElementById('bannerNext');
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));

  // Dot buttons
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide);
      if (idx !== current) goTo(idx);
    });
  });

  // Touch / swipe
  let touchStartX = 0;
  const section = document.querySelector('.banner-section');
  if (section) {
    section.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    section.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  }
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Trigger skill bars if inside
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.12 });

  function observe() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
  }
  observe();

  // Also stagger service cards and blog items
  const cardIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const children = e.target.querySelectorAll('.srv-card, .blog-card, .product-card, .client-card');
        children.forEach((c, i) => {
          setTimeout(() => {
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.05 });

  const grids = document.querySelectorAll('.services-grid, .blogs-grid, .blogs-featured, .products-grid, .clients-grid');
  grids.forEach(g => cardIo.observe(g));
})();

/* ---- SKILL BARS ---- */
(function () {
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach(bar => {
    bar.style.width = '0';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.querySelector('.skill-bars');
  if (skillSection) io.observe(skillSection);
})();

/* ---- SERVICE + BLOG CARD STAGGER ---- */
(function () {
  function stagger(cards) {
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(30px)';
      c.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          cards.forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, i * 80);
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.05 });

    if (cards[0] && cards[0].parentElement) io.observe(cards[0].closest('section') || cards[0].parentElement);
  }

  stagger(document.querySelectorAll('.srv-card'));
  stagger(document.querySelectorAll('.blog-card'));
  stagger(document.querySelectorAll('.product-card'));
  stagger(document.querySelectorAll('.client-card'));
})();

/* ---- CONTACT FORM ---- */
(function () {
  const form = document.getElementById('contactForm');
  const formWrap = document.getElementById('formWrap');
  const successState = document.getElementById('successState');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  const resetBtn = document.getElementById('resetBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.display = 'block';
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      formWrap.style.display = 'none';
      successState.style.display = 'block';
      spinner.style.display = 'none';
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 1600);
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    successState.style.display = 'none';
    formWrap.style.display = 'block';
  });
})();

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ======================================
   Contact Form -> WhatsApp
====================================== */

const contactForm = document.getElementById("contactForm");

if(contactForm){

contactForm.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const service=document.getElementById("service").value;
const message=document.getElementById("message").value;

const text=`Hello Dekode,

I am interested in your services.

*Name:* ${name}

*Email:* ${email}

*Service:* ${service}

*Message:*
${message}`;

const url=`https://wa.me/919278154679?text=${encodeURIComponent(text)}`;

window.open(url,"_blank");

contactForm.reset();

});

}
