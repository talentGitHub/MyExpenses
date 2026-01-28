import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ExpenseForm from '../src/components/ExpenseForm';
import ExpenseList from '../src/components/ExpenseList';
import { ReactNativeStorageAdapter } from '../src/storage/ReactNativeStorageAdapter';

// Import shared business logic
const { Expense, EXPENSE_CATEGORIES, CURRENCIES, ExpenseManager, MockSyncAdapter } = require('../../shared/src/index.js');

export default function Index() {
  const [expenses, setExpenses] = useState([]);
  const [expenseManager, setExpenseManager] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const storage = new ReactNativeStorageAdapter();
      const syncAdapter = new MockSyncAdapter();
      const manager = new ExpenseManager(storage, syncAdapter);
      
      await manager.initialize();
      setExpenseManager(manager);
      
      // Load expenses
      const loadedExpenses = manager.getExpenses();
      setExpenses(loadedExpenses);
      setTotalExpenses(manager.getTotalExpenses());
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Error', 'Failed to initialize app');
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const expense = new Expense(
        null,
        expenseData.amount,
        expenseData.category,
        expenseData.description,
        expenseData.date,
        expenseData.currency
      );
      
      await expenseManager.addExpense(expense.toJSON());
      
      // Refresh the list
      const updatedExpenses = expenseManager.getExpenses();
      setExpenses(updatedExpenses);
      setTotalExpenses(expenseManager.getTotalExpenses());
      
      Alert.alert('Success', 'Expense added successfully');
    } catch (error) {
      console.error('Add expense error:', error);
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseManager.deleteExpense(id);
              
              // Refresh the list
              const updatedExpenses = expenseManager.getExpenses();
              setExpenses(updatedExpenses);
              setTotalExpenses(expenseManager.getTotalExpenses());
            } catch (error) {
              console.error('Delete expense error:', error);
              Alert.alert('Error', 'Failed to delete expense');
            }
          }
        }
      ]
    );
  };

  const handleSync = async () => {
    setRefreshing(true);
    try {
      const success = await expenseManager.syncAll();
      if (success) {
        const updatedExpenses = expenseManager.getExpenses();
        setExpenses(updatedExpenses);
        setTotalExpenses(expenseManager.getTotalExpenses());
        Alert.alert('Success', 'Data synced successfully');
      } else {
        Alert.alert('Warning', 'Sync completed with warnings');
      }
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync data');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!expenseManager) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyExpenses</Text>
        <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
          <Text style={styles.syncButtonText}>🔄 Sync</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
        <Text style={styles.summaryCount}>{expenses.length} transactions</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleSync} />
        }
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          categories={EXPENSE_CATEGORIES}
          currencies={CURRENCIES}
        />
        
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  syncButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});
