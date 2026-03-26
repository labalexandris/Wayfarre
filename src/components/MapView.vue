<template>
  <div class="map-container">
    <div ref="mapEl" style="width:100%;height:100%"></div>
    <div class="map-brand-watermark"><span>Wayfarre</span> &mdash; click to pin</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

const props = defineProps({
  places: { type: Array, required: true },
  selectedPlaceId: { type: Number, default: null },
  categories: { type: Array, required: true }
})

const emit = defineEmits(['select-place', 'add-place'])

const mapEl = ref(null)
let map = null
let markerClusterGroup = null
let markers = new Map()

function getCategoryByPlace(place) {
  return props.categories.find(c => c.id === place.category) || props.categories[props.categories.length - 1]
}

function createCustomIcon(place, isSelected) {
  const cat = getCategoryByPlace(place)
  const size = isSelected ? 46 : 38
  const zoomClass = isSelected ? 'marker-selected' : ''
  const ring = isSelected ? `box-shadow: 0 0 0 3px ${cat.color}44, 0 0 16px ${cat.color}33, 0 4px 12px rgba(0,0,0,0.35);` : `box-shadow: 0 2px 10px rgba(0,0,0,0.3);`
  const scale = isSelected ? 'transform: scale(1.05);' : ''

  return L.divIcon({
    className: `custom-marker ${zoomClass}`,
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${cat.color};
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isSelected ? '22px' : '17px'};
      ${ring}
      ${scale}
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      cursor: pointer;
    ">${cat.icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

function updateMarkers() {
  if (!map || !markerClusterGroup) return

  markerClusterGroup.clearLayers()
  markers.clear()

  props.places.forEach(place => {
    const isSelected = place.id === props.selectedPlaceId
    const icon = createCustomIcon(place, isSelected)
    const marker = L.marker([place.lat, place.lng], { icon })

    marker.bindTooltip(place.name, {
      direction: 'top',
      offset: [0, -20],
      className: 'custom-tooltip'
    })

    marker.on('click', () => {
      emit('select-place', place.id)
    })

    markers.set(place.id, marker)
    markerClusterGroup.addLayer(marker)
  })
}

function flyToPlace(placeId) {
  const place = props.places.find(p => p.id === placeId)
  if (place && map) {
    map.flyTo([place.lat, place.lng], 14, { duration: 1.2 })
  }
}

onMounted(() => {
  map = L.map(mapEl.value, {
    zoomControl: false
  }).setView([47.5, 10.0], 5)

  L.control.zoom({ position: 'topright' }).addTo(map)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map)

  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount()
      let size = 'small'
      if (count >= 10) size = 'medium'
      if (count >= 30) size = 'large'

      const sizes = { small: 42, medium: 52, large: 62 }
      const s = sizes[size]

      return L.divIcon({
        html: `<div style="
          width: ${s}px;
          height: ${s}px;
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: ${s > 42 ? '16px' : '14px'};
          box-shadow: 0 4px 16px rgba(255,107,107,0.35);
          letter-spacing: -0.3px;
        ">${count}</div>`,
        className: 'custom-cluster',
        iconSize: [s, s]
      })
    }
  })

  map.addLayer(markerClusterGroup)

  map.on('click', (e) => {
    emit('add-place', { lat: e.latlng.lat, lng: e.latlng.lng })
  })

  updateMarkers()

  if (props.places.length > 0) {
    const bounds = L.latLngBounds(props.places.map(p => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
})

watch(() => props.places, () => {
  nextTick(updateMarkers)
}, { deep: true })

watch(() => props.selectedPlaceId, (newId, oldId) => {
  // Update marker icons
  if (oldId && markers.has(oldId)) {
    const oldPlace = props.places.find(p => p.id === oldId)
    if (oldPlace) {
      markers.get(oldId).setIcon(createCustomIcon(oldPlace, false))
    }
  }
  if (newId && markers.has(newId)) {
    const newPlace = props.places.find(p => p.id === newId)
    if (newPlace) {
      markers.get(newId).setIcon(createCustomIcon(newPlace, true))
      flyToPlace(newId)
    }
  }
})
</script>
