import { describe, it, expect } from 'vitest';
import { validateName, validateWhatsApp, validateAddress } from './validators.js';

describe('validateName', () => {
  it('rejects empty', () => {
    expect(validateName('').valid).toBe(false);
    expect(validateName('   ').valid).toBe(false);
  });

  it('rejects too short/long', () => {
    expect(validateName('A').valid).toBe(false);
    expect(validateName('x'.repeat(101)).valid).toBe(false);
  });

  it('accepts normal name', () => {
    expect(validateName('Budi Santoso').valid).toBe(true);
  });
});

describe('validateWhatsApp', () => {
  it('accepts Indonesian formats', () => {
    expect(validateWhatsApp('08123456789').valid).toBe(true);
    expect(validateWhatsApp('628123456789').valid).toBe(true);
    expect(validateWhatsApp('+628123456789').valid).toBe(true);
  });

  it('normalizes to 62 format', () => {
    expect(validateWhatsApp('08123456789').cleaned).toBe('628123456789');
  });

  it('rejects invalid', () => {
    expect(validateWhatsApp('123').valid).toBe(false);
    expect(validateWhatsApp('08123').valid).toBe(false);
    expect(validateWhatsApp('').valid).toBe(false);
  });
});

describe('validateAddress', () => {
  it('rejects empty', () => {
    expect(validateAddress('').valid).toBe(false);
  });

  it('accepts normal address', () => {
    expect(validateAddress('Jl. Melati No. 1, Depok').valid).toBe(true);
  });
});
