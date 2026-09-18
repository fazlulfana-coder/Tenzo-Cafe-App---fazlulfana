import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { TenzoLogo } from '../common/TenzoLogo';
import { BAKERY_BRANCHES } from '../../data/branchesData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onOpenAuth?: () => void;
  onOpenAdmin?: () => void;
  onOpenMyOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenAdmin, onOpenMyOrders }) => {
  const { settings, setActiveTab, setSelectedCategory, categories } = useBakery();

  const handleAdminClick = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  const primaryWhatsapp = (settings.whatsapp || '94757550333').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#2D241E] text-[#DED9CF] border-t border-[#3D332D] mt-16 pb-20 sm:pb-0">
      {/* Brand highlight section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Col 1: About Tenzo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TenzoLogo size="sm" showBadge={false} />
              <div>
                <h3 className="font-serif-bakery text-xl font-bold text-[#FAF7F2] tracking-tight">
                  {settings.name}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4A373] mt-0.5">
                  {settings.tagline}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-[#C9C4B9] leading-relaxed font-normal">
              Freshly baked Sri Lankan savory buns, maalu paan, kimbula buns, wood-fired hearth breads, 
              and pure butter cakes across our 3 branches: <strong>Thihariya</strong>, <strong>Ellalamulla</strong>, and <strong>Kalleliya</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={`https://wa.me/${primaryWhatsapp}?text=${encodeURIComponent('Hello Tenzo Cafe & Bakers, I would like to place an order.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-[#1E3B2B]" />
                WhatsApp Us
              </a>
              <a
                href={`tel:${settings.hotline}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3D332D] hover:bg-[#4A3F37] text-white text-xs font-bold uppercase tracking-wider border border-[#4A3F37] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                Call Hotline
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-[0.2em]">
              Bakery Menu &amp; Outlets
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C9C4B9]">
              <li>
                <button 
                  onClick={() => { setActiveTab('products'); setSelectedCategory('all'); }}
                  className="hover:text-[#D4A373] transition-colors cursor-pointer"
                >
                  All Bakery Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('offers')}
                  className="text-[#D4A373] hover:underline font-medium cursor-pointer"
                >
                  Today's Specials ✨
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('branches')}
                  className="text-[#FAF7F2] hover:text-[#D4A373] font-medium cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                  Our 3 Branches
                </button>
              </li>
              {categories.slice(0, 4).map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => { setActiveTab('products'); setSelectedCategory(c.id); }}
                    className="hover:text-[#D4A373] transition-colors cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              {onOpenMyOrders && (
                <li>
                  <button 
                    onClick={onOpenMyOrders}
                    className="hover:text-[#D4A373] transition-colors cursor-pointer"
                  >
                    Track Orders
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Our 3 Branches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-[0.2em]">
              Our 3 Branches
            </h4>
            <div className="space-y-3 text-xs text-[#C9C4B9]">
              {BAKERY_BRANCHES.map(b => (
                <div key={b.id} className="p-2.5 rounded-xl bg-[#3D332D]/70 border border-[#4A3F37]">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-serif-bakery">{b.name}</strong>
                    {b.isMain && <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#D4A373] text-[#2D241E] font-bold">Main</span>}
                  </div>
                  <p className="text-[11px] text-[#C9C4B9] mt-0.5 leading-tight">{b.address}</p>
                  <div className="flex items-center gap-3 mt-1.5 font-mono text-[11px]">
                    <a href={`tel:${b.hotline}`} className="text-[#D4A373] hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {b.hotline}
                    </a>
                    <a 
                      href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.name}, I want to place an order.`)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#25D366] hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Service Standards & Admin */}
          <div className="space-y-3 bg-[#3D332D] p-5 rounded-3xl border border-[#4A3F37]">
            <h4 className="text-xs font-bold text-[#FAF7F2] uppercase tracking-[0.15em]">
              Operating Hours &amp; Admin
            </h4>
            <div className="text-xs text-[#C9C4B9] space-y-1.5">
              <div className="flex items-center gap-1.5 text-white">
                <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Daily 5:30 AM – 10:30 PM</span>
              </div>
              <p className="text-[11px] text-[#A69C8E]">
                Thihariya, Ellalamulla &amp; Kalleliya outlets.
              </p>
            </div>

            <div className="pt-2 text-xs text-[#D4A373] flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
              Accepting Online &amp; WhatsApp Orders
            </div>
            
            <div className="pt-3 border-t border-[#4A3F37] flex flex-col gap-2">
              <button
                onClick={handleAdminClick}
                className="w-full py-2.5 px-3 rounded-xl bg-[#2D241E] hover:bg-[#1E1814] text-xs text-[#FAF7F2] hover:text-[#D4A373] flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#4A3F37]"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                <span>Staff &amp; Admin Management</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-8 border-t border-[#3D332D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A8C73]">
          <p>© {new Date().getFullYear()} Tenzo Cafe &amp; Bakers. All Rights Reserved. Thihariya • Ellalamulla • Kalleliya, Sri Lanka.</p>
          <div className="flex items-center gap-1 text-[#C9C4B9]">
            <span>Freshly Baked Daily With Ceylon Spices</span>
            <Heart className="w-3.5 h-3.5 text-[#D4A373] fill-[#D4A373] inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
