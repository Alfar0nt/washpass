import { getOrders } from '../services/api.js';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters.js';
import { getStatusLabel, getStatusBadgeClass, ORDER_STATUSES } from '../utils/status.js';

export class OrderList {
  constructor(container, options = {}) {
    this.container = container;
    this.onOrderClick = options.onOrderClick || (() => {});
    this.onRefresh = options.onRefresh || (() => {});
    this.statusFilter = options.statusFilter || null;
    
    this.orders = [];
    this.isLoading = false;
    
    this.render();
    this.bindEvents();
    this.loadOrders();
  }

  render() {
    this.container.innerHTML = `
      <div class="admin-order-list">
        <div class="admin-order-list__header">
          <h1 class="admin-order-list__title">Daftar Pesanan</h1>
          <div class="admin-order-list__filters">
            <select class="admin-filter" id="statusFilter" aria-label="Filter status">
              <option value="">Semua Status</option>
              ${Object.values(ORDER_STATUSES).map(status => `
                <option value="${status}" ${this.statusFilter === status ? 'selected' : ''}>
                  ${getStatusLabel(status)}
                </option>
              `).join('')}
            </select>
            <button type="button" class="btn btn-outline" id="refreshBtn">
              <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div class="admin-order-list__content" id="ordersContent">
          <div class="admin-loading" id="loadingState">
            <div class="loading-spinner"></div>
            <p>Memuat pesanan...</p>
          </div>
          <div class="admin-empty" id="emptyState" style="display: none;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3>Belum ada pesanan</h3>
            <p>Pesanan akan muncul di sini saat customer memesan</p>
          </div>
          <div class="admin-table-container" id="tableContainer" style="display: none;">
            <table class="admin-table" role="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Customer</th>
                  <th scope="col">WhatsApp</th>
                  <th scope="col">Item</th>
                  <th scope="col">Total</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col">Status</th>
                  <th scope="col">Lokasi</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody"></tbody>
            </table>
          </div>
          <div class="admin-card-list" id="cardList" style="display: none;"></div>
        </div>
      </div>
    `;

    this.loadingState = this.container.querySelector('#loadingState');
    this.emptyState = this.container.querySelector('#emptyState');
    this.tableContainer = this.container.querySelector('#tableContainer');
    this.cardList = this.container.querySelector('#cardList');
    this.tableBody = this.container.querySelector('#ordersTableBody');
    this.statusFilter = this.container.querySelector('#statusFilter');
    this.refreshBtn = this.container.querySelector('#refreshBtn');
  }

  bindEvents() {
    this.statusFilter.addEventListener('change', (e) => {
      this.statusFilter = e.target.value || null;
      this.loadOrders();
    });

    this.refreshBtn.addEventListener('click', () => this.loadOrders());
  }

  async loadOrders() {
    this.setLoading(true);
    
    try {
      this.orders = await getOrders(this.statusFilter);
      this.renderOrders();
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.showError('Gagal memuat pesanan');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.loadingState.style.display = loading ? 'flex' : 'none';
    this.refreshBtn.disabled = loading;
    
    if (loading) {
      this.refreshBtn.innerHTML = '<span class="loading-spinner"></span><span>Memuat...</span>';
    } else {
      this.refreshBtn.innerHTML = '<svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg><span>Refresh</span>';
    }
  }

  renderOrders() {
    if (this.orders.length === 0) {
      this.emptyState.style.display = 'flex';
      this.tableContainer.style.display = 'none';
      this.cardList.style.display = 'none';
      return;
    }

    this.emptyState.style.display = 'none';
    
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      this.tableContainer.style.display = 'none';
      this.cardList.style.display = 'block';
      this.renderCardList();
    } else {
      this.tableContainer.style.display = 'block';
      this.cardList.style.display = 'none';
      this.renderTable();
    }
  }

