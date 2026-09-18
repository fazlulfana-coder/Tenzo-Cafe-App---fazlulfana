import React, { useState } from 'react';
import { Product } from '../../types';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR } from '../../utils/formatters';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  AlertCircle,
  Leaf
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelectProduct,
  onOpenDetail
}) => {
  const { cart, addToCart, updateCartQuantity } = useBakery();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = product.stock <= 0 || !product.isAvailable;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMsg(null);
    const result = addToCart(product, 1);
    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } else if (result.message) {
      setErrorMsg(result.message);
      setTimeout(() => setErrorMsg(null), 2500);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMsg(null);
    if (quantityInCart < product.stock) {
      updateCartQuantity(product.id, quantityInCart + 1);
    } else {
      setErrorMsg(`Max ${product.stock} available`);
      setTimeout(() => setErrorMsg(null), 2000);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMsg(null);
    updateCartQuantity(product.id, quantityInCart - 1);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => (onOpenDetail || onSelectProduct)?.(product)}
      className="group relative flex flex-col bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs hover:shadow-md hover:border-[#D4A373] transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isSpecialOffer && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4A373] text-[#2D241E] shadow-2xs">
              <Sparkles className="w-3 h-3" />
              Special Offer
            </span>
          )}
          {product.isFeatured && !product.isSpecialOffer && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2D241E] text-white shadow-2xs">
              Chef’s Pick
            </span>
          )}
        </div>

        {/* Top Right: Dietary / Category badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {product.isVegetarian && (
            <span 
              className="w-6 h-6 rounded-full bg-white text-[#2E7D32] border border-[#E5E1D8] shadow-2xs flex items-center justify-center" 
              title="Vegetarian / Pure Veg"
            >
              <Leaf className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#2D241E] border border-[#E5E1D8] backdrop-blur-xs">
            {product.categoryName}
          </span>
        </div>

        {/* Out of Stock overlay banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#2D241E]/70 backdrop-blur-[1px] flex items-center justify-center p-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#C0392B] text-white font-bold text-xs uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Title & Unit */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif-bakery font-bold text-[#2D241E] text-lg sm:text-xl leading-snug group-hover:text-[#8B5E3C] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#7A6C5D] line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Stock status hint */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          {isOutOfStock ? (
            <span className="text-[#C0392B] font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Unavailable
            </span>
          ) : isLowStock ? (
            <span className="text-[#8B5E3C] font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Only {product.stock} left!
            </span>
          ) : (
            <span className="text-[#3D6E42] font-medium">
              Available ({product.stock} {product.unit.toLowerCase()}s)
            </span>
          )}

          <span className="text-[#9A8C73] font-medium text-[10px] uppercase tracking-wider">
            Per {product.unit}
          </span>
        </div>

        {/* Price & Action Section */}
        <div className="mt-3 pt-3 border-t border-[#F0ECE4] flex items-center justify-between gap-2">
          
          {/* Price display in LKR */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-[#2D241E] font-mono tracking-tight">
                {formatLKR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#9A8C73] line-through font-mono">
                  {formatLKR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#9A8C73] uppercase tracking-widest font-semibold">
              LKR
            </span>
          </div>

          {/* Cart Control */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] text-[#9A8C73] text-xs font-semibold cursor-not-allowed border border-[#E5E1D8]"
              >
                Sold Out
              </button>
            ) : quantityInCart > 0 ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5E1D8] rounded-xl p-1 shadow-2xs"
              >
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-lg bg-white text-[#2D241E] border border-[#E5E1D8] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-mono font-bold text-[#2D241E]">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantityInCart >= product.stock}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
                    quantityInCart >= product.stock
                      ? 'bg-[#E5E1D8] text-[#9A8C73] cursor-not-allowed'
                      : 'bg-[#2D241E] text-white hover:bg-[#3D332D]'
                  }`}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id={`btn-add-${product.id}`}
                onClick={handleAdd}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer ${
                  justAdded
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#2D241E] hover:bg-[#3D332D] text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Temporary warning/error */}
        {errorMsg && (
          <p className="mt-2 text-[11px] text-[#C0392B] font-medium text-center animate-fade-in">
            {errorMsg}
          </p>
        )}

      </div>
    </div>
  );
};
