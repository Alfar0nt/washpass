import { StepManager, ORDER_STEPS, initStepManager } from './components/step-manager.js';
import { initCustomerForm } from './components/customer-form.js';
import { initOrderReview } from './components/order-review.js';
import { cart } from './components/cart.js';
import { submitOrder } from './services/api.js';
import { generateWhatsAppMessage, redirectToWhatsApp } from './utils/whatsapp.js';
import { formatCurrency } from './utils/formatters.js';

const STEP_ORDER = ['category', 'material', 'washType', 'photos', 'cart', 'customer', 'review'];

let stepManager = null;
let customerForm = null;
let orderReview = null;
let currentStepComponent = null;

const stepComponents = {
  category: null,
  material: null,
  washType: null,
  photos: null,
  cart: null,
  customer: null,
  review: null,
};

const app = document.getElementById('app');
const stepIndicatorContainer = document.createElement('div');
stepIndicatorContainer.id = 'stepIndicator';
app.prepend(stepIndicatorContainer);

function init() {
  stepManager = initStepManager(stepIndicatorContainer, {
    onStepChange: handleStepChange,
    onStepComplete: handleStepComplete,
  });

  loadCartFromStorage();
  renderStep('category');
}

function loadCartFromStorage() {
  const stored = localStorage.getItem('washpass_cart');
  if (stored) {
    try {
      cart.items = JSON.parse(stored);
      cart.emit('change');
    } catch (e) {
      console.warn('Failed to load cart:', e);
    }
  }
}

function handleStepChange(step, index) {
  renderStep(step.id);
}

function handleStepComplete(step, index) {
  console.log('Step completed:', step.id);
}

function renderStep(stepId) {
  const contentContainer = document.getElementById('stepContent');
  if (!contentContainer) return;

  if (currentStepComponent && currentStepComponent.destroy) {
    currentStepComponent.destroy();
  }

  switch (stepId) {
    case 'category':
      renderCategoryStep(contentContainer);
      break;
    case 'material':
      renderMaterialStep(contentContainer);
      break;
    case 'washType':
      renderWashTypeStep(contentContainer);
      break;
    case 'photos':
      renderPhotosStep(contentContainer);
      break;
    case 'cart':
      renderCartStep(contentContainer);
      break;
    case 'customer':
      renderCustomerStep(contentContainer);
      break;
    case 'review':
      renderReviewStep(contentContainer);
      break;
  }
}

function renderCategoryStep(container) {
  container.innerHTML = `
    <div class="step-content">
      <h2 class="step-title">Pilih Kategori</h2>
      <p class="step-subtitle">Apa yang ingin Anda cuci hari ini?</p>
      <div class="category-grid" id="categoryGrid">
        <button type="button" class="category-card" data-category="shoe">
          <div class="category-card__icon">👟</div>
          <h3 class="category-card__title">Sepatu</h3>
          <p class="category-card__desc">Sneakers, pantofel, boots, dll</p>
        </button>
        <button type="button" class="category-card" data-category="sandal">
          <div class="category-card__icon">🩴</div>
          <h3 class="category-card__title">Sandal</h3>
          <p class="category-card__desc">Gunung, jepit, flip-flop, dll</p>
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => selectCategory(card.dataset.category));
  });
}

function selectCategory(category) {
  cart.clear();
  const nextStep = category === 'shoe' ? 'material' : 'washType';
  stepManager.completeCurrentStep();
  stepManager.goToStep(STEP_ORDER.indexOf(nextStep));
}

function renderMaterialStep(container) {
  import('./config/pricing.js').then(({ MATERIALS }) => {
    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">Pilih Bahan Sepatu</h2>
        <p class="step-subtitle">Pilih jenis bahan sepatu Anda untuk harga yang tepat</p>
        <div class="material-grid" id="materialGrid">
          ${MATERIALS.map(m => `
            <button type="button" class="material-card" data-material="${m.id}">
              <div class="material-card__icon">${m.icon}</div>
              <h3 class="material-card__title">${m.name}</h3>
              <p class="material-card__desc">${m.description}</p>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.material-card').forEach(card => {
      card.addEventListener('click', () => selectMaterial(card.dataset.material));
    });
  });
}

