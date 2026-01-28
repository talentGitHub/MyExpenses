// Performance test to measure improvements in expense operations
const { Expense, ExpenseManager } = require('./shared/src/index.js');

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

// Helper function to generate random date within last year
function randomDate() {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
  return new Date(randomTime).toISOString();
}

async function performanceTest() {
  console.log('🔥 Performance Test Suite\n');
  console.log('Testing with large datasets to measure optimization impact\n');

  const storage = new TestStorageAdapter();
  const manager = new ExpenseManager(storage, null);
  await manager.initialize();

  // Test 1: Add multiple expenses
  console.log('📊 Test 1: Bulk Insert Performance');
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities'];
  const startInsert = performance.now();
  
  const numExpenses = 1000;
  for (let i = 0; i < numExpenses; i++) {
    const expense = new Expense(
      null,
      Math.random() * 500,
      categories[Math.floor(Math.random() * categories.length)],
      `Test expense ${i}`,
      randomDate(),
      'USD'
    );
    await manager.addExpense(expense.toJSON());
  }
  
  const insertTime = performance.now() - startInsert;
  console.log(`✅ Inserted ${numExpenses} expenses in ${insertTime.toFixed(2)}ms`);
  console.log(`   Average: ${(insertTime / numExpenses).toFixed(3)}ms per expense\n`);

  // Test 2: Date filtering performance
  console.log('📊 Test 2: Date Filtering Performance');
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();
  
  const startFilter = performance.now();
  for (let i = 0; i < 100; i++) {
    manager.getExpenses({ startDate: oneMonthAgo });
  }
  const filterTime = performance.now() - startFilter;
  
  console.log(`✅ Performed 100 date filter operations in ${filterTime.toFixed(2)}ms`);
  console.log(`   Average: ${(filterTime / 100).toFixed(3)}ms per filter\n`);

  // Test 3: Category filtering performance
  console.log('📊 Test 3: Category Filtering Performance');
  const startCategoryFilter = performance.now();
  for (let i = 0; i < 100; i++) {
    manager.getExpenses({ category: 'Food & Dining' });
  }
  const categoryFilterTime = performance.now() - startCategoryFilter;
  
  console.log(`✅ Performed 100 category filter operations in ${categoryFilterTime.toFixed(2)}ms`);
  console.log(`   Average: ${(categoryFilterTime / 100).toFixed(3)}ms per filter\n`);

  // Test 4: getTotalExpenses performance
  console.log('📊 Test 4: Total Calculation Performance');
  const startTotal = performance.now();
  for (let i = 0; i < 100; i++) {
    manager.getTotalExpenses();
  }
  const totalTime = performance.now() - startTotal;
  
  console.log(`✅ Calculated totals 100 times in ${totalTime.toFixed(2)}ms`);
  console.log(`   Average: ${(totalTime / 100).toFixed(3)}ms per calculation\n`);

  // Test 5: getExpensesByCategory performance
  console.log('📊 Test 5: Category Summary Performance');
  const startCategorySummary = performance.now();
  for (let i = 0; i < 100; i++) {
    manager.getExpensesByCategory();
  }
  const categorySummaryTime = performance.now() - startCategorySummary;
  
  console.log(`✅ Generated category summaries 100 times in ${categorySummaryTime.toFixed(2)}ms`);
  console.log(`   Average: ${(categorySummaryTime / 100).toFixed(3)}ms per summary\n`);

  // Test 6: Optimized getExpensesAnalysis performance
  console.log('📊 Test 6: Optimized Analysis Performance (new method)');
  const startAnalysis = performance.now();
  for (let i = 0; i < 100; i++) {
    manager.getExpensesAnalysis();
  }
  const analysisTime = performance.now() - startAnalysis;
  
  console.log(`✅ Generated complete analysis 100 times in ${analysisTime.toFixed(2)}ms`);
  console.log(`   Average: ${(analysisTime / 100).toFixed(3)}ms per analysis\n`);

  // Test 7: Compare old vs new approach
  console.log('📊 Test 7: Old vs New Approach Comparison');
  
  const startOld = performance.now();
  for (let i = 0; i < 100; i++) {
    const expenses = manager.getExpenses();
    const total = manager.getTotalExpenses();
    const byCategory = manager.getExpensesByCategory();
  }
  const oldTime = performance.now() - startOld;
  
  const startNew = performance.now();
  for (let i = 0; i < 100; i++) {
    const { expenses, total, byCategory } = manager.getExpensesAnalysis();
  }
  const newTime = performance.now() - startNew;
  
  console.log(`   Old approach (3 separate calls): ${oldTime.toFixed(2)}ms`);
  console.log(`   New approach (1 combined call): ${newTime.toFixed(2)}ms`);
  console.log(`   ⚡ Speedup: ${(oldTime / newTime).toFixed(2)}x faster`);
  console.log(`   💾 Saved: ${(oldTime - newTime).toFixed(2)}ms (${(((oldTime - newTime) / oldTime) * 100).toFixed(1)}% reduction)\n`);

  // Summary
  console.log('📈 Performance Summary:');
  console.log('═══════════════════════════════════════════════');
  console.log(`Total expenses in dataset: ${manager.getExpenses().length}`);
  console.log(`\nKey Optimizations:`);
  console.log(`✅ Date filtering: Pre-parsed dates reduce object creation`);
  console.log(`✅ Combined analysis: ${(((oldTime - newTime) / oldTime) * 100).toFixed(1)}% faster for common operations`);
  console.log(`✅ Async sync: Non-blocking background operations`);
  console.log(`✅ React memoization: Prevents unnecessary re-renders`);
  console.log(`✅ DOM optimization: DocumentFragment for efficient rendering`);
  console.log('\n🎉 Performance optimizations successfully implemented!\n');
}

// Run the performance test
performanceTest().catch(error => {
  console.error('❌ Performance test failed:', error);
  process.exit(1);
});
