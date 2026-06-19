import { useNavigate } from 'react-router-dom';
import { IoHeart, IoLocation, IoHelpCircle, IoLogOut, IoChevronForward } from 'react-icons/io5';
import { motion } from 'framer-motion';

const menuItems = [
  {
    id: 'favourites',
    icon: IoHeart,
    iconClass: 'profile-menu__icon--fav',
    label: 'Favourites',
    route: '/favourites',
  },
  {
    id: 'address',
    icon: IoLocation,
    iconClass: 'profile-menu__icon--address',
    label: 'Address Book',
    route: null,
  },
  {
    id: 'help',
    icon: IoHelpCircle,
    iconClass: 'profile-menu__icon--help',
    label: 'Help',
    route: null,
  },
  {
    id: 'logout',
    icon: IoLogOut,
    iconClass: 'profile-menu__icon--logout',
    label: 'Logout',
    route: null,
  },
];

/**
 * ProfileMenu — list of profile action items with icons.
 */
export default function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <nav className="profile-menu" aria-label="Profile menu">
      {menuItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            className="profile-menu__item"
            onClick={() => item.route && navigate(item.route)}
            type="button"
            aria-label={item.label}
            id={`profile-${item.id}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <span className={`profile-menu__icon ${item.iconClass}`}>
              <Icon />
            </span>
            <span>{item.label}</span>
            <IoChevronForward className="profile-menu__arrow" />
          </motion.button>
        );
      })}
    </nav>
  );
}
