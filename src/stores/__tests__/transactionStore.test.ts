import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../transactionStore';

describe('Transaction Store - Simple Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Test 1
  it('should start with empty transactions', () => {
    const store = useTransactionStore();
    expect(store.transactions).toEqual([]);
  });

  // Test 2
  it('should calculate total income', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Salary', 
        amount: 5000, 
        transaction_type: 'Income', 
        payment_method: 'Bank Transfer',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Bonus', 
        amount: 1000, 
        transaction_type: 'Income', 
        payment_method: 'Bank Transfer',
        date: '2024-01-15', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-15' 
      }
    ];
    
    expect(store.totalIncome).toBe(6000);
  });

  // Test 3
  it('should calculate total expenses', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Groceries', 
        amount: 200, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-10', 
        account_id: '1', 
        category_id: '2', 
        user_id: '1', 
        created_at: '2024-01-10' 
      },
      { 
        id: '2', 
        description: 'Gas', 
        amount: 50, 
        transaction_type: 'Expense', 
        payment_method: 'Card',
        date: '2024-01-12', 
        account_id: '1', 
        category_id: '3', 
        user_id: '1', 
        created_at: '2024-01-12' 
      }
    ];
    
    expect(store.totalExpenses).toBe(250);
  });

  // Test 4
  it('should calculate net savings', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Salary', 
        amount: 5000, 
        transaction_type: 'Income', 
        payment_method: 'Bank Transfer',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Rent', 
        amount: 2000, 
        transaction_type: 'Expense', 
        payment_method: 'Bank Transfer',
        date: '2024-01-10', 
        account_id: '1', 
        category_id: '2', 
        user_id: '1', 
        created_at: '2024-01-10' 
      }
    ];
    
    expect(store.netSavings).toBe(3000);
  });

  // Test 5
  it('should filter income transactions', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Salary', 
        amount: 5000, 
        transaction_type: 'Income', 
        payment_method: 'Bank Transfer',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Groceries', 
        amount: 200, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-10', 
        account_id: '1', 
        category_id: '2', 
        user_id: '1', 
        created_at: '2024-01-10' 
      }
    ];
    
    expect(store.incomeTransactions.length).toBe(1);
  });

  // Test 6
  it('should filter expense transactions', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Salary', 
        amount: 5000, 
        transaction_type: 'Income', 
        payment_method: 'Bank Transfer',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Groceries', 
        amount: 200, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-10', 
        account_id: '1', 
        category_id: '2', 
        user_id: '1', 
        created_at: '2024-01-10' 
      }
    ];
    
    expect(store.expenseTransactions.length).toBe(1);
  });

  // Test 7
  it('should get transactions by account', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Test1', 
        amount: 100, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-01', 
        account_id: 'acc1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Test2', 
        amount: 200, 
        transaction_type: 'Expense', 
        payment_method: 'Card',
        date: '2024-01-02', 
        account_id: 'acc2', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-02' 
      }
    ];
    
    const result = store.getTransactionsByAccount('acc1');
    expect(result.length).toBe(1);
  });

  // Test 8
  it('should get transactions by category', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Groceries', 
        amount: 100, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: 'cat1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Gas', 
        amount: 50, 
        transaction_type: 'Expense', 
        payment_method: 'Card',
        date: '2024-01-02', 
        account_id: '1', 
        category_id: 'cat2', 
        user_id: '1', 
        created_at: '2024-01-02' 
      }
    ];
    
    const result = store.getTransactionsByCategory('cat1');
    expect(result.length).toBe(1);
  });

  // Test 9
  it('should get transactions by date range', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Test', 
        amount: 100, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-05', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      },
      { 
        id: '2', 
        description: 'Test', 
        amount: 200, 
        transaction_type: 'Expense', 
        payment_method: 'Card',
        date: '2024-01-15', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      }
    ];
    
    const result = store.getTransactionsByDateRange('2024-01-01', '2024-01-10');
    expect(result.length).toBe(1);
  });

  // Test 10
  it('should clear all transactions', () => {
    const store = useTransactionStore();
    store.transactions = [
      { 
        id: '1', 
        description: 'Test', 
        amount: 100, 
        transaction_type: 'Expense', 
        payment_method: 'Cash',
        date: '2024-01-01', 
        account_id: '1', 
        category_id: '1', 
        user_id: '1', 
        created_at: '2024-01-01' 
      }
    ];
    
    store.clearTransactions();
    expect(store.transactions).toEqual([]);
  });
});