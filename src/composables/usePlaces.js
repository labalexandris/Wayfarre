import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'wayfarre-places-v1'

const CATEGORIES = [
  { id: 'accommodation', label: 'Stay', icon: '🏨', color: '#E8596E' },
  { id: 'food', label: 'Eat & Drink', icon: '🍽️', color: '#FF8E53' },
  { id: 'attraction', label: 'Must See', icon: '⭐', color: '#F7B731' },
  { id: 'nature', label: 'Nature', icon: '🌿', color: '#26D0A1' },
  { id: 'transport', label: 'Transit', icon: '🚌', color: '#4DABF7' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#B07FE0' },
  { id: 'other', label: 'Other', icon: '📍', color: '#8B87A0' }
]

function loadPlaces() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : getDefaultPlaces()
  } catch {
    return getDefaultPlaces()
  }
}

function getDefaultPlaces() {
  return [
    { id: 1, name: 'Eiffel Tower', description: 'Iconic iron lattice tower on the Champ de Mars', lat: 48.8584, lng: 2.2945, category: 'attraction', day: 1 },
    { id: 2, name: 'Le Marais Bistro', description: 'Classic Parisian bistro in the historic Marais quarter', lat: 48.8566, lng: 2.3622, category: 'food', day: 1 },
    { id: 3, name: 'Hotel Lutetia', description: 'Art Deco palace hotel on the Left Bank', lat: 48.8510, lng: 2.3265, category: 'accommodation', day: 1 },
    { id: 4, name: 'Colosseum', description: 'Ancient amphitheater in the heart of Rome', lat: 41.8902, lng: 12.4922, category: 'attraction', day: 2 },
    { id: 5, name: 'Trastevere', description: 'Charming neighborhood with cobblestone streets and trattorias', lat: 41.8865, lng: 12.4700, category: 'food', day: 2 },
    { id: 6, name: 'Sagrada Familia', description: 'Gaudi\'s unfinished masterpiece basilica', lat: 41.4036, lng: 2.1744, category: 'attraction', day: 3 },
    { id: 7, name: 'La Boqueria', description: 'Vibrant food market off La Rambla', lat: 41.3816, lng: 2.1719, category: 'shopping', day: 3 },
    { id: 8, name: 'Hallstatt', description: 'Fairy-tale lakeside village in the Austrian Alps', lat: 47.5622, lng: 13.6493, category: 'nature', day: 4 },
    { id: 9, name: 'Santorini Caldera', description: 'Dramatic volcanic cliffs with sunset views', lat: 36.4165, lng: 25.4322, category: 'nature', day: 5 },
    { id: 10, name: 'Amsterdam Centraal', description: 'Main railway hub connecting the Netherlands', lat: 52.3791, lng: 4.9003, category: 'transport', day: 6 },
    { id: 11, name: 'Anne Frank House', description: 'Historic house and museum along the Prinsengracht canal', lat: 52.3752, lng: 4.8840, category: 'attraction', day: 6 },
    { id: 12, name: 'Swiss Alps — Jungfrau', description: 'Top of Europe with panoramic glacier views', lat: 46.5369, lng: 7.9625, category: 'nature', day: 7 },
    { id: 13, name: 'Charles Bridge', description: 'Gothic stone bridge lined with baroque statues in Prague', lat: 50.0865, lng: 14.4114, category: 'attraction', day: 8 },
    { id: 14, name: 'Plitvice Lakes', description: 'Cascading turquoise lakes in a Croatian national park', lat: 44.8654, lng: 15.5820, category: 'nature', day: 9 },
    { id: 15, name: 'Dubrovnik Old Town', description: 'Walled city perched on the Adriatic coast', lat: 42.6507, lng: 18.0944, category: 'attraction', day: 9 },
  ]
}

const places = ref(loadPlaces())
const selectedPlaceId = ref(null)
const searchQuery = ref('')
const activeCategory = ref(null)
const activeDay = ref(null)

watch(places, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function usePlaces() {
  const filteredPlaces = computed(() => {
    return places.value.filter(p => {
      const matchesSearch = !searchQuery.value ||
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !activeCategory.value || p.category === activeCategory.value
      const matchesDay = !activeDay.value || p.day === activeDay.value
      return matchesSearch && matchesCategory && matchesDay
    })
  })

  const days = computed(() => {
    const daySet = new Set(places.value.map(p => p.day))
    return [...daySet].sort((a, b) => a - b)
  })

  const selectedPlace = computed(() => {
    return places.value.find(p => p.id === selectedPlaceId.value) || null
  })

  function addPlace(place) {
    const id = Date.now()
    places.value.push({ ...place, id })
    selectedPlaceId.value = id
    return id
  }

  function removePlace(id) {
    const idx = places.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      places.value.splice(idx, 1)
      if (selectedPlaceId.value === id) selectedPlaceId.value = null
    }
  }

  function updatePlace(id, updates) {
    const place = places.value.find(p => p.id === id)
    if (place) Object.assign(place, updates)
  }

  function selectPlace(id) {
    selectedPlaceId.value = id
  }

  function reorderPlace(fromIndex, toIndex) {
    const filtered = filteredPlaces.value
    const item = filtered[fromIndex]
    const allIdx = places.value.indexOf(item)
    if (allIdx === -1) return
    places.value.splice(allIdx, 1)

    const targetItem = filtered[toIndex]
    const targetAllIdx = places.value.indexOf(targetItem)
    if (targetAllIdx === -1) {
      places.value.push(item)
    } else {
      places.value.splice(targetAllIdx, 0, item)
    }
  }

  return {
    places,
    filteredPlaces,
    selectedPlace,
    selectedPlaceId,
    searchQuery,
    activeCategory,
    activeDay,
    days,
    CATEGORIES,
    addPlace,
    removePlace,
    updatePlace,
    selectPlace,
    reorderPlace
  }
}
