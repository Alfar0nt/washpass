import { getOrderDetail, updateOrderStatus } from '../services/api.js';
import { getPhotoUrl } from '../services/api.js';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters.js';
import { getStatusLabel, getStatusBadgeClass, getValidTransitions, ORDER_STATUSES, getStatusDescription } from '../utils/status.js';
import { initMap, addMarker, destroyMap } from '../utils/map.js';

export class OrderDetail {
  constructor(container, options = {}) {
    this.container = container;
    this.onClose = options.onClose || (() => {});
    this.orderId = null;
    this.order = null;
    this.map = null;
    
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="admin-modal-overlay" id="modalOverlay" style="display: none">
        <div class="admin-modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="admin-modal__header">
            <h2 id="modalTitle">Detail Pesanan</h2>
            <button type="button" class="admin-modal__close" id="closeBtn" aria-label="Tutup">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="admin-modal__content" id="modalContent">
            <div class="admin-loading">
              <div class="loading-spinner"></div>
              <p>Memuat detail...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.overlay = this.container.querySelector('#modalOverlay');
    this.modal = this.container.querySelector('#modal');
    this.closeBtn = this.container.querySelector('#closeBtn');
    this.content = this.container.querySelector('#modalContent');
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') this.close();
  }

  async open(orderId) {
    this.orderId = orderId;
    this.overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.showLoading();

    try {
      this.order = await getOrderDetail(orderId);
      this.renderDetail();
    } catch (error) {
      console.error('Failed to load order detail:', error);
      this.showError(error.message || 'Gagal memuat detail pesanan');
    }
  }

  showLoading() {
    this.content.innerHTML = `
      <div class="admin-loading">
        <div class="loading-spinner"></div>
        <p>Memuat detail...</p>
      </div>
    `;
  }

  showError(message) {
    this.content.innerHTML = `
      <div class="admin-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>Gagal Memuat</h3>
        <p>${this.escapeHtml(message)}</p>
        <button type="button" class="btn btn-primary" id="errorCloseBtn">Tutup</button>
      </div>
    `;

    const closeBtn = this.content.querySelector('#errorCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
  }

  close() {
    if (this.map) {
      destroyMap('detailMap');
      this.map = null;
    }
    this.overlay.style.display = 'none';
    document.body.style.overflow = '';
    this.onClose();
  }

  renderDetail() {
    const { items = [], customer_name, whatsapp, address, address_note, total_price, total_items, status, created_at, latitude, longitude } = this.order;
    
    const validTransitions = getValidTransitions(status);
    const statusOptions = validTransitions.length > 0 ? validTransitions : [status];

    this.content.innerHTML = `
      <div class="admin-detail">
        <div class="admin-detail__header">
          <div class="admin-detail__id">
            <span class="admin-detail__order-id">#${this.orderId}</span>
            <span class="status-badge ${getStatusBadgeClass(status)}">${getStatusLabel(status)}</span>
          </div>
          <div class="admin-detail__meta">
            <span>${formatRelativeTime(created_at)}</span>
            <span>${formatDate(created_at)}</span>
          </div>
        </div>

        <div class="admin-detail__section">
          <h3 class="admin-detail__section-title">Data Customer</h3>
          <div class="admin-detail__customer">
            <div class="admin-detail__field">
              <label>Nama</label>
              <span>${this.escapeHtml(customer_name)}</span>
            </div>
            <div class="admin-detail__field">
              <label>WhatsApp</label>
              <a href="https://wa.me/${this.formatWhatsAppForLink(whatsapp)}" target="_blank" rel="noopener" class="whatsapp-link">
                ${this.formatWhatsAppForDisplay(whatsapp)}
              </a>
            </div>
            <div class="admin-detail__field">
              <label>Alamat Pickup</label>
              <span>${this.escapeHtml(address)}</span>
            </div>
            ${address_note ? `
            <div class="admin-detail__field">
              <label>Catatan Alamat</label>
              <span>${this.escapeHtml(address_note)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        ${latitude && longitude ? `
        <div class="admin-detail__section">
          <h3 class="admin-detail__section-title">Lokasi Pickup</h3>
          <div class="admin-detail__location">
            <div class="admin-detail__coordinates">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary);">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              <span>${latitude.toFixed(6)}, ${longitude.toFixed(6)}</span>
            </div>
            <div class="admin-detail__map" id="detailMap" style="height: 300px; border-radius: var(--radius-lg); overflow: hidden;"></div>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}', '_blank')">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Buka di Google Maps
            </button>
          </div>
        </div>
        ` : ''}

        <div class="admin-detail__section">
          <h3 class="admin-detail__section-title">Detail Pesanan (${total_items} item)</h3>
          <div class="admin-detail__items">
            ${items.map((item, index) => this.renderItem(item, index)).join('')}
          </div>
        </div>

        <div class="admin-detail__summary">
          <div class="admin-detail__summary-row">
            <span>Total Harga</span>
            <span>${formatCurrency(total_price)}</span>
          </div>
          <div class="admin-detail__summary-row">
            <span>Jumlah Item</span>
            <span>${total_items} pasang</span>
          </div>
        </div>

        <div class="admin-detail__section">
          <h3 class="admin-detail__section-title">Update Status</h3>
          <div class="admin-detail__status-update">
            <p class="admin-detail__status-desc">${getStatusDescription(status)}</p>
            <div class="admin-detail__status-selector">
              <label for="statusSelect">Ubah Status:</label>
              <select id="statusSelect" class="form-input" ${validTransitions.length === 0 ? 'disabled' : ''}>
                <option value="${status}" selected>${getStatusLabel(status)} (Saat Ini)</option>
                ${validTransitions.map(s => `<option value="${s}">${getStatusLabel(s)}</option>`).join('')}
              </select>
              <button type="button" class="btn btn-primary" id="updateStatusBtn" ${validTransitions.length === 0 ? 'disabled' : ''}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initMapIfNeeded(latitude, longitude);
    this.bindDetailEvents();
  }

  initMapIfNeeded(latitude, longitude) {
    if (!latitude || !longitude || !window.L) return;
    
    setTimeout(() => {
      this.map = initMap('detailMap', {
        zoomControl: true,
        attributionControl: true,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        touchZoom: true,
      });
      
      if (this.map) {
        addMarker(this.map, latitude, longitude, {
          icon: window.L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 36px; height: 36px; background: #0D9488; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>',
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          }),
        });
        this.map.setView([latitude, longitude], 16);
      }
    }, 200);
  }

