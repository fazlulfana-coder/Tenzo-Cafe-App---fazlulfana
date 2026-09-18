import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  UtensilsCrossed, 
  Flame, 
  MapPin, 
  MessageCircle, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

interface MobileBottomBarProps {
  onOpenCart: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenCart }) => {
  const { cart, activeTab, setActiveTab, setSelectedCategory } = useBakery();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    setActiveTab('products');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E1D8] px-2 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="grid grid-cols-5 items-center justify-items-center gap-1">
        
        {/* Menu */}
        <button
          onClick={() => {
            setActiveTab('products');
            setSelectedCategory('all');
            scrollToSection('products-section');
          }}
          className={`flex flex-col items-center justify-center w-full py-1.5 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'products' ? 'text-[#8B5E3C] font-bold' : 'text-[#7A6C5D]'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>

        {/* Specials */}
        <button
          onClick={() => scrollToSection('special-offers')}
          className="flex flex-col items-center justify-center w-full py-1.5 text-[10px] font-medium text-[#7A6C5D] hover:text-[#8B5E3C] transition-colors cursor-pointer"
        >
          <Flame className="w-5 h-5 mb-0.5 text-amber-600" />
          <span>Specials</span>
        </button>

        {/* WhatsApp Fast Order */}
        <a
          href="https://wa.me/94757550333?text=Hello%20Tenzo%20Cafe%20%26%20Bakers!%20I%20would%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center w-full -mt-3.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border-2 border-white">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <span className="text-[9px] font-bold text-[#25D366] mt-0.5 uppercase tracking-tighter">
            WhatsApp
          </span>
        </a>

        {/* Branches */}
        <button
          onClick={() => scrollToSection('branches-section')}
          className="flex flex-col items-center justify-center w-full py-1.5 text-[10px] font-medium text-[#7A6C5D] hover:text-[#8B5E3C] transition-colors cursor-pointer"
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Branches</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center w-full py-1.5 text-[10px] font-medium text-[#7A6C5D] hover:text-[#8B5E3C] relative transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#8B5E3C] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

      </div>
    </nav>
  );
};
