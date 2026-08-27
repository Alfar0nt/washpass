import { PRICING, MATERIALS, WASH_TYPES } from '../config/pricing.js';

export class PriceTable {
  constructor(container, options = {}) {
    this.container = container;
    this.activeTab = 'shoe';
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <section id="pricing" class="section price-table" aria-labelledby="pricing-title">
        <div class="container">
          <div class="section-header">
            <h2 id="pricing-title" class="section-header__title">Daftar Harga</h2>
            <p class="section-header__description">Harga transparan per kategori bahan & tipe cuci (per pasang)</p>
          </div>
          <div class="price-table__tabs" role="tablist" aria-label="Kategori harga">
            <button role="tab" class="price-table__tab ${this.activeTab === 'shoe' ? 'price-table__tab--active' : ''}" aria-selected="${this.activeTab === 'shoe'}" data-tab="shoe" aria-controls="panel-shoe" id="tab-shoe">Sepatu</button>
            <button role="tab" class="price-table__tab ${this.activeTab === 'sandal' ? 'price-table__tab--active' : ''}" aria-selected="${this.activeTab === 'sandal'}" data-tab="sandal" aria-controls="panel-sandal" id="tab-sandal">Sandal</button>
          </div>
          <div role="tabpanel" id="panel-shoe" class="price-table__panel ${this.activeTab === 'shoe' ? 'price-table__panel--active' : ''}" aria-labelledby="tab-shoe">
            ${this.renderShoeTable()}
          </div>
          <div role="tabpanel" id="panel-sandal" class="price-table__panel ${this.activeTab === 'sandal' ? 'price-table__panel--active' : ''}" aria-labelledby="tab-sandal" hidden>
            ${this.renderSandalTable()}
          </div>
        </div>
      </section>
    `;
  }

  renderShoeTable() {
    const rows = MATERIALS.map(material => `
      <tr>
        <td class="price-table__material">${material.name}</td>
        <td class="price-table__price">${this.formatPrice(PRICING.shoe[material.id]['fast-clean'])}</td>
        <td class="price-table__price">${this.formatPrice(PRICING.shoe[material.id]['deep-clean'])}</td>
      </tr>
    `).join('');

    return `
      <div style="overflow-x: auto;">
        <table class="price-table__table">
          <thead>
            <tr>
              <th scope="col">Bahan Sepatu</th>
              <th scope="col">Cuci Kering (Fast Clean)</th>
              <th scope="col">Cuci Basah (Deep Clean)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <tr class="price-table__note"><td colspan="3">* Harga per pasang. Estimasi: Fast Clean 1-2 hari, Deep Clean 3-5 hari.</td></tr>
    `;
  }

  renderSandalTable() {
    return `
      <div style="overflow-x: auto;">
        <table class="price-table__table">
          <thead>
            <tr>
              <th scope="col">Jenis Sandal</th>
              <th scope="col">Cuci Kering (Fast Clean)</th>
              <th scope="col">Cuci Basah (Deep Clean)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="price-table__material">Semua Jenis Sandal</td>
              <td class="price-table__price">${this.formatPrice(PRICING.sandal['fast-clean'])}</td>
              <td class="price-table__price">${this.formatPrice(PRICING.sandal['deep-clean'])}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <tr class="price-table__note"><td colspan="3">* Harga flat rate untuk semua jenis sandal. Estimasi: Fast Clean 1-2 hari, Deep Clean 3-5 hari.</td></tr>
    `;
  }

  formatPrice(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  bindEvents() {
    this.container.querySelectorAll('.price-table__tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
  }

  switchTab(tab) {
    if (tab === this.activeTab) return;
    
    this.activeTab = tab;
    
    this.container.querySelectorAll('.price-table__tab').forEach(t => {
      t.classList.toggle('price-table__tab--active', t.dataset.tab === tab);
      t.setAttribute('aria-selected', t.dataset.tab === tab);
    });
    
    this.container.querySelectorAll('.price-table__panel').forEach(panel => {
      const isActive = panel.id === `panel-${tab}`;
      panel.classList.toggle('price-table__panel--active', isActive);
      panel.hidden = !isActive;
    });
  }
}

export function initPriceTable(container, options) {
  return new PriceTable(container, options);
}