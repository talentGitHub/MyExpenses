#!/usr/bin/env node

/**
 * Simple script to generate placeholder PNG icons for the mobile app.
 * Creates basic colored squares with text.
 */

const fs = require('fs');
const path = require('path');

// Simple function to create an SVG that can be converted to PNG
function createSVGIcon(size, text, backgroundColor = '#007AFF') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
  <text x="50%" y="50%" font-size="${size * 0.2}" fill="white" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-weight="bold">${text}</text>
</svg>`;
}

const assetsDir = path.join(__dirname, 'mobile', 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Generating placeholder icons...');

// Generate icon.png (1024x1024) - Main app icon
const iconSVG = createSVGIcon(1024, '$', '#007AFF');
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSVG);
console.log('✓ Created icon.svg');

// Generate adaptive-icon.png (1024x1024) - Android adaptive icon
const adaptiveIconSVG = createSVGIcon(1024, '$', '#007AFF');
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveIconSVG);
console.log('✓ Created adaptive-icon.svg');

// Generate splash.png (1284x2778) - Splash screen
const splashSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="white"/>
  <circle cx="642" cy="1200" r="150" fill="#007AFF"/>
  <text x="50%" y="1550" font-size="80" fill="#333333" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">MyExpenses</text>
  <text x="50%" y="1650" font-size="40" fill="#666666" text-anchor="middle" font-family="Arial, sans-serif">Track your expenses</text>
</svg>`;
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), splashSVG);
console.log('✓ Created splash.svg');

// Generate favicon.png (48x48)
const faviconSVG = createSVGIcon(48, '$', '#007AFF');
fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), faviconSVG);
console.log('✓ Created favicon.svg');

console.log('\n✓ All placeholder icons generated successfully!');
console.log('\nNote: SVG files have been created. To convert them to PNG, you can:');
console.log('1. Use an online converter like cloudconvert.com');
console.log('2. Use ImageMagick: convert icon.svg icon.png');
console.log('3. Use a design tool like Figma, Sketch, or Adobe Illustrator');
console.log('\nFor production, replace these with professionally designed icons.');
