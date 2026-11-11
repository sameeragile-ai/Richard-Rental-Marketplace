/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

// Context
import { AppProvider } from './context/AppContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BottomTabBar } from './components/common/BottomTabBar';
import { CartDrawer } from './components/common/CartDrawer';
import { RoleSwitcherPill } from './components/common/RoleSwitcherPill';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { BrandedLoader } from './components/common/BrandedLoader';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { TripsPage } from './pages/TripsPage';
import { HostPage } from './pages/HostPage';
import { AdminPage } from './pages/AdminPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes({ onOpenCart }: { onOpenCart: () => void }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCheckoutRoute = location.pathname === '/checkout';

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <OfflineBanner />

      {/* Navbar rendered on all routes except admin sidebar view */}
      {!isAdminRoute && <Navbar onOpenCart={onOpenCart} />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/host" element={<HostPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer rendered on non-admin / non-checkout routes */}
      {!isAdminRoute && !isCheckoutRoute && <Footer />}

      {/* Native Mobile Bottom Tab Bar */}
      <BottomTabBar onOpenCart={onOpenCart} />

      {/* Floating Demo Role Switcher Pill */}
      <RoleSwitcherPill />

      {/* Notification Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AppProvider>
      <BrandedLoader />
      <BrowserRouter>
        <AnimatedRoutes onOpenCart={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </BrowserRouter>
    </AppProvider>
  );
}
