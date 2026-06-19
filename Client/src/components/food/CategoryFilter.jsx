import { memo } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../data/menuItems';

/**
 * CategoryFilter — horizontal scrollable chips to filter menu items.
 */
const CategoryFilter = memo(function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="category-filter" role="tablist" aria-label="Menu categories">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          className={`category-chip ${activeCategory === cat.id ? 'category-chip--active' : ''}`}
          onClick={() => onSelect(cat.id)}
          role="tab"
          aria-selected={activeCategory === cat.id}
          id={`category-${cat.id}`}
          type="button"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
        >
          <span className="category-chip__icon">{cat.icon}</span>
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
});

export default CategoryFilter;
