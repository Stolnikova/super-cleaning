"use strict";

// ========== CALCULATOR LOGIC ==========

const cards = document.querySelectorAll('.service-card');

const calcTotal  = document.querySelector('.calculator p:nth-child(2)');
const calcTitles = document.querySelector('.calculator p:nth-child(3)');

const cardState = new Map();

function parsePrice(priceStr) {
  const match = priceStr.match(/[\d]+/);
  return match ? +match[0] : 0;
}

function updateCalculator() {
  if (cardState.size === 0) {
    calcTotal.textContent = '0 грн';
    calcTitles.innerHTML  = 'Оберіть послугу';
    return;
  }

  let total = 0;
  const lines = [];

  cardState.forEach(({ price, qty, title }) => {
    total += price * qty;
    lines.push(`${title} ×${qty}`);
  });

  calcTotal.textContent = `${total} грн`;
  calcTitles.innerHTML  = lines.map(line => `<span>${line}</span>`).join('');
}

cards.forEach((card) => {
  const minus   = card.querySelector('.qty-minus');
  const plus    = card.querySelector('.qty-plus');
  const counter = card.querySelector('.qty');
  const titleEl = card.querySelector('.service-card-title');
  const priceEl = card.querySelector('.service-card-price');

  const title = titleEl.textContent.trim();
  const price = parsePrice(priceEl.textContent);

  card.addEventListener('click', () => {
    if (card.classList.contains('active')) return;
    card.classList.add('active');
    counter.textContent = 1;
    cardState.set(card, { price, qty: 1, title });
    updateCalculator();
  });

  minus.addEventListener('click', (e) => {
    e.stopPropagation();
    let qty = +counter.textContent;
    if (qty <= 1) {
      card.classList.remove('active');
      counter.textContent = 1;
      cardState.delete(card);
    } else {
      qty--;
      counter.textContent = qty;
      cardState.set(card, { price, qty, title });
    }
    updateCalculator();
  });

  plus.addEventListener('click', (e) => {
    e.stopPropagation();
    const qty = +counter.textContent + 1;
    counter.textContent = qty;
    cardState.set(card, { price, qty, title });
    updateCalculator();
  });
});