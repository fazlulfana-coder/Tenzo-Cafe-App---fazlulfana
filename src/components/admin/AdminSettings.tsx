import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { BakerySettings } from '../../types';
import { formatLKR } from '../../utils/formatters';
import { 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Lock,
  MessageCircle
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useBakery();

  const [formData, setFormData] = useState<BakerySettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof BakerySettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all bakery settings to factory defaults?')) {
      resetToDefaults();
      setFormData(settings);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Bakery Configuration
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Manage brand profile, Sri Lanka hotline, delivery rates, operating hours, and admin passcode
          </p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Store Profile */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#8B5E3C]" />
            <span>Brand Profile &amp; Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Bakery Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#2D241E] mb-1">Address (Bakery Counter)</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Operating Hours</label>
              <input
                type="text"
                required
                value={formData.operatingHours}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Contact In-Charge Person</label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>
        </div>

        {/* Communication & Hotline */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#8B5E3C]" />
            <span>Hotline &amp; WhatsApp Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Primary Hotline</label>
              <input
                type="tel"
                required
                value={formData.hotline}
                onChange={(e) => handleChange('hotline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Secondary Contact Number</label>
              <input
                type="tel"
                value={formData.secondaryPhone || ''}
                onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                placeholder="e.g. 077 836 0152"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="94757550333"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
              />
              <p className="text-[10px] text-[#9A8C73] mt-1">Country code format without + (e.g. 94757550333)</p>
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates and Fees */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8B5E3C]" />
            <span>Delivery Fees &amp; Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Standard Delivery Fee (LKR)</label>
              <input
                type="number"
                min={0}
                required
                value={formData.deliveryFee}
                onChange={(e) => handleChange('deliveryFee', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Free Delivery Threshold (LKR)</label>
              <input
                type="number"
                min={0}
                required
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D241E] mb-1">Default Currency Code</label>
              <input
                type="text"
                disabled
                value={formData.currency}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] text-[#7A6C5D] font-mono opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Security & Admin Passcode */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8B5E3C]" />
            <span>Security &amp; Passcode</span>
          </h3>

          <div className="max-w-md text-xs">
            <label className="block font-semibold text-[#2D241E] mb-1">Admin Access Passcode</label>
            <input
              type="text"
              required
              value={formData.adminPassword}
              onChange={(e) => handleChange('adminPassword', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-mono"
            />
            <p className="text-[11px] text-[#9A8C73] mt-1">
              Required by staff to log into the management console.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-[#E5E1D8] text-[#9A8C73] hover:text-[#C0392B] hover:border-[#C0392B] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Factory Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#D4A373]" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
