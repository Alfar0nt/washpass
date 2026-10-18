import { describe, it, expect } from 'vitest';
import { getPrice, getAllPrices, getMaterialsForCategory } from './pricing.js';

describe('getPrice', () => {
  it('returns shoe material prices', () => {
    expect(getPrice('shoe', 'canvas', 'fast-clean')).toBe(35000);
    expect(getPrice('shoe', 'leather', 'deep-clean')).toBe(75000);
  });

  it('returns flat sandal prices', () => {
    expect(getPrice('sandal', null, 'fast-clean')).toBe(20000);
    expect(getPrice('sandal', null, 'deep-clean')).toBe(30000);
  });

  it('falls back to 0 for unknown material', () => {
    expect(getPrice('shoe', 'unknown', 'fast-clean')).toBe(0);
  });
});

describe('getAllPrices / getMaterialsForCategory', () => {
  it('sandal has no materials list', () => {
    expect(getMaterialsForCategory('sandal')).toEqual([]);
  });

  it('shoe has materials', () => {
    expect(getMaterialsForCategory('shoe').length).toBeGreaterThan(0);
  });

  it('pricing table has both categories', () => {
    const p = getAllPrices();
    expect(p.shoe).toBeTruthy();
    expect(p.sandal).toBeTruthy();
  });
});
