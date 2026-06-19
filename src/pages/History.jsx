import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import OrderCard from '../components/history/OrderCard';
import { orderHistory as staticOrders } from '../data/orderHistory';

/**
 * History page — shows past orders with reorder functionality.
 * Dynamically merges localStorage-placed orders with static initial history.
 */
export default function History() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bilal_orders');
      const parsedStored = stored ? JSON.parse(stored) : [];

      // Merge static mock orders with dynamic user-placed orders
      const combined = [...parsedStored, ...staticOrders];

      // Sort by date descending (newest first)
      combined.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(combined);
    } catch (error) {
      console.error('Error reading order history:', error);
      // Fallback to static orders only if localStorage is corrupted
      setOrders(staticOrders);
    }
  }, []);

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
        <h1 className="page-header__title">History</h1>
      </div>

      <div className="page-content history-page">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="empty-state__icon">📋</span>
            <h2 className="empty-state__title">No orders yet</h2>
            <p className="empty-state__desc">
              Your order history will appear here once you place your first order.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}

