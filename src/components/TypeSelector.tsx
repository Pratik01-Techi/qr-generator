/**
 * Horizontal picker for QR content types (text, URL, email, etc.).
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QR_TYPE_OPTIONS } from '../constants/qrTypes';
import { colors, radius, spacing, typography } from '../constants/theme';
import { QRContentType } from '../types';

interface Props {
  selected: QRContentType;
  onSelect: (type: QRContentType) => void;
}

export function TypeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>CONTENT TYPE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {QR_TYPE_OPTIONS.map((option) => {
          const active = selected === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={active ? colors.textInverse : colors.primary}
              />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

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
  row: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  chipText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
});
