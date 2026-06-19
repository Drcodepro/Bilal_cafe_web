import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Cart from './pages/Cart';
import History from './pages/History';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';

/**
 * Page transition wrapper — smooth slide animations between routes.
 */
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.3,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <FavouritesProvider>
          <BrowserRouter>
            <div className="app-layout">
              <AnimatedRoutes />
              <BottomNav />
            </div>
          </BrowserRouter>
        </FavouritesProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}
