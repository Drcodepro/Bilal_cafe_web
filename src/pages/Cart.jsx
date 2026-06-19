import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoLocationSharp, IoTimeOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useCartDispatch } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { sanitizeNote } from '../utils/sanitize';

/**
 * Cart page — shows current cart items with stepper controls,
 * location banner, ETA, note field, and bill summary.
 * No payment section (removed per requirements).
 */
export default function Cart() {
  const navigate = useNavigate();
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const [note, setNote] = useState('');

  const handleNoteChange = useCallback((e) => {
    setNote(sanitizeNote(e.target.value));
  }, []);

  // Group items by category for display
  const categorizedItems = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    biryani: '🍚 Bilal Specialties',
    kebabs: '🍢 Kebabs & Tikka',
    starters: '🥘 Starters',
    breads: '🫓 Breads',
    beverages: '🥤 Beverages',
    desserts: '🍮 Desserts',
    other: '📦 Other',
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <button
          className="page-header__back"
          onClick={() => navigate(-1)}
          type="button"
          aria-label="Go back"
        >
          <IoArrowBack />
        </button>
        <h1 className="page-header__title">Cart</h1>
      </div>

      <div className="page-content cart-page">
        {items.length > 0 ? (
          <>
            {/* Ordering From Banner */}
            <motion.div
              className="cart-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="cart-banner__info">
                <IoLocationSharp className="cart-banner__icon" />
                <div className="cart-banner__text">
                  Ordering from: <strong>Bilal — Mount Road</strong>
                </div>
              </div>
              <button className="cart-banner__change" type="button">
                Change
              </button>
            </motion.div>

            {/* ETA */}
            <motion.div
              className="cart-eta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <IoTimeOutline />
              Estimated Time for Entry in Cafe:
              <span className="cart-eta__time">11:31 pm</span>
            </motion.div>

            {/* Cart Items by Category */}
            {Object.keys(categorizedItems).map((cat) => (
              <div key={cat}>
                <div className="cart-section-title">
                  {categoryLabels[cat] || cat}
                </div>
                <AnimatePresence mode="popLayout">
                  {categorizedItems[cat].map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            ))}

            {/* Bill Summary */}
            <CartSummary />

            {/* Note */}
            <div className="cart-note">
              <label className="cart-note__label" htmlFor="order-note">
                Note
              </label>
              <textarea
                id="order-note"
                className="cart-note__input"
                placeholder="Any special instructions for your order..."
                value={note}
                onChange={handleNoteChange}
                maxLength={500}
                rows={3}
              />
            </div>
          </>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="empty-state__icon">🛒</span>
            <h2 className="empty-state__title">Your cart is empty</h2>
            <p className="empty-state__desc">
              Explore our menu and add your favourite dishes to get started.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