  renderTable() {
    this.tableBody.innerHTML = this.orders.map(order => `
      <tr data-order-id="${order.id}" tabindex="0" role="button" aria-label="Lihat detail pesanan ${order.id}">
        <td>${order.id}</td>
        <td>${this.escapeHtml(order.customer_name)}</td>
        <td>
          <a href="https://wa.me/${this.formatWhatsAppForLink(order.whatsapp)}" target="_blank" rel="noopener" class="whatsapp-link">
            ${this.formatWhatsAppForDisplay(order.whatsapp)}
          </a>
        </td>
        <td>${order.total_items || 0} pasang</td>
        <td>${formatCurrency(order.total_price)}</td>
        <td>${formatRelativeTime(order.created_at)}</td>
        <td>
          <span class="status-badge ${getStatusBadgeClass(order.status)}">
            ${getStatusLabel(order.status)}
          </span>
        </td>
        <td>
          ${order.latitude && order.longitude ? `
            <button type="button" class="btn btn-ghost btn-sm location-btn" data-lat="${order.latitude}" data-lng="${order.longitude}" aria-label="Lihat lokasi di peta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
            </button>
          ` : '<span class="text-muted">—</span>'}
        </td>
        <td>
          <button type="button" class="btn btn-outline btn-sm detail-btn" data-order-id="${order.id}" aria-label="Detail pesanan ${order.id}">
            Detail
          </button>
        </td>
      </tr>
    `).join('');

    this.tableBody.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = parseInt(btn.dataset.orderId);
        this.onOrderClick(orderId);
      });
    });

    this.tableBody.querySelectorAll('.location-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        this.openMap(lat, lng);
      });
    });

    this.tableBody.querySelectorAll('tr[data-order-id]').forEach(row => {
      row.addEventListener('click', () => {
        const orderId = parseInt(row.dataset.orderId);
        this.onOrderClick(orderId);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const orderId = parseInt(row.dataset.orderId);
          this.onOrderClick(orderId);
        }
      });
    });
  }

  renderCardList() {
    this.cardList.innerHTML = this.orders.map(order => `
      <article class="admin-card" data-order-id="${order.id}" tabindex="0" role="button" aria-label="Lihat detail pesanan ${order.id}">
        <div class="admin-card__header">
          <div>
            <span class="admin-card__id">#${order.id}</span>
            <span class="status-badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
          </div>
          <span class="admin-card__date">${formatRelativeTime(order.created_at)}</span>
        </div>
        <div class="admin-card__customer">
          <strong>${this.escapeHtml(order.customer_name)}</strong>
          <a href="https://wa.me/${this.formatWhatsAppForLink(order.whatsapp)}" target="_blank" rel="noopener" class="whatsapp-link">
            ${this.formatWhatsAppForDisplay(order.whatsapp)}
          </a>
        </div>
        <div class="admin-card__meta">
          <span>${order.total_items || 0} item</span>
          <span>${formatCurrency(order.total_price)}</span>
        </div>
        ${order.latitude && order.longitude ? `
          <button type="button" class="btn btn-ghost btn-sm location-btn" data-lat="${order.latitude}" data-lng="${order.longitude}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            Lihat Lokasi
          </button>
        ` : ''}
        <button type="button" class="btn btn-outline btn-sm detail-btn" data-order-id="${order.id}">Detail</button>
      </article>
    `).join('');

    this.cardList.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = parseInt(btn.dataset.orderId);
        this.onOrderClick(orderId);
      });
    });

    this.cardList.querySelectorAll('.location-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        this.openMap(lat, lng);
      });
    });

    this.cardList.querySelectorAll('.admin-card').forEach(card => {
      card.addEventListener('click', () => {
        const orderId = parseInt(card.dataset.orderId);
        this.onOrderClick(orderId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const orderId = parseInt(card.dataset.orderId);
          this.onOrderClick(orderId);
        }
      });
    });
  }

  openMap(lat, lng) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
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

  showError(message) {
    this.loadingState.style.display = 'none';
    this.emptyState.style.display = 'flex';
    this.emptyState.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>Gagal Memuat</h3>
      <p>${message}. Periksa koneksi Anda lalu coba lagi.</p>
      <button type="button" class="btn btn-primary" id="retryBtn">
        <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        <span>Coba Lagi</span>
      </button>
    `;
    this.container.querySelector('#retryBtn')?.addEventListener('click', () => this.loadOrders());
  }
}

export function initOrderList(container, options) {
  return new OrderList(container, options);
}