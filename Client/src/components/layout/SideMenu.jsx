import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoHelpCircle, IoLogOut, IoChevronForward, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SideMenu — Slide-in drawer that lists menu items like Favourites, Help, and Logout.
 * Toggled from the footer Menu button.
 */
export default function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  console.log("SideMenu rendering, isOpen:", isOpen);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const menuItems = [
    {
      id: 'favourites',
      icon: IoHeart,
      iconClass: 'profile-menu__icon--fav',
      label: 'Favourites',
      action: () => {
        navigate('/favourites');
        onClose();
      },
    },
    {
      id: 'help',
      icon: IoHelpCircle,
      iconClass: 'profile-menu__icon--help',
      label: 'Help',
      action: () => {
        alert('For support, please call us at +91 9826603673 or email support@bilalcafe.com.');
        onClose();
      },
    },
    {
      id: 'logout',
      icon: IoLogOut,
      iconClass: 'profile-menu__icon--logout',
      label: 'Logout',
      action: () => {
        if (confirm('Are you sure you want to logout?')) {
          alert('Logged out successfully (simulation).');
          onClose();
        }
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="side-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer content */}
          <motion.div
            className="side-menu-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="side-menu-drawer__header">
              <h2 className="side-menu-drawer__title">Menu</h2>
              <button
                type="button"
                className="side-menu-drawer__close"
                onClick={onClose}
                aria-label="Close menu"
              >
                <IoClose />
              </button>
            </div>

            <nav className="profile-menu" aria-label="Side menu">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="profile-menu__item"
                    onClick={item.action}
                    type="button"
                    aria-label={item.label}
                    id={`menu-item-${item.id}`}
                  >
                    <span className={`profile-menu__icon ${item.iconClass}`}>
                      <Icon />
                    </span>
                    <span>{item.label}</span>
                    <IoChevronForward className="profile-menu__arrow" />
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
