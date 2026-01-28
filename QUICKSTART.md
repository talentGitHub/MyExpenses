# Quick Start Guide

This guide will help you get MyExpenses up and running on all platforms.

## Step 1: System Requirements

- Node.js 18 or higher
- npm 9 or higher
- Git

### Additional Requirements by Platform

**For Android Development:**
- Android Studio
- Android SDK
- JDK 11 or higher

**For iOS Development (macOS only):**
- Xcode 14 or higher
- CocoaPods
- iOS Simulator or physical device

**For Windows Desktop:**
- Windows 10 or higher (for building Windows executables)

## Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/talentGitHub/MyExpenses.git
cd MyExpenses

# Install all dependencies at once
npm run install:all
```

## Step 3: Run on Your Platform

### Option A: Mobile (Easiest - Works on Any Platform)

1. Install Expo Go on your phone from:
   - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)

2. Start the development server:
```bash
cd mobile
npm start
```

3. Scan the QR code with:
   - Android: Use Expo Go app
   - iOS: Use Camera app (it will open Expo Go)

### Option B: Desktop (Windows)

```bash
cd desktop
npm install
npm start
```

The desktop application will open automatically.

### Option C: Mobile on Emulator/Simulator

**Android Emulator:**
```bash
cd mobile
npm run android
```

**iOS Simulator (macOS only):**
```bash
cd mobile
npm run ios
```

## Step 5: Building for Production

### Build Android APK

The easiest way to build an APK:

```bash
./build-android.sh
```

Or manually:

```bash
cd mobile
npm run build:android
```

This will:
1. Use EAS Build (Expo's cloud build service)
2. Create an APK file in about 10-20 minutes
3. Provide a download link when complete

**Detailed instructions:** See [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)

### Build Windows Desktop Installer

```bash
cd desktop
npm run build:win
```

The installer will be in `desktop/dist/MyExpenses Setup.exe`

### Build iOS App

```bash
cd mobile
eas build --platform ios --profile preview
```

Requires an Apple Developer account.

## Step 6: Using the App

### Adding Your First Expense

1. Enter an amount (e.g., 25.50)
2. Select a category (e.g., "Food & Dining")
3. Add a description (e.g., "Lunch at restaurant")
4. Click "Add Expense"

### Viewing Your Expenses

- All expenses appear in the list below the form
- The summary card shows your total expenses
- Each expense displays category, amount, description, and date

### Syncing Across Devices

1. Click the "Sync" button in the header
2. Your expenses will be synchronized
3. Open the app on another device and sync there too

**Note:** Currently using mock sync. For real sync, you'll need to set up a backend API.

## Troubleshooting

### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Expo app issues

```bash
# Clear Expo cache
cd mobile
expo start -c
```

### Desktop app won't start

```bash
# Reinstall Electron
cd desktop
npm uninstall electron
npm install electron --save-dev
```

## Next Steps

- Customize the app theme in the styles
- Add your own expense categories
- Set up a real backend for cloud sync
- Add user authentication
- Deploy to app stores

## Getting Help

- Check the main README.md for detailed documentation
- Review the code examples in each platform folder
- Open an issue on GitHub if you encounter problems

## Quick Reference

### Useful Commands

```bash
# Root directory
npm run install:all         # Install all dependencies
npm run mobile:start        # Start mobile dev server
npm run mobile:android      # Run on Android
npm run mobile:ios          # Run on iOS
npm run desktop:start       # Start desktop app
npm run desktop:build       # Build desktop installer

# Mobile directory
cd mobile
npm start                   # Start development server
npm run android            # Run on Android
npm run ios                # Run on iOS
npm run web                # Run in web browser

# Desktop directory
cd desktop
npm start                  # Start desktop app
npm run build              # Build for all platforms
npm run build:win          # Build for Windows
npm run build:mac          # Build for macOS
npm run build:linux        # Build for Linux
```

## Platform-Specific Notes

### Android
- Requires Android SDK 21 (Android 5.0) or higher
- USB debugging must be enabled for physical devices
- First build may take 10-15 minutes

### iOS
- Requires iOS 13.0 or higher
- macOS required for building iOS apps
- Apple Developer account needed for physical devices

### Windows
- Works on Windows 10 and Windows 11
- No special requirements for running
- Administrator rights may be needed for installation

Happy expense tracking! 💰
