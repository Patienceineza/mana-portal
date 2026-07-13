// Mirrors the backend's internal/phone package so the portal and API agree
// on what counts as a valid phone number: E.164 form, e.g. +254712345678.
const E164_RE = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s().-]/g, '');
}

export function isValidPhone(raw: string): boolean {
  return E164_RE.test(normalizePhone(raw));
}
