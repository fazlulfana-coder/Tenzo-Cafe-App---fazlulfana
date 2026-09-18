import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { OrderType, OrderCustomerInfo } from '../../types';
import { formatLKR } from '../../utils/formatters';
import { 
  X, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Truck, 
  Store,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
  onOrderSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onOrderCreated,
  onOrderSuccess 
}) => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryFee, 
    cartTotal, 
    createOrder, 
    currentCustomer,
    settings 
  } = useBakery();

  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [name, setName] = useState(currentCustomer?.name || '');
  const [phone, setPhone] = useState(currentCustomer?.phone || '');
  const [address, setAddress] = useState('');
  
  // Default to today
  const todayStr = new Date().toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [preferredTime, setPreferredTime] = useState('Afternoon (3:00 PM - 6:00 PM)');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const effectiveDeliveryFee = orderType === 'Delivery' ? deliveryFee : 0;
  const finalTotal = cartSubtotal + effectiveDeliveryFee;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim()) {
      errs.phone = 'Phone number is required for order updates';
    } else if (cleanPhone.length < 9) {
      errs.phone = 'Please enter a valid Sri Lankan phone number (e.g., 077 123 4567)';
    }

    if (orderType === 'Delivery' && !address.trim()) {
      errs.address = 'Delivery address is required for doorstep dispatch';
    }

    if (!preferredDate) {
      errs.preferredDate = 'Please select a preferred date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const customerInfo: OrderCustomerInfo = {
        name: name.trim(),
        phone: phone.trim(),
        address: orderType === 'Delivery' ? address.trim() : undefined,
        preferredDate,
        preferredTime,
        notes: notes.trim(),
      };

      await createOrder(customerInfo, orderType, notes.trim());
      setIsSubmitting(false);
      onClose();
      if (onOrderSuccess) onOrderSuccess();
      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D241E] text-[#FAF7F2] font-serif-bakery font-normal text-xl flex items-center justify-center shadow-xs">
              T
            </div>
            <div>
              <h2 className="font-serif-bakery text-xl font-normal italic text-[#2D241E]">
                Checkout &amp; Order
              </h2>
              <p className="text-xs text-[#7A6C5D] font-medium">
                Tenzo Cafe and Bakers – Fresh Bakes To Your Door
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#F0ECE4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-6">
          
          {/* Order Type Toggle */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C] mb-2">
              Select Order Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-ordertype-delivery"
                onClick={() => setOrderType('Delivery')}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  orderType === 'Delivery'
                    ? 'border-[#8B5E3C] bg-[#FAF7F2] text-[#2D241E] ring-2 ring-[#8B5E3C]/20 shadow-xs'
                    : 'border-[#E5E1D8] bg-white text-[#7A6C5D] hover:bg-[#FAF7F2]'
                }`}
              >
                <Truck className="w-4 h-4 text-[#8B5E3C]" />
                <span>Home Delivery</span>
              </button>

              <button
                type="button"
                id="btn-ordertype-pickup"
                onClick={() => setOrderType('Pickup')}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  orderType === 'Pickup'
                    ? 'border-[#8B5E3C] bg-[#FAF7F2] text-[#2D241E] ring-2 ring-[#8B5E3C]/20 shadow-xs'
                    : 'border-[#E5E1D8] bg-white text-[#7A6C5D] hover:bg-[#FAF7F2]'
                }`}
              >
                <Store className="w-4 h-4 text-[#8B5E3C]" />
                <span>Store Pickup (Free)</span>
              </button>
            </div>
            {orderType === 'Pickup' && (
              <p className="mt-2 text-xs text-[#7A6C5D] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E5E1D8]">
                📍 <strong>Pickup Counter:</strong> {settings.address} (Ready at your scheduled time).
              </p>
            )}
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C]">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="input-customer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border bg-[#FAF7F2] focus:bg-white focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E5E1D8] focus:border-[#8B5E3C]'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Phone Number (Sri Lanka) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    id="input-customer-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border bg-[#FAF7F2] focus:bg-white focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E5E1D8] focus:border-[#8B5E3C]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Delivery Address (if Delivery) */}
            {orderType === 'Delivery' && (
              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="input-customer-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street, Area, City (e.g. No 12, Galle Road, Colombo 03)"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border bg-[#FAF7F2] focus:bg-white focus:outline-none transition-colors ${
                      errors.address ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E5E1D8] focus:border-[#8B5E3C]'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
              </div>
            )}

            {/* Preferred Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Preferred Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="date"
                    id="input-preferred-date"
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <select
                    id="select-preferred-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="Early Morning (5:30 AM - 8:00 AM)">Early Morning (5:30 AM - 8:00 AM)</option>
                    <option value="Morning (8:00 AM - 11:30 AM)">Morning (8:00 AM - 11:30 AM)</option>
                    <option value="Mid-day & Lunch (11:30 AM - 2:30 PM)">Mid-day & Lunch (11:30 AM - 2:30 PM)</option>
                    <option value="Afternoon Tea (3:00 PM - 6:30 PM)">Afternoon Tea (3:00 PM - 6:30 PM)</option>
                    <option value="Evening & Night (6:30 PM - 9:45 PM)">Evening & Night (6:30 PM - 9:45 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                <textarea
                  id="input-order-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please warm fish patties, add birthday tag on cake, call upon arrival..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

          </div>

          {/* Complete Order Summary */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#E5E1D8] space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C] flex items-center justify-between">
              <span>Order Summary</span>
              <span className="font-mono text-[#2D241E]">{cart.length} items</span>
            </h4>

            {/* Quick list of items */}
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-[#8B5E3C] font-mono w-5">{item.quantity}x</span>
                    <span className="text-[#2D241E] truncate">{item.product.name}</span>
                  </div>
                  <span className="font-semibold text-[#2D241E] font-mono shrink-0">
                    {formatLKR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-2 border-t border-[#E5E1D8] text-xs space-y-1">
              <div className="flex justify-between text-[#7A6C5D]">
                <span>Subtotal</span>
                <span className="font-mono">{formatLKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7A6C5D]">
                <span>Delivery Charge</span>
                <span>
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[10px] tracking-wider">FREE</span>
                  ) : (
                    <span className="font-mono">{formatLKR(effectiveDeliveryFee)}</span>
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E5E1D8] flex justify-between text-sm sm:text-base font-bold text-[#2D241E]">
                <span>Total Due</span>
                <span className="font-mono text-lg text-[#2D241E]">
                  {formatLKR(finalTotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#9A8C73] italic pt-1">
                Payment Method: {orderType === 'Delivery' ? 'Cash on Delivery (COD)' : 'Cash / Card on Pickup'}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-place-order"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 rounded-xl bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2] font-bold text-sm sm:text-base shadow-lg shadow-[#2D241E]/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Placing your order...</span>
              ) : (
                <>
                  <span>Confirm &amp; Place Order – <span className="font-mono">{formatLKR(finalTotal)}</span></span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
