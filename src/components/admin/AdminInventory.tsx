import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR } from '../../utils/formatters';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  ShieldCheck, 
  Check, 
  RotateCcw
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateProductStock, categories } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'low') return matchesSearch && p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'out') return matchesSearch && p.stock <= 0;
    return matchesSearch;
  });

  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockItems = products.filter(p => p.stock <= 0);

  const handleStockAdjust = (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateProductStock(id, newStock);
  };

  const handleRestockBatch = (id: string, amount: number = 20) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    updateProductStock(id, p.stock + amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Inventory &amp; Stock Control
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Track daily baking batches, adjust quantity on-hand, and prevent stockouts
          </p>
        </div>
      </div>

      {/* Stock Alerts Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Total Catalog Items</span>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {products.length}
          </div>
          <p className="text-[11px] text-[#9A8C73]">Baking items active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Low Stock Alert (&le; 5)</span>
          <div className="font-serif-bakery text-2xl font-bold text-amber-700">
            {lowStockItems.length}
          </div>
          <p className="text-[11px] text-[#9A8C73]">Need next oven batch soon</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">Out of Stock</span>
          <div className="font-serif-bakery text-2xl font-bold text-rose-600">
            {outOfStockItems.length}
          </div>
          <p className="text-[11px] text-[#9A8C73]">Currently sold out</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product inventory by name..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              stockFilter === 'all'
                ? 'bg-[#2D241E] text-white'
                : 'bg-[#FAF7F2] text-[#7A6C5D] hover:bg-[#E5E1D8]'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              stockFilter === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-[#FAF7F2] text-amber-800 hover:bg-amber-100'
            }`}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              stockFilter === 'out'
                ? 'bg-rose-600 text-white'
                : 'bg-[#FAF7F2] text-rose-700 hover:bg-rose-100'
            }`}
          >
            Sold Out ({outOfStockItems.length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A6C5D]">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] border-b border-[#E5E1D8]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.map(p => {
                const isLow = p.stock > 0 && p.stock <= 5;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-[#E5E1D8] shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-[#2D241E] text-sm font-serif-bakery">{p.name}</p>
                          <p className="text-[11px] text-[#9A8C73]">Unit: {p.unit}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#2D241E]">
                      {p.categoryName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-[#2D241E]">
                      {formatLKR(p.price)}
                    </td>

                    <td className="py-3.5 px-4">
                      {isOut ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Well Stocked
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-base font-bold ${
                        isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-[#2D241E]'
                      }`}>
                        {p.stock}
                      </span>
                      <span className="text-[10px] text-[#9A8C73] ml-1">in stock</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Stepper buttons */}
                        <div className="flex items-center gap-1 bg-[#FAF7F2] border border-[#E5E1D8] p-1 rounded-xl">
                          <button
                            onClick={() => handleStockAdjust(p.id, p.stock, -1)}
                            disabled={p.stock <= 0}
                            className="w-7 h-7 rounded-lg bg-white border border-[#E5E1D8] text-[#2D241E] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
                            title="Decrease stock by 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, p.stock, 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#E5E1D8] text-[#2D241E] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-2xs"
                            title="Increase stock by 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Batch restock */}
                        <button
                          onClick={() => handleRestockBatch(p.id, 20)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          title="Restock full batch (+20)"
                        >
                          +20 Batch
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
