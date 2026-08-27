import { getCurrentPosition, LOCATION_ERRORS, reverseGeocode, formatCoordinates, openInMaps } from '../utils/location.js';
import { createMiniMap } from '../utils/map.js';

export class LocationPicker {
  constructor(container, options = {}) {
    this.container = container;
    this.onLocationChange = options.onLocationChange || (() => {});
    this.onError = options.onError || (() => {});
    this.onLoadingChange = options.onLoadingChange || (() => {});
    
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;
    this.map = null;
    this.isLoading = false;
    
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="location-picker">
        <div class="location-picker__header">
          <label class="location-picker__label">Share Lokasi GPS (Opsional)</label>
          <p class="location-picker__hint">Gunakan lokasi saat ini untuk memudahkan tim pickup menemukan alamat Anda</p>
        </div>
        
        <div class="location-picker__actions">
          <button type="button" class="btn btn-outline location-picker__btn" id="getLocationBtn">
            <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            <span>Gunakan Lokasi Saya</span>
          </button>
          
          <button type="button" class="btn btn-ghost location-picker__clear" id="clearLocationBtn" style="display: none;">
            <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Hapus Lokasi</span>
          </button>
        </div>

        <div class="location-picker__status" id="locationStatus" style="display: none;"></div>

        <div class="location-picker__preview" id="locationPreview" style="display: none;">
          <div class="location-picker__coordinates" id="coordinatesDisplay"></div>
          <div class="location-picker__map-container" id="miniMapContainer" style="height: 200px; border-radius: var(--radius-lg); overflow: hidden;"></div>
          <div class="location-picker__map-actions">
            <button type="button" class="btn btn-sm btn-ghost" id="openInMapsBtn">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>Buka di Google Maps</span>
            </button>
          </div>
        </div>

        <div class="location-picker__loading" id="loadingOverlay" style="display: none;">
          <div class="loading-spinner"></div>
          <p>Mengambil lokasi Anda...</p>
        </div>
      </div>
    `;

    this.getLocationBtn = this.container.querySelector('#getLocationBtn');
    this.clearLocationBtn = this.container.querySelector('#clearLocationBtn');
    this.locationStatus = this.container.querySelector('#locationStatus');
    this.locationPreview = this.container.querySelector('#locationPreview');
    this.coordinatesDisplay = this.container.querySelector('#coordinatesDisplay');
    this.miniMapContainer = this.container.querySelector('#miniMapContainer');
    this.openInMapsBtn = this.container.querySelector('#openInMapsBtn');
    this.loadingOverlay = this.container.querySelector('#loadingOverlay');
  }

  bindEvents() {
    this.getLocationBtn.addEventListener('click', () => this.getLocation());
    this.clearLocationBtn.addEventListener('click', () => this.clearLocation());
    this.openInMapsBtn.addEventListener('click', () => this.openInMaps());
  }

  async getLocation() {
    if (this.isLoading) return;

    this.setLoading(true);
    this.hideStatus();
    this.hidePreview();

    try {
      const position = await getCurrentPosition();
      
      this.latitude = position.latitude;
      this.longitude = position.longitude;
      this.accuracy = position.accuracy;

      this.showPreview();
      
      this.coordinatesDisplay.textContent = formatCoordinates(this.latitude, this.longitude);
      
      this.map = createMiniMap('miniMapContainer', this.latitude, this.longitude);
      
      this.setLoading(false);
      this.getLocationBtn.style.display = 'none';
      this.clearLocationBtn.style.display = 'inline-flex';

      this.onLocationChange({
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.accuracy,
      });

      this.tryReverseGeocode();
    } catch (error) {
      this.setLoading(false);
      this.showError(error.message || 'Gagal mengambil lokasi');
      this.onError(error);
    }
  }

  async tryReverseGeocode() {
    try {
      const address = await reverseGeocode(this.latitude, this.longitude);
      if (address) {
        this.showStatus(`Lokasi ditemukan: ${address}`, 'success');
      }
    } catch (error) {
      // Silently fail, coordinates are enough
    }
  }

  clearLocation() {
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;
    
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.hidePreview();
    this.hideStatus();
    
    this.getLocationBtn.style.display = 'inline-flex';
    this.clearLocationBtn.style.display = 'none';

    this.onLocationChange(null);
  }

  openInMaps() {
    if (this.latitude && this.longitude) {
      openInMaps(this.latitude, this.longitude, 'Lokasi Pickup WashPass');
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.loadingOverlay.style.display = loading ? 'flex' : 'none';
    this.getLocationBtn.disabled = loading;
    this.onLoadingChange(loading);
  }

  showStatus(message, type = 'info') {
    this.locationStatus.textContent = message;
    this.locationStatus.className = `location-picker__status location-picker__status--${type}`;
    this.locationStatus.style.display = 'block';
  }

  hideStatus() {
    this.locationStatus.style.display = 'none';
  }

  showError(message) {
    this.showStatus(message, 'error');
  }

  showPreview() {
    this.locationPreview.style.display = 'block';
  }

  hidePreview() {
    this.locationPreview.style.display = 'none';
  }

  getLocation() {
    return this.latitude && this.longitude ? {
      latitude: this.latitude,
      longitude: this.longitude,
      accuracy: this.accuracy,
    } : null;
  }

  setLocation(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.showPreview();
    this.coordinatesDisplay.textContent = formatCoordinates(latitude, longitude);
    this.map = createMiniMap('miniMapContainer', latitude, longitude);
    this.getLocationBtn.style.display = 'none';
    this.clearLocationBtn.style.display = 'inline-flex';
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export function initLocationPicker(container, options) {
  return new LocationPicker(container, options);
}