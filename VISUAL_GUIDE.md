# MyExpenses - Visual Guide

## Desktop Application (Windows)

The Windows desktop application provides a clean, modern interface for tracking expenses.

### Main Features

1. **Header Bar**
   - App title "MyExpenses"
   - Sync button for data synchronization

2. **Summary Dashboard**
   - Total expenses displayed prominently
   - Transaction count
   - Blue gradient background for visual appeal

3. **Expense Form** (Left Panel)
   - Amount input (numeric with decimal support)
   - Category dropdown (10 predefined categories)
   - Description text area
   - Currency selector (6 currencies)
   - "Add Expense" button

4. **Expense List** (Right Panel)
   - List of all expenses sorted by date
   - Each expense shows:
     - Category name
     - Amount with currency
     - Description
     - Date
     - Delete button

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ MyExpenses                                   [🔄 Sync]       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                    Total Expenses                            │
│                      $185.75                                 │
│                   3 transactions                             │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  Add New Expense     │  │  Recent Expenses            │ │
│  │                      │  │                              │ │
│  │  Amount: [_______]   │  │  ┌─────────────────────────┐│ │
│  │                      │  │  │ Food & Dining    $25.50 ││ │
│  │  Category: [▼____]   │  │  │ Lunch at restaurant     ││ │
│  │                      │  │  │ Jan 28, 2026   [Delete] ││ │
│  │  Description:        │  │  └─────────────────────────┘│ │
│  │  [____________]      │  │                              │ │
│  │  [____________]      │  │  ┌─────────────────────────┐│ │
│  │  [____________]      │  │  │ Shopping        $120.00 ││ │
│  │                      │  │  │ Groceries               ││ │
│  │  Currency: [USD ▼]   │  │  │ Jan 28, 2026   [Delete] ││ │
│  │                      │  │  └─────────────────────────┘│ │
│  │  [Add Expense]       │  │                              │ │
│  │                      │  │  ┌─────────────────────────┐│ │
│  └──────────────────────┘  │  │ Transportation   $50.00 ││ │
│                              │  │ Taxi ride               ││ │
│                              │  │ Jan 28, 2026   [Delete] ││ │
│                              │  └─────────────────────────┘│ │
│                              └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Mobile Application (Android & iOS)

The mobile app provides a touch-friendly interface optimized for smartphones.

### Main Features

1. **Header**
   - App title
   - Sync button

2. **Summary Card**
   - Total expenses
   - Transaction count
   - Blue gradient background

3. **Expense Form**
   - Amount input with numeric keyboard
   - Category picker with tap selection
   - Description text input
   - Currency selector
   - Large "Add Expense" button

4. **Expense List**
   - Scrollable list of expenses
   - Pull-to-refresh for syncing
   - Swipeable items (on mobile)
   - Delete confirmation dialog

### Mobile Layout

```
┌────────────────────────┐
│    MyExpenses  [🔄]   │
├────────────────────────┤
│                        │
│   Total Expenses       │
│      $185.75          │
│   3 transactions       │
│                        │
├────────────────────────┤
│                        │
│  Add New Expense       │
│                        │
│  Amount                │
│  [_______________]     │
│                        │
│  Category              │
│  [Food & Dining   ▼]   │
│                        │
│  Description           │
│  [_______________]     │
│  [_______________]     │
│                        │
│  Currency              │
│  [USD            ▼]    │
│                        │
│  [  Add Expense  ]     │
│                        │
├────────────────────────┤
│  Recent Expenses       │
│                        │
│  ┌──────────────────┐  │
│  │ Food & Dining    │  │
│  │ $25.50           │  │
│  │ Lunch at...      │  │
│  │ Jan 28  [Delete] │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ Shopping         │  │
│  │ $120.00          │  │
│  │ Groceries        │  │
│  │ Jan 28  [Delete] │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ Transportation   │  │
│  │ $50.00           │  │
│  │ Taxi ride        │  │
│  │ Jan 28  [Delete] │  │
│  └──────────────────┘  │
│                        │
└────────────────────────┘
```

## Color Scheme

- **Primary Color**: Blue (#007AFF) - Used for buttons, highlights
- **Background**: Light gray (#F5F5F5) - Main background
- **Cards**: White (#FFFFFF) - Form and list item backgrounds
- **Text**: Dark gray (#333333) - Primary text
- **Secondary Text**: Medium gray (#666666) - Descriptions
- **Border**: Light gray (#DDDDDD) - Input borders

## Typography

- **Headers**: 24-28px, Bold
- **Body**: 14-16px, Regular
- **Small Text**: 12px, Regular
- **Amounts**: 18-48px, Bold

## Responsive Design

- **Desktop**: Two-column layout (form + list)
- **Mobile**: Single-column stacked layout
- **Tablet**: Adaptive layout based on screen width

## Accessibility

- Clear visual hierarchy
- Sufficient color contrast
- Touch-friendly button sizes (mobile)
- Keyboard navigation (desktop)
- Screen reader compatible

## User Experience Flow

### Adding an Expense

1. User enters amount → Numeric keyboard appears (mobile)
2. User selects category → Dropdown/picker opens
3. User adds description (optional) → Text input
4. User clicks "Add Expense" → Confirmation appears
5. Expense appears in list → Summary updates

### Syncing Data

1. User clicks "Sync" button → Button shows loading state
2. App syncs with server → Progress indication
3. Sync completes → Success message shown
4. List updates with any new data → UI refreshes

### Deleting an Expense

1. User clicks "Delete" → Confirmation dialog appears
2. User confirms → Expense removed from list
3. Summary updates → Sync marked for deletion

## Platform-Specific Features

### Windows Desktop
- Native window controls
- Keyboard shortcuts
- System tray integration (future)
- Auto-update (future)

### Android
- Material Design components
- Navigation drawer (future)
- Notification support (future)
- Widget support (future)

### iOS
- Native iOS design patterns
- Swipe gestures
- 3D Touch support (future)
- Widget support (future)

## Future UI Enhancements

- Dark mode support
- Customizable themes
- Charts and graphs
- Budget progress bars
- Category icons
- Search and filter UI
- Export options
- Settings screen
