/**
 * Primary and secondary actions: generate, copy, save, and share.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  hasQr: boolean;
  isBusy: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  onSave: () => void;
  onShare: () => void;
}

/** Primary action shown above the QR preview. */
export function GenerateButton({
  isBusy,
  onGenerate,
}: Pick<Props, 'isBusy' | 'onGenerate'>) {
  return (
    <TouchableOpacity
      onPress={onGenerate}
      disabled={isBusy}
      style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBg}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <>
            <Ionicons name="qr-code-outline" size={20} color={colors.textInverse} />
            <Text style={styles.primaryText}>Generate QR Code</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

/** Secondary export actions shown below the QR preview. */
export function ExportActions({
  hasQr,
  isBusy,
  onCopy,
  onSave,
  onShare,
}: Omit<Props, 'onGenerate'>) {
  return (
    <View style={styles.secondaryRow}>
      <ActionChip
        icon="copy-outline"
        label="Copy"
        disabled={!hasQr || isBusy}
        onPress={onCopy}
      />
      <ActionChip
        icon="download-outline"
        label="Save"
        disabled={!hasQr || isBusy}
        onPress={onSave}
      />
      <ActionChip
        icon="share-social-outline"
        label="Share"
        disabled={!hasQr || isBusy}
        onPress={onShare}
      />
    </View>
  );
}

function ActionChip({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, disabled && styles.chipDisabled]}
      accessibilityRole="button"
    >
      <Ionicons
        name={icon}
        size={20}
        color={disabled ? colors.textSecondary : colors.primary}
      />
      <Text style={[styles.chipText, disabled && styles.chipTextDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  gradientBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  primaryText: {
    ...typography.subtitle,
    color: colors.textInverse,
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  chipTextDisabled: {
    color: colors.textSecondary,
  },
});
