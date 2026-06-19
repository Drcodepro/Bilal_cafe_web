import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useCartDispatch } from '../../context/CartContext';
import { menuItems } from '../../data/menuItems';

/**
 * OrderCard — a single past order in the History page.
 */
const OrderCard = memo(function OrderCard({ order, index = 0 }) {
  const dispatch = useCartDispatch();

  const handleReorder = useCallback(() => {
    // Clear cart first, then add order items
    dispatch({ type: 'CLEAR_CART' });
    order.items.forEach((orderItem) => {
      // Find the menu item to get full data
      const menuItem = menuItems.find(
        (m) => m.name === orderItem.name
      );
      if (menuItem) {
        for (let i = 0; i < orderItem.quantity; i++) {
          dispatch({ type: 'ADD_ITEM', payload: menuItem });
        }
      }
    });
  }, [dispatch, order.items]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const itemsSummary = order.items
    .map((i) => `${i.quantity}x ${i.name}`)
    .join(', ');

  return (
    <motion.div
      className="order-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="order-card__header">
        <span className="order-card__restaurant">{order.restaurantName}</span>
        <span className="order-card__status">
          {order.status}
          <IoCheckmarkCircle className="order-card__status-icon" />
        </span>
      </div>
      <div className="order-card__items">{itemsSummary}</div>
      <div className="order-card__footer">
        <div>
          <div className="order-card__total">₹{order.totalAmount.toFixed(2)}</div>
          <div className="order-card__date">{formatDate(order.date)}</div>
        </div>
        <button
          className="reorder-btn"
          onClick={handleReorder}
          type="button"
          aria-label={`Reorder ${order.orderNumber}`}
          id={`reorder-${order.id}`}
        >
          Reorder
        </button>
      </div>
    </motion.div>
  );
});

export default OrderCard;
