import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types/types';
import { useAccountStore } from './accountStore';
import { useBudgetStore } from './budgetStore';

type NewTransaction = Omit<Transaction, 'id' | 'user_id' | 'created_at'>;
type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>;

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

  const netSavings = computed(() => totalIncome.value - totalExpenses.value);

  const incomeTransactions = computed(() =>
    transactions.value.filter(t => t.transaction_type === 'Income')
  );

  const expenseTransactions = computed(() =>
    transactions.value.filter(t => t.transaction_type === 'Expense')
  );

  const getTransactionsByAccount = (accountId: string) =>
    transactions.value.filter(t => t.account_id === accountId);

  const getTransactionsByCategory = (categoryId: string) =>
    transactions.value.filter(t => t.category_id === categoryId);

  const getTransactionsByBudget = (budgetId: string) =>
    transactions.value.filter(t => t.budget_id === budgetId);

  const getTransactionsByDateRange = (startDate: string, endDate: string) =>
    transactions.value.filter(t => t.date >= startDate && t.date <= endDate);

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
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transaction: NewTransaction) => {
    try {
      isLoading.value = true;
      error.value = null;

      const accountStore = useAccountStore();
      const budgetStore = useBudgetStore();

      // 1. Validate
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!transaction.description?.trim()) throw new Error('Description is required');
      if (!transaction.amount || transaction.amount <= 0) throw new Error('Amount must be greater than 0');
      if (!transaction.account_id) throw new Error('Account is required');
      if (!transaction.category_id) throw new Error('Category is required');
      if (!transaction.date) throw new Error('Date is required');

      // 2. Get account and check balance
      const account = accountStore.accounts.find(a => a.id === transaction.account_id);
      if (!account) throw new Error('Account not found');

      if (transaction.transaction_type === 'Expense' && account.balance < transaction.amount) {
        throw new Error('Insufficient balance');
      }

      // 3. Insert transaction
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) transactions.value.unshift(data);

      // 4. Update account balance
      const newBalance = transaction.transaction_type === 'Income'
        ? account.balance + transaction.amount
        : account.balance - transaction.amount;

      await accountStore.updateAccount(transaction.account_id, { balance: newBalance });

      // 5. Update budget if applicable
      if (transaction.transaction_type === 'Expense' && transaction.budget_id) {
        const budget = budgetStore.budgets.find(b => b.id === transaction.budget_id);
        if (budget) {
          await budgetStore.updateBudget(transaction.budget_id, {
            spent: budget.spent + transaction.amount
          });
        }
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTransaction = async (id: string, updates: UpdateTransaction) => {
    try {
      isLoading.value = true;
      error.value = null;

      const accountStore = useAccountStore();
      const budgetStore = useBudgetStore();

      if (updates.amount !== undefined && updates.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Get the original transaction to reverse changes
      const originalTransaction = transactions.value.find(t => t.id === id);
      if (!originalTransaction) throw new Error('Transaction not found');

      // Update transaction in database
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // If amount or account changed, update balances
      if (updates.amount !== undefined || updates.account_id !== undefined) {
        const oldAccount = accountStore.accounts.find(a => a.id === originalTransaction.account_id);
        const newAccountId = updates.account_id || originalTransaction.account_id;
        const newAccount = accountStore.accounts.find(a => a.id === newAccountId);
        const newAmount = updates.amount || originalTransaction.amount;
        const transactionType = updates.transaction_type || originalTransaction.transaction_type;

        if (oldAccount) {
          // Reverse old transaction effect
          const oldReversal = originalTransaction.transaction_type === 'Income'
            ? -originalTransaction.amount
            : originalTransaction.amount;
          
          await accountStore.updateAccount(originalTransaction.account_id, {
            balance: oldAccount.balance + oldReversal
          });
        }

        if (newAccount) {
          // Apply new transaction effect
          const newEffect = transactionType === 'Income' ? newAmount : -newAmount;
          
          await accountStore.updateAccount(newAccountId, {
            balance: newAccount.balance + newEffect
          });
        }
      }

      // If budget changed, update budget spent
      if (originalTransaction.transaction_type === 'Expense' || updates.transaction_type === 'Expense') {
        // Remove from old budget
        if (originalTransaction.budget_id) {
          const oldBudget = budgetStore.budgets.find(b => b.id === originalTransaction.budget_id);
          if (oldBudget) {
            await budgetStore.updateBudget(originalTransaction.budget_id, {
              spent: Math.max(0, oldBudget.spent - originalTransaction.amount)
            });
          }
        }

        // Add to new budget
        const newBudgetId = updates.budget_id !== undefined ? updates.budget_id : originalTransaction.budget_id;
        const newAmount = updates.amount || originalTransaction.amount;
        
        if (newBudgetId) {
          const newBudget = budgetStore.budgets.find(b => b.id === newBudgetId);
          if (newBudget) {
            await budgetStore.updateBudget(newBudgetId, {
              spent: newBudget.spent + newAmount
            });
          }
        }
      }

      // Update local state
      const index = transactions.value.findIndex(t => t.id === id);
      if (index !== -1 && data) {
        transactions.value[index] = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const accountStore = useAccountStore();
      const budgetStore = useBudgetStore();

      // 1. Get transaction to reverse changes
      const transaction = transactions.value.find(t => t.id === id);
      if (!transaction) throw new Error('Transaction not found');

      // 2. Delete from database
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // 3. Reverse account balance
      const account = accountStore.accounts.find(a => a.id === transaction.account_id);
      if (account) {
        const balanceAdjustment = transaction.transaction_type === 'Income'
          ? -transaction.amount
          : transaction.amount;

        await accountStore.updateAccount(transaction.account_id, {
          balance: account.balance + balanceAdjustment
        });
      }

      // 4. Reverse budget if applicable
      if (transaction.transaction_type === 'Expense' && transaction.budget_id) {
        const budget = budgetStore.budgets.find(b => b.id === transaction.budget_id);
        if (budget) {
          await budgetStore.updateBudget(transaction.budget_id, {
            spent: Math.max(0, budget.spent - transaction.amount)
          });
        }
      }

      // 5. Remove from state
      transactions.value = transactions.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTransactions = async (ids: string[]) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .in('id', ids);

      if (deleteError) throw deleteError;

      transactions.value = transactions.value.filter(t => !ids.includes(t.id));
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearTransactions = () => {
    transactions.value = [];
    error.value = null;
  };

  return {
    transactions,
    isLoading,
    error,
    totalIncome,
    totalExpenses,
    netSavings,
    incomeTransactions,
    expenseTransactions,
    getTransactionsByAccount,
    getTransactionsByCategory,
    getTransactionsByBudget,
    getTransactionsByDateRange,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactions,
    clearTransactions
  };
});