import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { BAKERY_BRANCHES } from '../../data/branchesData';
import { 
  MessageCircle, 
  X, 
  Send, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface WhatsAppChatBoxProps {
  onOpenCart?: () => void;
}

export const WhatsAppChatBox: React.FC<WhatsAppChatBoxProps> = ({ onOpenCart }) => {
  const { settings, cart, cartTotal } = useBakery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(BAKERY_BRANCHES[0].id);
  const [customMessage, setCustomMessage] = useState('');
  const [customerName, setCustomerName] = useState('');

  const selectedBranch = BAKERY_BRANCHES.find(b => b.id === selectedBranchId) || BAKERY_BRANCHES[0];
  const cleanPhone = (selectedBranch.whatsapp || settings.whatsapp || '94757550333').replace(/[^0-9]/g, '');

  const quickPrompts = [
    '🥐 4 Hot Maalu Buns & 2 Milk Teas',
    '🍞 1 Thatty Bread & Seeni Sambal',
    '🐊 5 Kimbula Buns (Crocodile Buns)',
    '🎂 Inquire about 1Kg Birthday Butter Cake',
    '📦 Afternoon Short Eats Platter (4 Pcs)',
  ];

  const handleSend = (textToSend?: string) => {
    let messageBody = textToSend || customMessage.trim();

    // If cart has items and user wants to include cart
    if (cart.length > 0 && (!messageBody || messageBody.includes('cart'))) {
      const itemsList = cart.map(i => `• ${i.product.name} x ${i.quantity} (Rs. ${i.product.price * i.quantity})`).join('\n');
      messageBody = `*New Order from Tenzo Cafe & Bakers Website*\n\n` +
        `*Customer:* ${customerName || 'Customer'}\n` +
        `*Branch:* ${selectedBranch.name}\n\n` +
        `*Items Ordered:*\n${itemsList}\n\n` +
        `*Total: Rs. ${cartTotal.toLocaleString()}*\n\n` +
        (customMessage ? `*Special Request:* ${customMessage}\n\n` : '') +
        `Please confirm availability and pickup / delivery time. Thank you!`;
    } else if (!messageBody) {
      messageBody = `Hello ${selectedBranch.name}! I would like to place an order from Tenzo Cafe & Bakers.`;
      if (customerName) {
        messageBody += ` My name is ${customerName}.`;
      }
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-[#E5E1D8] shadow-md text-xs font-semibold text-[#2D241E] animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span>Order via WhatsApp</span>
          </div>
        )}

        <button
          id="btn-floating-whatsapp"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat & Order via WhatsApp"
          className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#1E3B2B]" />
          ) : (
            <MessageCircle className="w-7 h-7 text-[#1E3B2B] fill-[#1E3B2B]" />
          )}

          {cart.length > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-full bg-[#2D241E] text-white text-[10px] font-bold border-2 border-white shadow-xs">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* WhatsApp Chat Box Window */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-96 max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#2D241E] text-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-[#1E3B2B] flex items-center justify-center font-bold">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#2D241E]" />
              </div>
              <div>
                <h3 className="font-serif-bakery text-base font-bold text-white leading-tight">
                  Tenzo Cafe &amp; Bakers
                </h3>
                <p className="text-[11px] text-[#D4A373] flex items-center gap-1">
                  <span>Fast WhatsApp Ordering</span> • <span className="text-[#25D366]">Online Now</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-[#C9C4B9] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#FAF7F2]">
            
            {/* Branch Selector */}
            <div className="p-3 bg-white rounded-2xl border border-[#E5E1D8] space-y-1.5 shadow-2xs">
              <label className="text-[10px] uppercase font-bold text-[#8B5E3C] tracking-wider block">
                Select Your Nearest Outlet
              </label>
              <div className="relative">
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-xs font-semibold text-[#2D241E] py-2 pl-2.5 pr-8 rounded-xl border border-[#E5E1D8] focus:outline-none focus:border-[#25D366] cursor-pointer appearance-none"
                >
                  {BAKERY_BRANCHES.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.hotline})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#7A6C5D] absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-[#7A6C5D] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#8B5E3C] shrink-0" />
                <span className="truncate">{selectedBranch.address}</span>
              </p>
            </div>

            {/* Cart Preview (if items in cart) */}
            {cart.length > 0 && (
              <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32]">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart Ready: {cart.length} Item{cart.length > 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1B5E20]">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Cart Items to WhatsApp</span>
                </button>
              </div>
            )}

            {/* Customer Name input */}
            <div>
              <label className="text-[11px] font-semibold text-[#2D241E] block mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Nadeesha / Mohamed"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#E5E1D8] focus:outline-none focus:border-[#25D366]"
              />
            </div>

            {/* Quick Sri Lankan Order Prompts */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-[#8B5E3C] tracking-wider block">
                Quick Bakery Requests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomMessage(prompt);
                      handleSend(prompt);
                    }}
                    className="text-[11px] text-left px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#E8F5E9] hover:border-[#C8E6C9] border border-[#E5E1D8] text-[#2D241E] transition-all cursor-pointer shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom note textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#2D241E] block">
                Type Your Order / Inquiry
              </label>
              <textarea
                rows={2}
                placeholder="Type your items, delivery address, or questions..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#E5E1D8] focus:outline-none focus:border-[#25D366] resize-none"
              />
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="p-3 bg-white border-t border-[#E5E1D8]">
            <button
              onClick={() => handleSend()}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1E3B2B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open WhatsApp Chat ({selectedBranch.name.split(' ')[0]})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
