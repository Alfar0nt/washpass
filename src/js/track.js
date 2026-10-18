import { initFooter } from './components/footer.js';
import { trackOrder } from './services/api.js';
import { getStatusLabel, getStatusDescription, getStatusColor } from './utils/status.js';
import { formatCurrency, formatDate, formatRelativeTime } from './utils/formatters.js';
import { MATERIALS, WASH_TYPES } from './config/pricing.js';

const STATUS_FLOW = ['pending', 'picked_up', 'in_progress', 'done'];

function materialLabel(id) {
  return MATERIALS.find((m) => m.id === id)?.name || '';
}

function washLabel(id) {
  return WASH_TYPES.find((w) => w.id === id)?.name || id;
}

function categoryLabel(category) {
  return category === 'sandal' ? 'Sandal' : 'Sepatu';
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function renderHeader() {
  return `
    <header class="track-header">
      <a href="/" class="track-header__brand" aria-label="WashPass beranda">
        <span class="track-header__mark" aria-hidden="true">👟</span>
        <span class="track-header__logo">WashPass</span>
        <span class="demo-badge">DEMO</span>
      </a>
      <a href="/" class="track-header__back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Kembali ke Beranda</span>
      </a>
    </header>
  `;
}

function renderTimeline(currentStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return `
    <ol class="track-timeline" aria-label="Tahapan pesanan">
      ${STATUS_FLOW.map((status, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'future';
        return `
          <li class="track-timeline__item track-timeline__item--${state}">
            <span class="track-timeline__dot" aria-hidden="true"></span>
            <span class="track-timeline__label">${getStatusLabel(status)}</span>
          </li>
        `;
      }).join('')}
    </ol>
  `;
}

function renderResult(order) {
  const color = getStatusColor(order.status);
  const items = order.items || [];

  return `
    <div class="track-result">
      <div class="track-result__head">
        <div>
          <p class="track-result__order-id">Pesanan #${order.id}</p>
          <p class="track-result__updated">Diperbarui ${escapeHtml(formatRelativeTime(order.updated_at))}</p>
        </div>
        <span class="track-status" style="background:${color.bg};color:${color.text};border-color:${color.border}">
          ${getStatusLabel(order.status)}
        </span>
      </div>

      <p class="track-result__desc">${escapeHtml(getStatusDescription(order.status))}</p>

      ${renderTimeline(order.status)}

      <div class="track-result__grid">
        <div class="track-meta">
          <span class="track-meta__label">Dibuat</span>
          <span class="track-meta__value">${escapeHtml(formatDate(order.created_at))}</span>
        </div>
        <div class="track-meta">
          <span class="track-meta__label">Jumlah</span>
          <span class="track-meta__value">${order.total_items} pasang</span>
        </div>
      </div>

      <h3 class="track-result__subtitle">Rincian Item</h3>
      <ul class="track-items">
        ${items.map((item) => `
          <li class="track-item">
            <div class="track-item__info">
              <span class="track-item__name">
                ${categoryLabel(item.category)}${item.material ? ` — ${escapeHtml(materialLabel(item.material))}` : ''}
              </span>
              <span class="track-item__wash">${escapeHtml(washLabel(item.wash_type))}</span>
            </div>
            <span class="track-item__price">${formatCurrency(item.price)}</span>
          </li>
        `).join('')}
      </ul>

      <div class="track-result__total">
        <span>Total</span>
        <span>${formatCurrency(order.total_price)}</span>
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${renderHeader()}
    <main id="main" class="track-main">
      <div class="container">
        <div class="track-hero">
          <h1 class="track-hero__title">Lacak Pesanan</h1>
          <p class="track-hero__subtitle">Masukkan nomor pesanan Anda (contoh: 12) untuk melihat status pencucian terkini.</p>
        </div>

        <form class="track-form" id="trackForm" novalidate>
          <label class="track-form__label" for="orderId">Nomor Pesanan</label>
          <div class="track-form__row">
            <input
              class="track-form__input"
              id="orderId"
              name="orderId"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="Contoh: 12"
              aria-describedby="trackError"
            >
            <button type="submit" class="btn btn-primary track-form__submit">Lacak</button>
          </div>
          <p class="track-form__error" id="trackError" role="alert" hidden></p>
        </form>

        <div class="track-output" id="trackOutput" aria-live="polite"></div>
      </div>
    </main>
    <footer id="footer"></footer>
  `;

  initFooter(document.getElementById('footer'));

  const form = document.getElementById('trackForm');
  const input = document.getElementById('orderId');
  const errorEl = document.getElementById('trackError');
  const output = document.getElementById('trackOutput');

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    output.innerHTML = '';

    const id = input.value.trim();
    if (!/^\d+$/.test(id)) {
      showError('Nomor pesanan tidak valid. Masukkan angka saja.');
      return;
    }

    const submitBtn = form.querySelector('.track-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mencari...';

    try {
      const order = await trackOrder(id);
      output.innerHTML = renderResult(order);
    } catch (error) {
      output.innerHTML = `
        <div class="track-empty">
          <p>${escapeHtml(error.message || 'Pesanan tidak ditemukan.')}</p>
          <p class="track-empty__hint">Periksa kembali nomor pesanan Anda.</p>
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Lacak';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
