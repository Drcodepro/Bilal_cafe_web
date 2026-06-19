import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

/**
 * Cart reducer — handles all cart mutations.
 * Pure function, no side effects.
 */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case 'DECREMENT': {
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}

const initialState = {
  items: [],
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

/** Hook: read cart state */
export function useCart() {
  const context = useContext(CartContext);
  if (!context && context !== initialState) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

/** Hook: cart dispatch actions */
export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return dispatch;
}

/** Hook: computed cart values */
export function useCartSummary() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.05; // 5% GST
  const taxes = Math.round(subtotal * taxRate);
  const total = subtotal + taxes;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, taxes, total, totalItems };
}

/** Hook: get quantity of a specific item in cart */
export function useItemQuantity(itemId) {
  const { items } = useCart();
  const item = items.find((i) => i.id === itemId);
  return item ? item.quantity : 0;
}
