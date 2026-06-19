import { useState, useCallback } from 'react';
import { IoSearch, IoPerson } from 'react-icons/io5';
import { HiLocationMarker } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { sanitizeSearchQuery } from '../../utils/sanitize';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Header component — sticky top bar with logo, location, search, and profile.
 */
export default function Header({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <>
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

        <button
          className="header__profile-btn"
          type="button"
          onClick={() => setIsProfileOpen(true)}
          aria-label="View profile details"
          id="header-profile-btn"
        >
          <IoPerson />
        </button>
      </header>

      {/* Profile Details Modal Overlay */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="profile-popup-overlay" onClick={() => setIsProfileOpen(false)}>
            <motion.div
              className="profile-popup-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="profile-popup-card__header">
                <img
                  src="/logo.png"
                  alt="User Avatar"
                  className="profile-popup-card__avatar"
                  width="48"
                  height="48"
                />
                <h2 className="profile-popup-card__title">User Profile</h2>
              </div>

              <div className="profile-popup-card__details">
                <div className="profile-popup-card__detail-item">
                  <span className="profile-popup-card__label">Name</span>
                  <span className="profile-popup-card__value">Bilal Ahmed</span>
                </div>
                <div className="profile-popup-card__detail-item">
                  <span className="profile-popup-card__label">Phone Number</span>
                  <span className="profile-popup-card__value">+91 9826603673</span>
                </div>
                <div className="profile-popup-card__detail-item">
                  <span className="profile-popup-card__label">Email ID</span>
                  <span className="profile-popup-card__value">bilal.ahmed@example.com</span>
                </div>
              </div>

              <button
                className="profile-popup-card__close-btn animate-btn"
                type="button"
                onClick={() => setIsProfileOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
