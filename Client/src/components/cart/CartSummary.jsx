import { memo } from 'react';
import { useCartSummary } from '../../context/CartContext';

/**
 * CartSummary — bill breakdown at the bottom of the cart.
 */
const CartSummary = memo(function CartSummary() {
  const { subtotal, taxes, total } = useCartSummary();

  if (subtotal === 0) return null;

  return (
    <div className="cart-summary">
      <div className="cart-summary__row">
        <span className="cart-summary__label">Subtotal</span>
        <span className="cart-summary__value">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="cart-summary__row">
        <span className="cart-summary__label">GST (5%)</span>
        <span className="cart-summary__value">₹{taxes.toFixed(2)}</span>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <span className="cart-summary__label">Total Bill:</span>
        <span className="cart-summary__value">₹{total.toFixed(2)}</span>
      </div>
      <div className="cart-summary__inclusive">
        🔥 Inclusive of taxes & charges
      </div>
    </div>
  );
});

export default CartSummary;
