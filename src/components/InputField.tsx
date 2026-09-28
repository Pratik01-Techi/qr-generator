/**
 * Dynamic input fields that change based on the selected QR content type.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { QR_TYPE_OPTIONS } from '../constants/qrTypes';
import { colors, radius, spacing, typography } from '../constants/theme';
import { QRContentType, QRFormData } from '../types';

interface Props {
  type: QRContentType;
  form: QRFormData;
  error?: string;
  onChange: <K extends keyof QRFormData>(key: K, value: QRFormData[K]) => void;
}

export function InputField({ type, form, error, onChange }: Props) {
  const meta = QR_TYPE_OPTIONS.find((option) => option.id === type)!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>YOUR CONTENT</Text>
      <Text style={styles.hint}>{meta.hint}</Text>

      {type === 'wifi' ? (
        <>
          <TextInput
            value={form.wifiSsid}
            onChangeText={(value) => onChange('wifiSsid', value)}
            placeholder="Network name (SSID)"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, error ? styles.inputError : null]}
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TextInput
            value={form.wifiPassword}
            onChangeText={(value) => onChange('wifiPassword', value)}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, error ? styles.inputError : null]}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={styles.securityRow}>
            {(['WPA', 'WEP', 'nopass'] as const).map((security) => {
              const active = form.wifiSecurity === security;
              return (
                <TouchableOpacity
                  key={security}
                  onPress={() => onChange('wifiSecurity', security)}
                  style={[styles.securityChip, active && styles.securityChipActive]}
                >
                  <Text
                    style={[
                      styles.securityText,
                      active && styles.securityTextActive,
                    ]}
                  >
                    {security === 'nopass' ? 'Open' : security}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        <TextInput
          value={getFieldValue(type, form)}
          onChangeText={(value) => onChange(getFieldKey(type), value)}
          placeholder={meta.placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, error ? styles.inputError : null]}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          autoCorrect={type === 'text'}
          keyboardType={getKeyboardType(type)}
          multiline={type === 'text'}
          numberOfLines={type === 'text' ? 4 : 1}
          textAlignVertical={type === 'text' ? 'top' : 'center'}
        />
      )}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

function getFieldKey(type: QRContentType): keyof QRFormData {
  switch (type) {
    case 'url':
      return 'url';
    case 'email':
      return 'email';
    case 'phone':
      return 'phone';
    default:
      return 'text';
  }
}

function getFieldValue(type: QRContentType, form: QRFormData): string {
  switch (type) {
    case 'url':
      return form.url;
    case 'email':
      return form.email;
    case 'phone':
      return form.phone;
    default:
      return form.text;
  }
}

function getKeyboardType(type: QRContentType) {
  switch (type) {
    case 'url':
      return 'url';
    case 'email':
      return 'email-address';
    case 'phone':
      return 'phone-pad';
    default:
      return 'default';
  }
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  securityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  securityChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  securityText: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  securityTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  errorBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.errorBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
