/**
 * Style controls: QR size, error-correction level, and color presets.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ERROR_LEVELS, QR_SIZES } from '../constants/qrTypes';
import { colors, qrColorPresets, radius, spacing, typography } from '../constants/theme';
import { ErrorCorrectionLevel, QRStyleOptions } from '../types';

interface Props {
  styleOptions: QRStyleOptions;
  onChange: <K extends keyof QRStyleOptions>(
    key: K,
    value: QRStyleOptions[K]
  ) => void;
  onErrorLevel: (level: ErrorCorrectionLevel) => void;
}

export function StyleControls({ styleOptions, onChange, onErrorLevel }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionLabel}>STYLE</Text>

      {/* Size */}
      <Text style={styles.subLabel}>Size</Text>
      <View style={styles.row}>
        {QR_SIZES.map((size) => {
          const active = styleOptions.size === size.value;
          return (
            <TouchableOpacity
              key={size.label}
              onPress={() => onChange('size', size.value)}
              style={[styles.segment, active && styles.segmentActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {size.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Error correction */}
      <Text style={styles.subLabel}>Error correction</Text>
      <View style={styles.row}>
        {ERROR_LEVELS.map((level) => {
          const active = styleOptions.errorCorrection === level.id;
          return (
            <TouchableOpacity
              key={level.id}
              onPress={() => onErrorLevel(level.id)}
              style={[styles.segment, active && styles.segmentActive]}
              accessibilityRole="button"
              accessibilityLabel={`Error correction ${level.description}`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Foreground color */}
      <Text style={styles.subLabel}>QR color</Text>
      <View style={styles.swatchRow}>
        {qrColorPresets.foreground.map((hex) => {
          const active = styleOptions.foregroundColor === hex;
          return (
            <TouchableOpacity
              key={`fg-${hex}`}
              onPress={() => onChange('foregroundColor', hex)}
              style={[
                styles.swatch,
                { backgroundColor: hex },
                hex === '#FFFFFF' && styles.swatchBorder,
                active && styles.swatchActive,
              ]}
              accessibilityLabel={`Foreground color ${hex}`}
            />
          );
        })}
      </View>

      {/* Background color */}
      <Text style={styles.subLabel}>Background</Text>
      <View style={styles.swatchRow}>
        {qrColorPresets.background.map((hex) => {
          const active = styleOptions.backgroundColor === hex;
          return (
            <TouchableOpacity
              key={`bg-${hex}`}
              onPress={() => onChange('backgroundColor', hex)}
              style={[
                styles.swatch,
                { backgroundColor: hex },
                hex === '#FFFFFF' && styles.swatchBorder,
                active && styles.swatchActive,
              ]}
              accessibilityLabel={`Background color ${hex}`}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  subLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderMuted,
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  segmentText: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchBorder: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  swatchActive: {
    borderWidth: 3,
    borderColor: colors.accent,
  },
});
