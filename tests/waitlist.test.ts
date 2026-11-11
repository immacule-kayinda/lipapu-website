import { describe, expect, it } from 'vitest';
import { normalizePhone, validateWaitlist } from '@/lib/waitlist';

describe('normalizePhone', () => {
  it('convertit un numéro local en format international (RDC)', () => {
    expect(normalizePhone('0812345678')).toBe('+243812345678');
    expect(normalizePhone('081 234 56 78')).toBe('+243812345678');
  });

  it('accepte le format international avec + ou 00', () => {
    expect(normalizePhone('+243 81 234 5678')).toBe('+243812345678');
    expect(normalizePhone('00243812345678')).toBe('+243812345678');
    expect(normalizePhone('+33612345678')).toBe('+33612345678');
  });

  it('refuse les numéros invalides', () => {
    expect(normalizePhone('12345')).toBeNull();
    expect(normalizePhone('abc')).toBeNull();
    expect(normalizePhone('+0123456789')).toBeNull();
  });
});

describe('validateWaitlist', () => {
  it('accepte un e-mail avec consentement et le met en minuscules', () => {
    const result = validateWaitlist({ contact: ' Nom@Exemple.COM ', consent: true });
    expect(result).toEqual({
      ok: true,
      honeypot: false,
      data: { contact: 'nom@exemple.com', type: 'email' },
    });
  });

  it('accepte un téléphone avec consentement', () => {
    const result = validateWaitlist({ contact: '0812345678', consent: true });
    expect(result).toMatchObject({ ok: true, data: { contact: '+243812345678', type: 'phone' } });
  });

  it('exige un contact', () => {
    expect(validateWaitlist({ contact: '  ', consent: true })).toEqual({
      ok: false,
      errors: { contact: 'contactRequired' },
    });
    expect(validateWaitlist({ consent: true })).toMatchObject({
      ok: false,
      errors: { contact: 'contactRequired' },
    });
  });

  it('refuse un contact invalide', () => {
    expect(validateWaitlist({ contact: 'pas-un-email@', consent: true })).toMatchObject({
      ok: false,
      errors: { contact: 'contactInvalid' },
    });
    expect(validateWaitlist({ contact: '123', consent: true })).toMatchObject({
      ok: false,
      errors: { contact: 'contactInvalid' },
    });
    expect(validateWaitlist({ contact: 'a'.repeat(300) + '@x.cd', consent: true })).toMatchObject({
      ok: false,
      errors: { contact: 'contactInvalid' },
    });
  });

  it('exige un consentement explicite (booléen true)', () => {
    for (const consent of [false, undefined, 'on', 1]) {
      expect(validateWaitlist({ contact: 'a@b.cd', consent })).toEqual({
        ok: false,
        errors: { consent: 'consentRequired' },
      });
    }
  });

  it('signale les deux erreurs ensemble', () => {
    expect(validateWaitlist({})).toEqual({
      ok: false,
      errors: { contact: 'contactRequired', consent: 'consentRequired' },
    });
  });

  it('détecte le champ piège rempli (robot)', () => {
    expect(validateWaitlist({ contact: 'a@b.cd', consent: true, website: 'http://spam' })).toEqual({
      ok: true,
      honeypot: true,
    });
  });
});
