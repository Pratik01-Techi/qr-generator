/**
 * Displays locally saved QR history with quick restore and delete actions.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { HistoryItem } from '../types';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryList({ items, onSelect, onDelete, onClear }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>RECENT HISTORY</Text>
        <TouchableOpacity onPress={onClear} accessibilityRole="button">
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <TouchableOpacity
            style={styles.content}
            onPress={() => onSelect(item)}
            accessibilityRole="button"
          >
            <View style={styles.iconWrap}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={styles.meta}>
                {item.type.toUpperCase()} · {formatDate(item.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
            accessibilityLabel="Delete history item"
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  clearText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: spacing.md,
  },
});
