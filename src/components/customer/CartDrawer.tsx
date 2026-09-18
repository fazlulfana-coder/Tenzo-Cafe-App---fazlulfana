import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR } from '../../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCheckout?: () => void;
  onProceedCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onCheckout, 
  onProceedCheckout 
}) => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    deliveryFee, 
    cartTotal,
    settings,
    clearCart
  } = useBakery();

  const open = isOpen !== undefined ? isOpen : isCartOpen;

  const handleClose = () => {
    if (onClose) onClose();
    setIsCartOpen(false);
  };

  const handleProceed = () => {
    handleClose();
    if (onCheckout) onCheckout();
    if (onProceedCheckout) onProceedCheckout();
  };

  if (!open) return null;

  const threshold = settings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, threshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2D241E]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E1D8] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E1D8] flex items-center justify-between bg-[#FCFAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A373] text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
                Your Bakery Cart
              </h2>
              <p className="text-[11px] uppercase tracking-wider text-[#7A6C5D] font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in basket
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-wider font-bold text-[#9A8C73] hover:text-[#C0392B] transition-colors px-2 py-1"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        {cart.length > 0 && (
          <div className="bg-[#FAF7F2] px-4 py-3 border-b border-[#E5E1D8] text-xs text-[#2D241E]">
            {remainingForFreeDelivery > 0 ? (
              <div>
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-[#2D241E]">
                    <Truck className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    <span>Add <strong className="font-mono font-bold text-[#8B5E3C]">{formatLKR(remainingForFreeDelivery)}</strong> for FREE delivery</span>
                  </span>
                  <span className="text-[#9A8C73] font-mono text-[11px]">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full bg-[#E5E1D8] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-[#D4A373] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>You unlocked FREE delivery in Colombo! 🎉</span>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#F0ECE4]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E5E1D8] text-[#8B5E3C] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 opacity-70" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#7A6C5D] max-w-xs leading-relaxed">
                  Discover our freshly baked buns, pastries, breads, and cakes made with pure butter and Ceylon love.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white font-bold uppercase tracking-widest text-xs shadow-2xs transition-colors"
              >
                Browse Bakery Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="pt-3.5 first:pt-0 flex gap-3.5 items-center"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E5E1D8] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#2D241E] truncate font-serif-bakery">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#7A6C5D] font-mono">
                      {formatLKR(item.product.price)} / {item.product.unit}
                    </p>

                    {/* Stepper */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5E1D8] rounded-xl p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-[#E5E1D8] text-[#2D241E] flex items-center justify-center hover:bg-[#FAF7F2] text-xs shadow-2xs cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-[#2D241E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.product.stock) {
                              updateCartQuantity(item.product.id, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 rounded-lg bg-[#2D241E] text-white flex items-center justify-center hover:bg-[#3D332D] text-xs shadow-2xs disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-[#9A8C73] hover:text-[#C0392B] transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total for item */}
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#2D241E] text-sm font-mono">
                      {formatLKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E5E1D8] bg-[#FCFAF7] space-y-3">
            <div className="space-y-1.5 text-xs text-[#7A6C5D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D241E] font-mono">{formatLKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#2E7D32] font-bold">FREE</span>
                  ) : (
                    <span className="font-mono">{formatLKR(deliveryFee)}</span>
                  )}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#E5E1D8] flex justify-between text-base font-bold text-[#2D241E]">
                <span className="font-serif-bakery">Total Amount</span>
                <span className="font-mono text-lg text-[#2D241E]">{formatLKR(cartTotal)}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                id="btn-proceed-checkout"
                onClick={handleProceed}
                className="w-full py-4 px-4 rounded-xl bg-[#D4A373] hover:bg-[#C59362] text-[#2D241E] font-bold uppercase tracking-widest text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider text-[#7A6C5D] hover:text-[#2D241E] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
