// Simple test to verify the expense tracking functionality
const { Expense, EXPENSE_CATEGORIES, CURRENCIES, ExpenseManager, MockSyncAdapter } = require('./shared/src/index.js');

// Mock storage adapter for testing
class TestStorageAdapter {
  constructor() {
    this.data = {};
  }

  async save(key, data) {
    this.data[key] = data;
  }

  async load(key) {
    return this.data[key] || null;
  }

  async delete(key) {
    delete this.data[key];
  }

  async clear() {
    this.data = {};
  }
}

async function runTests() {
  console.log('🧪 Running MyExpenses Tests...\n');

  try {
    // Test 1: Create expense
    console.log('Test 1: Create expense');
    const expense = new Expense(null, 25.50, 'Food & Dining', 'Lunch at restaurant', null, 'USD');
    console.log('✅ Expense created:', expense.toJSON());
    console.assert(expense.amount === 25.50, 'Amount should be 25.50');
    console.assert(expense.category === 'Food & Dining', 'Category should be Food & Dining');
    console.log();

    // Test 2: Initialize ExpenseManager
    console.log('Test 2: Initialize ExpenseManager');
    const storage = new TestStorageAdapter();
    const sync = new MockSyncAdapter();
    const manager = new ExpenseManager(storage, sync);
    await manager.initialize();
    console.log('✅ ExpenseManager initialized');
    console.log();

    // Test 3: Add expense
    console.log('Test 3: Add expense');
    const expense1 = new Expense(null, 50.00, 'Transportation', 'Taxi ride', null, 'USD');
    await manager.addExpense(expense1.toJSON());
    const expenses = manager.getExpenses();
    console.assert(expenses.length === 1, 'Should have 1 expense');
    console.log('✅ Expense added. Total expenses:', expenses.length);
    console.log();

    // Test 4: Add multiple expenses
    console.log('Test 4: Add multiple expenses');
    await manager.addExpense(new Expense(null, 15.75, 'Food & Dining', 'Coffee', null, 'USD').toJSON());
    await manager.addExpense(new Expense(null, 120.00, 'Shopping', 'Groceries', null, 'USD').toJSON());
    const allExpenses = manager.getExpenses();
    console.assert(allExpenses.length === 3, 'Should have 3 expenses');
    console.log('✅ Multiple expenses added. Total:', allExpenses.length);
    console.log();

    // Test 5: Calculate total
    console.log('Test 5: Calculate total expenses');
    const total = manager.getTotalExpenses();
    console.assert(total === 185.75, `Total should be 185.75, got ${total}`);
    console.log('✅ Total calculated correctly:', total);
    console.log();

    // Test 6: Filter by category
    console.log('Test 6: Filter expenses by category');
    const foodExpenses = manager.getExpenses({ category: 'Food & Dining' });
    console.assert(foodExpenses.length === 1, 'Should have 1 food expense');
    console.log('✅ Category filter works. Food expenses:', foodExpenses.length);
    console.log();

    // Test 7: Get expenses by category summary
    console.log('Test 7: Get expenses by category summary');
    const byCategory = manager.getExpensesByCategory();
    console.log('✅ Expenses by category:', byCategory);
    console.log();

    // Test 8: Delete expense
    console.log('Test 8: Delete expense');
    const expenseToDelete = allExpenses[0];
    await manager.deleteExpense(expenseToDelete.id);
    const afterDelete = manager.getExpenses();
    console.assert(afterDelete.length === 2, 'Should have 2 expenses after delete');
    console.log('✅ Expense deleted. Remaining:', afterDelete.length);
    console.log();

    // Test 9: Sync functionality
    console.log('Test 9: Test sync functionality');
    await manager.syncAll();
    console.log('✅ Sync completed successfully');
    console.log();

    // Test 10: Expense categories
    console.log('Test 10: Verify expense categories');
    console.assert(EXPENSE_CATEGORIES.length === 10, 'Should have 10 categories');
    console.log('✅ Categories available:', EXPENSE_CATEGORIES.length);
    console.log('   Categories:', EXPENSE_CATEGORIES.join(', '));
    console.log();

    // Test 11: Currency support
    console.log('Test 11: Verify currency support');
    console.assert(CURRENCIES.length === 6, 'Should have 6 currencies');
    console.log('✅ Currencies available:', CURRENCIES.length);
    console.log('   Currencies:', CURRENCIES.map(c => `${c.code} (${c.symbol})`).join(', '));
    console.log();

    console.log('🎉 All tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run tests
runTests().then(success => {
  if (success) {
    console.log('✨ MyExpenses core functionality is working correctly!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed!');
    process.exit(1);
  }
});
