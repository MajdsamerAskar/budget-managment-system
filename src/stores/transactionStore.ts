import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types/types';

export const useTransactionStore = defineStore('transaction', () => {
  //state
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  //getters
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
  //actions

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
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) transactions.value.unshift(data);
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      isLoading.value = true;
      error.value = null;

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
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      transactions.value = transactions.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    //state
    transactions,
    isLoading,
    error,
    //getters
    totalIncome,
    totalExpenses,
    netSavings,
    //actions
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
});