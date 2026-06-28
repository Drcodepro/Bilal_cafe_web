import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import CategoryFilter from '../components/food/CategoryFilter';
import FoodCard from '../components/food/FoodCard';
import { menuItems } from '../data/menuItems';
import { useLocation } from '../context/LocationContext';
import { HiLocationMarker } from 'react-icons/hi';

/**
 * Home page — main menu exploration view.
 * Features: search, category filter, location banner, animated food card list.
 */
export default function Home() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef(null);
  const { selectedLocation } = useLocation();

  // Debounce search by 300ms to avoid excessive filtering
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    let items = menuItems;

    if (category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return items;
  }, [category, debouncedQuery]);

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="page-content">
        {/* Location Banner */}
        <motion.div
          className="location-banner"
          key={selectedLocation.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HiLocationMarker className="location-banner__icon" />
          <span className="location-banner__text">
            Browsing menu for <strong>{selectedLocation.name}</strong>
          </span>
          <span className="location-banner__dot" />
          <span className="location-banner__address">{selectedLocation.address}</span>
        </motion.div>

        {/* Explore Menu Title */}
        <motion.div
          className="explore-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="explore-menu__title">
            <span className="explore-menu__icon">🍽️</span>
            Explore Menu
          </h1>
        </motion.div>

        {/* Category Chips */}
        <CategoryFilter activeCategory={category} onSelect={setCategory} />

        {/* Food Items */}
        <div className="food-list" role="list" aria-label="Menu items">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FoodCard key={item.id} item={item} index={index} />
            ))
          ) : (

            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="empty-state__icon">🔍</span>
              <h2 className="empty-state__title">No items found</h2>
              <p className="empty-state__desc">
                Try a different search or category to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
