import React from 'react';
import { useBakery } from '../../context/BakeryContext';

export const CategoryFilterBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products, activeTab, setActiveTab } = useBakery();

  const handleSelect = (catId: string) => {
    setSelectedCategory(catId);
    if (activeTab !== 'products' && activeTab !== 'categories') {
      setActiveTab('products');
    }
  };

  const getProductCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.categoryId === catId).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {/* All Items Option */}
        <button
          id="cat-pill-all"
          onClick={() => handleSelect('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 ${
            selectedCategory === 'all'
              ? 'bg-[#2D241E] text-white border border-[#2D241E] shadow-2xs'
              : 'bg-white hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E5E1D8] hover:border-[#2D241E]'
          }`}
        >
          <span>All Bakes</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
            selectedCategory === 'all' ? 'bg-[#3D332D] text-[#D4A373]' : 'bg-[#FAF7F2] text-[#7A6C5D]'
          }`}>
            {products.length}
          </span>
        </button>

        {/* Dynamic categories */}
        {categories.map((cat) => {
          const count = getProductCount(cat.id);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.slug}`}
              onClick={() => handleSelect(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#2D241E] text-white border border-[#2D241E] shadow-2xs'
                  : 'bg-white hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E5E1D8] hover:border-[#2D241E]'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-[#3D332D] text-[#D4A373]' : 'bg-[#FAF7F2] text-[#7A6C5D]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
