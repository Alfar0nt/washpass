import { formatCurrency } from '../utils/formatters.js';

export class OrderReview {
  constructor(container, options = {}) {
    this.container = container;
    this.onSubmit = options.onSubmit || (() => {});
    this.onBackToCart = options.onBackToCart || (() => {});
    this.onBackToCustomer = options.onBackToCustomer || (() => {});
    
    this.orderData = options.orderData || {};
    this.isSubmitting = false;
    
    this.render();
    this.bindEvents();
  }

  render() {
    const { items = [], customer, totalPrice = 0, totalItems = 0 } = this.orderData;
    
    this.container.innerHTML = `
      <div class="order-review">
        <div class="order-review__section">
          <h3 class="order-review__title">Ringkasan Pesanan</h3>
          <div class="order-review__items" id="orderItems">
            ${items.map((item, index) => this.renderItem(item, index)).join('')}
          </div>
        </div>

        <div class="order-review__section">
          <h3 class="order-review__title">Data Customer</h3>
          <div class="order-review__customer" id="customerInfo">
            ${this.renderCustomer(customer)}
          </div>
        </div>

        ${this.orderData.latitude && this.orderData.longitude ? `
        <div class="order-review__section">
          <h3 class="order-review__title">Lokasi Pickup</h3>
          <div class="order-review__location">
            <div class="order-review__coordinates">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary);">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              <span>${this.orderData.latitude.toFixed(6)}, ${this.orderData.longitude.toFixed(6)}</span>
            </div>
            <div class="order-review__map" id="reviewMap" style="height: 200px; border-radius: var(--radius-lg); overflow: hidden;"></div>
          </div>
        </div>
        ` : ''}

        <div class="order-review__total">
          <div class="order-review__total-row">
            <span>Total Harga</span>
            <span class="order-review__total-price">${formatCurrency(totalPrice)}</span>
          </div>
          <div class="order-review__total-row">
            <span>Jumlah Item</span>
            <span>${totalItems} pasang</span>
          </div>
        </div>

        <div class="order-review__actions">
          <button type="button" class="btn btn-outline btn-lg" id="backToCartBtn">
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Ubah Pesanan</span>
          </button>
          <button type="button" class="btn btn-outline btn-lg" id="backToCustomerBtn">
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Ubah Data Diri</span>
          </button>
          <button type="button" class="btn btn-primary btn-lg btn-full" id="submitBtn">
            <span>Kirim Pesanan via WhatsApp</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </button>
        </div>
      </div>
    `;

    this.submitBtn = this.container.querySelector('#submitBtn');
    this.backToCartBtn = this.container.querySelector('#backToCartBtn');
    this.backToCustomerBtn = this.container.querySelector('#backToCustomerBtn');
    this.reviewMapContainer = this.container.querySelector('#reviewMap');

    if (this.reviewMapContainer) {
      this.initReviewMap();
    }
  }

  initReviewMap() {
    if (!window.L) return;
    
    const { latitude, longitude } = this.orderData;
    const map = window.L.map('reviewMap', {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    window.L.marker([latitude, longitude], {
      icon: window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 32px; height: 32px; background: #0D9488; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    }).addTo(map);

    map.setView([latitude, longitude], 16);
  }

  renderItem(item, index) {
    const materialLabel = this.getMaterialLabel(item.material);
    const washTypeLabel = item.wash_type === 'fast-clean' ? 'Cuci Kering (Fast Clean)' : 'Cuci Basah (Deep Clean)';
    
    return `
      <div class="order-review__item">
        <div class="order-review__item-header">
          <span class="order-review__item-number">${index + 1}.</span>
          <span class="order-review__item-category">${item.category === 'shoe' ? 'Sepatu' : 'Sandal'}</span>
          ${item.category === 'shoe' ? `<span class="order-review__item-material">${materialLabel}</span>` : ''}
        </div>
        <div class="order-review__item-details">
          <div class="order-review__item-detail">
            <span class="order-review__item-label">Tipe Cuci:</span>
            <span class="order-review__item-value">${washTypeLabel}</span>
          </div>
          <div class="order-review__item-detail">
            <span class="order-review__item-label">Harga:</span>
            <span class="order-review__item-value">${formatCurrency(item.price)}</span>
          </div>
          ${item.notes ? `
          <div class="order-review__item-detail">
            <span class="order-review__item-label">Catatan:</span>
            <span class="order-review__item-value">${item.notes}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderCustomer(customer) {
    if (!customer) return '';
    
    return `
      <div class="order-review__customer-row">
        <span class="order-review__customer-label">Nama:</span>
        <span class="order-review__customer-value">${customer.name}</span>
      </div>
      <div class="order-review__customer-row">
        <span class="order-review__customer-label">WhatsApp:</span>
        <span class="order-review__customer-value">${customer.whatsapp}</span>
      </div>
      <div class="order-review__customer-row">
        <span class="order-review__customer-label">Alamat:</span>
        <span class="order-review__customer-value">${customer.address}</span>
      </div>
      ${customer.address_note ? `
      <div class="order-review__customer-row">
        <span class="order-review__customer-label">Catatan:</span>
        <span class="order-review__customer-value">${customer.address_note}</span>
      </div>
      ` : ''}
    `;
  }

  getMaterialLabel(material) {
    const labels = {
      'canvas': 'Kanvas / Textile',
      'mesh-knit': 'Mesh / Knit',
      'leather': 'Kulit Asli / Sintetis',
      'suede-nubuck': 'Suede / Nubuck',
      'rubber-eva': 'Karet / EVA / Foam',
    };
    return labels[material] || material;
  }

  bindEvents() {
    this.submitBtn.addEventListener('click', () => this.handleSubmit());
    this.backToCartBtn.addEventListener('click', () => this.onBackToCart());
    this.backToCustomerBtn.addEventListener('click', () => this.onBackToCustomer());
  }

  handleSubmit() {
    if (this.isSubmitting) return;
    this.onSubmit();
  }

  setSubmitting(submitting) {
    this.isSubmitting = submitting;
    this.submitBtn.disabled = submitting;
    this.backToCartBtn.disabled = submitting;
    this.backToCustomerBtn.disabled = submitting;
    
    if (submitting) {
      this.submitBtn.innerHTML = '<span class="loading-spinner"></span><span>Mengirim pesanan...</span>';
    } else {
      this.submitBtn.innerHTML = '<span>Kirim Pesanan via WhatsApp</span><svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>';
    }
  }

  updateOrderData(orderData) {
    this.orderData = orderData;
    this.render();
    this.bindEvents();
  }
}

export function initOrderReview(container, options) {
  return new OrderReview(container, options);
}