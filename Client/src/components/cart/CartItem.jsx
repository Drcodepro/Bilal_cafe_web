import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCartDispatch } from '../../context/CartContext';

/**
 * CartItem — a single item row in the Cart page with stepper controls.
 */
const CartItem = memo(function CartItem({ item }) {
  const dispatch = useCartDispatch();

  const handleIncrement = useCallback(() => {
    dispatch({ type: 'INCREMENT', payload: item.id });
  }, [dispatch, item.id]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: 'DECREMENT', payload: item.id });
  }, [dispatch, item.id]);

  return (
    <motion.div
      className="cart-item"
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="cart-item__image"
        loading="lazy"
        width="56"
        height="56"
        onError={(e) => {
          e.target.src = '/images/placeholder.svg';
        }}
      />
      <div className="cart-item__info">
        <div className="cart-item__name">{item.name}</div>
        <div className="cart-item__price">
          ₹{item.price * item.quantity}
        </div>
      </div>
      <div className="cart-item__stepper">
        <button
          className="cart-item__step-btn"
          onClick={handleDecrement}
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
        >
          −
        </button>
        <motion.span
          className="cart-item__qty"
          key={item.quantity}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {item.quantity}
        </motion.span>
        <button
          className="cart-item__step-btn"
          onClick={handleIncrement}
          type="button"
          aria-label={`Increase ${item.name} quantity`}
        >
          +
        </button>
      </div>
    </motion.div>
  );
});

export default CartItem;
