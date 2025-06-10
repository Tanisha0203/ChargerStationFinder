<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'Map',
  setup() {
    const store = useStore()
    const mapContainer = ref(null)
    const map = ref(null)
    const markers = ref([])
    
    const chargers = computed(() => store.getters.getChargers)

    const initMap = () => {
      if (!mapContainer.value) return

      // Initialize map
      map.value = L.map(mapContainer.value).setView([0, 0], 2)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value)

      // Add markers for each charger
      markers.value = chargers.value.map(charger => {
        const marker = L.marker([charger.location.latitude, charger.location.longitude])
          .addTo(map.value)
          .bindPopup(`
            <h3>${charger.name}</h3>
            <p><strong>Status:</strong> ${charger.status}</p>
            <p><strong>Power Output:</strong> ${charger.powerOutput} kW</p>
            <p><strong>Connector Type:</strong> ${charger.connectorType}</p>
          `)
        return marker
      })

      // Fit map bounds to show all markers
      if (markers.value.length > 0) {
        const group = new L.featureGroup(markers.value)
        map.value.fitBounds(group.getBounds().pad(0.1))
      }
    }

    onMounted(async () => {
      await store.dispatch('fetchChargers')
      initMap()
    })

    onUnmounted(() => {
      if (map.value) {
        map.value.remove()
      }
    })

    return {
      mapContainer
    }
  }
}
</script>

<style scoped>
.map-container {
  height: calc(100vh - 64px);
  width: 100%;
}
</style> 