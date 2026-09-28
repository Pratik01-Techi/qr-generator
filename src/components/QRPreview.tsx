/**
 * Renders the generated QR code with a capture wrapper for save/share actions.
 */
import React, { forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { colors, radius, spacing, typography } from '../constants/theme';
import { QRStyleOptions } from '../types';

type ViewShotRef = React.ElementRef<typeof ViewShot>;

interface Props {
  value: string | null;
  styleOptions: QRStyleOptions;
  isGenerating?: boolean;
  contrastWarning?: boolean;
}

export const QRPreview = forwardRef<ViewShotRef, Props>(function QRPreview(
  { value, styleOptions, isGenerating, contrastWarning },
  ref
) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>PREVIEW</Text>
      <View style={styles.card}>
        {!value ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>No QR code yet</Text>
            <Text style={styles.placeholderText}>
              Enter content above and tap Generate
            </Text>
          </View>
        ) : (
          <ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
            <View
              style={[
                styles.qrFrame,
                { backgroundColor: styleOptions.backgroundColor },
              ]}
            >
              {isGenerating ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <QRCode
                  value={value}
                  size={styleOptions.size}
                  color={styleOptions.foregroundColor}
                  backgroundColor={styleOptions.backgroundColor}
                  ecl={styleOptions.errorCorrection}
                  quietZone={12}
                />
              )}
            </View>
          </ViewShot>
        )}
      </View>

      {contrastWarning ? (
        <Text style={styles.warning}>
          Foreground and background are too similar. Scanning may fail.
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  placeholder: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  placeholderTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  placeholderText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  qrFrame: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
