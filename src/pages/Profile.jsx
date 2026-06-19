import { motion } from 'framer-motion';
import ProfileMenu from '../components/profile/ProfileMenu';

/**
 * Profile page — user account info and menu items.
 */
export default function Profile() {
  return (
    <>
      <div className="page-content" style={{ paddingTop: 0 }}>
        {/* Dark Header with Avatar & Phone */}
        <motion.div
          className="profile-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: 0 }}
        >
          <img
            src="/logo.png"
            alt="Bilal Kebabs & Biryani"
            className="profile-header__avatar"
            width="56"
            height="56"
          />
          <div className="profile-header__info">
            <div className="profile-header__phone">9826603673</div>
            <button
              className="profile-header__subtitle"
              type="button"
              aria-label="View account details"
            >
              View Account Details →
            </button>
          </div>
        </motion.div>

        {/* Menu Items */}
        <ProfileMenu />
      </div>
    </>
  );
}
