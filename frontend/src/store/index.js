import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'https://chargerstationfinder.onrender.com'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    chargers: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_CHARGERS(state, chargers) {
      state.chargers = chargers
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials)
        commit('SET_TOKEN', response.data.token)
        return response
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Login failed')
        throw error
      }
    },
    async register({ commit }, credentials) {
      try {
        console.log('Sending registration request with credentials:', credentials);
        const response = await axios.post(`${API_URL}/auth/register`, credentials)
        console.log('Registration response:', response.data);
        commit('SET_TOKEN', response.data.token)
        return response
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        commit('SET_ERROR', error.response?.data?.message || 'Registration failed')
        throw error
      }
    },
    logout({ commit }) {
      commit('SET_TOKEN', null)
    },
    async fetchChargers({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${API_URL}/chargers`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('SET_CHARGERS', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch chargers')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createCharger({ commit, state }, charger) {
      try {
        const response = await axios.post(`${API_URL}/chargers`, charger, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create charger')
        throw error
      }
    },
    async updateCharger({ commit, state }, { id, charger }) {
      try {
        const response = await axios.put(`${API_URL}/chargers/${id}`, charger, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update charger')
        throw error
      }
    },
    async deleteCharger({ commit, state }, id) {
      try {
        await axios.delete(`${API_URL}/chargers/${id}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete charger')
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getChargers: state => state.chargers,
    getLoading: state => state.loading,
    getError: state => state.error
  }
}) 