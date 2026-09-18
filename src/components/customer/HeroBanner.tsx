import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { TenzoLogo } from '../common/TenzoLogo';
import { 
  Sparkles, 
  Clock, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  Flame,
  MessageCircle,
  MapPin
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setSelectedCategory, settings } = useBakery();
  const cleanWhatsapp = (settings.whatsapp || '94757550333').replace(/[^0-9]/g, '');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#2D241E] text-[#FAF7F2] border border-[#3D332D] shadow-sm mx-4 sm:mx-6 lg:mx-8 my-6">
      {/* Warm Ambient Bakery Background with Refined Editorial Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2D241E] via-[#2D241E]/95 to-[#2D241E]/70" />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-18 lg:py-20">
        <div className="max-w-2xl space-y-6">
          
          {/* Brand header with Logo & Badge */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <TenzoLogo size="md" showBadge={false} />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D332D] border border-[#4A3F37] text-[#D4A373] text-[10px] font-bold uppercase tracking-[0.2em]">
                <Flame className="w-3 h-3 text-[#D4A373]" />
                <span>Open Daily 5:30 AM – 10:30 PM</span>
              </div>
              <p className="text-xs sm:text-sm text-[#DED9CF] font-serif-bakery italic tracking-wide mt-1">
                {settings.tagline} • Thihariya, Ellalamulla &amp; Kalleliya
              </p>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="font-serif-bakery text-4xl sm:text-5xl lg:text-6xl font-light italic tracking-tight text-[#FAF7F2] leading-tight">
              Tenzo <span className="text-[#D4A373] font-serif-bakery font-normal">Cafe &amp; Bakers</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#C9C4B9] leading-relaxed max-w-xl font-normal">
            Experience traditional Sri Lankan savory short eats, oven-crisp wood-fired roast paan, 
            maalu buns, kimbula buns, and celebration gateaux. Freshly baked across our 3 branches: 
            <strong> Thihariya</strong>, <strong>Ellalamulla</strong> &amp; <strong>Kalleliya</strong>.
          </p>

          {/* Branches indicator pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#9A8C73] uppercase font-bold tracking-wider">Outlets:</span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#3D332D] border border-[#4A3F37] text-[#FAF7F2]">
              <MapPin className="w-3 h-3 text-[#D4A373]" /> Thihariya (Main)
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#3D332D] border border-[#4A3F37] text-[#FAF7F2]">
              <MapPin className="w-3 h-3 text-[#D4A373]" /> Ellalamulla
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#3D332D] border border-[#4A3F37] text-[#FAF7F2]">
              <MapPin className="w-3 h-3 text-[#D4A373]" /> Kalleliya
            </span>
          </div>

          {/* CTAs: Menu, WhatsApp Order & Specials */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              id="hero-btn-order-now"
              onClick={() => {
                setActiveTab('products');
                setSelectedCategory('all');
              }}
              className="px-6 py-3.5 rounded-xl bg-[#D4A373] hover:bg-[#C59362] text-[#2D241E] font-bold uppercase tracking-widest text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#2D241E]" />
              <span>Explore Bakery Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              id="hero-btn-whatsapp-order"
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Tenzo Cafe & Bakers! I would like to place an order from your bakery.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] font-bold uppercase tracking-widest text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp</span>
            </a>

            <button
              id="hero-btn-offers"
              onClick={() => setActiveTab('offers')}
              className="px-5 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-[#FAF7F2] font-bold uppercase tracking-widest text-xs border border-[#4A3F37] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>Today’s Specials</span>
            </button>
          </div>

          {/* Editorial Trust badges */}
          <div className="pt-6 border-t border-[#3D332D] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3D332D] border border-[#4A3F37] flex items-center justify-center text-[#D4A373] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#FAF7F2] text-xs">Daily Fresh Batches</p>
                <p className="text-[11px] text-[#9A8C73]">Never day-old stock</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3D332D] border border-[#4A3F37] flex items-center justify-center text-[#D4A373] shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#FAF7F2] text-xs">Delivery &amp; Pickup</p>
                <p className="text-[11px] text-[#9A8C73]">Free over Rs. 2,500</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3D332D] border border-[#4A3F37] flex items-center justify-center text-[#D4A373] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#FAF7F2] text-xs">Pure Ceylon Dairy</p>
                <p className="text-[11px] text-[#9A8C73]">100% pure butter &amp; spice</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

