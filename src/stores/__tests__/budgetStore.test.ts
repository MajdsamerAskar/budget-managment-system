import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBudgetStore } from '../budgetStore';

describe('Budget Store - Simple Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Test 1
  it('should start with empty budgets', () => {
    const store = useBudgetStore();
    expect(store.budgets).toEqual([]);
  });

  // Test 2
  it('should calculate total allocated', () => {
    const store = useBudgetStore();
    store.budgets = [
      { id: '1', name: 'Food', total_amount: 500, spent: 100, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' },
      { id: '2', name: 'Gas', total_amount: 200, spent: 50, category_id: '2', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' }
    ];
    
    expect(store.totalAllocated).toBe(700);
  });

  // Test 3
  it('should calculate total spent', () => {
    const store = useBudgetStore();
    store.budgets = [
      { id: '1', name: 'Food', total_amount: 500, spent: 100, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' }
    ];
    
    expect(store.totalSpent).toBe(100);
  });

  // Test 4
  it('should find over-budget items', () => {
    const store = useBudgetStore();
    store.budgets = [
      { id: '1', name: 'Food', total_amount: 100, spent: 150, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' }
    ];
    
    expect(store.overBudgetItems.length).toBe(1);
  });

  // Test 5
  it('should calculate percentage', () => {
    const store = useBudgetStore();
    expect(store.getPercentage(50, 100)).toBe(50);
  });

  // Test 6
  it('should return safe status', () => {
    const store = useBudgetStore();
    const budget = { id: '1', name: 'Test', total_amount: 100, spent: 50, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' };
    
    expect(store.getBudgetStatus(budget)).toBe('safe');
  });

  // Test 7
  it('should return warning status', () => {
    const store = useBudgetStore();
    const budget = { id: '1', name: 'Test', total_amount: 100, spent: 85, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' };
    
    expect(store.getBudgetStatus(budget)).toBe('warning');
  });

  // Test 8
  it('should return danger status', () => {
    const store = useBudgetStore();
    const budget = { id: '1', name: 'Test', total_amount: 100, spent: 120, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' };
    
    expect(store.getBudgetStatus(budget)).toBe('danger');
  });

  // Test 9
  it('should find budget by id', () => {
    const store = useBudgetStore();
    store.budgets = [
      { id: '1', name: 'Food', total_amount: 500, spent: 100, category_id: '1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' }
    ];
    
    const found = store.getBudgetById('1');
    expect(found?.name).toBe('Food');
  });

  // Test 10
  it('should filter by category', () => {
    const store = useBudgetStore();
    store.budgets = [
      { id: '1', name: 'Food', total_amount: 500, spent: 100, category_id: 'cat1', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' },
      { id: '2', name: 'Gas', total_amount: 200, spent: 50, category_id: 'cat2', start_date: '2024-01-01', end_date: '2024-12-31', user_id: '1', created_at: '2024-01-01' }
    ];
    
    const filtered = store.getBudgetsByCategory('cat1');
    expect(filtered.length).toBe(1);
  });
});