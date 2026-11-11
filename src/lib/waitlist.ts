/**
 * Validation de la liste d'attente. Utilisée côté serveur (route /api/waitlist) et côté client
 * (aide à la saisie). Le serveur reste la référence.
 */

export type ContactType = 'email' | 'phone';

export type WaitlistErrorCode = 'contactRequired' | 'contactInvalid' | 'consentRequired';

export type WaitlistInput = {
  contact?: unknown;
  consent?: unknown;
  /** Champ piège : un humain ne le voit pas et ne le remplit pas. */
  website?: unknown;
};

export type WaitlistResult =
  | { ok: true; data: { contact: string; type: ContactType }; honeypot: false }
  | { ok: true; honeypot: true }
  | { ok: false; errors: { contact?: WaitlistErrorCode; consent?: WaitlistErrorCode } };

export const CONTACT_MAX_LENGTH = 254;

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const E164_RE = /^\+[1-9]\d{7,14}$/;

/** Indicatif utilisé pour un numéro saisi au format local (0XXXXXXXXX), RDC. */
const LOCAL_COUNTRY_CODE = '+243';

/** Normalise un numéro vers le format international E.164, ou renvoie null. */
export function normalizePhone(raw: string): string | null {
  let value = raw.replace(/[\s.\-()]/g, '');
  if (value.startsWith('00')) value = `+${value.slice(2)}`;
  else if (/^0\d{9}$/.test(value)) value = `${LOCAL_COUNTRY_CODE}${value.slice(1)}`;
  return E164_RE.test(value) ? value : null;
}

export function validateWaitlist(input: WaitlistInput): WaitlistResult {
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return { ok: true, honeypot: true };
  }

  const errors: { contact?: WaitlistErrorCode; consent?: WaitlistErrorCode } = {};
  const raw = typeof input.contact === 'string' ? input.contact.trim() : '';

  let data: { contact: string; type: ContactType } | null = null;
  if (raw === '') {
    errors.contact = 'contactRequired';
  } else if (raw.length > CONTACT_MAX_LENGTH) {
    errors.contact = 'contactInvalid';
  } else if (raw.includes('@')) {
    if (EMAIL_RE.test(raw)) data = { contact: raw.toLowerCase(), type: 'email' };
    else errors.contact = 'contactInvalid';
  } else {
    const phone = normalizePhone(raw);
    if (phone) data = { contact: phone, type: 'phone' };
    else errors.contact = 'contactInvalid';
  }

  if (input.consent !== true) errors.consent = 'consentRequired';

  if (Object.keys(errors).length > 0 || !data) return { ok: false, errors };
  return { ok: true, data, honeypot: false };
}
