// Storage interface for different platforms
export class StorageAdapter {
  async save(key, data) {
    throw new Error('save() must be implemented');
  }

  async load(key) {
    throw new Error('load() must be implemented');
  }

  async delete(key) {
    throw new Error('delete() must be implemented');
  }

  async clear() {
    throw new Error('clear() must be implemented');
  }
}

// Expense manager with sync capabilities
export class ExpenseManager {
  constructor(storageAdapter, syncAdapter = null) {
    this.storage = storageAdapter;
    this.sync = syncAdapter;
    this.expenses = [];
    this.STORAGE_KEY = 'myexpenses_data';
  }

  async initialize() {
    await this.loadExpenses();
    if (this.sync) {
      await this.sync.initialize();
    }
  }

  async loadExpenses() {
    try {
      const data = await this.storage.load(this.STORAGE_KEY);
      this.expenses = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      this.expenses = [];
    }
  }

  async saveExpenses() {
    try {
      await this.storage.save(this.STORAGE_KEY, JSON.stringify(this.expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  async addExpense(expense) {
    this.expenses.push(expense);
    await this.saveExpenses();
    
    if (this.sync) {
      await this.sync.syncExpense(expense);
    }
    
    return expense;
  }

  async updateExpense(id, updates) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveExpenses();
      
      if (this.sync) {
        await this.sync.syncExpense(this.expenses[index]);
      }
      
      return this.expenses[index];
    }
    return null;
  }

  async deleteExpense(id) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    await this.saveExpenses();
    
    if (this.sync) {
      await this.sync.deleteExpense(id);
    }
  }

  getExpenses(filters = {}) {
    let filtered = [...this.expenses];

    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(e => new Date(e.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(e => new Date(e.date) <= new Date(filters.endDate));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTotalExpenses(filters = {}) {
    const expenses = this.getExpenses(filters);
    return expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  }

  getExpensesByCategory(filters = {}) {
    const expenses = this.getExpenses(filters);
    const byCategory = {};
    
    expenses.forEach(expense => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += parseFloat(expense.amount);
    });
    
    return byCategory;
  }

  async syncAll() {
    if (!this.sync) {
      throw new Error('Sync adapter not configured');
    }

    try {
      // Get remote expenses
      const remoteExpenses = await this.sync.fetchAllExpenses();
      
      // Merge with local expenses (simple last-write-wins strategy)
      const mergedExpenses = this.mergeExpenses(this.expenses, remoteExpenses);
      
      this.expenses = mergedExpenses;
      await this.saveExpenses();
      
      // Push any pending local changes
      await this.sync.syncAllExpenses(this.expenses);
      
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  mergeExpenses(local, remote) {
    const merged = new Map();
    
    // Add all local expenses
    local.forEach(expense => {
      merged.set(expense.id, expense);
    });
    
    // Merge remote expenses (last-write-wins based on updatedAt)
    remote.forEach(remoteExpense => {
      const localExpense = merged.get(remoteExpense.id);
      
      if (!localExpense) {
        merged.set(remoteExpense.id, remoteExpense);
      } else {
        // Keep the most recently updated version
        const localTime = new Date(localExpense.updatedAt).getTime();
        const remoteTime = new Date(remoteExpense.updatedAt).getTime();
        
        if (remoteTime > localTime) {
          merged.set(remoteExpense.id, remoteExpense);
        }
      }
    });
    
    return Array.from(merged.values());
  }
}
