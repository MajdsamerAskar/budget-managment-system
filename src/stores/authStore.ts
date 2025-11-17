import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);

  // Actions
  const signUp = async (email: string, password: string, name: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at
        };
      }
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at
        };
      }
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    try {
      isLoading.value = true;
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      user.value = null;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        user.value = {
          id: currentUser.id,
          email: currentUser.email!,
          created_at: currentUser.created_at
        };
      }
    } catch (err: any) {
      error.value = err.message;
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    fetchUser
  };
});