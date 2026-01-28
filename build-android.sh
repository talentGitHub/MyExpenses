#!/bin/bash

# MyExpenses Android Build Script
# This script helps you build an Android APK for the MyExpenses app

set -e  # Exit on error

echo "======================================"
echo "MyExpenses Android APK Builder"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [ ! -d "mobile" ]; then
    echo -e "${RED}Error: mobile directory not found!${NC}"
    echo "Please run this script from the MyExpenses root directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠ EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
    echo -e "${GREEN}✓ EAS CLI installed${NC}"
else
    echo -e "${GREEN}✓ EAS CLI found: $(eas --version)${NC}"
fi

echo ""
echo "======================================"
echo "Select Build Type:"
echo "======================================"
echo "1) Preview APK (Recommended for testing)"
echo "2) Production APK (For Play Store)"
echo "3) Development APK (For debugging)"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

cd mobile

case $choice in
    1)
        echo -e "${GREEN}Building Preview APK...${NC}"
        echo ""
        echo "This will create an APK that you can install on any Android device."
        echo "The build will run on Expo's servers and may take 10-20 minutes."
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
            npm run build:android:preview
        else
            echo "Build cancelled."
            exit 0
        fi
        ;;
    2)
        echo -e "${GREEN}Building Production APK...${NC}"
        echo ""
        echo "This will create an optimized APK for Play Store submission."
        echo "Make sure you have configured signing credentials."
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
            npm run build:android:production
        else
            echo "Build cancelled."
            exit 0
        fi
        ;;
    3)
        echo -e "${GREEN}Building Development APK...${NC}"
        echo ""
        echo "This will create a larger APK with development tools."
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
            eas build --platform android --profile development
        else
            echo "Build cancelled."
            exit 0
        fi
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo -e "${GREEN}Build initiated successfully!${NC}"
echo "======================================"
echo ""
echo "What happens next:"
echo "1. The build will run on Expo's servers"
echo "2. You'll receive a build URL"
echo "3. You can close this terminal - the build will continue"
echo "4. When complete, download the APK from the provided URL"
echo ""
echo "To check build status later:"
echo "  cd mobile && eas build:list"
echo ""
echo "To view build details:"
echo "  eas build:view [build-id]"
echo ""
echo -e "${GREEN}Happy building! 🚀${NC}"
