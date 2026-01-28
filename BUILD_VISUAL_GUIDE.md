# Android APK Build Process - Visual Guide

## Build Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     START: Build APK                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │   Install Prerequisites     │
           │  - Node.js & npm            │
           │  - EAS CLI                  │
           │  - Expo Account (free)      │
           └─────────────┬───────────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │   Choose Build Method       │
           └─────────────┬───────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐            ┌──────────────────┐
│ Interactive     │            │ Manual Command   │
│ ./build-       │            │ cd mobile        │
│ android.sh      │            │ npm run build:   │
│                 │            │ android          │
└────────┬────────┘            └────────┬─────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Select Build Profile       │
         │  1. Preview (Recommended)    │
         │  2. Production               │
         │  3. Development              │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   EAS Cloud Build Starts     │
         │   (Runs on Expo servers)     │
         │   ⏱️  Takes 10-20 minutes     │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Build Status Updates       │
         │   - Queued                   │
         │   - Building                 │
         │   - Finished                 │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Download APK File          │
         │   📥 From build URL          │
         │   Size: ~40-60 MB            │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Install on Android Device  │
         │   - Enable Unknown Sources   │
         │   - Tap APK file             │
         │   - Install                  │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │      ✅ APK INSTALLED!        │
         │   Launch MyExpenses App      │
         └──────────────────────────────┘
```

## Step-by-Step Screenshots Guide

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```
Output:
```
added 1 package in 2s
```

### Step 2: Run Build Script
```bash
./build-android.sh
```

Expected Output:
```
======================================
MyExpenses Android APK Builder
======================================

✓ Node.js found: v20.20.0
✓ npm found: 10.8.2
✓ EAS CLI found: 5.9.1

======================================
Select Build Type:
======================================
1) Preview APK (Recommended for testing)
2) Production APK (For Play Store)
3) Development APK (For debugging)
4) Exit

Enter your choice (1-4): 1
```

### Step 3: Build Starts
```
Building Preview APK...

✔ Using remote Android credentials (Expo server)
✔ Compiling JavaScript bundle
✔ Running Gradle build

Build details: https://expo.dev/accounts/[username]/projects/myexpenses/builds/[build-id]
```

### Step 4: Build Progress
Visit the build URL in your browser to see:

```
┌─────────────────────────────────────────┐
│ Build Status: IN PROGRESS              │
├─────────────────────────────────────────┤
│ Platform: Android                       │
│ Profile: preview                        │
│ Type: APK                              │
│                                        │
│ Progress: █████████░░░░░░ 60%        │
│                                        │
│ Current Step: Running Gradle Build     │
│                                        │
│ Started: 2 minutes ago                 │
│ Estimated completion: 8 minutes        │
└─────────────────────────────────────────┘
```

### Step 5: Build Complete
```
┌─────────────────────────────────────────┐
│ Build Status: ✅ FINISHED               │
├─────────────────────────────────────────┤
│ Platform: Android                       │
│ Profile: preview                        │
│ Type: APK                              │
│                                        │
│ APK Size: 54.2 MB                      │
│                                        │
│ [Download APK Button]                  │
│                                        │
│ Build took: 15 minutes 32 seconds      │
└─────────────────────────────────────────┘
```

### Step 6: Install on Device

**Android Installation Screen:**
```
┌─────────────────────────────────────────┐
│         📱 Install MyExpenses?          │
├─────────────────────────────────────────┤
│                                        │
│  This app will be able to:             │
│  • Access the internet                 │
│  • View network connections            │
│                                        │
│  App size: 54 MB                       │
│                                        │
│  [Cancel]              [Install]       │
└─────────────────────────────────────────┘
```

**After Installation:**
```
┌─────────────────────────────────────────┐
│    ✅ App installed successfully!       │
├─────────────────────────────────────────┤
│                                        │
│          [Open]        [Done]          │
└─────────────────────────────────────────┘
```

## Build Profiles Comparison

| Feature | Development | Preview | Production |
|---------|-------------|---------|------------|
| **Size** | ~80 MB | ~50 MB | ~40 MB |
| **Dev Tools** | ✅ Included | ❌ None | ❌ None |
| **Optimized** | ❌ No | ✅ Yes | ✅ Yes |
| **Debugging** | ✅ Easy | ⚠️ Limited | ❌ No |
| **Use Case** | Active dev | Testing | Store |
| **Speed** | Slower | Medium | Fast |

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

# Check all builds
eas build:list

# View specific build
eas build:view [build-id]

# Cancel a build
eas build:cancel [build-id]
```

## Timeline Expectations

```
Minute 0  ─────► Build starts, code uploaded
Minute 1-2 ────► Dependencies downloaded
Minute 3-8 ────► JavaScript bundled
Minute 9-15 ───► Android Gradle build
Minute 15-18 ──► APK packaging
Minute 18+ ────► ✅ Build complete!
```

**Average Time:** 15-20 minutes
**Fastest Time:** 12 minutes
**Slowest Time:** 30 minutes (high server load)

## File Sizes

After download:
- **Development APK:** ~80 MB
- **Preview APK:** ~50 MB  
- **Production APK:** ~40 MB

After installation on device:
- **App Size:** ~60-100 MB (varies by profile)
- **Cache:** ~5-10 MB
- **User Data:** Varies based on usage

## Requirements

### For Building:
- ✅ Internet connection
- ✅ Expo account (free)
- ✅ EAS CLI installed
- ❌ No Android Studio needed
- ❌ No local Android SDK needed

### For Installing:
- ✅ Android 5.0 (Lollipop) or higher
- ✅ ~100 MB free space
- ✅ Unknown sources enabled
- ❌ No Google account needed
- ❌ No Play Store needed

## Troubleshooting Visual Guide

```
Build Failed? → Check build logs on build URL
             → Review error message
             → Common fixes:
                - Update dependencies
                - Check app.json config
                - Verify EAS credentials

Can't Install? → Enable unknown sources
              → Check storage space
              → Uninstall old version
              → Verify Android version

App Crashes? → Clear app data
            → Reinstall APK
            → Check logs: adb logcat
```

## Success Indicators

✅ You know it's working when:
- Build completes without errors
- APK downloads successfully  
- APK size is 40-60 MB
- App installs on device
- App opens without crashing
- Features work as expected

## Next Steps After First APK

1. ✅ Test all features thoroughly
2. ✅ Test on multiple Android devices
3. ✅ Get feedback from users
4. ✅ Iterate and rebuild as needed
5. ✅ Consider Play Store submission

---

**Tip:** Keep the build URL bookmarked! You can always download the APK again from that URL within 30 days.
