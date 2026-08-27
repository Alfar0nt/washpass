export const LOCATION_ERRORS = {
  PERMISSION_DENIED: 'permission_denied',
  POSITION_UNAVAILABLE: 'position_unavailable',
  TIMEOUT: 'timeout',
  NOT_SUPPORTED: 'not_supported',
  UNKNOWN: 'unknown',
};

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: LOCATION_ERRORS.NOT_SUPPORTED, message: 'Geolocation is not supported by this browser' });
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorCode = LOCATION_ERRORS.UNKNOWN;
        let message = 'An unknown error occurred';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorCode = LOCATION_ERRORS.PERMISSION_DENIED;
            message = 'Location permission denied. Please enable location access in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorCode = LOCATION_ERRORS.POSITION_UNAVAILABLE;
            message = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorCode = LOCATION_ERRORS.TIMEOUT;
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = error.message;
        }

        reject({ code: errorCode, message });
      },
      { ...defaultOptions, ...options }
    );
  });
}

export function watchPosition(callback, options = {}) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser');
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      let errorCode = LOCATION_ERRORS.UNKNOWN;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorCode = LOCATION_ERRORS.PERMISSION_DENIED;
          break;
        case error.POSITION_UNAVAILABLE:
          errorCode = LOCATION_ERRORS.POSITION_UNAVAILABLE;
          break;
        case error.TIMEOUT:
          errorCode = LOCATION_ERRORS.TIMEOUT;
          break;
      }
      callback(null, { code: errorCode, message: error.message });
    },
    { ...defaultOptions, ...options }
  );
}

export function clearWatch(watchId) {
  if (navigator.geolocation && watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WashPass/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    }
    
    return null;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return null;
  }
}

export function formatCoordinates(latitude, longitude) {
  const lat = latitude.toFixed(6);
  const lng = longitude.toFixed(6);
  return `${lat}, ${lng}`;
}

export function openInMaps(latitude, longitude, label = 'Lokasi Pickup') {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(label)}`;
  window.open(url, '_blank');
}