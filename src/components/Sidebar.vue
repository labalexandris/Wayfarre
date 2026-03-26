<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-toggle" @click="isCollapsed = !isCollapsed">
      <span>{{ isCollapsed ? '▶' : '◀' }}</span>
    </div>

    <div class="sidebar-content" v-show="!isCollapsed">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo">🧭</div>
          <h1 class="app-title">Wayfarre</h1>
        </div>
        <p class="app-subtitle">Chart your course, pin your adventures</p>
      </div>

      <!-- Search -->
      <div class="search-box">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search destinations..."
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
          />
        </div>
      </div>

      <!-- Category Filter -->
      <div class="filter-bar">
        <button
          class="filter-chip"
          :class="{ active: !activeCategory }"
          @click="$emit('update:activeCategory', null)"
        >All</button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-chip"
          :class="{ active: activeCategory === cat.id }"
          :style="activeCategory === cat.id ? { background: cat.color, borderColor: cat.color } : {}"
          @click="$emit('update:activeCategory', activeCategory === cat.id ? null : cat.id)"
        >{{ cat.icon }} {{ cat.label }}</button>
      </div>

      <!-- Day Filter -->
      <div class="day-filter" v-if="days.length > 0">
        <button
          class="day-chip"
          :class="{ active: !activeDay }"
          @click="$emit('update:activeDay', null)"
        >All Days</button>
        <button
          v-for="day in days"
          :key="day"
          class="day-chip"
          :class="{ active: activeDay === day }"
          @click="$emit('update:activeDay', activeDay === day ? null : day)"
        >Day {{ day }}</button>
      </div>

      <!-- Stats -->
      <div class="stats-bar">
        <span class="stat"><span class="stat-icon">📍</span> <span class="stat-value">{{ filteredPlaces.length }}</span> places</span>
        <span class="stat"><span class="stat-icon">📅</span> <span class="stat-value">{{ days.length }}</span> days</span>
      </div>

      <!-- Place List -->
      <div class="place-list">
        <transition-group name="list">
          <PlaceCard
            v-for="(place, index) in filteredPlaces"
            :key="place.id"
            :place="place"
            :index="index"
            :is-selected="selectedPlaceId === place.id"
            :categories="categories"
            @select="$emit('select-place', $event)"
            @remove="$emit('remove-place', $event)"
            @reorder="(from, to) => $emit('reorder-place', from, to)"
          />
        </transition-group>

        <div class="empty-state" v-if="filteredPlaces.length === 0">
          <span class="empty-icon">🌍</span>
          <p>No destinations yet</p>
          <p class="empty-hint">Click anywhere on the map to start pinning places</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PlaceCard from './PlaceCard.vue'

defineProps({
  filteredPlaces: { type: Array, required: true },
  selectedPlaceId: { type: Number, default: null },
  categories: { type: Array, required: true },
  searchQuery: { type: String, default: '' },
  activeCategory: { type: String, default: null },
  activeDay: { type: Number, default: null },
  days: { type: Array, default: () => [] }
})

defineEmits([
  'select-place',
  'remove-place',
  'reorder-place',
  'update:searchQuery',
  'update:activeCategory',
  'update:activeDay'
])

const isCollapsed = ref(false)
</script>
