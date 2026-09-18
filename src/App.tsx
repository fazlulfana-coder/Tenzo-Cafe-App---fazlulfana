import React, { useState } from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryFilterBar } from './components/customer/CategoryFilterBar';
import { ProductGrid } from './components/customer/ProductGrid';
import { SpecialOffers } from './components/customer/SpecialOffers';
import { ContactSection } from './components/customer/ContactSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderConfirmationModal } from './components/customer/OrderConfirmationModal';
import { MyOrdersModal } from './components/customer/MyOrdersModal';
import { AuthModal } from './components/customer/AuthModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { BranchesSection } from './components/customer/BranchesSection';
import { WhatsAppChatBox } from './components/customer/WhatsAppChatBox';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';

import { Product } from './types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const BakeryAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdminLoggedIn, 
    adminTab,
    isCartOpen, 
    setIsCartOpen,
    categories,
    setSelectedCategory
  } = useBakery();

  // Modal visibility states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'admin' | 'customer'>('admin');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const handleOpenAuth = (tab: 'admin' | 'customer' = 'admin') => {
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    setIsConfirmationOpen(true);
  };

  // If in Admin mode and logged in, render the full management console
  if (activeTab === 'admin' && isAdminLoggedIn) {
    return (
      <>
        <OfflineIndicator />
        <AdminLayout>
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'inventory' && <AdminInventory />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'sales' && <AdminReports />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      </>
    );
  }

  // If user navigated to admin tab but is not logged in, prompt login
  if (activeTab === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2D241E] flex flex-col justify-between">
        <Header 
          onOpenAuth={handleOpenAuth} 
          onOpenMyOrders={() => setIsMyOrdersOpen(true)}
          onOpenCart={handleOpenCart}
        />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E1D8] shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E5E1D8] text-[#8B5E3C] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
                Staff Authentication Required
              </h2>
              <p className="text-xs text-[#7A6C5D] leading-relaxed">
                The management dashboard is restricted to Tenzo Cafe and Bakers personnel. Please enter your admin passcode to proceed.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => handleOpenAuth('admin')}
                className="w-full py-3.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Enter Admin Passcode
              </button>
              <button
                onClick={() => setActiveTab('home')}
                className="w-full py-2.5 rounded-xl border border-[#E5E1D8] text-[#7A6C5D] hover:text-[#2D241E] font-medium text-xs transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </main>
        <Footer 
          onOpenAuth={() => handleOpenAuth('admin')}
          onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        />
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultTab={authDefaultTab}
        />
      </div>
    );
  }

  // Customer Facing Storefront
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D241E] flex flex-col justify-between selection:bg-[#D4A373] selection:text-white">
      {/* Network & PWA utilities */}
      <OfflineIndicator />
      <PWAInstallBanner />

      {/* Main Header */}
      <Header 
        onOpenAuth={handleOpenAuth} 
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenCart={handleOpenCart}
      />

      {/* Dynamic Tab Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroBanner />
            <CategoryFilterBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SpecialOffers onOpenDetail={(p) => setDetailProduct(p)} />
            </div>
            <ProductGrid onOpenDetail={(p) => setDetailProduct(p)} />
            <div className="py-6">
              <BranchesSection />
            </div>
            <ContactSection />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="pt-4">
            <CategoryFilterBar />
            <ProductGrid onOpenDetail={(p) => setDetailProduct(p)} />
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="pt-4">
            <BranchesSection />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C] bg-white border border-[#E5E1D8] px-3.5 py-1.5 rounded-full inline-block">
                Artisanal Departments
              </span>
              <h2 className="font-serif-bakery text-3xl sm:text-4xl font-light italic text-[#2D241E] tracking-tight">
                Explore Bakery Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6C5D]">
                Select any department below to view today’s freshly baked batches and custom orders.
              </p>
            </div>

            {/* Category Cards Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('products');
                  }}
                  className="bg-white p-6 rounded-3xl border border-[#E5E1D8] hover:border-[#8B5E3C] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] group-hover:bg-[#2D241E] group-hover:text-white text-[#8B5E3C] border border-[#E5E1D8] flex items-center justify-center font-bold text-lg transition-colors">
                      {cat.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E] group-hover:text-[#8B5E3C] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#7A6C5D] mt-1 line-clamp-2">
                        {cat.description || 'Authentic Sri Lankan recipe, baked fresh every morning.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE4] flex items-center justify-between text-xs font-semibold text-[#8B5E3C]">
                    <span>Browse Department</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <ProductGrid onOpenDetail={(p) => setDetailProduct(p)} />
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <SpecialOffers onOpenDetail={(p) => setDetailProduct(p)} />
            <ProductGrid onOpenDetail={(p) => setDetailProduct(p)} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-4">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        onOpenAuth={() => handleOpenAuth('admin')}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setActiveTab('admin');
          } else {
            handleOpenAuth('admin');
          }
        }}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* Modals and Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={handleProceedToCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onOpenMyOrders={() => {
          setIsConfirmationOpen(false);
          setIsMyOrdersOpen(true);
        }}
      />

      <MyOrdersModal 
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authDefaultTab}
      />

      <ProductDetailModal 
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      {/* Floating Order via WhatsApp Chat Box Widget */}
      {activeTab !== 'admin' && (
        <WhatsAppChatBox onOpenCart={() => setIsCartOpen(true)} />
      )}

      {/* Mobile-Friendly Sticky Navigation Bar */}
      {activeTab !== 'admin' && (
        <MobileBottomBar 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={handleOpenAuth}
          onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <BakeryAppContent />
    </BakeryProvider>
  );
}
