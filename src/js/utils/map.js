let mapInstances = new Map();

export function initMap(containerId, options = {}) {
  if (!window.L) {
    console.error('Leaflet (L) is not loaded');
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Map container #${containerId} not found`);
    return null;
  }

  if (mapInstances.has(containerId)) {
    const existingMap = mapInstances.get(containerId);
    existingMap.remove();
    mapInstances.delete(containerId);
  }

  container.innerHTML = '';

  const defaultOptions = {
    center: [-6.2088, 106.8456], // Jakarta default
    zoom: 15,
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true,
    touchZoom: true,
  };

  const map = window.L.map(containerId, { ...defaultOptions, ...options });

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  mapInstances.set(containerId, map);

  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  return map;
}

export function addMarker(map, latitude, longitude, options = {}) {
  if (!map || !window.L) return null;

  const defaultOptions = {
    draggable: false,
    title: 'Lokasi Pickup',
  };

  const marker = window.L.marker([latitude, longitude], { ...defaultOptions, ...options }).addTo(map);
  return marker;
}

export function addCircle(map, latitude, longitude, radius = 50, options = {}) {
  if (!map || !window.L) return null;

  const defaultOptions = {
    color: '#0D9488',
    fillColor: '#0D9488',
    fillOpacity: 0.15,
    weight: 2,
  };

  const circle = window.L.circle([latitude, longitude], { radius, ...defaultOptions, ...options }).addTo(map);
  return circle;
}

export function fitBounds(map, bounds, options = {}) {
  if (!map || !window.L) return;
  
  const defaultOptions = {
    padding: [20, 20],
    maxZoom: 18,
  };
  
  map.fitBounds(bounds, { ...defaultOptions, ...options });
}

export function centerMap(map, latitude, longitude, zoom = 16) {
  if (!map) return;
  map.setView([latitude, longitude], zoom);
}

export function destroyMap(containerId) {
  const map = mapInstances.get(containerId);
  if (map) {
    map.remove();
    mapInstances.delete(containerId);
  }
}

export function destroyAllMaps() {
  for (const [containerId, map] of mapInstances) {
    map.remove();
  }
  mapInstances.clear();
}

export function getMap(containerId) {
  return mapInstances.get(containerId);
}

export function createMiniMap(containerId, latitude, longitude, options = {}) {
  const map = initMap(containerId, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    ...options,
  });

  if (!map) return null;

  addMarker(map, latitude, longitude);
  addCircle(map, latitude, longitude, 30);

  return map;
}