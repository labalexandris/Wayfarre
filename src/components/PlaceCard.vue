<template>
  <div
    class="place-card"
    :class="{ selected: isSelected, dragging: isDragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent
    @drop="onDrop"
    @click="$emit('select', place.id)"
  >
    <div class="place-card-accent" :style="{ background: `linear-gradient(180deg, ${category.color}, ${category.color}88)` }"></div>
    <div class="place-card-body">
      <div class="place-card-header">
        <span class="place-icon">{{ category.icon }}</span>
        <div class="place-info">
          <h3 class="place-name">{{ place.name }}</h3>
          <span class="place-category">{{ category.label }}</span>
        </div>
        <div class="place-actions">
          <span class="day-badge" v-if="place.day">Day {{ place.day }}</span>
          <button class="btn-delete" @click.stop="$emit('remove', place.id)" title="Remove">×</button>
        </div>
      </div>
      <p class="place-desc" v-if="place.description">{{ place.description }}</p>
      <div class="place-coords">
        {{ place.lat.toFixed(4) }}°, {{ place.lng.toFixed(4) }}°
      </div>
    </div>
    <div class="drag-handle" title="Drag to reorder">⠿</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  place: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  index: { type: Number, required: true }
})

const emit = defineEmits(['select', 'remove', 'reorder'])

const isDragging = ref(false)

const category = computed(() => {
  return props.categories.find(c => c.id === props.place.category) || props.categories[props.categories.length - 1]
})

function onDragStart(e) {
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.index.toString())
}

function onDragEnd() {
  isDragging.value = false
}

function onDrop(e) {
  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
  if (!isNaN(fromIndex) && fromIndex !== props.index) {
    emit('reorder', fromIndex, props.index)
  }
}
</script>
