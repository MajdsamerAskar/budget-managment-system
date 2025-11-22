import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types/types';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.transaction_type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpenses = computed(() =>
    transactions.value
      .filter(t => t.transaction_type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netBalance = computed(() => totalIncome.value - totalExpenses.value);

  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 10);
  });

  const getTransactionsByCategory = (categoryId: string) => {
    return transactions.value.filter(t => t.category_id === categoryId);
  };

  const getTransactionsByAccount = (accountId: string) => {
    return transactions.value.filter(t => t.account_id === accountId);
  };

  // Actions
  const fetchTransactions = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      transactions.value = data || [];
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching transactions:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id' | 'payment_method_id'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authentication error: ' + userError.message);
      }
      
      if (!user) {
        throw new Error('User not authenticated. Please log in.');
      }

      console.log('Adding transaction for user:', user.id);
      console.log('Transaction data:', transaction);

      // Get current account balance
      const { data: accountData, error: accountFetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', transaction.account_id)
        .single();

      if (accountFetchError) {
        console.error('Error fetching account:', accountFetchError);
        throw new Error('Failed to fetch account: ' + accountFetchError.message);
      }

      const currentBalance = accountData.balance;
      let newBalance: number;

      // Calculate new balance based on transaction type
      if (transaction.transaction_type === 'Income') {
        newBalance = currentBalance + transaction.amount;
      } else if (transaction.transaction_type === 'Expense') {
        newBalance = currentBalance - transaction.amount;
      } else {
        throw new Error('Invalid transaction type');
      }

      console.log('Current balance:', currentBalance);
      console.log('New balance:', newBalance);

      // Start a transaction-like operation (we'll do it sequentially)
      // 1. Insert transaction
      const { data: transactionData, error: insertError } = await supabase
        .from('transactions')
        .insert({ 
          ...transaction, 
          user_id: user.id 
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create transaction: ' + insertError.message);
      }

      // 2. Update account balance
      const { error: updateAccountError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', transaction.account_id);

      if (updateAccountError) {
        console.error('Error updating account balance:', updateAccountError);
        // Rollback: Delete the transaction we just created
        await supabase.from('transactions').delete().eq('id', transactionData.id);
        throw new Error('Failed to update account balance: ' + updateAccountError.message);
      }

      // 3. If transaction has a category and is an expense, update budget spent
      if (transaction.transaction_type === 'Expense' && transaction.category_id) {
        const { data: budgetData, error: budgetFetchError } = await supabase
          .from('budgets')
          .select('spent')
          .eq('category_id', transaction.category_id)
          .single();

        if (!budgetFetchError && budgetData) {
          const newSpent = budgetData.spent + transaction.amount;
          
          const { error: updateBudgetError } = await supabase
            .from('budgets')
            .update({ spent: newSpent })
            .eq('category_id', transaction.category_id);

          if (updateBudgetError) {
            console.warn('Failed to update budget spent:', updateBudgetError);
            // Don't throw error here, budget update is optional
          }
        }
      }

      if (transactionData) {
        transactions.value.unshift(transactionData);
        console.log('Transaction added successfully:', transactionData);
      }
      
      return transactionData;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error in addTransaction:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTransaction = async (
    id: string, 
    updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Get the old transaction to calculate balance difference
      const oldTransaction = transactions.value.find(t => t.id === id);
      if (!oldTransaction) {
        throw new Error('Transaction not found');
      }

      // If account or amount or type changed, we need to update account balances
      if (updates.account_id || updates.amount !== undefined || updates.transaction_type) {
        const oldAccountId = updates.account_id || oldTransaction.account_id;
        const newAccountId = updates.account_id || oldTransaction.account_id;
        const oldAmount = oldTransaction.amount;
        const newAmount = updates.amount !== undefined ? updates.amount : oldTransaction.amount;
        const oldType = oldTransaction.transaction_type;
        const newType = updates.transaction_type || oldTransaction.transaction_type;

        // Revert old transaction effect
        const { data: oldAccountData, error: oldAccountFetchError } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', oldAccountId)
          .single();

        if (oldAccountFetchError) throw oldAccountFetchError;

        let revertedBalance = oldAccountData.balance;
        if (oldType === 'Income') {
          revertedBalance -= oldAmount;
        } else {
          revertedBalance += oldAmount;
        }

        // Apply new transaction effect
        if (oldAccountId === newAccountId) {
          // Same account
          if (newType === 'Income') {
            revertedBalance += newAmount;
          } else {
            revertedBalance -= newAmount;
          }

          await supabase
            .from('accounts')
            .update({ balance: revertedBalance })
            .eq('id', oldAccountId);
        } else {
          // Different accounts
          await supabase
            .from('accounts')
            .update({ balance: revertedBalance })
            .eq('id', oldAccountId);

          const { data: newAccountData, error: newAccountFetchError } = await supabase
            .from('accounts')
            .select('balance')
            .eq('id', newAccountId)
            .single();

          if (newAccountFetchError) throw newAccountFetchError;

          let newBalance = newAccountData.balance;
          if (newType === 'Income') {
            newBalance += newAmount;
          } else {
            newBalance -= newAmount;
          }

          await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', newAccountId);
        }
      }

      // Update transaction
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const index = transactions.value.findIndex(t => t.id === id);
      if (index !== -1 && data) {
        transactions.value[index] = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating transaction:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Get the transaction to revert account balance
      const transaction = transactions.value.find(t => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Get current account balance
      const { data: accountData, error: accountFetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', transaction.account_id)
        .single();

      if (accountFetchError) throw accountFetchError;

      // Revert the transaction effect on balance
      let newBalance = accountData.balance;
      if (transaction.transaction_type === 'Income') {
        newBalance -= transaction.amount;
      } else {
        newBalance += transaction.amount;
      }

      // Update account balance
      const { error: updateAccountError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', transaction.account_id);

      if (updateAccountError) throw updateAccountError;

      // If expense with category, update budget spent
      if (transaction.transaction_type === 'Expense' && transaction.category_id) {
        const { data: budgetData, error: budgetFetchError } = await supabase
          .from('budgets')
          .select('spent')
          .eq('category_id', transaction.category_id)
          .single();

        if (!budgetFetchError && budgetData) {
          const newSpent = Math.max(0, budgetData.spent - transaction.amount);
          
          await supabase
            .from('budgets')
            .update({ spent: newSpent })
            .eq('category_id', transaction.category_id);
        }
      }

      // Delete transaction
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      transactions.value = transactions.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting transaction:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    transactions,
    isLoading,
    error,
    
    // Actions
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Computed (Getters)
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
    getTransactionsByCategory,
    getTransactionsByAccount
  };
});