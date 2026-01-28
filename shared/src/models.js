// Expense data model
export class Expense {
  constructor(id, amount, category, description, date, currency = 'USD') {
    this.id = id || this.generateId();
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date || new Date().toISOString();
    this.currency = currency;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.syncStatus = 'pending'; // pending, synced, conflict
  }

  generateId() {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: this.date,
      currency: this.currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      syncStatus: this.syncStatus
    };
  }

  static fromJSON(json) {
    const expense = new Expense(
      json.id,
      json.amount,
      json.category,
      json.description,
      json.date,
      json.currency
    );
    expense.createdAt = json.createdAt;
    expense.updatedAt = json.updatedAt;
    expense.syncStatus = json.syncStatus || 'pending';
    return expense;
  }
}

// Expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal',
  'Other'
];

// Currency list
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
];