function selectMaterial(material) {
  const tempItem = { category: 'shoe', material };
  sessionStorage.setItem('washpass_temp_item', JSON.stringify(tempItem));
  stepManager.completeCurrentStep();
  stepManager.next();
}

function renderWashTypeStep(container) {
  import('./config/pricing.js').then(({ WASH_TYPES, getPrice }) => {
    const tempItem = JSON.parse(sessionStorage.getItem('washpass_temp_item') || '{}');
    const isSandal = tempItem.category === 'sandal';
    const material = tempItem.material;

    container.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">Pilih Tipe Pencucian</h2>
        <p class="step-subtitle">${isSandal ? 'Sandal' : 'Sepatu ' + material} — Pilih jenis pencucian</p>
        <div class="wash-type-grid" id="washTypeGrid">
          ${WASH_TYPES.map(w => {
            const price = isSandal ? PRICING.sandal[w.id] : getPrice('shoe', material, w.id);
            return `
              <button type="button" class="wash-type-card" data-wash-type="${w.id}">
                <div class="wash-type-card__icon">${w.icon}</div>
                <h3 class="wash-type-card__title">${w.name}</h3>
                <p class="wash-type-card__desc">${w.description}</p>
                <div class="wash-type-card__meta">
                  <span class="wash-type-card__duration">⏱️ ${w.duration}</span>
                  <span class="wash-type-card__price">${formatCurrency(price)}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.wash-type-card').forEach(card => {
      card.addEventListener('click', () => selectWashType(card.dataset.washType));
    });
  });
}

import { PRICING } from './config/pricing.js';

function selectWashType(washType) {
  const tempItem = JSON.parse(sessionStorage.getItem('washpass_temp_item') || '{}');
  tempItem.wash_type = washType;
  tempItem.price = tempItem.category === 'sandal' 
    ? PRICING.sandal[washType] 
    : PRICING.shoe[tempItem.material]?.[washType] || 0;
  sessionStorage.setItem('washpass_temp_item', JSON.stringify(tempItem));
  stepManager.completeCurrentStep();
  stepManager.next();
}

function renderPhotosStep(container) {
  container.innerHTML = `
    <div class="step-content">
      <h2 class="step-title">Upload Foto & Catatan</h2>
      <p class="step-subtitle">Tambahkan 1-3 foto sepatu/sandal untuk tim kami menilai kondisi</p>
      <div class="photo-uploader" id="photoUploader"></div>
      <div class="photo-preview" id="photoPreview"></div>
      <div class="form-group">
        <label for="itemNotes" class="form-label">Catatan Khusus (Opsional)</label>
        <textarea id="itemNotes" class="form-textarea" rows="3" placeholder="Contoh: Ada noda tinta di sisi kiri, tali hilang 1 sisi"></textarea>
      </div>
      <div class="step-actions">
        <button type="button" class="btn btn-outline" id="backToWashType">Kembali</button>
        <button type="button" class="btn btn-primary" id="addToCart">Tambah ke Keranjang</button>
      </div>
    </div>
  `;

  initPhotoUploader();
  container.querySelector('#backToWashType').addEventListener('click', () => stepManager.previous());
  container.querySelector('#addToCart').addEventListener('click', addToCart);
}

let currentPhotos = [];

function initPhotoUploader() {
  const uploader = document.getElementById('photoUploader');
  const preview = document.getElementById('photoPreview');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  input.style.display = 'none';
  input.id = 'photoInput';
  uploader.appendChild(input);

  uploader.innerHTML = `
    <div class="photo-uploader__zone" id="dropZone">
      <svg class="photo-uploader__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p class="photo-uploader__text">Seret & lepas foto di sini<br>atau klik untuk pilih</p>
      <p class="photo-uploader__hint">Max 3 foto, 5MB per foto (JPEG, PNG, WebP)</p>
    </div>
  `;

  const dropZone = uploader.querySelector('#dropZone');
  dropZone.addEventListener('click', () => input.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('photo-uploader__zone--dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('photo-uploader__zone--dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('photo-uploader__zone--dragover');
    handleFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleFiles(files) {
  const fileArray = Array.from(files).slice(0, 3);
  currentPhotos = fileArray;
  renderPhotoPreview();
}

function renderPhotoPreview() {
  const preview = document.getElementById('photoPreview');
  if (currentPhotos.length === 0) {
    preview.innerHTML = '';
    return;
  }

  preview.innerHTML = `
    <h4 class="preview-title">Preview Foto (${currentPhotos.length}/3)</h4>
    <div class="preview-grid">
      ${currentPhotos.map((file, index) => `
        <div class="preview-item">
          <img src="${URL.createObjectURL(file)}" alt="Preview ${index + 1}" class="preview-img">
          <button type="button" class="preview-remove" data-index="${index}" aria-label="Hapus foto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      `).join('')}
    </div>
  `;

  preview.querySelectorAll('.preview-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      currentPhotos.splice(index, 1);
      renderPhotoPreview();
    });
  });
}

function addToCart() {
  if (currentPhotos.length === 0) {
    alert('Minimal 1 foto harus di-upload');
    return;
  }

  const tempItem = JSON.parse(sessionStorage.getItem('washpass_temp_item') || '{}');
  const notes = document.getElementById('itemNotes').value.trim();
  
  const item = {
    ...tempItem,
    photos: currentPhotos,
    notes: notes || null,
  };

  cart.addItem(item);
  currentPhotos = [];
  sessionStorage.removeItem('washpass_temp_item');
  stepManager.completeCurrentStep();
  stepManager.next();
}

function renderCartStep(container) {
  const items = cart.getItems();
  const totalPrice = cart.getTotalPrice();
  const totalItems = cart.getTotalItems();
  const isValid = cart.isValid();
  const validationMessage = cart.getValidationMessage();

  container.innerHTML = `
    <div class="step-content">
      <h2 class="step-title">Keranjang Pesanan</h2>
      <p class="step-subtitle">${totalItems} item • ${formatCurrency(totalPrice)}</p>
      
      ${!isValid ? `
        <div class="cart-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>${validationMessage}</span>
        </div>
      ` : ''}

      <div class="cart-items" id="cartItems">
        ${items.length === 0 ? `
          <div class="cart-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p>Keranjang kosong</p>
          </div>
        ` : items.map((item, index) => renderCartItem(item, index)).join('')}
      </div>

      ${items.length > 0 ? `
        <div class="cart-summary">
          <div class="cart-summary__row">
            <span>Subtotal</span>
            <span>${formatCurrency(totalPrice)}</span>
          </div>
          <div class="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${formatCurrency(totalPrice)}</span>
          </div>
        </div>
      ` : ''}

      <div class="step-actions">
        <button type="button" class="btn btn-outline" id="addMoreItem" ${items.length === 0 ? 'style="display:none"' : ''}>
          <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Item Lain</span>
        </button>
        <button type="button" class="btn btn-primary" id="proceedToCustomer" ${!isValid ? 'disabled' : ''}>
          <span>Lanjut ke Data Diri</span>
          <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  `;

  container.querySelector('#addMoreItem')?.addEventListener('click', () => {
    stepManager.goToStep(STEP_ORDER.indexOf('category'));
  });
  container.querySelector('#proceedToCustomer')?.addEventListener('click', () => {
    stepManager.completeCurrentStep();
    stepManager.next();
  });

  container.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = btn.dataset.id;
      cart.removeItem(itemId);
      renderCartStep(container);
    });
  });
}

function renderCartItem(item, index) {
  const materialLabel = item.material ? getMaterialLabel(item.material) : '';
  const washTypeLabel = item.wash_type === 'fast-clean' ? 'Cuci Kering' : 'Cuci Basah';
  
  return `
    <div class="cart-item">
      <div class="cart-item__header">
        <span class="cart-item__number">${index + 1}.</span>
        <span class="cart-item__category">${item.category === 'shoe' ? 'Sepatu' : 'Sandal'}</span>
        ${materialLabel ? `<span class="cart-item__material">${materialLabel}</span>` : ''}
        <button type="button" class="cart-item__remove" data-id="${item.id}" aria-label="Hapus item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="cart-item__details">
        <span>${washTypeLabel}</span>
        <span class="cart-item__price">${formatCurrency(item.price)}</span>
      </div>
      ${item.notes ? `<p class="cart-item__notes">${item.notes}</p>` : ''}
    </div>
  `;
}

function getMaterialLabel(material) {
  const labels = {
    'canvas': 'Kanvas / Textile',
    'mesh-knit': 'Mesh / Knit',
    'leather': 'Kulit Asli / Sintetis',
    'suede-nubuck': 'Suede / Nubuck',
    'rubber-eva': 'Karet / EVA / Foam',
  };
  return labels[material] || material;
}

function renderCustomerStep(container) {
  container.innerHTML = `
    <div class="step-content">
      <h2 class="step-title">Data Customer</h2>
      <p class="step-subtitle">Isi data diri untuk pickup & komunikasi via WhatsApp</p>
      <div id="customerFormContainer"></div>
    </div>
  `;

  customerForm = initCustomerForm(container.querySelector('#customerFormContainer'), {
    onSubmit: handleCustomerSubmit,
    onBack: () => stepManager.previous(),
  });
}

function handleCustomerSubmit(formData) {
  const orderData = {
    items: cart.getItems(),
    customer: formData,
    totalPrice: cart.getTotalPrice(),
    totalItems: cart.getTotalItems(),
    latitude: formData.latitude,
    longitude: formData.longitude,
  };

  sessionStorage.setItem('washpass_order_data', JSON.stringify(orderData));
  stepManager.completeCurrentStep();
  stepManager.next();
}

function renderReviewStep(container) {
  const orderData = JSON.parse(sessionStorage.getItem('washpass_order_data') || '{}');
  
  if (!orderData.items || orderData.items.length === 0) {
    stepManager.goToStep(STEP_ORDER.indexOf('cart'));
    return;
  }

  orderReview = initOrderReview(container, {
    orderData,
    onSubmit: handleOrderSubmit,
    onBackToCart: () => stepManager.goToStep(STEP_ORDER.indexOf('cart')),
    onBackToCustomer: () => stepManager.goToStep(STEP_ORDER.indexOf('customer')),
  });
}

async function handleOrderSubmit() {
  const orderData = JSON.parse(sessionStorage.getItem('washpass_order_data') || '{}');
  orderReview.setSubmitting(true);

  try {
    const formData = new FormData();
    formData.append('customer_name', orderData.customer.name);
    formData.append('whatsapp', orderData.customer.whatsapp);
    formData.append('address', orderData.customer.address);
    formData.append('address_note', orderData.customer.address_note || '');
    if (orderData.latitude) formData.append('latitude', orderData.latitude.toString());
    if (orderData.longitude) formData.append('longitude', orderData.longitude.toString());
    formData.append('items', JSON.stringify(orderData.items));
    formData.append('total_price', orderData.totalPrice.toString());
    formData.append('total_items', orderData.totalItems.toString());

    orderData.items.forEach((item, itemIndex) => {
      item.photos?.forEach((photo, photoIndex) => {
        formData.append('photos', photo);
      });
    });

    const response = await submitOrder(formData);
    
    if (response.orderId) {
      const waMessage = generateWhatsAppMessage(orderData);
      sessionStorage.removeItem('washpass_order_data');
      sessionStorage.removeItem('washpass_cart');
      cart.clear();
      redirectToWhatsApp(waMessage);
    } else {
      throw new Error('Gagal membuat order');
    }
  } catch (error) {
    console.error('Order submit error:', error);
    alert('Gagal mengirim pesanan: ' + error.message);
    orderReview.setSubmitting(false);
  }
}

function getMaterialLabel(material) {
  const labels = {
    'canvas': 'Kanvas / Textile',
    'mesh-knit': 'Mesh / Knit',
    'leather': 'Kulit Asli / Sintetis',
    'suede-nubuck': 'Suede / Nubuck',
    'rubber-eva': 'Karet / EVA / Foam',
  };
  return labels[material] || material;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}