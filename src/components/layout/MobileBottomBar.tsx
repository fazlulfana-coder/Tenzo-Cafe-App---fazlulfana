import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Home, 
  UtensilsCrossed, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';

interface MobileBottomBarProps {
  onOpenCart: () => void;
  onOpenAuth: (role: 'admin' | 'customer') => void;
  onOpenMyOrders: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenCart,
}) => {
  const { activeTab, setActiveTab, cartItemCount, settings } = useBakery();
  const cleanWhatsapp = (settings.whatsapp || '94757550333').replace(/[^0-9]/g, '');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#2D241E]/95 backdrop-blur-md border-t border-[#4A3F37] px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'home'
              ? 'text-[#D4A373]'
              : 'text-[#C9C4B9] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        {/* Menu / Products */}
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'products'
              ? 'text-[#D4A373]'
              : 'text-[#C9C4B9] hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>

        {/* Branches */}
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'branches'
              ? 'text-[#D4A373]'
              : 'text-[#C9C4B9] hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Branches</span>
        </button>

        {/* Specials */}
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'offers'
              ? 'text-[#D4A373]'
              : 'text-[#C9C4B9] hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#D4A373]" />
          <span className="text-[10px] font-semibold mt-0.5">Specials</span>
        </button>

        {/* Shopping Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#C9C4B9] hover:text-white transition-colors cursor-pointer min-w-[56px]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D4A373] text-[#2D241E] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Cart</span>
        </button>

        {/* 1-Tap WhatsApp Order */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Tenzo Cafe & Bakers! I want to order freshly baked items.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#25D366] hover:text-[#20bd5a] transition-colors cursor-pointer min-w-[56px]"
          title="Order via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
        </a>

      </div>
    </div>
  );
};
