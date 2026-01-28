// Sync adapter interface
export class SyncAdapter {
  async initialize() {
    throw new Error('initialize() must be implemented');
  }

  async syncExpense(expense) {
    throw new Error('syncExpense() must be implemented');
  }

  async deleteExpense(id) {
    throw new Error('deleteExpense() must be implemented');
  }

  async fetchAllExpenses() {
    throw new Error('fetchAllExpenses() must be implemented');
  }

  async syncAllExpenses(expenses) {
    throw new Error('syncAllExpenses() must be implemented');
  }
}

// Simple REST API sync adapter
export class RestApiSyncAdapter extends SyncAdapter {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }

  async initialize() {
    // Check API connectivity
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch (error) {
      console.warn('API not available, sync disabled');
      return false;
    }
  }

  async syncExpense(expense) {
    try {
      const response = await fetch(`${this.apiUrl}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      return await response.json();
    } catch (error) {
      console.error('Sync expense error:', error);
      throw error;
    }
  }

  async deleteExpense(id) {
    try {
      await fetch(`${this.apiUrl}/expenses/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }

  async fetchAllExpenses() {
    try {
      const response = await fetch(`${this.apiUrl}/expenses`);
      return await response.json();
    } catch (error) {
      console.error('Fetch expenses error:', error);
      return [];
    }
  }

  async syncAllExpenses(expenses) {
    try {
      const response = await fetch(`${this.apiUrl}/expenses/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenses)
      });
      return await response.json();
    } catch (error) {
      console.error('Sync all expenses error:', error);
      throw error;
    }
  }
}

// Mock sync adapter for development/testing
export class MockSyncAdapter extends SyncAdapter {
  constructor() {
    super();
    this.mockData = [];
  }

  async initialize() {
    console.log('Mock sync adapter initialized');
    return true;
  }

  async syncExpense(expense) {
    const index = this.mockData.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      this.mockData[index] = expense;
    } else {
      this.mockData.push(expense);
    }
    return expense;
  }

  async deleteExpense(id) {
    this.mockData = this.mockData.filter(e => e.id !== id);
  }

  async fetchAllExpenses() {
    return [...this.mockData];
  }

  async syncAllExpenses(expenses) {
    this.mockData = [...expenses];
    return this.mockData;
  }
}
