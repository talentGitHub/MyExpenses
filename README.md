# MyExpenses - Cross-Platform Expense Tracking Application

A comprehensive expense tracking application that works seamlessly across Windows, Android, and iOS platforms with built-in synchronization capabilities.

## Features

- ✅ **Cross-Platform Support**: Works on Windows (Desktop), Android, and iOS
- ✅ **Expense Tracking**: Record daily expenses with amount, category, description, and date
- ✅ **Category Management**: Pre-defined categories including Food, Transportation, Shopping, etc.
- ✅ **Currency Support**: Multiple currency support (USD, EUR, GBP, JPY, CNY, INR)
- ✅ **Data Synchronization**: Sync your expenses across all devices
- ✅ **Local Storage**: Data persists locally on each device
- ✅ **Summary Dashboard**: View total expenses and transaction counts
- ✅ **Modern UI**: Clean and intuitive user interface

## Architecture

The application is built with a modular architecture:

```
MyExpenses/
├── shared/          # Shared business logic (models, managers, sync)
├── mobile/          # React Native app for Android & iOS
├── desktop/         # Electron app for Windows
└── docs/            # Documentation
```

### Technology Stack

- **Mobile (Android & iOS)**: React Native with Expo
- **Desktop (Windows)**: Electron.js
- **Shared Logic**: JavaScript ES6 modules
- **Local Storage**: 
  - Mobile: AsyncStorage (React Native)
  - Desktop: Electron Store
- **Sync**: Pluggable sync adapters (Mock/REST API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- For mobile development:
  - Android Studio (for Android)
  - Xcode (for iOS, macOS only)
  - Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/talentGitHub/MyExpenses.git
cd MyExpenses
```

2. Install dependencies for all projects:
```bash
npm run install:all
```

Or install individually:
```bash
# Install shared dependencies
cd shared && npm install

# Install mobile dependencies
cd mobile && npm install

# Install desktop dependencies
cd desktop && npm install
```

## Running the Applications

### Mobile App (Android & iOS)

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens in Expo Go)

Or run directly on emulators/simulators:
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

### Desktop App (Windows)

1. Navigate to the desktop directory:
```bash
cd desktop
```

2. Install dependencies (if not done already):
```bash
npm install
```

3. Start the application:
```bash
npm start
```

### Building for Production

#### Mobile Apps

Build Android APK:
```bash
cd mobile
expo build:android
```

Build iOS IPA:
```bash
cd mobile
expo build:ios
```

#### Desktop App

Build for Windows:
```bash
cd desktop
npm run build:win
```

The installer will be created in the `desktop/dist` directory.

Build for other platforms:
```bash
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Usage Guide

### Adding an Expense

1. Fill in the expense details:
   - **Amount**: Enter the expense amount (e.g., 25.50)
   - **Category**: Select from predefined categories
   - **Description**: Add optional notes about the expense
   - **Currency**: Select your currency (default: USD)

2. Click/Tap "Add Expense" button

3. The expense will be saved locally and marked for sync

### Viewing Expenses

- All expenses are displayed in chronological order (newest first)
- Each expense shows:
  - Category
  - Amount with currency
  - Description
  - Date
  - Delete button

### Syncing Data

1. Click/Tap the "Sync" button in the header
2. The app will synchronize with other devices
3. A confirmation message will appear when sync is complete

**Note**: Currently using a mock sync adapter for demonstration. For production, configure a real backend API.

### Deleting Expenses

1. Find the expense you want to delete
2. Click/Tap the "Delete" button
3. Confirm the deletion
4. The expense will be removed from local storage and sync

## Data Synchronization

### How Sync Works

1. **Local-First**: All data is stored locally first
2. **Background Sync**: Data syncs in the background when requested
3. **Conflict Resolution**: Last-write-wins strategy for conflicts
4. **Offline Support**: Works offline, syncs when connection is available

### Configuring Sync Backend

To use a real sync backend:

1. Replace `MockSyncAdapter` with `RestApiSyncAdapter` in:
   - `mobile/app/index.js`
   - `desktop/src/app.js`

2. Provide your API endpoint:
```javascript
const syncAdapter = new RestApiSyncAdapter('https://your-api.com');
```

3. Implement the backend API with these endpoints:
   - `POST /expenses` - Add/update expense
   - `DELETE /expenses/:id` - Delete expense
   - `GET /expenses` - Fetch all expenses
   - `POST /expenses/sync` - Bulk sync
   - `GET /health` - Health check

## Project Structure

### Shared Module (`shared/`)

Contains business logic shared across all platforms:

- **models.js**: Data models (Expense, Categories, Currencies)
- **expenseManager.js**: Core business logic and data management
- **syncAdapter.js**: Sync interface and implementations

### Mobile App (`mobile/`)

React Native application:

- **app/**: Main application screens
- **src/components/**: Reusable UI components
- **src/storage/**: Platform-specific storage adapter

### Desktop App (`desktop/`)

Electron application:

- **main.js**: Electron main process
- **src/index.html**: Main UI layout
- **src/app.js**: Application logic
- **src/styles.css**: Styling
- **src/storage.js**: Electron storage adapter

## Development

### Code Style

- Use ES6+ JavaScript features
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Testing

Currently, the project uses manual testing. To add automated tests:

1. Install testing frameworks:
```bash
npm install --save-dev jest @testing-library/react-native
```

2. Add test scripts to package.json
3. Write unit tests for shared logic
4. Write integration tests for UI components

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on all platforms
5. Submit a pull request

## Troubleshooting

### Mobile App Issues

**Problem**: Expo app won't start
- Solution: Clear cache with `expo start -c`

**Problem**: Can't connect to development server
- Solution: Ensure your phone and computer are on the same network

### Desktop App Issues

**Problem**: Electron app won't start
- Solution: Delete `node_modules` and reinstall dependencies

**Problem**: Build fails
- Solution: Check that electron-builder is properly installed

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/talentGitHub/MyExpenses/issues

## Roadmap

Future enhancements:
- [ ] User authentication
- [ ] Cloud backup
- [ ] Export to CSV/PDF
- [ ] Budget tracking
- [ ] Recurring expenses
- [ ] Multi-currency conversion
- [ ] Charts and analytics
- [ ] Receipt photo attachments
- [ ] Split expenses
- [ ] Categories customization