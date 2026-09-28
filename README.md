# 📱 QR Generator App

A modern, full-featured **React Native & Expo** mobile app designed to generate customized QR codes for URLs, WiFi networks, vCards, text, and email credentials with real-time styling and quick export capabilities.

---

## ✨ Features

- 🔗 **Multiple QR Types**: Support for URL, Text, WiFi credentials, vCard contacts, and Email templates.
- 🎨 **Custom Styling**: Adjust foreground & background colors, logo integration, sizing, and error correction levels (L, M, Q, H).
- 💾 **Export & Sharing**: Save generated QR code images directly to device gallery or share seamlessly via system share sheet.
- 📜 **History Management**: Automatically save generated QR codes locally using `AsyncStorage` with history clearing and quick reload.
- ⚡ **Cross-Platform**: Works natively on **iOS**, **Android**, and **Web**.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) / [React Native](https://reactnative.dev)
- **Language**: TypeScript
- **Rendering**: `react-native-qrcode-svg`, `react-native-svg`
- **Storage**: `@react-native-async-storage/async-storage`
- **Media & Sharing**: `expo-media-library`, `expo-sharing`

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Expo Go](https://expo.dev/go) app on iOS / Android (for physical device testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pratik01-tech/qr-generator.git
   cd qr-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
