# MyExpenses Assets

This directory contains application assets including icons and splash screens.

## Current Assets

Placeholder SVG files have been generated for development:
- **icon.svg** → needs conversion to icon.png (1024x1024px)
- **adaptive-icon.svg** → needs conversion to adaptive-icon.png (1024x1024px)
- **splash.svg** → needs conversion to splash.png (1284x2778px)
- **favicon.svg** → needs conversion to favicon.png (48x48px)

## Converting SVG to PNG

### Option 1: Online Converters
- Visit: https://cloudconvert.com/svg-to-png
- Upload each SVG file
- Set the target size
- Download the PNG

### Option 2: Using ImageMagick (if installed)
```bash
cd mobile/assets
convert icon.svg -resize 1024x1024 icon.png
convert adaptive-icon.svg -resize 1024x1024 adaptive-icon.png
convert splash.svg -resize 1284x2778 splash.png
convert favicon.svg -resize 48x48 favicon.png
```

### Option 3: Design Tools
- Open SVG in Figma, Sketch, or Adobe Illustrator
- Export as PNG at the required sizes

## Required Assets for Production

### Mobile App (Expo)

- **icon.png**: 1024x1024px - App icon
- **splash.png**: 1284x2778px - Splash screen
- **adaptive-icon.png**: 1024x1024px - Android adaptive icon
- **favicon.png**: 48x48px - Web favicon

### Desktop App (Electron)

- **icon.png**: 512x512px - App icon (cross-platform)
- **icon.ico**: Windows icon
- **icon.icns**: macOS icon

## Note on Building APK

**Important:** The SVG files are sufficient for building an APK. Expo will use the SVGs during the build process. However, for best results and proper rendering, it's recommended to convert them to PNG files at the specified resolutions.

## Creating Professional Icons

For production apps, it's recommended to use professional icon design:

### Tools for Icon Creation

- **Online**: favicon.io, canva.com, figma.com
- **Desktop**: Adobe Illustrator, Figma, Sketch
- **Icon Converters**: 
  - PNG to ICO: convertio.co
  - PNG to ICNS: cloudconvert.com

### Design Guidelines

- **Android**: Follow Material Design guidelines
- **iOS**: Follow Apple Human Interface Guidelines
- Use simple, recognizable shapes
- Ensure icons look good at small sizes
- Test on actual devices

