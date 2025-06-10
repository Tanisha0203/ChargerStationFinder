<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="navbar">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/map">Map View</router-link>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const logout = () => {
      store.dispatch('logout')
      router.push('/')
    }

    return {
      isAuthenticated,
      logout
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar {
  padding: 1rem;
  background-color: #f8f9fa;
  margin-bottom: 2rem;
}

.navbar a {
  margin: 0 1rem;
  text-decoration: none;
  color: #2c3e50;
}

.navbar a.router-link-active {
  color: #42b983;
}

.logout-btn {
  float: right;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style> 