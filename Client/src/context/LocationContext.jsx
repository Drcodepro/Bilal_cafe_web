import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { locations, locationStock } from '../data/locationStock';

const LocationContext = createContext(null);

const STORAGE_KEY = 'bilal_selected_location';

/**
 * Load persisted location from localStorage.
 * Falls back to the first location (Anna Salai) if missing/invalid.
 */
function loadLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return locations[0];
    const parsed = JSON.parse(raw);
    // Validate: must match a known location id
    const found = locations.find((loc) => loc.id === parsed?.id);
    return found || locations[0];
  } catch {
    return locations[0];
  }
}

/**
 * Persist selected location to localStorage.
 */
function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: location.id }));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocationState] = useState(loadLocation);

  // Persist on change
  useEffect(() => {
    saveLocation(selectedLocation);
  }, [selectedLocation]);

  const setSelectedLocation = useCallback((location) => {
    setSelectedLocationState(location);
  }, []);

  // Stock helpers — memoized on selectedLocation.id
  const stockMap = useMemo(
    () => locationStock[selectedLocation.id] || {},
    [selectedLocation.id]
  );

  const getStock = useCallback(
    (itemId) => {
      const count = stockMap[itemId];
      return typeof count === 'number' ? count : 0;
    },
    [stockMap]
  );

  const isLowStock = useCallback(
    (itemId) => {
      const count = getStock(itemId);
      return count > 0 && count < 10;
    },
    [getStock]
  );

  const isOutOfStock = useCallback(
    (itemId) => getStock(itemId) === 0,
    [getStock]
  );

  const value = useMemo(
    () => ({
      selectedLocation,
      setSelectedLocation,
      getStock,
      isLowStock,
      isOutOfStock,
      locations,
    }),
    [selectedLocation, setSelectedLocation, getStock, isLowStock, isOutOfStock]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

/**
 * Hook: access location state and stock helpers.
 */
export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
