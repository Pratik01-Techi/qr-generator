import { Ionicons } from '@expo/vector-icons';
import { QRContentType } from '../types';

/** Metadata for each QR content type shown in the horizontal type picker. */
export const QR_TYPE_OPTIONS: {
  id: QRContentType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  hint: string;
}[] = [
  {
    id: 'text',
    label: 'Text',
    icon: 'document-text-outline',
    placeholder: 'Enter any text message',
    hint: 'Plain text, notes, or messages',
  },
  {
    id: 'url',
    label: 'URL',
    icon: 'link-outline',
    placeholder: 'https://example.com',
    hint: 'Website links open in a browser when scanned',
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'mail-outline',
    placeholder: 'name@example.com',
    hint: 'Opens the default email app with this address',
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: 'call-outline',
    placeholder: '+91 9876543210',
    hint: 'Dial this number when the QR code is scanned',
  },
  {
    id: 'wifi',
    label: 'WiFi',
    icon: 'wifi-outline',
    placeholder: 'Network name (SSID)',
    hint: 'Share WiFi credentials for quick connection',
  },
];

/** Pixel sizes mapped to user-friendly labels. */
export const QR_SIZES = [
  { label: 'S', value: 180 },
  { label: 'M', value: 220 },
  { label: 'L', value: 260 },
] as const;

/** Error-correction presets with short descriptions for accessibility. */
export const ERROR_LEVELS = [
  { id: 'L' as const, label: 'L', description: 'Low — smallest QR, less damage tolerance' },
  { id: 'M' as const, label: 'M', description: 'Medium — balanced size and resilience' },
  { id: 'Q' as const, label: 'Q', description: 'Quartile — good for logos or partial cover' },
  { id: 'H' as const, label: 'H', description: 'High — maximum damage tolerance' },
];

/** Practical upper bound to avoid overly dense QR codes on mobile screens. */
export const MAX_QR_PAYLOAD_LENGTH = 2000;
