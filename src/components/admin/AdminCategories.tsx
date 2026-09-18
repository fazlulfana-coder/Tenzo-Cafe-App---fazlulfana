import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X, Tags, Check } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useBakery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Croissant');
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setIcon('Cake');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setIcon(c.icon || 'Croissant');
    setDescription(c.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        icon,
        description: description.trim()
      });
    } else {
      addCategory({
        name: name.trim(),
        icon,
        description: description.trim()
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, catName: string) => {
    const productsInCat = products.filter(p => p.categoryId === id);
    if (productsInCat.length > 0) {
      alert(`Cannot delete category "${catName}" because it has ${productsInCat.length} products assigned to it. Please reassign those products first.`);
      return;
    }
    if (window.confirm(`Delete category "${catName}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Menu Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Organize bakery showcase sections (Breads, Short Eats, Cakes, Coffee, Pastries)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div 
              key={cat.id} 
              className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8] text-[#8B5E3C] flex items-center justify-center font-bold text-sm">
                    <Tags className="w-5 h-5 text-[#8B5E3C]" />
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FAF7F2] border border-[#E5E1D8] text-[#2D241E]">
                    {count} {count === 1 ? 'product' : 'products'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#7A6C5D] mt-0.5">
                    {cat.description || 'Fresh artisanal treats made daily.'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#9A8C73]">
                  ID: {cat.id}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-[#9A8C73] hover:text-[#C0392B] hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
            <div className="p-5 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                {editingCategory ? 'Edit Category' : 'Create Bakery Category'}
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
                <label className="block font-semibold text-[#2D241E] mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artisanal Sourdoughs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief note about this category..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
