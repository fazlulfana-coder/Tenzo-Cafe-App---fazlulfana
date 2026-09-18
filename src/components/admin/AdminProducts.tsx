import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Product, UnitType } from '../../types';
import { formatLKR } from '../../utils/formatters';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Leaf, 
  Sparkles, 
  Check, 
  X, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useBakery();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Product edit/create modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState<UnitType>('Piece');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number>(20);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isSpecialOffer, setIsSpecialOffer] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 'breads');
    setPrice(350);
    setOriginalPrice(undefined);
    setUnit('Piece');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80');
    setStock(25);
    setIsAvailable(true);
    setIsVegetarian(false);
    setIsSpecialOffer(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setUnit(p.unit);
    setDescription(p.description);
    setImage(p.image);
    setStock(p.stock);
    setIsAvailable(p.isAvailable);
    setIsVegetarian(p.isVegetarian || false);
    setIsSpecialOffer(p.isSpecialOffer || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    const matchedCat = categories.find(c => c.id === categoryId);
    const catName = matchedCat ? matchedCat.name : 'Bakery';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        categoryId,
        categoryName: catName,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        unit,
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        stock: Number(stock),
        isAvailable,
        isVegetarian,
        isSpecialOffer,
      });
    } else {
      addProduct({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        categoryId,
        categoryName: catName,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        unit,
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        stock: Number(stock),
        isAvailable,
        isFeatured: false,
        isVegetarian,
        isSpecialOffer,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, pName: string) => {
    if (window.confirm(`Are you sure you want to remove "${pName}" from the catalog?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Product Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Manage bakery menu items, daily oven prices, availability, and tags
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-medium text-[#2D241E]"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A6C5D]">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] border-b border-[#E5E1D8]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (LKR)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E5E1D8] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-[#2D241E] text-sm font-serif-bakery">{p.name}</p>
                        <p className="text-[11px] text-[#9A8C73] line-clamp-1 max-w-xs">{p.description}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#2D241E]">
                    {p.categoryName}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-[#2D241E] text-sm">{formatLKR(p.price)}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-[#9A8C73] line-through block">
                        {formatLKR(p.originalPrice)}
                      </span>
                    )}
                    <span className="text-[10px] text-[#7A6C5D]">/{p.unit}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={p.stock <= 5 ? 'text-[#C0392B]' : 'text-[#2D241E]'}>
                      {p.stock}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isVegetarian && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" /> Veg
                        </span>
                      )}
                      {p.isSpecialOffer && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Offer
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      p.isAvailable && p.stock > 0
                        ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                        : 'bg-[#FDEDEC] text-[#C0392B] border-[#FADBD8]'
                    }`}>
                      {p.isAvailable && p.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-[#9A8C73] hover:text-[#C0392B] hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
            
            <div className="p-5 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                {editingProduct ? 'Edit Product' : 'Add New Bakery Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#E5E1D8] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ceylon Cinnamon Rolls"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-[#2D241E] mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D241E] mb-1">Serving Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Loaf">Loaf</option>
                    <option value="Pack">Pack</option>
                    <option value="Box">Box</option>
                    <option value="500g">500g</option>
                    <option value="Kg">Kg</option>
                    <option value="Cup">Cup</option>
                    <option value="Bottle">Bottle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-[#2D241E] mb-1">Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D241E] mb-1">Original Price (LKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional strikethrough"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D241E] mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] mb-1">Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients, taste notes, freshly baked notice..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E5E1D8]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C] focus:ring-[#8B5E3C]"
                  />
                  <span className="font-semibold text-[#2D241E]">Item is Available for Sale</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C] focus:ring-[#8B5E3C]"
                  />
                  <span className="font-semibold text-[#2D241E]">Vegetarian Safe</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpecialOffer}
                    onChange={(e) => setIsSpecialOffer(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C] focus:ring-[#8B5E3C]"
                  />
                  <span className="font-semibold text-[#8B5E3C]">Feature in Special Offers</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E5E1D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E1D8] text-[#7A6C5D] hover:bg-[#FAF7F2] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
