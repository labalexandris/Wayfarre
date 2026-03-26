<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header-icon">📌</div>
      <h2>Pin a Destination</h2>
      <p class="modal-coords">{{ lat.toFixed(4) }}, {{ lng.toFixed(4) }}</p>

      <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" placeholder="e.g. Eiffel Tower" autofocus />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" rows="2" placeholder="What's special about this place?"></textarea>
      </div>

      <div class="form-group">
        <label>Category</label>
        <div class="category-select">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-option"
            :class="{ active: category === cat.id }"
            :style="category === cat.id ? { background: cat.color, borderColor: cat.color, color: '#fff' } : {}"
            @click="category = cat.id"
          >{{ cat.icon }} {{ cat.label }}</button>
        </div>
      </div>

      <div class="form-group">
        <label>Day</label>
        <input v-model.number="day" type="number" min="1" max="365" placeholder="Day number" />
      </div>

      <div class="modal-actions">
        <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn btn-add" @click="submit" :disabled="!name.trim()">Pin It ✈️</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  categories: { type: Array, required: true }
})

const emit = defineEmits(['close', 'add'])

const name = ref('')
const description = ref('')
const category = ref('attraction')
const day = ref(1)

function submit() {
  if (!name.value.trim()) return
  emit('add', {
    name: name.value.trim(),
    description: description.value.trim(),
    category: category.value,
    lat: props.lat,
    lng: props.lng,
    day: day.value || 1
  })
}
</script>
