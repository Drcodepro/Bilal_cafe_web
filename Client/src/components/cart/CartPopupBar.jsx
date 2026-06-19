import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCart } from 'react-icons/io5';
import { useCartSummary } from '../../context/CartContext';

/**
 * CartPopupBar — a floating card at the bottom of the screen (above BottomNav)
 * that appears when items are added to the cart, prompting the user to view cart.
 * Hidden on the Cart page itself.
 */
export default function CartPopupBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, totalItems } = useCartSummary();

  // Only show the popup bar on the Home page when cart has items
  const isVisible = totalItems > 0 && location.pathname === '/';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cart-popup-bar"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="cart-popup-bar__left">
            <div className="cart-popup-bar__icon-wrap">
              <IoCart className="cart-popup-bar__icon" />
              <span className="cart-popup-bar__badge">{totalItems}</span>
            </div>
            <div className="cart-popup-bar__text">
              <span className="cart-popup-bar__count">
                {totalItems} Item{totalItems > 1 ? 's' : ''}
              </span>
              <span className="cart-popup-bar__divider">|</span>
              <span className="cart-popup-bar__total">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="cart-popup-bar__btn animate-btn"
            onClick={() => navigate('/cart')}
            type="button"
          >
            View Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

