/**
 * Header with gradient background and app branding.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export function Header() {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.content}>
        <Text style={styles.title}>QR Generator</Text>
        <Text style={styles.subtitle}>Create scannable codes in seconds</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.88)',
  },
});
