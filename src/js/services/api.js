const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export async function submitOrder(formData) {
  return request('/orders', {
    method: 'POST',
    body: formData,
    headers: {},
  });
}

export async function getOrders(status = null) {
  const query = status ? `?status=${status}` : '';
  return request(`/orders${query}`);
}

export async function getOrderDetail(id) {
  return request(`/orders/${id}`);
}

export async function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export function getPhotoUrl(filename) {
  return `/uploads/${filename}`;
}