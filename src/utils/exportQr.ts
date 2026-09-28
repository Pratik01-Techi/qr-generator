/**
 * Export helpers for copy, save-to-gallery, and share actions.
 * Wrapped in try/catch so permission failures show friendly messages.
 */
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';

type ViewShotRef = React.ElementRef<typeof ViewShot>;

/** Copy the encoded QR payload (not the image) to the clipboard. */
export async function copyPayloadToClipboard(payload: string): Promise<void> {
  await Clipboard.setStringAsync(payload);
}

/** Capture the QR preview and save it to the device photo gallery. */
export async function saveQrToGallery(
  viewShotRef: React.RefObject<ViewShotRef | null>
): Promise<void> {
  if (Platform.OS === 'web') {
    const uri = await captureQrImage(viewShotRef);
    const link = document.createElement('a');
    link.href = uri;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const MediaLibrary = require('expo-media-library');
  const permission = await MediaLibrary.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Storage permission is required to save QR codes.');
  }

  const uri = await captureQrImage(viewShotRef);
  await MediaLibrary.saveToLibraryAsync(uri);
}

/** Share the captured QR image using the Android share sheet. */
export async function shareQrImage(
  viewShotRef: React.RefObject<ViewShotRef | null>
): Promise<void> {
  if (Platform.OS === 'web') {
    if (navigator.share) {
      const uri = await captureQrImage(viewShotRef);
      const res = await fetch(uri);
      const blob = await res.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      await navigator.share({
        files: [file],
        title: 'QR Code',
      });
      return;
    }
    throw new Error('Sharing is not supported on this browser.');
  }

  const Sharing = require('expo-sharing');
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }

  const uri = await captureQrImage(viewShotRef);
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'Share QR Code',
  });
}

async function captureQrImage(
  viewShotRef: React.RefObject<ViewShotRef | null>
): Promise<string> {
  if (Platform.OS === 'web') {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      
      return new Promise<string>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = svgElement.clientWidth || 250;
          canvas.height = svgElement.clientHeight || 250;
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(image, 0, 0);
            const png = canvas.toDataURL('image/png');
            resolve(png);
          } else {
            reject(new Error('Could not create canvas context'));
          }
        };
        image.onerror = () => {
          reject(new Error('Failed to load SVG image'));
        };
        image.src = blobURL;
      });
    }
    throw new Error('SVG element not found for capturing.');
  }

  if (!viewShotRef.current?.capture) {
    throw new Error('QR preview is not ready yet. Generate a code first.');
  }

  const uri = await viewShotRef.current.capture();
  if (!uri) {
    throw new Error('Could not capture the QR image.');
  }

  const FileSystem = require('expo-file-system');
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    throw new Error('Captured image file was not found.');
  }

  return uri;
}

