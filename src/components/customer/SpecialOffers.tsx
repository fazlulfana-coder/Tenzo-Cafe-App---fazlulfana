import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { Sparkles, Flame, Tag, ArrowRight } from 'lucide-react';

interface SpecialOffersProps {
  onSelectProduct?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onSelectProduct, onOpenDetail }) => {
  const { products, setActiveTab, setSelectedCategory } = useBakery();
  const handleSelect = onOpenDetail || onSelectProduct;

  const specialProducts = products.filter(p => p.isSpecialOffer);

  return (
    <section className="py-8 sm:py-12">
      {/* Banner Callout */}
      <div className="mb-8 rounded-3xl bg-[#8B5E3C] p-6 sm:p-10 text-white border border-[#7A5234] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />

        <div className="space-y-2 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#734A2C] border border-[#9A6B46] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
            Limited Daily Baking Special
          </div>
          <h2 className="font-serif-bakery text-2xl sm:text-4xl font-light italic text-[#FAF7F2] tracking-tight">
            Today’s Oven Specials &amp; Combos
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EBE1] max-w-xl leading-relaxed">
            Handcrafted daily bakery favorites, celebration gateaux, and savory afternoon short-eat bundles at exclusive bakery prices.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 relative z-10">
          <button
            onClick={() => {
              setActiveTab('products');
              setSelectedCategory('all');
            }}
            className="px-6 py-3.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-widest shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View All Bakes</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>

      {/* Grid of special offer items */}
      {specialProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {specialProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={handleSelect}
              onOpenDetail={handleSelect}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-stone-500 text-sm py-8">
          Check back tomorrow morning for fresh seasonal bakery offers!
        </p>
      )}
    </section>
  );
};
