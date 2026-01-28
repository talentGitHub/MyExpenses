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
    this.pendingSyncs = []; // Track failed syncs for retry
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
    
    // Save immediately, but don't wait for sync
    await this.saveExpenses();
    
    // Queue sync operation without blocking
    if (this.sync) {
      this.sync.syncExpense(expense).catch(error => {
        console.error('Background sync error:', error);
        // Track failed sync for potential retry
        this.pendingSyncs.push({ type: 'add', data: expense, timestamp: Date.now() });
      });
    }
    
    return expense;
  }

  async updateExpense(id, updates) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updates, updatedAt: new Date().toISOString() };
      
      // Save immediately, but don't wait for sync
      await this.saveExpenses();
      
      // Queue sync operation without blocking
      if (this.sync) {
        const updatedExpense = this.expenses[index];
        this.sync.syncExpense(updatedExpense).catch(error => {
          console.error('Background sync error:', error);
          // Track failed sync for potential retry
          this.pendingSyncs.push({ type: 'update', data: updatedExpense, timestamp: Date.now() });
        });
      }
      
      return this.expenses[index];
    }
    return null;
  }

  async deleteExpense(id) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    
    // Save immediately, but don't wait for sync
    await this.saveExpenses();
    
    // Queue sync operation without blocking
    if (this.sync) {
      this.sync.deleteExpense(id).catch(error => {
        console.error('Background sync error:', error);
        // Track failed sync for potential retry
        this.pendingSyncs.push({ type: 'delete', data: { id }, timestamp: Date.now() });
      });
    }
  }

  // Method to retry pending syncs
  async retryPendingSyncs() {
    if (!this.sync || this.pendingSyncs.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;
    const remainingSyncs = [];

    for (const pendingSync of this.pendingSyncs) {
      try {
        if (pendingSync.type === 'add' || pendingSync.type === 'update') {
          await this.sync.syncExpense(pendingSync.data);
        } else if (pendingSync.type === 'delete') {
          await this.sync.deleteExpense(pendingSync.data.id);
        }
        success++;
      } catch (error) {
        console.error('Retry sync failed:', error);
        remainingSyncs.push(pendingSync);
        failed++;
      }
    }

    this.pendingSyncs = remainingSyncs;
    return { success, failed, remaining: remainingSyncs.length };
  }

  // Get count of pending syncs
  getPendingSyncCount() {
    return this.pendingSyncs.length;
  }

  getExpenses(filters = {}) {
    let filtered = [...this.expenses];

    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    // Pre-parse dates once to avoid creating Date objects in every iteration
    const startTime = filters.startDate ? new Date(filters.startDate).getTime() : null;
    const endTime = filters.endDate ? new Date(filters.endDate).getTime() : null;

    if (startTime !== null) {
      filtered = filtered.filter(e => new Date(e.date).getTime() >= startTime);
    }

    if (endTime !== null) {
      filtered = filtered.filter(e => new Date(e.date).getTime() <= endTime);
    }

    // Cache date values for sorting to avoid repeated Date object creation
    if (filtered.length > 0) {
      const dateCache = new Map();
      return filtered.sort((a, b) => {
        let aTime;
        if (dateCache.has(a.id)) {
          aTime = dateCache.get(a.id);
        } else {
          aTime = new Date(a.date).getTime();
          dateCache.set(a.id, aTime);
        }
        
        let bTime;
        if (dateCache.has(b.id)) {
          bTime = dateCache.get(b.id);
        } else {
          bTime = new Date(b.date).getTime();
          dateCache.set(b.id, bTime);
        }
        
        return bTime - aTime;
      });
    }
    
    return filtered;
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

  // Optimized method to get both total and by-category in one pass
  getExpensesAnalysis(filters = {}) {
    const expenses = this.getExpenses(filters);
    let total = 0;
    const byCategory = {};
    
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      total += amount;
      
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += amount;
    });
    
    return { total, byCategory, expenses };
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
