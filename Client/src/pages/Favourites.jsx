import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import FoodCard from '../components/food/FoodCard';
import { useFavourites } from '../context/FavouritesContext';
import { menuItems } from '../data/menuItems';

/**
 * Favourites page — grid of items the user has hearted.
 */
export default function Favourites() {
  const navigate = useNavigate();
  const { favourites } = useFavourites();

  const favouriteItems = menuItems.filter((item) =>
    favourites.includes(item.id)
  );

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
        <h1 className="page-header__title">Favourites</h1>
      </div>

      <div className="page-content">
        {favouriteItems.length > 0 ? (
          <div className="favourites-grid" role="list" aria-label="Favourite items">
            {favouriteItems.map((item, index) => (
              <FoodCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="empty-state__icon">💖</span>
            <h2 className="empty-state__title">No favourites yet</h2>
            <p className="empty-state__desc">
              Tap the heart on any dish to save it here for easy access.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
