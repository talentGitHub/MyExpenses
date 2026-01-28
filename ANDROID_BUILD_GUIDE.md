# Building Android APK for MyExpenses

This guide explains how to build an Android APK file for the MyExpenses mobile application.

## Prerequisites

Before building the APK, ensure you have:

1. **Node.js 18+** and **npm** installed
2. **Expo CLI** installed globally: `npm install -g expo-cli`
3. **EAS CLI** installed globally: `npm install -g eas-cli`
4. An **Expo account** (free tier is sufficient) - Sign up at https://expo.dev/

## Build Methods

There are two primary methods to build an Android APK:

### Method 1: EAS Build (Recommended - Cloud-based)

This is the easiest method and doesn't require Android Studio or a local Android development environment.

#### Step 1: Set Up EAS

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Navigate to the mobile directory
cd mobile

# Log in to your Expo account
eas login

# Configure EAS for your project
eas build:configure
```

When prompted, select:
- Platform: Android
- Build type: APK (not AAB)

This will create an `eas.json` file (already created in this repo).

#### Step 2: Update Project ID

After running `eas build:configure`, EAS will give you a project ID. Update the `app.json` file:

```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

Or let EAS update it automatically during the first build.

#### Step 3: Build the APK

Choose one of the build profiles:

**Preview Build (Recommended for testing):**
```bash
cd mobile
npm run build:android
# or
eas build --platform android --profile preview
```

**Production Build:**
```bash
cd mobile
npm run build:android:production
# or
eas build --platform android --profile production
```

**Development Build:**
```bash
cd mobile
eas build --platform android --profile development
```

#### Step 4: Wait for Build

- The build process runs on Expo's servers
- You'll see a build URL in the terminal
- Building typically takes 10-20 minutes
- You can close the terminal - the build will continue

#### Step 5: Download the APK

Once complete, you can:
1. Download from the URL provided in the terminal
2. Visit https://expo.dev/accounts/[your-account]/projects/myexpenses/builds
3. Download the APK file

The APK can be installed on any Android device (Android 5.0+).

### Method 2: Local Build (Advanced)

This method requires a full Android development environment.

#### Prerequisites for Local Build

1. **Android Studio** with Android SDK
2. **Java Development Kit (JDK) 17**
3. **Android SDK Build Tools**
4. Environment variables configured:
   - `ANDROID_HOME` pointing to your Android SDK location
   - `JAVA_HOME` pointing to your JDK installation

#### Steps for Local Build

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Generate native Android project
npx expo prebuild --platform android

# Build the APK
cd android
./gradlew assembleRelease

# APK will be located at:
# android/app/build/outputs/apk/release/app-release.apk
```

Note: Local builds are more complex and require significant setup.

## Build Profiles Explained

The `eas.json` file defines three build profiles:

### 1. Development
- For development and debugging
- Larger file size
- Includes dev tools
- Not suitable for distribution

### 2. Preview (Recommended)
- For testing and internal distribution
- Optimized APK
- Can be shared with testers
- **This is the recommended profile for generating APKs**

### 3. Production
- For Play Store submission
- Fully optimized
- Requires signing certificate
- Smallest file size

## Installing the APK

### On Your Device

1. **Enable Unknown Sources:**
   - Go to Settings → Security (or Privacy)
   - Enable "Install unknown apps" for your file manager or browser

2. **Transfer the APK:**
   - Download directly on device from the build URL
   - Or transfer via USB, email, cloud storage, etc.

3. **Install:**
   - Tap the APK file
   - Follow installation prompts
   - Grant necessary permissions

### Using ADB (Android Debug Bridge)

```bash
# Connect device via USB with USB debugging enabled
adb devices

# Install the APK
adb install path/to/myexpenses.apk
```

## Troubleshooting

### Issue: "Package conflicts with an existing package"
**Solution:** Uninstall the existing app first or change the package name in `app.json`

### Issue: Build fails with "Invalid project ID"
**Solution:** Run `eas build:configure` and ensure the project ID in `app.json` is correct

### Issue: "Expo CLI not found"
**Solution:** Install globally: `npm install -g eas-cli expo-cli`

### Issue: Build takes too long
**Solution:** This is normal. EAS builds can take 15-30 minutes. You can close the terminal.

### Issue: Need to sign the APK
**Solution:** For production builds, generate a keystore:
```bash
eas credentials
```
Follow prompts to create or upload signing credentials.

## Icon Assets

The app requires the following assets in `mobile/assets/`:

- **icon.png** - 1024x1024px app icon
- **adaptive-icon.png** - 1024x1024px Android adaptive icon  
- **splash.png** - 1284x2778px splash screen
- **favicon.png** - 48x48px web favicon

Placeholder SVG files have been generated. For production:
1. Convert SVGs to PNG using an online tool or ImageMagick
2. Or create professional icons with a design tool

```bash
# Convert SVG to PNG using ImageMagick (if available)
cd mobile/assets
convert icon.svg -resize 1024x1024 icon.png
convert adaptive-icon.svg -resize 1024x1024 adaptive-icon.png
convert splash.svg -resize 1284x2778 splash.png
convert favicon.svg -resize 48x48 favicon.png
```

## Distribution Options

### 1. Direct APK Distribution
- Share the APK file directly
- Users install manually
- No Play Store account needed
- Good for internal testing

### 2. Google Play Store
- Requires Developer account ($25 one-time fee)
- Build with `production` profile
- Create Play Store listing
- Submit for review

### 3. Internal Testing
- Use Google Play's Internal Testing track
- Up to 100 testers
- No review process

## Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build preview APK (recommended)
cd mobile && npm run build:android

# Build production APK
cd mobile && npm run build:android:production

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

## Next Steps

After building your APK:

1. **Test thoroughly** on multiple Android devices
2. **Test all features:**
   - Adding expenses
   - Viewing expense list
   - Deleting expenses
   - Sync functionality
   - App works offline
3. **Get feedback** from beta testers
4. **Iterate** and rebuild as needed

## Resources

- **Expo EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Android App Bundle vs APK:** https://docs.expo.dev/build-reference/apk/
- **App Signing:** https://docs.expo.dev/app-signing/app-credentials/
- **Publishing to Play Store:** https://docs.expo.dev/submit/android/

## Support

For issues or questions:
- Check Expo forums: https://forums.expo.dev/
- Expo Discord: https://chat.expo.dev/
- GitHub Issues: https://github.com/talentGitHub/MyExpenses/issues

---

**Note:** The first build may take longer as EAS sets up your project. Subsequent builds will be faster.
