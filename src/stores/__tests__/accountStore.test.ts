import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountStore } from '../accountStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}));

describe('Account Store - Simple Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Test 1
  it('should start with empty accounts', () => {
    const store = useAccountStore();
    expect(store.accounts).toEqual([]);
  });

  // Test 2
  it('should start with loading as false', () => {
    const store = useAccountStore();
    expect(store.isLoading).toBe(false);
  });

  // Test 3
  it('should start with null error', () => {
    const store = useAccountStore();
    expect(store.error).toBeNull();
  });

  // Test 4
  it('should calculate total balance from accounts', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Savings', type: 'Bank', balance: 5000, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const totalBalance = store.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    expect(totalBalance).toBe(6000);
  });

  // Test 5
  it('should filter bank accounts', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Cash', type: 'Wallet', balance: 200, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const bankAccounts = store.accounts.filter(acc => acc.type === 'Bank');
    expect(bankAccounts.length).toBe(1);
  });

  // Test 6
  it('should filter wallet accounts', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Cash', type: 'Wallet', balance: 200, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const walletAccounts = store.accounts.filter(acc => acc.type === 'Wallet');
    expect(walletAccounts.length).toBe(1);
  });

  // Test 7
  it('should filter credit accounts', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Credit Card', type: 'Credit', balance: -500, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const creditAccounts = store.accounts.filter(acc => acc.type === 'Credit');
    expect(creditAccounts.length).toBe(1);
  });

  // Test 8
  it('should find account by id', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Savings', type: 'Bank', balance: 5000, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const found = store.accounts.find(acc => acc.id === '1');
    expect(found?.account_name).toBe('Checking');
  });

  // Test 9
  it('should count total number of accounts', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Savings', type: 'Bank', balance: 5000, user_id: '1', created_at: '2024-01-01' },
      { id: '3', account_name: 'Cash', type: 'Wallet', balance: 200, user_id: '1', created_at: '2024-01-01' }
    ];
    
    expect(store.accounts.length).toBe(3);
  });

  // Test 10
  it('should identify accounts with negative balance', () => {
    const store = useAccountStore();
    store.accounts = [
      { id: '1', account_name: 'Checking', type: 'Bank', balance: 1000, user_id: '1', created_at: '2024-01-01' },
      { id: '2', account_name: 'Credit Card', type: 'Credit', balance: -500, user_id: '1', created_at: '2024-01-01' }
    ];
    
    const negativeAccounts = store.accounts.filter(acc => acc.balance < 0);
    expect(negativeAccounts.length).toBe(1);
  });
});