import { getOrders, getOrderStats } from '../services/api.js';
import { formatCurrency, formatRelativeTime } from '../utils/formatters.js';
import { getStatusLabel, getStatusBadgeClass, ORDER_STATUSES } from '../utils/status.js';

const REFRESH_INTERVAL_MS = 30000;

export class OrderList {
  constructor(container, options = {}) {
    this.container = container;
    this.onOrderClick = options.onOrderClick || (() => {});
    this.onRefresh = options.onRefresh || (() => {});
    this.initialStatusFilter = options.statusFilter || null;

    this.orders = [];
    this.stats = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.statusFilter = this.initialStatusFilter;
    this.dateFilter = 'all';
    this.sortOrder = 'newest';

    this.render();
    this.bindEvents();
    this.refresh();

    this.refreshInterval = setInterval(() => {
      if (!document.hidden) this.refresh(true);
    }, REFRESH_INTERVAL_MS);
  }

  destroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  render() {
    this.container.innerHTML = `
      <div class="admin-order-list">
        <div class="admin-order-list__header">
          <h1 class="admin-order-list__title">Daftar Pesanan</h1>
          <div class="admin-order-list__filters">
            <input
              type="search"
              class="admin-filter admin-filter--search"
              id="searchInput"
              placeholder="Cari nama / WhatsApp / ID..."
              aria-label="Cari pesanan"
            >
            <select class="admin-filter" id="statusFilter" aria-label="Filter status">
              <option value="">Semua Status</option>
              ${Object.values(ORDER_STATUSES).map(status => `
                <option value="${status}" ${this.initialStatusFilter === status ? 'selected' : ''}>
                  ${getStatusLabel(status)}
                </option>
              `).join('')}
            </select>
            <select class="admin-filter" id="dateFilter" aria-label="Filter tanggal">
              <option value="all">Semua Tanggal</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
            </select>
            <select class="admin-filter" id="sortOrder" aria-label="Urutkan">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
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

        <div class="admin-stats" id="statsRow"></div>

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
            <p id="emptyStateText">Pesanan akan muncul di sini saat customer memesan</p>
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
    this.emptyStateText = this.container.querySelector('#emptyStateText');
    this.tableContainer = this.container.querySelector('#tableContainer');
    this.cardList = this.container.querySelector('#cardList');
    this.tableBody = this.container.querySelector('#ordersTableBody');
    this.statsRow = this.container.querySelector('#statsRow');
    this.searchInput = this.container.querySelector('#searchInput');
    this.statusFilterEl = this.container.querySelector('#statusFilter');
    this.dateFilterEl = this.container.querySelector('#dateFilter');
    this.sortOrderEl = this.container.querySelector('#sortOrder');
    this.refreshBtn = this.container.querySelector('#refreshBtn');
  }

  bindEvents() {
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderOrders();
    });

    this.statusFilterEl.addEventListener('change', (e) => {
      this.statusFilter = e.target.value || null;
      this.loadOrders();
    });

    this.dateFilterEl.addEventListener('change', (e) => {
      this.dateFilter = e.target.value;
      this.renderOrders();
    });

    this.sortOrderEl.addEventListener('change', (e) => {
      this.sortOrder = e.target.value;
      this.renderOrders();
    });

    this.refreshBtn.addEventListener('click', () => this.refresh());
  }

  async refresh(silent = false) {
    await Promise.all([this.loadOrders(silent), this.loadStats()]);
  }

  async loadStats() {
    try {
      this.stats = await getOrderStats();
      this.renderStats();
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  renderStats() {
    if (!this.stats) return;
    const { byStatus = {}, todayOrders = 0, todayRevenue = 0 } = this.stats;
    const cards = [
      { label: 'Belum Diambil', value: byStatus.pending || 0, tone: 'pending' },
      { label: 'Sudah Diambil', value: byStatus.picked_up || 0, tone: 'picked_up' },
      { label: 'Dikerjakan', value: byStatus.in_progress || 0, tone: 'in_progress' },
      { label: 'Selesai', value: byStatus.done || 0, tone: 'done' },
      { label: 'Dibatalkan', value: byStatus.cancelled || 0, tone: 'cancelled' },
      { label: 'Order Hari Ini', value: todayOrders, tone: 'neutral' },
      { label: 'Pendapatan Hari Ini', value: formatCurrency(todayRevenue), tone: 'neutral' },
    ];

    this.statsRow.innerHTML = cards.map(card => `
      <div class="admin-stat-card admin-stat-card--${card.tone}">
        <span class="admin-stat-card__value">${card.value}</span>
        <span class="admin-stat-card__label">${card.label}</span>
      </div>
    `).join('');
  }

  async loadOrders(silent = false) {
    if (!silent) this.setLoading(true);

    try {
      this.orders = await getOrders(this.statusFilter);
      this.renderOrders();
    } catch (error) {
      console.error('Failed to load orders:', error);
      if (!silent) this.showError('Gagal memuat pesanan');
    } finally {
      if (!silent) this.setLoading(false);
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

  getVisibleOrders() {
    let list = [...this.orders];

    if (this.searchQuery) {
      const q = this.searchQuery;
      const qDigits = q.replace(/\D/g, '');
      list = list.filter(order => {
        const nameMatch = (order.customer_name || '').toLowerCase().includes(q);
        const idMatch = String(order.id) === q || String(order.id).includes(q);
        const waDigits = (order.whatsapp || '').replace(/\D/g, '');
        const waMatch = qDigits.length > 0 && waDigits.includes(qDigits);
        return nameMatch || idMatch || waMatch;
      });
    }

    if (this.dateFilter !== 'all') {
      const todayStr = this.localDateStr(new Date());
      list = list.filter(order => {
        const orderDate = (order.created_at || '').slice(0, 10);
        if (this.dateFilter === 'today') return orderDate === todayStr;
        if (this.dateFilter === 'week') {
          const created = new Date((order.created_at || '').replace(' ', 'T'));
          if (isNaN(created.getTime())) return false;
          return (Date.now() - created.getTime()) <= 7 * 86400000;
        }
        return true;
      });
    }

    if (this.sortOrder === 'oldest') list.reverse();

    return list;
  }

  localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  renderOrders() {
    const orders = this.getVisibleOrders();

    if (orders.length === 0) {
      this.emptyState.style.display = 'flex';
      this.tableContainer.style.display = 'none';
      this.cardList.style.display = 'none';
      this.emptyStateText.textContent = this.orders.length > 0
        ? 'Tidak ada pesanan yang cocok dengan filter/pencarian'
        : 'Pesanan akan muncul di sini saat customer memesan';
      return;
    }

    this.emptyState.style.display = 'none';

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.tableContainer.style.display = 'none';
      this.cardList.style.display = 'block';
      this.renderCardList(orders);
    } else {
      this.tableContainer.style.display = 'block';
      this.cardList.style.display = 'none';
      this.renderTable(orders);
    }
  }

  completedBadge(order) {
    if (order.status !== ORDER_STATUSES.DONE || !order.updated_at) return '';
    return `<span class="admin-cell-sub">Selesai ${formatRelativeTime(order.updated_at)}</span>`;
  }

  renderTable(orders) {
    this.tableBody.innerHTML = orders.map(order => `
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
        <td>
          ${formatRelativeTime(order.created_at)}
          ${this.completedBadge(order)}
        </td>
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

    this.bindRowEvents(this.tableBody, 'tr[data-order-id]');
  }

  renderCardList(orders) {
    this.cardList.innerHTML = orders.map(order => `
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
        ${order.status === ORDER_STATUSES.DONE && order.updated_at ? `
          <span class="admin-cell-sub">Selesai ${formatRelativeTime(order.updated_at)}</span>
        ` : ''}
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

    this.bindRowEvents(this.cardList, '.admin-card');
  }

  bindRowEvents(root, selector) {
    root.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onOrderClick(parseInt(btn.dataset.orderId));
      });
    });

    root.querySelectorAll('.location-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openMap(parseFloat(btn.dataset.lat), parseFloat(btn.dataset.lng));
      });
    });

    root.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => this.onOrderClick(parseInt(el.dataset.orderId)));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onOrderClick(parseInt(el.dataset.orderId));
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
    this.container.querySelector('#retryBtn')?.addEventListener('click', () => this.refresh());
  }
}

export function initOrderList(container, options) {
  return new OrderList(container, options);
}
