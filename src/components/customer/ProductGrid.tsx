import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { 
  Search, 
  SlidersHorizontal, 
  Leaf, 
  Sparkles, 
  ArrowUpDown,
  X,
  Package
} from 'lucide-react';

interface ProductGridProps {
  onSelectProduct?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct, onOpenDetail }) => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useBakery();

  const handleSelect = onOpenDetail || onSelectProduct;

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

  // Active category name
  const activeCategoryObj = categories.find(c => c.id === selectedCategory);
  const categoryTitle = selectedCategory === 'all' 
    ? 'All Oven Bakes' 
    : (activeCategoryObj ? activeCategoryObj.name : 'Bakery Products');

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Dietary & offers filters
      if (vegetarianOnly && !product.isVegetarian) return false;
      if (offersOnly && !product.isSpecialOffer) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, vegetarianOnly, offersOnly, sortBy]);

  return (
    <section id="products-section" className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E1D8]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C] bg-[#FAF7F2] border border-[#E5E1D8] px-3 py-1 rounded-md inline-block">
              Artisanal Batch Baking
            </span>
            <h2 className="font-serif-bakery text-3xl sm:text-4xl font-light italic text-[#2D241E] tracking-tight">
              {categoryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6C5D] font-normal">
              Showing <strong className="font-mono text-[#2D241E] font-bold">{filteredProducts.length}</strong> freshly baked items available today
            </p>
          </div>

          {/* Controls: Search, Sort, Quick filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Vegetarian Filter Pill */}
            <button
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                vegetarianOnly
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-[#7A6C5D] border-[#E5E1D8] hover:border-[#8B5E3C]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Veg Only</span>
            </button>

            {/* Special Offers Pill */}
            <button
              onClick={() => setOffersOnly(!offersOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                offersOnly
                  ? 'bg-[#8B5E3C] text-white border-[#7A5234] shadow-2xs'
                  : 'bg-white text-[#7A6C5D] border-[#E5E1D8] hover:border-[#8B5E3C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offers Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="select-sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white text-[#2D241E] text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-[#E5E1D8] focus:outline-none focus:border-[#8B5E3C] cursor-pointer"
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Reset Filters button if any active */}
            {(selectedCategory !== 'all' || searchQuery || vegetarianOnly || offersOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setVegetarianOnly(false);
                  setOffersOnly(false);
                }}
                className="p-2 rounded-xl text-[#9A8C73] hover:text-[#C0392B] hover:bg-rose-50 transition-colors cursor-pointer"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E5E1D8] text-[#8B5E3C] flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 opacity-60" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                No baking items matched your selection
              </h3>
              <p className="text-xs text-[#7A6C5D] max-w-sm mx-auto">
                Try clearing search terms or resetting filters to browse all available bakery batches.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setVegetarianOnly(false);
                setOffersOnly(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={handleSelect}
                onOpenDetail={handleSelect}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
