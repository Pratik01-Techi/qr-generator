/**
 * Central design tokens for a consistent, modern UI across the app.
 * Keeping colors and spacing here makes theme tweaks easy for a college demo.
 */
export const colors = {
  primary: '#6366F1',       // Vibrant Indigo
  primaryDark: '#4F46E5',   // Deep Indigo
  primaryLight: '#E0E7FF',  // Soft Indigo selection backdrop
  accent: '#0D9488',        // Teal Breeze
  accentDark: '#0F766E',    // Dark Teal
  background: '#F8FAFC',    // Modern Soft Slate 50 background
  surface: '#FFFFFF',       // Pure White cards
  surfaceMuted: '#F1F5F9',  // Slate 100 card highlight / mute
  textPrimary: '#0F172A',   // Slate 900 dark text
  textSecondary: '#64748B', // Slate 500 muted text
  textInverse: '#FFFFFF',   // White text inside gradient elements
  border: '#E2E8F0',        // Slate 200 light border
  borderMuted: '#CBD5E1',   // Slate 300 darker border
  error: '#EF4444',         // Red
  errorBg: '#FEF2F2',       // Red 50 light backdrop
  success: '#10B981',       // Emerald Green
  successBg: '#ECFDF5',     // Green 50 light backdrop
  gradientStart: '#4F46E5', // Indigo start
  gradientEnd: '#06B6D4',   // Cyan end
  shadow: 'rgba(15, 23, 42, 0.08)', // Subtle premium shadows
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
};

/** Preset swatches for quick QR styling without a color picker. */
export const qrColorPresets = {
  foreground: ['#0F172A', '#4F46E5', '#0D9488', '#EF4444', '#10B981', '#64748B'],
  background: ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#EEF2F6', '#ECFDF5', '#FEF2F2'],
};
