import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Budget } from '@/types/types';



export const useBudgetStore = defineStore('budget', () => {
  const budgets = ref<Budget[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

 //getters functions 

  const totalAllocated = computed(() =>
    budgets.value.reduce((sum, b) => sum + b.total_amount, 0)
  );

  const totalSpent = computed(() =>
    budgets.value.reduce((sum, b) => sum + b.spent, 0)
  );

  const totalRemaining = computed(() =>
    totalAllocated.value - totalSpent.value
  );

  const activeBudgets = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return budgets.value.filter(
      b => b.start_date <= today && b.end_date >= today
    );
  });

  const expiredBudgets = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return budgets.value.filter(b => b.end_date < today);
  });

  const overBudgetItems = computed(() =>
    budgets.value.filter(b => b.spent > b.total_amount)
  );
  //helper functions
  
  const getPercentage = (spent: number, allocated: number): number => {
    return allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  };

  const getBudgetById = (id: string): Budget | undefined => {
    return budgets.value.find(b => b.id === id);
  };

  const getBudgetsByCategory = (categoryId: string): Budget[] => {
    return budgets.value.filter(b => b.category_id === categoryId);
  };

  const getBudgetStatus = (budget: Budget): 'safe' | 'warning' | 'danger' => {
    const percentage = getPercentage(budget.spent, budget.total_amount);
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  //actions functions
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

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'spent' | 'user_id'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: insertError } = await supabase
        .from('budgets')
        .insert({ ...budget, spent: 0, user_id: user.id })
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

  const updateBudget = async (id: string, updates: Partial<Omit<Budget, 'id' | 'user_id' | 'created_at'>>) => {
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
    // State
    budgets,
    isLoading,
    error,
    
    // Actions
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,

   
    // Computed (Getters)
    totalAllocated,
    totalSpent,
    totalRemaining,
    activeBudgets,
    expiredBudgets,
    overBudgetItems,
    
    // Helper Functions
    getPercentage,
    getBudgetById,
    getBudgetsByCategory,
    getBudgetStatus
  };
});