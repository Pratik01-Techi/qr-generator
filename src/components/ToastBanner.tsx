/**
 * Lightweight toast banner for non-blocking success/error feedback on Android.
 */
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface Props {
  message: string | null;
  type?: 'success' | 'error';
  onHide: () => void;
}

export function ToastBanner({ message, type = 'success', onHide }: Props) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) {
      return;
    }

    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        onHide();
      }
    });
  }, [message, onHide, opacity]);

  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity, backgroundColor: isError ? colors.error : colors.success },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    zIndex: 100,
    elevation: 8,
  },
  text: {
    ...typography.subtitle,
    color: colors.textInverse,
    textAlign: 'center',
  },
});
