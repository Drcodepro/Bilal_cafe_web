import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import OrderCard from '../components/history/OrderCard';
import { orderHistory } from '../data/orderHistory';

/**
 * History page — shows past orders with reorder functionality.
 */
export default function History() {
  const navigate = useNavigate();

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

      <div className="page-content">
        {orderHistory.length > 0 ? (
          orderHistory.map((order, index) => (
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
