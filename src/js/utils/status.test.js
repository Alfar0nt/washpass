import { describe, it, expect } from 'vitest';
import {
  ORDER_STATUSES,
  canTransition,
  getStatusLabel,
  getStatusBadgeClass,
  getStatusProgress,
} from './status.js';

describe('status transitions', () => {
  it('allows forward transitions', () => {
    expect(canTransition(ORDER_STATUSES.PENDING, ORDER_STATUSES.PICKED_UP)).toBe(true);
    expect(canTransition(ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.IN_PROGRESS)).toBe(true);
    expect(canTransition(ORDER_STATUSES.IN_PROGRESS, ORDER_STATUSES.DONE)).toBe(true);
  });

  it('allows cancellation from pending and picked_up', () => {
    expect(canTransition(ORDER_STATUSES.PENDING, ORDER_STATUSES.CANCELLED)).toBe(true);
    expect(canTransition(ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.CANCELLED)).toBe(true);
  });

  it('rejects backward and terminal transitions', () => {
    expect(canTransition(ORDER_STATUSES.DONE, ORDER_STATUSES.PENDING)).toBe(false);
    expect(canTransition(ORDER_STATUSES.CANCELLED, ORDER_STATUSES.PICKED_UP)).toBe(false);
    expect(canTransition(ORDER_STATUSES.IN_PROGRESS, ORDER_STATUSES.CANCELLED)).toBe(false);
  });
});

describe('status labels/badges', () => {
  it('has label for every status', () => {
    for (const status of Object.values(ORDER_STATUSES)) {
      expect(getStatusLabel(status)).toBeTruthy();
      expect(getStatusBadgeClass(status)).toMatch(/^status-badge--/);
    }
  });

  it('cancelled badge is distinct', () => {
    expect(getStatusBadgeClass(ORDER_STATUSES.CANCELLED)).toBe('status-badge--cancelled');
  });
});

describe('getStatusProgress', () => {
  it('is 100% when done', () => {
    expect(getStatusProgress(ORDER_STATUSES.DONE)).toBe(100);
  });

  it('is 0 for cancelled/unknown', () => {
    expect(getStatusProgress(ORDER_STATUSES.CANCELLED)).toBe(0);
  });
});
