export const ORDER_STATUSES = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: 'Belum Diambil',
  [ORDER_STATUSES.PICKED_UP]: 'Sudah Diambil',
  [ORDER_STATUSES.IN_PROGRESS]: 'Lagi Dikerjakan',
  [ORDER_STATUSES.DONE]: 'Selesai',
};

export const STATUS_COLORS = {
  [ORDER_STATUSES.PENDING]: {
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#FCD34D',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  [ORDER_STATUSES.PICKED_UP]: {
    bg: '#DBEAFE',
    text: '#2563EB',
    border: '#60A5FA',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  [ORDER_STATUSES.IN_PROGRESS]: {
    bg: '#FFEDD5',
    text: '#EA580C',
    border: '#FB923C',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  [ORDER_STATUSES.DONE]: {
    bg: '#DCFCE7',
    text: '#16A34A',
    border: '#4ADE80',
    badge: 'bg-green-100 text-green-700 border-green-300',
  },
};

export const STATUS_TRANSITIONS = {
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.PICKED_UP],
  [ORDER_STATUSES.PICKED_UP]: [ORDER_STATUSES.IN_PROGRESS],
  [ORDER_STATUSES.IN_PROGRESS]: [ORDER_STATUSES.DONE],
  [ORDER_STATUSES.DONE]: [],
};

export const STATUS_DESCRIPTIONS = {
  [ORDER_STATUSES.PENDING]: 'Order baru masuk, menunggu tim pickup',
  [ORDER_STATUSES.PICKED_UP]: 'Sepatu sudah diambil oleh tim, dalam perjalanan ke workshop',
  [ORDER_STATUSES.IN_PROGRESS]: 'Sepatu sedang dalam proses pencucian di workshop',
  [ORDER_STATUSES.DONE]: 'Pencucian selesai, sepatu siap diantar kembali ke customer',
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status) {
  return STATUS_COLORS[status] || STATUS_COLORS[ORDER_STATUSES.PENDING];
}

export function getStatusDescription(status) {
  return STATUS_DESCRIPTIONS[status] || '';
}

export function getValidTransitions(currentStatus) {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

export function canTransition(currentStatus, newStatus) {
  const validTransitions = getValidTransitions(currentStatus);
  return validTransitions.includes(newStatus);
}

export function getAllStatuses() {
  return Object.values(ORDER_STATUSES);
}

export function getStatusOptions(currentStatus = null) {
  const allStatuses = getAllStatuses();
  
  if (!currentStatus) {
    return allStatuses.map(status => ({
      value: status,
      label: getStatusLabel(status),
      description: getStatusDescription(status),
    }));
  }

  const validNext = getValidTransitions(currentStatus);
  return allStatuses
    .filter(status => status === currentStatus || validNext.includes(status))
    .map(status => ({
      value: status,
      label: getStatusLabel(status),
      description: getStatusDescription(status),
      isCurrent: status === currentStatus,
    }));
}

export function getStatusBadgeClass(status) {
  const colors = getStatusColor(status);
  return colors.badge;
}

export function getStatusProgress(currentStatus) {
  const order = [ORDER_STATUSES.PENDING, ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.IN_PROGRESS, ORDER_STATUSES.DONE];
  const currentIndex = order.indexOf(currentStatus);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / order.length) * 100;
}