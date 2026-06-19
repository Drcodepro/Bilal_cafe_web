import { memo, useState, useCallback } from 'react';
import { IoHeart, IoHeartOutline, IoStar } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useFavourites } from '../../context/FavouritesContext';
import { useCartDispatch, useItemQuantity } from '../../context/CartContext';

/**
 * FoodCard — displays a single menu item with:
 * - Image with favourite toggle
 * - Veg/non-veg indicator, name, description, rating
 * - Price with Add button / quantity stepper
 */
const FoodCard = memo(function FoodCard({ item, index = 0 }) {
  const { toggleFavourite, isFavourite } = useFavourites();
  const dispatch = useCartDispatch();
  const quantity = useItemQuantity(item.id);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const fav = isFavourite(item.id);

  const handleToggleFav = useCallback(() => {
    setHeartAnimating(true);
    toggleFavourite(item.id);
    setTimeout(() => setHeartAnimating(false), 400);
  }, [item.id, toggleFavourite]);

  const handleAdd = useCallback(() => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, [dispatch, item]);

  const handleIncrement = useCallback(() => {
    dispatch({ type: 'INCREMENT', payload: item.id });
  }, [dispatch, item.id]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: 'DECREMENT', payload: item.id });
  }, [dispatch, item.id]);

  return (
    <motion.div
      className="food-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Image + Favourite */}
      <div className="food-card__image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="food-card__image"
          loading="lazy"
          width="110"
          height="100"
          onError={(e) => {
            e.target.src = '/images/placeholder.svg';
          }}
        />
        <button
          className={`food-card__favourite ${fav ? 'food-card__favourite--active' : ''} ${heartAnimating ? 'animate-heart' : ''}`}
          onClick={handleToggleFav}
          type="button"
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
          id={`fav-${item.id}`}
        >
          {fav ? <IoHeart /> : <IoHeartOutline />}
        </button>
        {item.isPopular && <span className="popular-badge">Popular</span>}
      </div>

      {/* Info */}
      <div className="food-card__info">
        <div
          className={`food-card__veg-indicator ${item.isVeg ? 'food-card__veg-indicator--veg' : 'food-card__veg-indicator--nonveg'}`}
          aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        />
        <h3 className="food-card__name">{item.name}</h3>
        <p className="food-card__desc">{item.description}</p>

        {/* Rating */}
        <div className="food-card__rating">
          <IoStar className="food-card__rating-star" />
          <span>{item.rating}</span>
          <span>({item.reviewCount})</span>
        </div>

        {/* Price + Add/Stepper */}
        <div className="food-card__bottom">
          <span className="food-card__price">
            <span className="food-card__price-symbol">₹</span>
            {item.price}
          </span>

          {quantity === 0 ? (
            <motion.button
              className="add-btn add-btn--add"
              onClick={handleAdd}
              type="button"
              aria-label={`Add ${item.name} to cart`}
              id={`add-${item.id}`}
              whileTap={{ scale: 0.94 }}
            >
              Add
            </motion.button>
          ) : (
            <motion.div
              className="add-btn add-btn--stepper"
              initial={{ width: 80 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="add-btn__step"
                onClick={handleDecrement}
                type="button"
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>
              <motion.span
                className="add-btn__count"
                key={quantity}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {quantity}
              </motion.span>
              <button
                className="add-btn__step"
                onClick={handleIncrement}
                type="button"
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default FoodCard;
