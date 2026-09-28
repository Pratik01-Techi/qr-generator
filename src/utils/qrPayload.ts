import { MAX_QR_PAYLOAD_LENGTH } from '../constants/qrTypes';
import { QRContentType, QRFormData, ValidationResult } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;

/** Trim helper used before every validation pass. */
function clean(value: string): string {
  return value.trim();
}

/** Normalize URLs by adding https:// when the user omits a scheme. */
function normalizeUrl(raw: string): string {
  const value = clean(raw);
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

/**
 * Build the exact string encoded inside the QR code for each content type.
 * WiFi uses the standard WIFI: T:S:P format understood by phone cameras.
 */
export function buildQrPayload(type: QRContentType, form: QRFormData): string {
  switch (type) {
    case 'text':
      return clean(form.text);
    case 'url':
      return normalizeUrl(form.url);
    case 'email':
      return `mailto:${clean(form.email)}`;
    case 'phone': {
      const digits = clean(form.phone).replace(/[^\d+]/g, '');
      return `tel:${digits}`;
    }
    case 'wifi': {
      const ssid = clean(form.wifiSsid);
      const password = form.wifiPassword;
      const security = form.wifiSecurity;
      const escapedSsid = escapeWifiField(ssid);
      const escapedPassword = escapeWifiField(password);
      if (security === 'nopass') {
        return `WIFI:T:nopass;S:${escapedSsid};;`;
      }
      return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
    }
    default:
      return '';
  }
}

/** Escape special characters per the WiFi QR specification. */
function escapeWifiField(value: string): string {
  return value.replace(/([\\;,:"'])/g, '\\$1');
}

/** Human-readable label stored in history for quick identification. */
export function buildHistoryLabel(type: QRContentType, form: QRFormData): string {
  switch (type) {
    case 'text':
      return truncate(clean(form.text), 48);
    case 'url':
      return truncate(normalizeUrl(form.url), 48);
    case 'email':
      return clean(form.email);
    case 'phone':
      return clean(form.phone);
    case 'wifi':
      return `WiFi: ${clean(form.wifiSsid)}`;
    default:
      return 'QR Code';
  }
}

function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 3)}...`;
}

/**
 * Validate user input and return the encoded payload when valid.
 * Keeps error messages user-friendly for a college demo presentation.
 */
export function validateQrInput(type: QRContentType, form: QRFormData): ValidationResult {
  const payload = buildQrPayload(type, form);

  if (!payload) {
    return { isValid: false, message: 'Please enter content to generate a QR code.' };
  }

  if (payload.length > MAX_QR_PAYLOAD_LENGTH) {
    return {
      isValid: false,
      message: `Content is too long. Keep it under ${MAX_QR_PAYLOAD_LENGTH} characters.`,
    };
  }

  switch (type) {
    case 'url': {
      const url = normalizeUrl(form.url);
      if (!clean(form.url)) {
        return { isValid: false, message: 'Please enter a website URL.' };
      }
      try {
        // eslint-disable-next-line no-new
        new URL(url);
      } catch {
        return { isValid: false, message: 'Please enter a valid URL (e.g. https://example.com).' };
      }
      break;
    }
    case 'email':
      if (!EMAIL_REGEX.test(clean(form.email))) {
        return { isValid: false, message: 'Please enter a valid email address.' };
      }
      break;
    case 'phone':
      if (!PHONE_REGEX.test(clean(form.phone))) {
        return { isValid: false, message: 'Please enter a valid phone number.' };
      }
      break;
    case 'wifi':
      if (!clean(form.wifiSsid)) {
        return { isValid: false, message: 'Please enter a WiFi network name (SSID).' };
      }
      if (form.wifiSecurity !== 'nopass' && !form.wifiPassword.trim()) {
        return { isValid: false, message: 'Please enter the WiFi password.' };
      }
      break;
    default:
      break;
  }

  return { isValid: true, payload };
}

/** Warn when foreground and background are too similar for reliable scanning. */
export function hasLowContrast(foreground: string, background: string): boolean {
  return foreground.toLowerCase() === background.toLowerCase();
}
