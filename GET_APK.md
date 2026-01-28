# How to Get the Android APK

This is a quick reference for building and installing the MyExpenses Android APK.

## Fastest Way to Build

### Option 1: Use the Build Script (Easiest)

```bash
# From the repository root
./build-android.sh
```

Select option 1 for Preview APK, then follow the prompts.

### Option 2: Manual Build Command

```bash
cd mobile
npm run build:android
```

## What You Need

1. **Expo Account** (Free) - Sign up at https://expo.dev/
2. **EAS CLI** installed: `npm install -g eas-cli`
3. **Internet connection** (build happens in the cloud)

## First Time Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Navigate to mobile directory
cd mobile

# Login to Expo
eas login

# Configure the project (if needed)
eas build:configure
```

## The Build Process

1. Run the build command (see above)
2. EAS will start building on their servers (10-20 minutes)
3. You'll get a build URL - save it!
4. When complete, download the APK from that URL
5. You can close the terminal - the build continues

## Installing the APK

### On Your Android Phone

1. Download the APK to your phone
2. Open the downloaded file
3. If prompted, allow installation from unknown sources
4. Tap "Install"
5. Open the app!

### Using USB (from computer)

```bash
# Connect phone via USB with USB debugging enabled
adb install myexpenses.apk
```

## Build Profiles

- **Preview** (Recommended): Good for testing, easy to share
- **Production**: For Play Store, requires signing setup
- **Development**: For active development with dev tools

## Troubleshooting

**Problem:** "eas: command not found"  
**Solution:** `npm install -g eas-cli`

**Problem:** "Not logged in"  
**Solution:** `eas login`

**Problem:** Build URL expired  
**Solution:** Go to https://expo.dev/ → Your Projects → MyExpenses → Builds

**Problem:** Can't install APK  
**Solution:** Enable "Install from Unknown Sources" in Android settings

## Need Help?

Full documentation: [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)

## Alternative: Pre-built APK

If someone else has already built the APK, they can share it directly with you. Just download and install!

---

**Note:** The APK works on any Android device (Android 5.0 and above). No Google Play account needed for installation.
