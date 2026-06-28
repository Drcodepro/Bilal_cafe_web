import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { LocationProvider } from './context/LocationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import BottomNav from './components/layout/BottomNav';
import SideMenu from './components/layout/SideMenu';
import Home from './pages/Home';
import Cart from './pages/Cart';
import History from './pages/History';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';
import CartPopupBar from './components/cart/CartPopupBar';


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <LocationProvider>
        <CartProvider>
          <FavouritesProvider>
            <BrowserRouter>
              <div className="app-layout">
                <AnimatedRoutes />
                <CartPopupBar />
                <BottomNav isMenuOpen={isMenuOpen} onMenuToggle={() => { console.log("onMenuToggle clicked! Old state:", isMenuOpen); setIsMenuOpen(!isMenuOpen); }} />
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
              </div>
            </BrowserRouter>
          </FavouritesProvider>
        </CartProvider>
      </LocationProvider>
    </ErrorBoundary>
  );
}

