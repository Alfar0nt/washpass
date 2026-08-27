import { LocationPicker, initLocationPicker } from './location-picker.js';

export class CustomerForm {
  constructor(container, options = {}) {
    this.container = container;
    this.onSubmit = options.onSubmit || (() => {});
    this.onBack = options.onBack || (() => {});
    this.initialData = options.initialData || {};
    
    this.locationPicker = null;
    this.formData = {
      name: this.initialData.name || '',
      whatsapp: this.initialData.whatsapp || '',
      address: this.initialData.address || '',
      address_note: this.initialData.address_note || '',
      latitude: this.initialData.latitude || null,
      longitude: this.initialData.longitude || null,
    };
    
    this.render();
    this.bindEvents();
    this.initLocationPicker();
    this.populateForm();
  }

  render() {
    this.container.innerHTML = `
      <form class="customer-form" id="customerForm" novalidate>
        <div class="form-group">
          <label for="name" class="form-label">Nama Lengkap <span class="required">*</span></label>
          <input type="text" id="name" name="name" class="form-input" required autocomplete="name" placeholder="Masukkan nama lengkap Anda">
          <div class="form-error" id="nameError"></div>
        </div>

        <div class="form-group">
          <label for="whatsapp" class="form-label">Nomor WhatsApp <span class="required">*</span></label>
          <input type="tel" id="whatsapp" name="whatsapp" class="form-input" required autocomplete="tel" placeholder="08xxxxxxxxxx" inputmode="tel">
          <div class="form-hint">Format: 08xxxxxxxxxx atau +628xxxxxxxxxx</div>
          <div class="form-error" id="whatsappError"></div>
        </div>

        <div class="form-group">
          <label for="address" class="form-label">Alamat Pickup <span class="required">*</span></label>
          <textarea id="address" name="address" class="form-textarea" required rows="3" placeholder="Masukkan alamat lengkap untuk pickup (nama jalan, RT/RW, kelurahan, kecamatan, kota)"></textarea>
          <div class="form-error" id="addressError"></div>
        </div>

        <div class="form-group">
          <label for="address_note" class="form-label">Catatan Alamat (Opsional)</label>
          <textarea id="address_note" name="address_note" class="form-textarea" rows="2" placeholder="Contoh: Kos warna biru, lantai 2, dekat masjid"></textarea>
        </div>

        <div class="form-group location-picker-group">
          <div id="locationPickerContainer"></div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline btn-lg" id="backBtn">
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Kembali</span>
          </button>
          <button type="submit" class="btn btn-primary btn-lg">
            <span>Review Pesanan</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </form>
    `;

    this.form = this.container.querySelector('#customerForm');
    this.locationPickerContainer = this.container.querySelector('#locationPickerContainer');
    this.backBtn = this.container.querySelector('#backBtn');
  }

  initLocationPicker() {
    this.locationPicker = initLocationPicker(this.locationPickerContainer, {
      onLocationChange: (location) => {
        if (location) {
          this.formData.latitude = location.latitude;
          this.formData.longitude = location.longitude;
        } else {
          this.formData.latitude = null;
          this.formData.longitude = null;
        }
      },
      onError: (error) => {
        console.warn('Location picker error:', error);
      },
      onLoadingChange: (loading) => {
        this.backBtn.disabled = loading;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = loading;
      },
    });
  }

  populateForm() {
    const fields = ['name', 'whatsapp', 'address', 'address_note'];
    fields.forEach(field => {
      const input = this.form.querySelector(`[name="${field}"]`);
      if (input && this.formData[field]) {
        input.value = this.formData[field];
      }
    });

    if (this.formData.latitude && this.formData.longitude) {
      this.locationPicker.setLocation(this.formData.latitude, this.formData.longitude);
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.backBtn.addEventListener('click', () => this.onBack());

    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.clearError(input.name));
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let error = '';

    switch (name) {
      case 'name':
        if (!value) error = 'Nama lengkap wajib diisi';
        else if (value.length < 2) error = 'Nama minimal 2 karakter';
        break;
      case 'whatsapp':
        if (!value) error = 'Nomor WhatsApp wajib diisi';
        else if (!this.validateWhatsApp(value)) error = 'Format nomor WhatsApp tidak valid (contoh: 08xxxxxxxxxx)';
        break;
      case 'address':
        if (!value) error = 'Alamat pickup wajib diisi';
        else if (value.length < 10) error = 'Alamat terlalu pendek, masukkan alamat lengkap';
        break;
    }

    if (error) {
      this.showError(name, error);
      return false;
    } else {
      this.clearError(name);
      return true;
    }
  }

  validateWhatsApp(whatsapp) {
    const cleaned = whatsapp.replace(/\s+/g, '');
    return /^(\+62|62|0)8[1-9]\d{7,10}$/.test(cleaned);
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      const firstError = this.form.querySelector('.form-input.error, .form-textarea.error');
      if (firstError) firstError.focus();
      return;
    }

    const formData = new FormData(this.form);
    this.formData.name = formData.get('name').trim();
    this.formData.whatsapp = formData.get('whatsapp').trim();
    this.formData.address = formData.get('address').trim();
    this.formData.address_note = formData.get('address_note').trim();

    this.onSubmit({ ...this.formData });
  }

  showError(fieldName, message) {
    const input = this.form.querySelector(`[name="${fieldName}"]`);
    const errorEl = this.form.querySelector(`#${fieldName}Error`);
    
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  clearError(fieldName) {
    const input = this.form.querySelector(`[name="${fieldName}"]`);
    const errorEl = this.form.querySelector(`#${fieldName}Error`);
    
    if (input) input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  getData() {
    return { ...this.formData };
  }

  setLoading(loading) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.disabled = loading;
    this.backBtn.disabled = loading;
    
    if (loading) {
      submitBtn.innerHTML = '<span class="loading-spinner"></span><span>Memproses...</span>';
    } else {
      submitBtn.innerHTML = '<span>Review Pesanan</span><svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>';
    }
  }

  destroy() {
    if (this.locationPicker) {
      this.locationPicker.destroy();
    }
  }
}

export function initCustomerForm(container, options) {
  return new CustomerForm(container, options);
}