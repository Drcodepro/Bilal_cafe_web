import { NavLink } from 'react-router-dom';
import { IoHome, IoHomeOutline } from 'react-icons/io5';
import { IoTimeOutline, IoTime } from 'react-icons/io5';
import { IoCartOutline, IoCart } from 'react-icons/io5';
import { IoPersonOutline, IoPerson } from 'react-icons/io5';
import { useCartSummary } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  {
    to: '/',
    label: 'Home',
    iconActive: IoHome,
    iconInactive: IoHomeOutline,
  },
  {
    to: '/history',
    label: 'History',
    iconActive: IoTime,
    iconInactive: IoTimeOutline,
  },
  {
    to: '/cart',
    label: 'Cart',
    iconActive: IoCart,
    iconInactive: IoCartOutline,
    showBadge: true,
  },
  {
    to: '/profile',
    label: 'Profile',
    iconActive: IoPerson,
    iconInactive: IoPersonOutline,
  },
];

/**
 * Bottom navigation — 4 tabs (Home, History, Cart, Profile).
 * Payments tab intentionally excluded per requirements.
 */
export default function BottomNav() {
  const { totalItems } = useCartSummary();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(({ to, label, iconActive: Active, iconInactive: Inactive, showBadge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
          aria-label={label}
          id={`nav-${label.toLowerCase()}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                {isActive ? <Active /> : <Inactive />}
              </span>
              <span>{label}</span>
              {showBadge && totalItems > 0 && (
                <AnimatePresence>
                  <motion.span
                    className="bottom-nav__badge"
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                </AnimatePresence>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
