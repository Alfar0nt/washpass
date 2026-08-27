import { EventEmitter } from './event-emitter.js';

export class Cart extends EventEmitter {
  constructor() {
    super();
    this.items = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('washpass_cart');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
      this.items = [];
    }
    this.emit('change');
  }

  saveToStorage() {
    try {
      localStorage.setItem('washpass_cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }

  addItem(item) {
    const existingIndex = this.items.findIndex(i => 
      i.category === item.category && 
      i.material === item.material && 
      i.wash_type === item.wash_type
    );

    if (existingIndex >= 0) {
      this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + 1;
    } else {
      this.items.push({ ...item, quantity: 1, id: Date.now().toString() });
    }

    this.saveToStorage();
    this.emit('change');
    return this.items;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveToStorage();
    this.emit('change');
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveToStorage();
      this.emit('change');
    }
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.emit('change');
  }

  getItems() {
    return [...this.items];
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  getItemCount() {
    return this.items.length;
  }

  isValid() {
    return this.getTotalItems() >= 2;
  }

  getValidationMessage() {
    const total = this.getTotalItems();
    if (total === 0) return 'Keranjang kosong';
    if (total === 1) return 'Minimal order 2 pasang. Tambahkan 1 item lagi.';
    return null;
  }
}

export const cart = new Cart();