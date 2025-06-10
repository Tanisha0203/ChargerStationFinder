<template>
  <div class="dashboard">
    <h1>Charging Stations Dashboard</h1>
    
    <!-- Filters -->
    <div class="filters">
      <select v-model="filters.status" class="filter-select">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      
      <select v-model="filters.connectorType" class="filter-select">
        <option value="">All Connector Types</option>
        <option v-for="type in connectorTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      
      <input
        type="number"
        v-model="filters.minPower"
        placeholder="Min Power (kW)"
        class="filter-input"
      >
    </div>

    <!-- Add Charger Button -->
    <button @click="showAddModal = true" class="add-btn">
      Add New Charger
    </button>

    <!-- Chargers Table -->
    <div class="table-container">
      <table v-if="!loading">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Power Output</th>
            <th>Connector Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="charger in filteredChargers" :key="charger._id">
            <td>{{ charger.name }}</td>
            <td>{{ formatLocation(charger.location) }}</td>
            <td>
              <span :class="['status', charger.status.toLowerCase()]">
                {{ charger.status }}
              </span>
            </td>
            <td>{{ charger.powerOutput }} kW</td>
            <td>{{ charger.connectorType }}</td>
            <td>
              <button @click="editCharger(charger)" class="edit-btn">Edit</button>
              <button @click="deleteCharger(charger._id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="loading">Loading...</div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <h2>{{ showEditModal ? 'Edit' : 'Add' }} Charger</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" required>
          </div>
          
          <div class="form-group">
            <label>Latitude</label>
            <input type="number" v-model="form.location.latitude" required step="any">
          </div>
          
          <div class="form-group">
            <label>Longitude</label>
            <input type="number" v-model="form.location.longitude" required step="any">
          </div>
          
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Power Output (kW)</label>
            <input type="number" v-model="form.powerOutput" required min="0" step="0.1">
          </div>
          
          <div class="form-group">
            <label>Connector Type</label>
            <input v-model="form.connectorType" required>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="submit-btn">
              {{ showEditModal ? 'Update' : 'Add' }}
            </button>
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const loading = computed(() => store.getters.getLoading)
    const chargers = computed(() => store.getters.getChargers)
    
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingChargerId = ref(null)
    
    const filters = ref({
      status: '',
      connectorType: '',
      minPower: ''
    })
    
    const form = ref({
      name: '',
      location: {
        latitude: '',
        longitude: ''
      },
      status: 'Active',
      powerOutput: '',
      connectorType: ''
    })

    const connectorTypes = computed(() => {
      const types = new Set(chargers.value.map(c => c.connectorType))
      return Array.from(types)
    })

    const filteredChargers = computed(() => {
      return chargers.value.filter(charger => {
        if (filters.value.status && charger.status !== filters.value.status) return false
        if (filters.value.connectorType && charger.connectorType !== filters.value.connectorType) return false
        if (filters.value.minPower && charger.powerOutput < Number(filters.value.minPower)) return false
        return true
      })
    })

    const formatLocation = (location) => {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    }

    const resetForm = () => {
      form.value = {
        name: '',
        location: {
          latitude: '',
          longitude: ''
        },
        status: 'Active',
        powerOutput: '',
        connectorType: ''
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingChargerId.value = null
      resetForm()
    }

    const editCharger = (charger) => {
      editingChargerId.value = charger._id
      form.value = { ...charger }
      showEditModal.value = true
    }

    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('updateCharger', {
            id: editingChargerId.value,
            charger: form.value
          })
        } else {
          await store.dispatch('createCharger', form.value)
        }
        closeModal()
        await store.dispatch('fetchChargers')
      } catch (error) {
        // Error is handled by Vuex
      }
    }

    const deleteCharger = async (id) => {
      if (confirm('Are you sure you want to delete this charger?')) {
        try {
          await store.dispatch('deleteCharger', id)
          await store.dispatch('fetchChargers')
        } catch (error) {
          // Error is handled by Vuex
        }
      }
    }

    onMounted(async () => {
      await store.dispatch('fetchChargers')
    })

    return {
      loading,
      chargers,
      filters,
      form,
      showAddModal,
      showEditModal,
      connectorTypes,
      filteredChargers,
      formatLocation,
      editCharger,
      handleSubmit,
      deleteCharger,
      closeModal
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #28a745;
  color: white;
}

.status.inactive {
  background-color: #dc3545;
  color: white;
}

.edit-btn,
.delete-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.edit-btn {
  background-color: #17a2b8;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.submit-btn {
  background-color: #42b983;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style> 