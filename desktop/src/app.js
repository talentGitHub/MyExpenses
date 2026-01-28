const { ElectronStorageAdapter } = require('./storage');

// Load shared business logic
const sharedPath = require('path').join(__dirname, '../../shared/src/index.js');
const { Expense, EXPENSE_CATEGORIES, CURRENCIES, ExpenseManager, MockSyncAdapter } = require(sharedPath);

// Initialize the app
let expenseManager;

async function initializeApp() {
  try {
    const storage = new ElectronStorageAdapter();
    const syncAdapter = new MockSyncAdapter();
    expenseManager = new ExpenseManager(storage, syncAdapter);
    
    await expenseManager.initialize();
    
    // Populate categories dropdown
    populateCategories();
    
    // Render initial expenses
    renderExpenses();
    updateSummary();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    alert('Failed to initialize app');
  }
}

function populateCategories() {
  const categorySelect = document.getElementById('category');
  EXPENSE_CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

function renderExpenses() {
  const container = document.getElementById('expenseListContainer');
  const expenses = expenseManager.getExpenses();
  
  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No expenses recorded yet</h3>
        <p>Add your first expense using the form on the left</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = expenses.map(expense => `
    <div class="expense-item">
      <div class="expense-header">
        <div class="expense-category">${expense.category}</div>
        <div class="expense-amount">${formatCurrency(expense.amount, expense.currency)}</div>
      </div>
      <div class="expense-description">${expense.description || 'No description'}</div>
      <div class="expense-footer">
        <div class="expense-date">${formatDate(expense.date)}</div>
        <button class="btn btn-danger" onclick="deleteExpense('${expense.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function updateSummary() {
  const totalAmount = expenseManager.getTotalExpenses();
  const expenses = expenseManager.getExpenses();
  
  document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
  document.getElementById('transactionCount').textContent = expenses.length;
}

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const currency = document.getElementById('currency').value;
  
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  try {
    const expense = new Expense(
      null,
      amount,
      category,
      description,
      new Date().toISOString(),
      currency
    );
    
    await expenseManager.addExpense(expense.toJSON());
    
    // Reset form
    document.getElementById('expenseForm').reset();
    
    // Update UI
    renderExpenses();
    updateSummary();
    
    alert('Expense added successfully!');
  } catch (error) {
    console.error('Add expense error:', error);
    alert('Failed to add expense');
  }
});

// Delete expense function
async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) {
    return;
  }
  
  try {
    await expenseManager.deleteExpense(id);
    renderExpenses();
    updateSummary();
  } catch (error) {
    console.error('Delete expense error:', error);
    alert('Failed to delete expense');
  }
}

// Sync button handler
document.getElementById('syncBtn').addEventListener('click', async () => {
  const syncBtn = document.getElementById('syncBtn');
  syncBtn.disabled = true;
  syncBtn.textContent = '⏳ Syncing...';
  
  try {
    const success = await expenseManager.syncAll();
    if (success) {
      renderExpenses();
      updateSummary();
      alert('Data synced successfully!');
    } else {
      alert('Sync completed with warnings');
    }
  } catch (error) {
    console.error('Sync error:', error);
    alert('Failed to sync data');
  } finally {
    syncBtn.disabled = false;
    syncBtn.textContent = '🔄 Sync';
  }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make deleteExpense available globally
window.deleteExpense = deleteExpense;
