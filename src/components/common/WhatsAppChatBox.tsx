import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { BAKERY_BRANCHES } from '../../data/branchesData';
import { formatLKR } from '../../utils/formatters';
import { 
  MessageCircle, 
  X, 
  Send, 
  ShoppingBag, 
  Store, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Phone,
  ChevronDown
} from 'lucide-react';

export const WhatsAppChatBox: React.FC = () => {
  const { cart, cartTotal, settings } = useBakery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('branch-thihariya');
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [customerNote, setCustomerNote] = useState('');

  const selectedBranch = BAKERY_BRANCHES.find(b => b.id === selectedBranchId) || BAKERY_BRANCHES[0];

  const handlePresetSelect = (presetText: string) => {
    setCustomerNote(presetText);
  };

  const handleSendToWhatsApp = (overrideMsg?: string) => {
    const branchName = selectedBranch.name;
    const phone = selectedBranch.whatsapp || settings.whatsapp || '94757550333';

    let messageText = '';

    if (overrideMsg) {
      messageText = overrideMsg;
    } else {
      // Build structured order message
      const greeting = `*New Order via WhatsApp - Tenzo Cafe & Bakers*\n`;
      const branchInfo = `📍 *Selected Branch:* ${branchName}\n🚚 *Order Type:* ${orderType}\n`;

      let itemsPart = '';
      if (cart.length > 0) {
        itemsPart = `\n🛒 *Items from Cart:*\n` + cart.map(i => `• ${i.product.name} x ${i.quantity} (${i.product.unit}) - ${formatLKR(i.product.price * i.quantity)}`).join('\n') +
          `\n*Estimated Total:* ${formatLKR(cartTotal)}\n`;
      }

      const notePart = customerNote.trim() 
        ? `\n📝 *Order Details / Items:*\n${customerNote.trim()}\n`
        : '';

      const footer = `\n_Please confirm availability and preparation time. Thank you!_`;

      messageText = `${greeting}${branchInfo}${itemsPart}${notePart}${footer}`;
    }

    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="btn-whatsapp-chat-trigger"
          aria-label="Order via WhatsApp"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>

          <MessageCircle className="w-5 h-5 fill-current" />
          
          <span className="font-bold text-xs sm:text-sm tracking-wide hidden xs:inline whitespace-nowrap">
            Order via WhatsApp
          </span>

          {/* Cart items badge attached */}
          {cart.length > 0 && (
            <span className="bg-[#2D241E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </button>
      </div>

      {/* Expanded Interactive Chat / Ordering Box */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-h-[85vh] bg-white rounded-3xl border border-[#E5E1D8] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-[#2D241E] text-white p-4.5 sm:p-5 flex items-start justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white p-1 shrink-0 overflow-hidden shadow-sm">
                <img 
                  src="/images/tenzo-logo.svg" 
                  alt="Tenzo Cafe & Bakers" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-bakery text-base sm:text-lg font-bold text-white">
                    Tenzo Cafe &amp; Bakers
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#D4A373]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Online • Order via WhatsApp</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9A8C73] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer relative z-10"
              title="Close chat box"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Subtle background decoration */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[58vh] bg-[#FAF7F2] text-xs">
            
            {/* Quick Greeting message card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E1D8] shadow-2xs space-y-1">
              <p className="text-[#2D241E] font-medium leading-relaxed">
                👋 Ayubowan! How can we bake for you today? Choose your nearest outlet, select items, and message us directly on WhatsApp for instant confirmation.
              </p>
              <span className="text-[10px] text-[#9A8C73] block text-right font-mono">
                Thihariya • Ellalamulla • Kalleliya
              </span>
            </div>

            {/* Branch Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                <span>Select Nearest Branch</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BAKERY_BRANCHES.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer border ${
                      selectedBranchId === b.id
                        ? 'bg-[#8B5E3C] text-white border-[#7A5234] shadow-2xs'
                        : 'bg-white text-[#7A6C5D] border-[#E5E1D8] hover:border-[#8B5E3C]'
                    }`}
                  >
                    <span className="block truncate">{b.city}</span>
                    <span className="text-[9px] font-normal opacity-80 block truncate">
                      {b.isMain ? 'Main Cafe' : 'Outlet'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Type Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderType('Pickup')}
                className={`py-2 rounded-xl font-bold text-xs transition-colors border cursor-pointer ${
                  orderType === 'Pickup'
                    ? 'bg-[#2D241E] text-white border-[#2D241E]'
                    : 'bg-white text-[#7A6C5D] border-[#E5E1D8]'
                }`}
              >
                Counter Pickup
              </button>
              <button
                onClick={() => setOrderType('Delivery')}
                className={`py-2 rounded-xl font-bold text-xs transition-colors border cursor-pointer ${
                  orderType === 'Delivery'
                    ? 'bg-[#2D241E] text-white border-[#2D241E]'
                    : 'bg-white text-[#7A6C5D] border-[#E5E1D8]'
                }`}
              >
                Doorstep Delivery
              </button>
            </div>

            {/* If Cart has items, prompt to send current cart */}
            {cart.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900 font-bold flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    Cart Ready ({cart.length} items)
                  </span>
                  <span className="font-mono font-bold text-emerald-800 text-xs">
                    {formatLKR(cartTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Send your full cart with quantities directly to our kitchen staff.
                </p>
                <button
                  onClick={() => handleSendToWhatsApp()}
                  className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Cart via WhatsApp</span>
                </button>
              </div>
            )}

            {/* Quick Order Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A8C73]">
                Quick Order Suggestions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Thatty Bread + 2 Maalu Buns',
                  '5 Kimbula Buns Pack',
                  'Chicken Roll + Fish Bun Combo',
                  '1kg Traditional Butter Cake',
                  "What are today's fresh oven bakes?",
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className="text-[11px] bg-white hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E5E1D8] hover:border-[#8B5E3C] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes / Items input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C]">
                Type Your Order or Question
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. 2 Thatty Breads, 3 Maalu Buns, 1 Butter Cake slice for pickup at 5:00 PM..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white focus:outline-none focus:border-[#8B5E3C] text-xs resize-none"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-[#E5E1D8] flex items-center gap-2">
            <button
              onClick={() => handleSendToWhatsApp()}
              id="btn-send-whatsapp-order"
              className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send via WhatsApp</span>
            </button>

            <a
              href={`tel:${selectedBranch.hotline.replace(/\s+/g, '')}`}
              title={`Call ${selectedBranch.name}`}
              className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#E5E1D8] text-[#2D241E] border border-[#E5E1D8] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

        </div>
      )}
    </>
  );
};
