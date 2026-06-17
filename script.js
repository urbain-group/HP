'use strict';

/* ===== BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== HEADER: scroll effect ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const navBackdrop = document.getElementById('navBackdrop');

function closeNav() {
  nav.classList.remove('open');
  navToggle.classList.remove('open');
  navBackdrop.classList.remove('open');
  document.body.classList.remove('nav-open');
}

navToggle.addEventListener('click', e => {
  e.stopPropagation();
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navBackdrop.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
});

nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

navBackdrop.addEventListener('click', closeNav);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

/* ===== HERO SLIDER ===== */
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 5000);

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== GALLERY FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach((item, i) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) {
        item.style.animationDelay = `${(i % 9) * 0.05}s`;
      }
    });
  });
});

/* ===== LIGHTBOX ===== */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let allItems = [];
let currentIndex = 0;

function buildItemList() {
  allItems = [...document.querySelectorAll('.gallery-item:not(.hidden) .btn-zoom')];
}

function openLightbox(idx) {
  buildItemList();
  currentIndex = idx;
  const btn = allItems[currentIndex];
  lightboxImg.src = btn.dataset.src;
  lightboxTitle.textContent = btn.dataset.title || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

function showPrev() {
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    currentIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    const btn = allItems[currentIndex];
    lightboxImg.src = btn.dataset.src;
    lightboxTitle.textContent = btn.dataset.title || '';
    lightboxImg.style.opacity = '1';
  }, 200);
}

function showNext() {
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % allItems.length;
    const btn = allItems[currentIndex];
    lightboxImg.src = btn.dataset.src;
    lightboxTitle.textContent = btn.dataset.title || '';
    lightboxImg.style.opacity = '1';
  }, 200);
}

document.querySelectorAll('.btn-zoom').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    buildItemList();
    const idx = allItems.indexOf(btn);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

/* ===== TOUCH SWIPE for lightbox ===== */
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
}, { passive: true });

/* ===== ACTIVE NAV on scroll ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));
