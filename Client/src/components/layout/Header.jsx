import { useState, useCallback } from 'react';
import { IoSearch, IoPerson, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { HiLocationMarker } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { sanitizeSearchQuery } from '../../utils/sanitize';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../context/LocationContext';
import { useCart, useCartDispatch } from '../../context/CartContext';

/**
 * Header component — sticky top bar with logo, location picker, search, and profile.
 */
export default function Header({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null); // for cart-clear confirmation
  const { selectedLocation, setSelectedLocation, locations } = useLocation();
  const { items } = useCart();
  const cartDispatch = useCartDispatch();

  const handleChange = useCallback(
    (e) => {
      const sanitized = sanitizeSearchQuery(e.target.value);
      setQuery(sanitized);
      if (onSearch) {
        onSearch(sanitized);
      }
    },
    [onSearch]
  );

  const handleLocationSelect = useCallback(
    (location) => {
      if (location.id === selectedLocation.id) {
        setIsLocationOpen(false);
        return;
      }
      // If cart has items, show confirmation popup instead of switching directly
      if (items.length > 0) {
        setPendingLocation(location);
        return;
      }
      setSelectedLocation(location);
      setIsLocationOpen(false);
    },
    [setSelectedLocation, selectedLocation.id, items.length]
  );

  /** User confirmed: clear cart and switch location */
  const handleConfirmSwitch = useCallback(() => {
    if (pendingLocation) {
      cartDispatch({ type: 'CLEAR_CART' });
      setSelectedLocation(pendingLocation);
      setPendingLocation(null);
      setIsLocationOpen(false);
    }
  }, [pendingLocation, cartDispatch, setSelectedLocation]);

  /** User cancelled: keep current location */
  const handleCancelSwitch = useCallback(() => {
    setPendingLocation(null);
  }, []);

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

        <button
          className="header__location"
          type="button"
          aria-label="Change location"
          onClick={() => setIsLocationOpen(true)}
          id="header-location-btn"
        >
          <HiLocationMarker className="header__location-icon" />
          <span className="header__location-text">{selectedLocation.shortLabel}</span>
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

      {/* Location Picker Modal */}
      <AnimatePresence>
        {isLocationOpen && (
          <div
            className="location-picker-overlay"
            onClick={() => { setIsLocationOpen(false); setPendingLocation(null); }}
          >
            <motion.div
              className="location-picker-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="location-picker-card__header">
                <HiLocationMarker className="location-picker-card__header-icon" />
                <h2 className="location-picker-card__title">Choose Location</h2>
              </div>
              <p className="location-picker-card__subtitle">
                Select a Bilal Cafe branch to view menu availability
              </p>

              <div className="location-picker-list">
                {locations.map((loc) => {
                  const isActive = selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      className={`location-picker-item ${isActive ? 'location-picker-item--active' : ''}`}
                      onClick={() => handleLocationSelect(loc)}
                      id={`location-${loc.id}`}
                    >
                      <span className="location-picker-item__icon">{loc.icon}</span>
                      <div className="location-picker-item__info">
                        <span className="location-picker-item__name">{loc.name}</span>
                        <span className="location-picker-item__address">{loc.address}</span>
                      </div>
                      {isActive && (
                        <IoCheckmarkCircle className="location-picker-item__check" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                className="location-picker-card__close-btn animate-btn"
                type="button"
                onClick={() => { setIsLocationOpen(false); setPendingLocation(null); }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Clear Confirmation Popup */}
      <AnimatePresence>
        {pendingLocation && (
          <div
            className="confirm-popup-overlay"
            onClick={handleCancelSwitch}
          >
            <motion.div
              className="confirm-popup-card"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="confirm-popup-card__icon-wrap">
                <IoWarning className="confirm-popup-card__icon" />
              </div>
              <h3 className="confirm-popup-card__title">Switch Location?</h3>
              <p className="confirm-popup-card__message">
                You have <strong>{items.length} item{items.length > 1 ? 's' : ''}</strong> in your cart.
                Switching to <strong>{pendingLocation.name}</strong> will clear your current cart as
                stock availability may differ between locations.
              </p>
              <div className="confirm-popup-card__actions">
                <button
                  type="button"
                  className="confirm-popup-card__btn confirm-popup-card__btn--cancel"
                  onClick={handleCancelSwitch}
                  id="confirm-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm-popup-card__btn confirm-popup-card__btn--ok"
                  onClick={handleConfirmSwitch}
                  id="confirm-ok-btn"
                >
                  OK, Switch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
