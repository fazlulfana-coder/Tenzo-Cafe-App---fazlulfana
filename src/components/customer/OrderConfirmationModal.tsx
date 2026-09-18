import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR, formatDateTime, generateWhatsAppMessage } from '../../utils/formatters';
import { 
  CheckCircle2, 
  X, 
  Printer, 
  MessageCircle, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  Store,
  Truck,
  ArrowRight
} from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyOrders: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenMyOrders
}) => {
  const { recentOrder, settings, setActiveTab } = useBakery();

  useEffect(() => {
    if (isOpen && recentOrder) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#b45309', '#10b981']
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, recentOrder]);

  if (!isOpen || !recentOrder) return null;

  const rawWhatsapp = settings?.whatsapp || '94757550333';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const bakeryName = settings?.name || 'Tenzo Cafe & Bakers';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${generateWhatsAppMessage(recentOrder, bakeryName)}`;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in this frame:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
        
        {/* Printable Receipt Wrapper */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6">
          
          {/* Header & Success Icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#8B5E3C] font-bold">
                Order Received
              </span>
              <h2 className="font-serif-bakery text-2xl sm:text-3xl font-normal italic text-[#2D241E]">
                Your order has been successfully placed.
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6C5D]">
                Thank you for choosing Tenzo Cafe and Bakers! We are already preparing your oven bakes.
              </p>
            </div>

            {/* Prominent Order Number Card */}
            <div className="inline-block bg-[#FAF7F2] border border-[#E5E1D8] px-5 py-2.5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] block">
                Order Number
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D241E] tracking-tight">
                {recentOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Quick Details Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#E5E1D8] space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#E5E1D8] pb-2">
              <span className="text-[#7A6C5D]">Placed on</span>
              <span className="font-mono font-medium text-[#2D241E]">{formatDateTime(recentOrder.createdAt)}</span>
            </div>
            
            <div className="flex justify-between border-b border-[#E5E1D8] pb-2">
              <span className="text-[#7A6C5D]">Customer</span>
              <span className="font-medium text-[#2D241E]">{recentOrder.customer.name} (<span className="font-mono">{recentOrder.customer.phone}</span>)</span>
            </div>

            <div className="flex justify-between border-b border-[#E5E1D8] pb-2">
              <span className="text-[#7A6C5D]">Fulfillment</span>
              <span className="font-medium text-[#2D241E] flex items-center gap-1">
                {recentOrder.orderType === 'Delivery' ? (
                  <>
                    <Truck className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    Doorstep Delivery ({recentOrder.customer.address})
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    Pickup at Bakery Counter
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7A6C5D]">Preferred Slot</span>
              <span className="font-mono font-medium text-[#2D241E]">
                {recentOrder.customer.preferredDate} – {recentOrder.customer.preferredTime}
              </span>
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#8B5E3C] uppercase tracking-[0.15em] text-[11px]">
              Ordered Products
            </h4>
            <div className="divide-y divide-[#F0ECE4] border-t border-b border-[#F0ECE4] py-1">
              {recentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#8B5E3C] font-mono">{item.quantity}x</span>
                    <span className="text-[#2D241E]">{item.productName}</span>
                    <span className="text-[#9A8C73] font-mono text-[10px]">({formatLKR(item.price)})</span>
                  </div>
                  <span className="font-mono font-semibold text-[#2D241E]">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="pt-2 flex justify-between items-baseline text-sm">
              <span className="font-bold text-[#2D241E]">Total Amount:</span>
              <span className="font-mono text-xl font-bold text-[#2D241E]">
                {formatLKR(recentOrder.total)}
              </span>
            </div>
            <p className="text-[11px] text-[#9A8C73]">
              Payment: {recentOrder.paymentMethod} ({recentOrder.paymentStatus})
            </p>
          </div>

          {/* Non-print action buttons */}
          <div className="no-print pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send to Bakery WhatsApp</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE4] border border-[#E5E1D8] text-[#2D241E] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#7A6C5D]" />
                <span>Print Order Slip</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenMyOrders();
                }}
                className="flex-1 py-3 rounded-xl bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2] font-semibold text-xs transition-colors cursor-pointer"
              >
                Track in My Orders
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('home');
                }}
                className="py-3 px-4 rounded-xl border border-[#E5E1D8] text-[#7A6C5D] hover:bg-[#FAF7F2] font-semibold text-xs transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
