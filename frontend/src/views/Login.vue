<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
          >
        </div>
        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </form>
      <p class="toggle-text">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <a href="#" @click.prevent="toggleMode">
          {{ isLogin ? 'Register' : 'Login' }}
        </a>
      </p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isLogin = ref(true)
    const error = computed(() => store.getters.getError)

    const handleSubmit = async () => {
      try {
        const credentials = {
          email: email.value,
          password: password.value
        }
        
        if (isLogin.value) {
          await store.dispatch('login', credentials)
        } else {
          await store.dispatch('register', credentials)
        }
        
        router.push('/dashboard')
      } catch (err) {
        // Error is handled by Vuex
      }
    }

    const toggleMode = () => {
      isLogin.value = !isLogin.value
      store.commit('SET_ERROR', null)
    }

    return {
      email,
      password,
      isLogin,
      error,
      handleSubmit,
      toggleMode
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #3aa876;
}

.toggle-text {
  margin-top: 1rem;
  color: #666;
}

.toggle-text a {
  color: #42b983;
  text-decoration: none;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}
</style> 