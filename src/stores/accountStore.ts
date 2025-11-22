import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Account } from '@/types/types';

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalBalance = computed(() =>
    accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
  );

  const bankAccounts = computed(() =>
    accounts.value.filter(acc => acc.type === 'Bank')
  );

  const walletAccounts = computed(() =>
    accounts.value.filter(acc => acc.type === 'Wallet')
  );

  const creditAccounts = computed(() =>
    accounts.value.filter(acc => acc.type === 'Credit')
  );

  const getAccountById = (id: string): Account | undefined => {
    return accounts.value.find(acc => acc.id === id);
  };

  // Actions
  const fetchAccounts = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      accounts.value = data || [];
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching accounts:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const addAccount = async (account: Omit<Account, 'id' | 'created_at' | 'user_id'>) => {
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

      console.log('Adding account for user:', user.id);
      console.log('Account data:', account);

      const { data, error: insertError } = await supabase
        .from('accounts')
        .insert({ 
          ...account, 
          user_id: user.id 
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create account: ' + insertError.message);
      }

      if (data) {
        accounts.value.unshift(data);
        console.log('Account added successfully:', data);
      }
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error in addAccount:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAccount = async (id: string, updates: Partial<Omit<Account, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const index = accounts.value.findIndex(acc => acc.id === id);
      if (index !== -1 && data) {
        accounts.value[index] = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating account:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      accounts.value = accounts.value.filter(acc => acc.id !== id);
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting account:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    accounts,
    isLoading,
    error,
    
    // Actions
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    
    // Computed (Getters)
    totalBalance,
    bankAccounts,
    walletAccounts,
    creditAccounts,
    getAccountById
  };
});