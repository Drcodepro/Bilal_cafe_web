import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import CategoryFilter from '../components/food/CategoryFilter';
import FoodCard from '../components/food/FoodCard';
import { menuItems } from '../data/menuItems';

/**
 * Home page — main menu exploration view.
 * Features: search, category filter, animated food card list.
 */
export default function Home() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef(null);

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
