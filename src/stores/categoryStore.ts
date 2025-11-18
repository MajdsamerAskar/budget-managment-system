import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/types';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      categories.value = data || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: insertError } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) categories.value.push(data);
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const index = categories.value.findIndex(c => c.id === id);
      if (index !== -1 && data) {
        categories.value[index] = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      categories.value = categories.value.filter(c => c.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
});