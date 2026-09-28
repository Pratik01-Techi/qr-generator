/** Supported QR content categories shown in the type picker. */
export type QRContentType = 'text' | 'url' | 'email' | 'phone' | 'wifi';

/** QR error-correction levels supported by react-native-qrcode-svg. */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/** Visual and encoding options applied to the generated QR code. */
export interface QRStyleOptions {
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
}

/** Form fields collected per content type before encoding. */
export interface QRFormData {
  text: string;
  url: string;
  email: string;
  phone: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: 'WPA' | 'WEP' | 'nopass';
}

/** A saved entry in local history. */
export interface HistoryItem {
  id: string;
  type: QRContentType;
  label: string;
  payload: string;
  createdAt: number;
}

/** Result returned by validation helpers. */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  payload?: string;
}
