<template>
  <Toast />
  
  <div class="register-container">
    
    <!-- LEFT PANEL: Image Background (Same as Login for consistency) -->
    <div class="left-panel">
      <div class="overlay">
        <div class="content-wrapper">
          <!-- Star Icon -->
          <div class="brand-icon">
            <i class="pi pi-asterisk" style="font-size: 4rem; color: white;"></i>
          </div>

          <!-- Main Text -->
          <h1>Join Us<br />! <span class="wave">🚀</span></h1>
          
          <p class="sub-text">
            Start managing your budget effectively today.
          </p>
        </div>

        <!-- Copyright -->
        <div class="copyright">
          © 2022 buget system. All rights reserved.
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Registration Form -->
    <div class="right-panel">
      <div class="form-container">
        
        <h2 class="brand-logo">Budget</h2>

        <div class="welcome-header">
          <h3>Create Account</h3>
          <p>
            Already have an account? 
            <router-link to="/login">Login here</router-link>
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          
          <!-- Full Name Input -->
          <div class="field">
            <InputText 
              v-model="fullName" 
              placeholder="Full Name" 
              class="w-full custom-input" 
              required
            />
          </div>

          <!-- Email Input -->
          <div class="field">
            <InputText 
              v-model="email" 
              placeholder="Email Address" 
              class="w-full custom-input" 
              type="email"
              required
            />
          </div>

          <!-- Password Input -->
          <div class="field">
            <Password 
              v-model="password" 
              placeholder="Password" 
              :feedback="true" 
              toggleMask 
              inputClass="custom-input w-full"
              class="w-full"
              required
            />
          </div>

          <!-- Confirm Password Input -->
          <div class="field">
            <Password 
              v-model="confirmPassword" 
              placeholder="Confirm Password" 
              :feedback="false" 
              toggleMask 
              inputClass="custom-input w-full"
              class="w-full"
              :class="{ 'p-invalid': passwordError }"
              required
            />
            <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
          </div>

          <!-- Register Button -->
          <Button 
            label="Sign Up" 
            class="register-btn" 
            type="submit" 
            :loading="authStore.isLoading"
            :disabled="authStore.isLoading"
          />

          <!-- Google Button (Optional for Register pages too) -->
          <div class="divider">
            <span>OR</span>
          </div>

          <Button 
            class="google-btn" 
            :outlined="true" 
            type="button" 
            @click="handleGoogleRegister"
            :disabled="authStore.isLoading"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon" />
            <span>Sign up with Google</span>
          </Button>

        </form>

        <div class="footer-terms">
          <span>By signing up, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Adjust path if needed
import { useToast } from 'primevue/usetoast';

// Components
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// State
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');

// Handle Registration
const handleRegister = async () => {
  passwordError.value = '';

  // Basic Validation
  if (password.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters.";
    return;
  }

  try {
    await authStore.signUp(email.value, password.value, fullName.value);
    
    toast.add({ 
      severity: 'success', 
      summary: 'Account Created', 
      detail: 'Please check your email to confirm your account.', 
      life: 5000 
    });

    router.push('/login'); 

  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Registration Failed', 
      detail: error.message || 'Something went wrong', 
      life: 4000 
    });
  }
};

// Handle Google Register (Same as Login)
const handleGoogleRegister = async () => {
  try {
    await authStore.signInWithGoogle();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  }
};
</script>

<style scoped>
/* Reuse the same styles from LoginView for consistency */

.register-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* --- LEFT PANEL --- */
.left-panel {
  flex: 1;
  position: relative;
  /* You can change the image here to distinguish it from login if you want */
  background-image: url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80');
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
  background: rgba(0,0,0,0.5);
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
  align-items: center;
  justify-content: center;
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
  gap: 0.8rem; /* Slightly tighter gap for register form since it has more fields */
}

.brand-logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
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
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.welcome-header a {
  color: #111;
  font-weight: 600;
  text-decoration: underline;
}

/* --- FORM STYLES --- */
.field {
  margin-bottom: 1.2rem;
}

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

.p-error {
  color: #e24c4c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Buttons */
.register-btn {
  width: 100%;
  background-color: #111;
  border: 1px solid #111;
  color: white;
  padding: 1rem;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.register-btn:hover {
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

.divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.divider span {
  background: white;
  padding: 0 10px;
  color: #999;
  font-size: 0.8rem;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #eee;
  z-index: 0;
}

.footer-terms {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}

.footer-terms a {
  color: #111;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
  .register-container {
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