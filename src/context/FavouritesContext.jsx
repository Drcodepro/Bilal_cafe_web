import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const FavouritesContext = createContext(null);

const STORAGE_KEY = 'bilal_favourites';

/**
 * Safely reads favourites from localStorage with validation.
 * Returns an empty array if data is missing, malformed, or fails validation.
 */
function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Validate: must be an array of strings (item IDs)
    if (
      !Array.isArray(parsed) ||
      !parsed.every((id) => typeof id === 'string' && id.length < 50)
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/**
 * Safely writes favourites to localStorage.
 */
function saveFavourites(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage might be full or disabled — fail silently
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(loadFavourites);

  // Persist whenever favourites change
  useEffect(() => {
    saveFavourites(favourites);
  }, [favourites]);

  const toggleFavourite = useCallback((itemId) => {
    setFavourites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const isFavourite = useCallback(
    (itemId) => favourites.includes(itemId),
    [favourites]
  );

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}
