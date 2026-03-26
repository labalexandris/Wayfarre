# 🧭 Wayfarre

Wayfarre is a map-based travel planner for visualizing and organizing your journeys. Pin destinations, group by day, and craft your perfect itinerary.

---

## ✨ Features

- 🗺️ **Interactive Map** — Pin places anywhere in the world, powered by Leaflet and CARTO Voyager tiles
- 📍 **Custom Markers** — Colorful emoji markers by category, with clustering and smooth fly-to animations
- 🧩 **Sidebar Sync** — Search, filter, and reorder places; sidebar and map always in sync
- 🗂️ **Day & Category Filters** — Organize your trip by day and type (Stay, Eat & Drink, Must See, etc.)
- 🏨 **Add Place Modal** — Quick-add with name, description, category, and day
- 💾 **Local Storage** — Your trip persists between visits
- 🌙 **Dark Theme** — Modern, accessible, and mobile-friendly
- 🚀 **Preloaded Sample** — European adventure with 15 destinations across 9 days

---

## 🛠️ Getting Started

```bash
git clone https://github.com/yourusername/wayfarre.git
cd wayfarre
npm install
npm run dev
```

Visit [http://localhost:5175/](http://localhost:5175/) in your browser.

---

## 🗂️ Project Structure

- `src/components/` — Vue components (Sidebar, MapView, PlaceCard, AddPlaceModal)
- `src/composables/usePlaces.js` — Centralized state & logic
- `src/assets/styles.css` — Themed CSS

---

## 🌍 Credits

- Built with [Vue 3](https://vuejs.org/), [Leaflet](https://leafletjs.com/), [MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster), and [Vite](https://vitejs.dev/)
- Map tiles by [CARTO Voyager](https://carto.com/)
- Emoji icons by [Twemoji](https://twemoji.twitter.com/)
