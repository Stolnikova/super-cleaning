"use strict";

// ========== MODAL ==========
const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle    = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalIcon     = document.getElementById('modal-icon');
const modalForm     = document.getElementById('modal-form');
const modalSuccess  = document.getElementById('modal-success');
const modalSubmit   = document.getElementById('modal-submit');

const ICONS = {
  call: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>`,
  clean: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>`,
  order: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>`,
};

function openModal(type, orderData) {
  if (type === 'clean') {
    modalTitle.textContent    = 'Замовити прибирання';
    modalSubtitle.textContent = 'Заповніть форму — ми підберемо зручний час';
    modalIcon.innerHTML       = ICONS.clean;
    modalSubmit.textContent   = 'Замовити прибирання';
  } else if (type === 'order') {
    modalTitle.textContent    = 'Оформити замовлення';
    modalIcon.innerHTML       = ICONS.order;
    modalSubmit.textContent   = 'Підтвердити замовлення';

    // Показуємо список послуг і суму в підзаголовку
    const select = document.getElementById('modal-service-select');
    if (select) select.style.display = 'none';

    if (orderData && orderData.items.length > 0) {
      const list = orderData.items.map(i => `${i.title} ×${i.qty}`).join(', ');
      modalSubtitle.textContent = `${list} — разом: ${orderData.total}`;
    } else {
      modalSubtitle.textContent = 'Ви ще не обрали жодної послуги';
    }
  } else {
    modalTitle.textContent    = 'Замовити дзвінок';
    modalSubtitle.textContent = 'Залиште номер — ми передзвонимо протягом 15 хвилин';
    modalIcon.innerHTML       = ICONS.call;
    modalSubmit.textContent   = 'Надіслати заявку';
  }

  modalForm.style.display = '';
  modalSuccess.classList.remove('show');

  // select показуємо тільки для call і clean
  const select = document.getElementById('modal-service-select');
  if (select) select.style.display = type === 'order' ? 'none' : '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Close on button
modalClose.addEventListener('click', closeModal);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Submit → show success
modalSubmit.addEventListener('click', () => {
  const inputs = modalForm.querySelectorAll('input[required]');
  const allFilled = [...inputs].every(i => i.value.trim() !== '');
  if (!allFilled) return;

  modalForm.style.display = 'none';
  modalSuccess.classList.add('show');
});

// ========== TRIGGERS ==========
// "Замовити дзвінок" — header button
document.querySelectorAll('.btn-call').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('call');
  });
});

// "Замовити прибирання" — hero button
document.querySelectorAll('.btn-clean').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('clean');
  });
});

// "Замовити" — calculator button
const calcBtn = document.querySelector('.calc-btn');
if (calcBtn) {
  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Збираємо дані з калькулятора
    const totalEl  = document.querySelector('.calculator p:nth-child(2)');
    const titlesEl = document.querySelector('.calculator p:nth-child(3)');

    const totalText = totalEl ? totalEl.textContent.trim() : '0 грн';
    const spans     = titlesEl ? [...titlesEl.querySelectorAll('span')] : [];

    const items = spans.map(span => {
      const text  = span.textContent.trim();       // "Диван ×2"
      const match = text.match(/^(.+)\s×(\d+)$/);
      return match
        ? { title: match[1], qty: +match[2] }
        : { title: text, qty: 1 };
    });

    openModal('order', { items, total: totalText });
  });
}