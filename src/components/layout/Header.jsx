import { useState, useCallback } from 'react';
import { IoSearch } from 'react-icons/io5';
import { HiLocationMarker } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { sanitizeSearchQuery } from '../../utils/sanitize';

/**
 * Header component — sticky top bar with logo, location, and search.
 */
export default function Header({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e) => {
      const sanitized = sanitizeSearchQuery(e.target.value);
      setQuery(sanitized);
      if (onSearch) {
        // Debounce is handled in the parent via useEffect
        onSearch(sanitized);
      }
    },
    [onSearch]
  );

  return (
    <header className="header" role="banner">
      <img
        src="/logo.png"
        alt="Bilal Kebabs & Biryani"
        className="header__logo"
        width="40"
        height="40"
        loading="eager"
      />

      <button className="header__location" type="button" aria-label="Change location">
        <HiLocationMarker className="header__location-icon" />
        <span className="header__location-text">ABLD</span>
        <IoChevronDown className="header__location-arrow" />
      </button>

      <div className="search-bar">
        <input
          type="search"
          className="search-bar__input"
          placeholder="Search menu..."
          value={query}
          onChange={handleChange}
          aria-label="Search menu items"
          autoComplete="off"
          maxLength={100}
          id="menu-search"
        />
        <IoSearch className="search-bar__icon" />
      </div>
    </header>
  );
}