  renderItem(item, index) {
    const materialLabel = item.material ? this.getMaterialLabel(item.material) : '';
    const washTypeLabel = item.wash_type === 'fast-clean' ? 'Cuci Kering (Fast Clean)' : 'Cuci Basah (Deep Clean)';
    
    return `
      <div class="admin-detail__item">
        <div class="admin-detail__item-header">
          <span class="admin-detail__item-number">${index + 1}.</span>
          <span class="admin-detail__item-category">${item.category === 'shoe' ? 'Sepatu' : 'Sandal'}</span>
          ${materialLabel ? `<span class="admin-detail__item-material">${materialLabel}</span>` : ''}
        </div>
        <div class="admin-detail__item-body">
          <div class="admin-detail__item-row">
            <span class="admin-detail__item-label">Tipe Cuci:</span>
            <span class="admin-detail__item-value">${washTypeLabel}</span>
          </div>
          <div class="admin-detail__item-row">
            <span class="admin-detail__item-label">Harga:</span>
            <span class="admin-detail__item-value">${formatCurrency(item.price)}${item.quantity > 1 ? ` x${item.quantity}` : ''}</span>
          </div>
          ${item.notes ? `
          <div class="admin-detail__item-row">
            <span class="admin-detail__item-label">Catatan:</span>
            <span class="admin-detail__item-value">${this.escapeHtml(item.notes)}</span>
          </div>
          ` : ''}
          ${item.photos && item.photos.length > 0 ? `
          <div class="admin-detail__item-row">
            <span class="admin-detail__item-label">Foto:</span>
            <div class="admin-detail__photos">
              ${item.photos.map(photo => `
                <a href="${getPhotoUrl(photo.filename)}" target="_blank" rel="noopener" class="admin-detail__photo-link">
                  <img src="${getPhotoUrl(photo.filename)}" alt="${this.escapeHtml(photo.original_name)}" class="admin-detail__photo" loading="lazy">
                </a>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  bindDetailEvents() {
    const updateBtn = this.content.querySelector('#updateStatusBtn');
    const statusSelect = this.content.querySelector('#statusSelect');
    
    if (updateBtn && statusSelect) {
      updateBtn.addEventListener('click', async () => {
        const newStatus = statusSelect.value;
        if (newStatus && newStatus !== this.order.status) {
          await this.updateStatus(newStatus);
        }
      });
    }
  }

  async updateStatus(newStatus) {
    const updateBtn = this.content.querySelector('#updateStatusBtn');
    const originalText = updateBtn.innerHTML;
    
    updateBtn.disabled = true;
    updateBtn.innerHTML = '<span class="loading-spinner"></span><span>Menyimpan...</span>';
    
    try {
      await updateOrderStatus(this.orderId, newStatus);
      this.order.status = newStatus;
      this.renderDetail();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Gagal mengupdate status: ' + error.message);
      updateBtn.disabled = false;
      updateBtn.innerHTML = originalText;
    }
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

  formatWhatsAppForLink(whatsapp) {
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.startsWith('62')) return cleaned;
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    return '62' + cleaned;
  }

  formatWhatsAppForDisplay(whatsapp) {
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.startsWith('62')) return '+62 ' + cleaned.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    if (cleaned.startsWith('0')) return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    return whatsapp;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export function initOrderDetail(container, options) {
  return new OrderDetail(container, options);
}