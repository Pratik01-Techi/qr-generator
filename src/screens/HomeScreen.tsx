/**
 * Main screen: orchestrates input, validation, QR preview, and export actions.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ViewShot from 'react-native-view-shot';
import { ExportActions, GenerateButton } from '../components/ActionButtons';
import { Header } from '../components/Header';
import { HistoryList } from '../components/HistoryList';
import { InputField } from '../components/InputField';
import { QRPreview } from '../components/QRPreview';
import { StyleControls } from '../components/StyleControls';
import { ToastBanner } from '../components/ToastBanner';
import { TypeSelector } from '../components/TypeSelector';
import { colors, spacing } from '../constants/theme';
import {
  ErrorCorrectionLevel,
  HistoryItem,
  QRContentType,
  QRFormData,
  QRStyleOptions,
} from '../types';
import {
  copyPayloadToClipboard,
  saveQrToGallery,
  shareQrImage,
} from '../utils/exportQr';
import { buildHistoryLabel, hasLowContrast, validateQrInput } from '../utils/qrPayload';
import { checkUrlReachability } from '../utils/reachability';
import {
  clearHistory,
  loadHistory,
  removeHistoryItem,
  saveHistoryItem,
} from '../utils/storage';

type ViewShotRef = React.ElementRef<typeof ViewShot>;

const INITIAL_FORM: QRFormData = {
  text: '',
  url: '',
  email: '',
  phone: '',
  wifiSsid: '',
  wifiPassword: '',
  wifiSecurity: 'WPA',
};

const INITIAL_STYLE: QRStyleOptions = {
  size: 220,
  errorCorrection: 'M',
  foregroundColor: '#0F172A',
  backgroundColor: '#FFFFFF',
};

export function HomeScreen() {
  const viewShotRef = useRef<ViewShotRef>(null);

  const [contentType, setContentType] = useState<QRContentType>('text');
  const [form, setForm] = useState<QRFormData>(INITIAL_FORM);
  const [styleOptions, setStyleOptions] = useState<QRStyleOptions>(INITIAL_STYLE);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | undefined>();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  // Load saved history once when the screen mounts.
  useEffect(() => {
    loadHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  const updateForm = useCallback(
    <K extends keyof QRFormData>(key: K, value: QRFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setValidationError(undefined);
    },
    []
  );

  const updateStyle = useCallback(
    <K extends keyof QRStyleOptions>(key: K, value: QRStyleOptions[K]) => {
      setStyleOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  /** Validate input, update preview, and persist to local history. */
  const handleGenerate = useCallback(async () => {
    const result = validateQrInput(contentType, form);

    if (!result.isValid || !result.payload) {
      setValidationError(result.message);
      setQrValue(null);
      return;
    }

    if (hasLowContrast(styleOptions.foregroundColor, styleOptions.backgroundColor)) {
      setValidationError('Choose different foreground and background colors.');
      setQrValue(null);
      return;
    }

    setValidationError(undefined);
    setIsBusy(true);

    try {
      if (contentType === 'url' && result.payload) {
        const isReachable = await checkUrlReachability(result.payload);
        if (!isReachable) {
          setValidationError('invalid Link for QR generating');
          setQrValue(null);
          return;
        }
      }

      // Brief delay keeps the loading state visible on fast devices.
      await new Promise((resolve) => setTimeout(resolve, 120));
      setQrValue(result.payload);

      const item: HistoryItem = {
        id: `${Date.now()}`,
        type: contentType,
        label: buildHistoryLabel(contentType, form),
        payload: result.payload,
        createdAt: Date.now(),
      };

      await saveHistoryItem(item);
      setHistory(await loadHistory());
      showToast('QR code generated successfully!');
    } catch {
      showToast('Something went wrong while generating.', 'error');
    } finally {
      setIsBusy(false);
    }
  }, [contentType, form, showToast, styleOptions]);

  const handleCopy = useCallback(async () => {
    if (!qrValue) {
      return;
    }

    try {
      await copyPayloadToClipboard(qrValue);
      showToast('Content copied to clipboard');
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  }, [qrValue, showToast]);

  const handleSave = useCallback(async () => {
    setIsBusy(true);
    try {
      await saveQrToGallery(viewShotRef);
      showToast('QR code saved to gallery');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Save failed', 'error');
    } finally {
      setIsBusy(false);
    }
  }, [showToast]);

  const handleShare = useCallback(async () => {
    setIsBusy(true);
    try {
      await shareQrImage(viewShotRef);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Share failed', 'error');
    } finally {
      setIsBusy(false);
    }
  }, [showToast]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setContentType(item.type);
    setQrValue(item.payload);
    setValidationError(undefined);

    // Restore form fields from payload for common types.
    if (item.type === 'text') {
      setForm((prev) => ({ ...prev, text: item.payload }));
    } else if (item.type === 'url') {
      setForm((prev) => ({ ...prev, url: item.payload.replace(/^https?:\/\//i, '') }));
    } else if (item.type === 'email') {
      setForm((prev) => ({ ...prev, email: item.payload.replace(/^mailto:/i, '') }));
    } else if (item.type === 'phone') {
      setForm((prev) => ({ ...prev, phone: item.payload.replace(/^tel:/i, '') }));
    }

    showToast('History item restored');
  }, [showToast]);

  const handleHistoryDelete = useCallback(async (id: string) => {
    const next = await removeHistoryItem(id);
    setHistory(next);
    showToast('History item removed');
  }, [showToast]);

  const handleClearHistory = useCallback(() => {
    Alert.alert('Clear history', 'Remove all saved QR codes from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
          showToast('History cleared');
        },
      },
    ]);
  }, [showToast]);

  const handleTypeChange = useCallback((type: QRContentType) => {
    setContentType(type);
    setValidationError(undefined);
  }, []);

  const handleErrorLevel = useCallback((level: ErrorCorrectionLevel) => {
    updateStyle('errorCorrection', level);
  }, [updateStyle]);

  const contrastWarning =
    qrValue !== null &&
    hasLowContrast(styleOptions.foregroundColor, styleOptions.backgroundColor);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header />

          <View style={styles.body}>
            <TypeSelector selected={contentType} onSelect={handleTypeChange} />
            <InputField
              type={contentType}
              form={form}
              error={validationError}
              onChange={updateForm}
            />
            <StyleControls
              styleOptions={styleOptions}
              onChange={updateStyle}
              onErrorLevel={handleErrorLevel}
            />
            <GenerateButton isBusy={isBusy} onGenerate={handleGenerate} />
            <QRPreview
              ref={viewShotRef}
              value={qrValue}
              styleOptions={styleOptions}
              isGenerating={isBusy && !qrValue}
              contrastWarning={contrastWarning}
            />
            <ExportActions
              hasQr={Boolean(qrValue)}
              isBusy={isBusy}
              onCopy={handleCopy}
              onSave={handleSave}
              onShare={handleShare}
            />
            <HistoryList
              items={history}
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
              onClear={handleClearHistory}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ToastBanner
        message={toast?.message ?? null}
        type={toast?.type}
        onHide={() => setToast(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
