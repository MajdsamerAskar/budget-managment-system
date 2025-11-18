import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Budget } from '@/types';

export const useBudgetStore = defineStore('budget', () => {
  const budgets = ref<Budget[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchBudgets = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      budgets.value = data || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'spent'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: insertError } = await supabase
        .from('budgets')
        .insert({ ...budget, spent: 0 })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) budgets.value.unshift(data);
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const index = budgets.value.findIndex(b => b.id === id);
      if (index !== -1 && data) {
        budgets.value[index] = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      budgets.value = budgets.value.filter(b => b.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget
  };
});