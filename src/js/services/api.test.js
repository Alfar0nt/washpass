import { beforeEach, describe, expect, it } from 'vitest';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

globalThis.localStorage = createMemoryStorage();

const api = await import('./api.js');

function validFormData(overrides = {}) {
  const formData = new FormData();
  formData.append('customer_name', 'Tester Demo');
  formData.append('whatsapp', '081234567890');
  formData.append('address', 'Jl. Contoh Alamat No. 1, Jakarta');
  formData.append('address_note', '');
  formData.append(
    'items',
    JSON.stringify([
      { category: 'shoe', material: 'canvas', wash_type: 'fast-clean', price: 35000, photos: 0 },
      { category: 'sandal', wash_type: 'deep-clean', price: 30000, photos: 0 },
    ])
  );
  formData.append('total_price', '65000');
  formData.append('total_items', '2');
  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value);
  }
  return formData;
}

beforeEach(() => {
  localStorage.clear();
});

describe('mock api (localStorage)', () => {
  it('seeds 10 orders, newest first', async () => {
    const orders = await api.getOrders();
    expect(orders).toHaveLength(10);
    expect(orders[0].id).toBeGreaterThan(orders[9].id);
    expect(orders[0]).not.toHaveProperty('items');
  });

  it('trackOrder returns sanitized payload without PII', async () => {
    const tracked = await api.trackOrder(1001);
    expect(tracked).toHaveProperty('status');
    expect(tracked).not.toHaveProperty('customer_name');
    expect(tracked).not.toHaveProperty('whatsapp');
    expect(tracked).not.toHaveProperty('address');
  });

  it('trackOrder rejects non-numeric and missing ids', async () => {
    await expect(api.trackOrder('abc')).rejects.toThrow();
    await expect(api.trackOrder(9999)).rejects.toThrow();
  });

  it('enforces status transitions', async () => {
    const pending = (await api.getOrders('pending'))[0];
    await api.updateOrderStatus(pending.id, 'picked_up');
    await expect(api.updateOrderStatus(pending.id, 'done')).rejects.toThrow(
      /Invalid status transition/
    );
  });

  it('computes stats with zero-filled statuses', async () => {
    const stats = await api.getOrderStats();
    expect(stats.total).toBe(10);
    expect(stats.byStatus.cancelled).toBe(1);
    expect(Object.keys(stats.byStatus)).toHaveLength(5);
  });

  it('creates a new order via submitOrder', async () => {
    const response = await api.submitOrder(validFormData());
    expect(response.status).toBe('success');
    const detail = await api.getOrderDetail(response.orderId);
    expect(detail.customer_name).toBe('Tester Demo');
    expect(detail.items).toHaveLength(2);
    expect(detail.total_price).toBe(65000);
  });

  it('rejects invalid whatsapp on submit', async () => {
    await expect(api.submitOrder(validFormData({ whatsapp: '12345' }))).rejects.toThrow(
      /WhatsApp/
    );
  });

  it('getPhotoUrl resolves seeded photo to data URL', async () => {
    const detail = await api.getOrderDetail(1001);
    const filename = detail.items[0].photos[0].filename;
    expect(api.getPhotoUrl(filename)).toMatch(/^data:image\/svg/);
  });

  it('resetDemoData restores seed', async () => {
    await api.submitOrder(validFormData());
    api.resetDemoData();
    const orders = await api.getOrders();
    expect(orders).toHaveLength(10);
  });
});
