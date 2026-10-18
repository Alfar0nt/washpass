import { initOrderList } from './components/order-list.js';
import { initOrderDetail } from './components/order-detail.js';
import { resetDemoData } from './services/api.js';

const app = document.getElementById('app');

let orderList = null;
let orderDetail = null;

function init() {
  app.innerHTML = `
    <header class="admin-header">
      <div class="container">
        <div class="admin-header__content">
          <div class="admin-header__brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            <span>WashPass Admin</span>
          </div>
          <span class="admin-badge">Panel Admin</span>
          <span class="demo-badge">DEMO</span>
          <button type="button" class="btn btn-outline btn-sm" id="resetDemoBtn">Reset Demo</button>
        </div>
      </div>
    </header>
    <main class="admin-main">
      <div class="container">
        <div id="orderListContainer"></div>
      </div>
    </main>
    <div id="modalContainer"></div>
  `;

  const orderListContainer = document.getElementById('orderListContainer');
  const modalContainer = document.getElementById('modalContainer');

  orderList = initOrderList(orderListContainer, {
    onOrderClick: handleOrderClick,
  });

  orderDetail = initOrderDetail(modalContainer, {
    onClose: () => {},
  });

  document.getElementById('resetDemoBtn').addEventListener('click', () => {
    if (confirm('Reset semua data demo ke seed awal?')) {
      resetDemoData();
      window.location.reload();
    }
  });
}

function handleOrderClick(orderId) {
  orderDetail.open(orderId);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}