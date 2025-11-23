<template>
  <div class="login-container">
    
    <!-- LEFT PANEL: Image Background -->
    <div class="left-panel">
      <div class="overlay">
        <div class="content-wrapper">
          <!-- Star Icon -->
          <div class="brand-icon">
            <i class="pi pi-asterisk" style="font-size: 4rem; color: white;"></i>
          </div>

          <!-- Main Text -->
          <h1>Hello<br />! <span class="wave">👋</span></h1>
          
          <p class="sub-text">
            Welcome to My Budget Management System!
          </p>
        </div>

        <!-- Copyright -->
        <div class="copyright">
          © 2025 Budget Managment System. All rights reserved.
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Form -->
    <div class="right-panel">
      <div class="form-container">
        <h1>BUDGET PRO</h1>
        <h2 class="brand-logo"></h2>

        <div class="welcome-header">
          <h3>Welcome Back!</h3>
          <p>
            Don't have an account? 
            <router-link to="/register">Create your account</router-link>
          , it's FREE! Takes less than a minute.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          
          <!-- Email Input -->
          <div class="field">
            <InputText 
              v-model="email" 
              placeholder="Email" 
              class="w-full custom-input" 
            />
          </div>

          <!-- Password Input -->
          <div class="field">
            <Password 
              v-model="password" 
              placeholder="Password" 
              :feedback="false" 
              toggleMask 
              inputClass="custom-input w-full"
            />
          </div>

          <!-- Login Button -->
          <Button label="Login Now" class="login-btn" type="submit" />

          <!-- Google Button -->
          <Button class="google-btn"
           :outlined="true"
           type="button"
           @click="handleGoogleLogin"
           :loading="authStore.isLoading"
           >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon" />
            <span>Login with Google</span>
          </Button>

        </form>

        <div class="footer-link">
          <span>Forget password? <a href="#">Click here</a></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; 
import { useToast } from 'primevue/usetoast'; // Requires ToastService in main.js

// Components
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

// Setup Hooks
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// State
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// --- Action: Email/Password Login ---
const handleLogin = async () => {
  // Reset previous errors
  errorMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.';
    return;
  }

  try {
    await authStore.signIn(email.value, password.value);
    
    // Success feedback
    toast.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 3000 });
    
    // Redirect to Dashboard
    router.push({ name: 'Dashboard' }); 

  } catch (error) {
    // Error Handling
    errorMessage.value = 'Invalid email or password.'; 
    
    toast.add({ 
      severity: 'error', 
      summary: 'Login Failed', 
      detail: error.message || 'An error occurred', 
      life: 4000 
    });
  }
};

// --- Action: Google Login ---
const handleGoogleLogin = async () => {
  try {
    await authStore.signInWithGoogle();

  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Google Login Failed', 
      detail: error.message, 
      life: 4000 
    });
  }
};
</script>

<style scoped>
/* --- LAYOUT --- */
.login-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* --- LEFT PANEL --- */
.left-panel {
  flex: 1;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-panel .overlay {
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5); /* dark overlay */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  position: relative;
}

.content-wrapper {
  z-index: 2;
  max-width: 480px;
}

.brand-icon {
  margin-bottom: 2rem;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.wave {
  display: inline-block;
  animation: wave-animation 2.5s infinite;
  transform-origin: 70% 70%;
}

.sub-text {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.copyright {
  position: absolute;
  bottom: 2rem;
  left: 4rem;
  opacity: 0.6;
  font-size: 0.9rem;
  z-index: 2;
}

/* --- RIGHT PANEL --- */
.right-panel {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;       /* vertical center */
  justify-content: center;   /* horizontal center */
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
}

.form-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

/* Logo/Header */
.brand-logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #000;
}

.welcome-header h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111;
}

.welcome-header p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.welcome-header a {
  color: #111;
  font-weight: 600;
  text-decoration: underline;
}

/* --- FORM STYLES --- */
.field {
  margin-bottom: 1.5rem;
}

/* PrimeVue Overrides */
:deep(.custom-input) {
    width: 100%;
  background-color: #f9fafb;
  border: none;
  border-bottom: 1px solid #ddd;
  border-radius: 0;
  padding: 1rem 0.5rem;
  font-size: 1rem;
}

:deep(.custom-input:focus) {
  box-shadow: none;
  border-color: #000;
}
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input.custom-input) {
  width: 100%;       
  box-sizing: border-box;
  height: 3rem;      
}

/* Buttons */
.login-btn {
  width: 100%;
  background-color: #111;
  border: 1px solid #111;
  color: white;
  padding: 1rem;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.login-btn:hover {
  background-color: #333 !important;
  border-color: #333 !important;
}

.google-btn {
  width: 100%;
  background-color: white;
  border: 1px solid #ddd;
  color: #111;
  padding: 1rem;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.google-btn:hover {
  background-color: #f5f5f5 !important;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.footer-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.footer-link a {
  color: #111;
  font-weight: 600;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }
  .left-panel {
    display: none;
  }
}


@keyframes wave-animation {
  0% { transform: rotate( 0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}
</style>