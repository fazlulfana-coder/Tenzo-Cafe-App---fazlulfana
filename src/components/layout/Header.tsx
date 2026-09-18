import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { TenzoLogo } from '../common/TenzoLogo';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  Sparkles,
  Search,
  UserCheck,
  Receipt,
  MessageCircle,
  LayoutGrid
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (tab?: 'admin' | 'customer') => void;
  onOpenMyOrders: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenMyOrders, onOpenCart }) => {
  const { 
    activeTab, 
    setActiveTab, 
    cartItemCount, 
    setIsCartOpen, 
    isAdminLoggedIn,
    orders,
    currentCustomer,
    settings,
    searchQuery,
    setSearchQuery,
    notifications
  } = useBakery();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = (settings.whatsapp || '94757550333').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#E5E1D8] shadow-2xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#2D241E] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#3D332D]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-center sm:text-left">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-[#D4A373] text-[#2D241E] font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.15em] shrink-0">
              3 Outlets Open
            </span>
            <span className="truncate hidden sm:inline text-[#E5E1D8] font-normal">
              Thihariya (Warana Rd) • Ellalamulla • Kalleliya | Oven fresh bakes daily!
            </span>
            <span className="truncate sm:hidden font-medium text-[#E5E1D8]">
              Thihariya • Ellalamulla • Kalleliya
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-5 text-[#9A8C73] text-xs shrink-0 font-medium">
            <span className="flex items-center gap-1.5 text-[#E5E1D8]">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
              {settings.operatingHours.split('(')[0]}
            </span>
            <div className="flex items-center gap-1.5 text-[#E5E1D8]">
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              {settings.contactPerson && (
                <span className="text-[#D4A373] text-[11px] font-semibold">{settings.contactPerson}:</span>
              )}
              <a 
                href={`tel:${settings.hotline}`} 
                className="text-[#E5E1D8] hover:text-[#D4A373] transition-colors font-mono"
              >
                {settings.hotline}
              </a>
              {settings.secondaryPhone && (
                <>
                  <span className="text-[#9A8C73]">/</span>
                  <a 
                    href={`tel:${settings.secondaryPhone}`} 
                    className="text-[#E5E1D8] hover:text-[#D4A373] transition-colors font-mono"
                  >
                    {settings.secondaryPhone}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <TenzoLogo size="sm" showBadge={false} className="group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="font-serif-bakery text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#2D241E] leading-tight">
                {settings.name}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B5E3C] mt-0.5">
                {settings.tagline} • Thihariya, Ellalamulla &amp; Kalleliya
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`transition-all pb-1 ${
                activeTab === 'home' 
                  ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold' 
                  : 'text-[#7A6C5D] hover:text-[#2D241E] border-b-2 border-transparent'
              }`}
            >
              Home
            </button>
            <button
              id="nav-products"
              onClick={() => handleNavClick('products')}
              className={`transition-all pb-1 ${
                activeTab === 'products' 
                  ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold' 
                  : 'text-[#7A6C5D] hover:text-[#2D241E] border-b-2 border-transparent'
              }`}
            >
              Bakery Menu
            </button>
            <button
              id="nav-categories"
              onClick={() => handleNavClick('categories')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                activeTab === 'categories' 
                  ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold' 
                  : 'text-[#7A6C5D] hover:text-[#2D241E] border-b-2 border-transparent'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#8B5E3C]" />
              Categories
            </button>
            <button
              id="nav-offers"
              onClick={() => handleNavClick('offers')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                activeTab === 'offers' 
                  ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold' 
                  : 'text-[#7A6C5D] hover:text-[#2D241E] border-b-2 border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
              Today's Specials
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className={`transition-all pb-1 ${
                activeTab === 'contact' 
                  ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold' 
                  : 'text-[#7A6C5D] hover:text-[#2D241E] border-b-2 border-transparent'
              }`}
            >
              Contact Us
            </button>

            {/* Admin-only Orders: client cannot view this */}
            {isAdminLoggedIn && (
              <button
                id="nav-admin-orders"
                onClick={() => handleNavClick('admin')}
                className={`transition-all pb-1 flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'border-b-2 border-[#2D241E] text-[#2D241E] font-bold'
                    : 'text-[#8B5E3C] hover:text-[#2D241E] border-b-2 border-transparent font-semibold'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>Orders</span>
                {orders.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#2D241E] text-white text-[10px] font-mono font-bold">
                    {orders.length}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Action Buttons: WhatsApp, Search, Cart, Account, Admin Mode Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Direct Order on WhatsApp Button */}
            <a
              id="btn-header-whatsapp"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Tenzo Cafe & Bakers, I would like to place an order from your bakery.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] font-bold text-xs shadow-2xs transition-all hover:scale-105 active:scale-95"
              title="Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-[#1E3B2B]" />
              <span className="hidden xl:inline">Order via WhatsApp</span>
              <span className="xl:hidden">WhatsApp</span>
            </a>

            {/* Quick Search toggle/input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-[#FAF7F2] rounded-full px-3.5 py-1.5 border border-[#E5E1D8]">
                  <Search className="w-4 h-4 text-[#9A8C73] mr-2" />
                  <input
                    type="text"
                    placeholder="Search bun, cake, bread..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== 'products') setActiveTab('products');
                    }}
                    autoFocus
                    className="bg-transparent border-none text-xs focus:outline-none w-32 sm:w-44 text-[#2D241E]"
                  />
                  <button 
                    onClick={() => setShowSearchInput(false)}
                    className="text-[#9A8C73] hover:text-[#2D241E] ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  id="btn-search-toggle"
                  onClick={() => setShowSearchInput(true)}
                  className="p-2.5 text-[#2D241E] hover:bg-[#FAF7F2] rounded-full border border-transparent hover:border-[#E5E1D8] transition-colors cursor-pointer"
                  title="Search Bakery Products"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shopping Cart Button with count badge */}
            <button
              id="btn-cart-toggle"
              onClick={() => {
                if (onOpenCart) onOpenCart();
                setIsCartOpen(true);
              }}
              className="relative p-2.5 bg-white hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E5E1D8] rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#2D241E]" />
              {cartItemCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-[#2D241E] text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Switcher / Authentication button */}
            {activeTab === 'admin' ? (
              <button
                id="btn-switch-customer"
                onClick={() => setActiveTab('home')}
                className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#E5E1D8] group cursor-pointer"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-[#8B5E3C] tracking-wider">Storefront</span>
                  <span className="text-xs font-semibold text-[#2D241E] group-hover:underline">Customer View</span>
                </div>
                <div className="w-9 h-9 bg-[#2D241E] text-white rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                </div>
              </button>
            ) : (
              <button
                id="btn-switch-admin"
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setActiveTab('admin');
                  } else {
                    onOpenAuth('admin');
                  }
                }}
                className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#E5E1D8] group cursor-pointer text-left"
                title={isAdminLoggedIn ? "Open Admin Portal" : "Admin Sign In"}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-[#8B5E3C] tracking-wider">Admin</span>
                  <span className="text-xs font-semibold text-[#2D241E] group-hover:underline">
                    {isAdminLoggedIn ? 'Dashboard' : 'Sign In'}
                  </span>
                </div>
                <div className="w-9 h-9 bg-[#E5E1D8] group-hover:bg-[#DED9CF] rounded-full flex items-center justify-center transition-colors relative">
                  <ShieldCheck className="w-4 h-4 text-[#2D241E]" />
                  {isAdminLoggedIn && unreadNotifs > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FF4B2B] border-2 border-white"></span>
                  )}
                </div>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2D241E] hover:bg-[#FAF7F2] rounded-lg border border-[#E5E1D8] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#2D241E]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E1D8] bg-[#FCFAF7] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {/* Quick contact and WhatsApp bar */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E5E1D8]">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Tenzo Cafe & Bakers, I would like to order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-[#1E3B2B] text-xs font-bold shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Order</span>
            </a>
            <a
              href={`tel:${settings.hotline}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2D241E] text-white text-xs font-bold"
            >
              <Phone className="w-4 h-4 text-[#D4A373]" />
              <span>Call {settings.hotline}</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-left rounded-xl transition-colors ${activeTab === 'home' ? 'bg-[#2D241E] text-white font-semibold' : 'bg-white border border-[#E5E1D8] text-[#2D241E]'}`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`p-2.5 text-left rounded-xl transition-colors ${activeTab === 'products' ? 'bg-[#2D241E] text-white font-semibold' : 'bg-white border border-[#E5E1D8] text-[#2D241E]'}`}
            >
              🥐 Bakery Menu
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`p-2.5 text-left rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-[#2D241E] text-white font-semibold' : 'bg-white border border-[#E5E1D8] text-[#2D241E]'}`}
            >
              🏷️ Categories
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className={`p-2.5 text-left rounded-xl transition-colors ${activeTab === 'offers' ? 'bg-[#2D241E] text-white font-semibold' : 'bg-white border border-[#E5E1D8] text-[#2D241E]'}`}
            >
              ✨ Today's Specials
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`p-2.5 text-left rounded-xl transition-colors ${activeTab === 'contact' ? 'bg-[#2D241E] text-white font-semibold' : 'bg-white border border-[#E5E1D8] text-[#2D241E]'}`}
            >
              📞 Contact Us
            </button>

            {/* Admin-only Orders link in mobile menu */}
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('admin');
                }}
                className="p-2.5 text-left rounded-xl bg-[#FAF7F2] border border-[#D4A373] text-[#2D241E] font-semibold flex items-center justify-between col-span-2 sm:col-span-1"
              >
                <span>🧾 Orders ({orders.length})</span>
                <span className="text-[10px] bg-[#2D241E] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  Admin
                </span>
              </button>
            )}
          </div>
          <div className="pt-2 border-t border-[#E5E1D8]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (activeTab === 'admin') {
                  setActiveTab('home');
                } else if (isAdminLoggedIn) {
                  setActiveTab('admin');
                } else {
                  onOpenAuth('admin');
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#2D241E] text-white cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
              {activeTab === 'admin' ? 'Switch to Customer View' : (isAdminLoggedIn ? 'Open Bakery Admin' : 'Admin Login')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
