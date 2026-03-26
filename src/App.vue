<template>
  <div class="app-layout">
    <Sidebar
      :filtered-places="filteredPlaces"
      :selected-place-id="selectedPlaceId"
      :categories="CATEGORIES"
      :search-query="searchQuery"
      :active-category="activeCategory"
      :active-day="activeDay"
      :days="days"
      @select-place="selectPlace"
      @remove-place="removePlace"
      @reorder-place="reorderPlace"
      @update:search-query="searchQuery = $event"
      @update:active-category="activeCategory = $event"
      @update:active-day="activeDay = $event"
    />

    <MapView
      :places="filteredPlaces"
      :selected-place-id="selectedPlaceId"
      :categories="CATEGORIES"
      @select-place="selectPlace"
      @add-place="openAddModal"
    />

    <AddPlaceModal
      v-if="showAddModal"
      :lat="newPlaceCoords.lat"
      :lng="newPlaceCoords.lng"
      :categories="CATEGORIES"
      @add="handleAddPlace"
      @close="showAddModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapView from './components/MapView.vue'
import Sidebar from './components/Sidebar.vue'
import AddPlaceModal from './components/AddPlaceModal.vue'
import { usePlaces } from './composables/usePlaces.js'

const {
  filteredPlaces,
  selectedPlaceId,
  searchQuery,
  activeCategory,
  activeDay,
  days,
  CATEGORIES,
  addPlace,
  removePlace,
  selectPlace,
  reorderPlace
} = usePlaces()

const showAddModal = ref(false)
const newPlaceCoords = ref({ lat: 0, lng: 0 })

function openAddModal(coords) {
  newPlaceCoords.value = coords
  showAddModal.value = true
}

function handleAddPlace(place) {
  addPlace(place)
  showAddModal.value = false
}
</script>
