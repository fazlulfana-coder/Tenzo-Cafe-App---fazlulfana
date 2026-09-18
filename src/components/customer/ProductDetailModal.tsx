import React, { useState } from 'react';
import { Product } from '../../types';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR } from '../../utils/formatters';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Leaf, 
  Check, 
  AlertCircle,
  Plus, 
  Minus,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, cart, updateCartQuantity } = useBakery();
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0 || !product.isAvailable;
  const cartItem = cart.find(c => c.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    setErrorMessage(null);
    const result = addToCart(product, selectedQty);
    if (result.success) {
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        onClose();
      }, 900);
    } else if (result.message) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#2D241E]/70 hover:bg-[#2D241E] text-white transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto h-64 md:h-full bg-[#FAF7F2]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D241E] text-[#FAF7F2] shadow-xs">
                {product.categoryName}
              </span>
              {product.isVegetarian && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800 text-white flex items-center gap-1 shadow-xs">
                  <Leaf className="w-3.5 h-3.5" />
                  Vegetarian
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C] bg-[#FAF7F2] border border-[#E5E1D8] px-2.5 py-1 rounded-md">
                  Fresh Batch Daily
                </span>
                {product.isSpecialOffer && (
                  <span className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Special Deal
                  </span>
                )}
              </div>

              <h2 className="font-serif-bakery text-2xl sm:text-3xl font-normal italic text-[#2D241E] leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-[#2D241E]">
                  {formatLKR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#9A8C73] line-through font-mono">
                    {formatLKR(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-[#7A6C5D] font-medium font-mono">
                  / {product.unit}
                </span>
              </div>

              <p className="text-sm text-[#7A6C5D] leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Stock info */}
              <div className="pt-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Currently Out of Stock. Fresh batch coming soon!
                  </span>
                ) : (
                  <span className="text-[#8B5E3C] font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold">{product.stock}</span> {product.unit.toLowerCase()}(s) in stock – Ready for dispatch
                  </span>
                )}
              </div>

              {inCartQty > 0 && (
                <p className="text-xs text-[#8B5E3C] bg-[#FAF7F2] border border-[#E5E1D8] p-2.5 rounded-xl font-medium">
                  You already have <strong className="font-mono text-[#2D241E]">{inCartQty}</strong> in your cart.
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="space-y-3 pt-4 border-t border-[#F0ECE4]">
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">Select Quantity:</span>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E5E1D8] p-1 rounded-xl">
                    <button
                      onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                      disabled={selectedQty <= 1}
                      className="w-8 h-8 rounded-lg bg-white text-[#2D241E] border border-[#E5E1D8] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-mono font-bold text-[#2D241E]">
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => setSelectedQty(Math.min(product.stock, selectedQty + 1))}
                      disabled={selectedQty >= product.stock}
                      className="w-8 h-8 rounded-lg bg-white text-[#2D241E] border border-[#E5E1D8] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
              )}

              <div className="flex items-center gap-3">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5E1D8] text-[#9A8C73] font-bold text-sm cursor-not-allowed text-center"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                      addedSuccess
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add {selectedQty} to Cart – <span className="font-mono">{formatLKR(product.price * selectedQty)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
