import React from 'react';
import { BAKERY_BRANCHES } from '../../data/branchesData';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, CheckCircle2, Store } from 'lucide-react';

export const BranchesSection: React.FC = () => {
  return (
    <section id="branches-section" className="py-12 sm:py-16 bg-white border-y border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5E1D8] text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
            <Store className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>3 Convenient Outlets Across Gampaha District</span>
          </div>

          <h2 className="font-serif-bakery text-3xl sm:text-4xl lg:text-5xl font-light italic text-[#2D241E] tracking-tight">
            Our Bakery Branches
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D] leading-relaxed">
            Fresh batches baked every morning and afternoon. Visit our main cafe in <strong className="text-[#2D241E]">Thihariya</strong> or grab your favorites on-the-go at our <strong className="text-[#2D241E]">Ellalamulla</strong> and <strong className="text-[#2D241E]">Kalleliya</strong> branches.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BAKERY_BRANCHES.map(branch => {
            const cleanPhone = branch.whatsapp;
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello New Tenzo Cafe & Bakers! I would like to place an order / inquire about items at your ${branch.name}.`
            )}`;
            const telUrl = `tel:${branch.hotline.replace(/\s+/g, '')}`;

            return (
              <div
                key={branch.id}
                id={branch.id}
                className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                  branch.isMain
                    ? 'bg-[#FAF7F2] border-[#8B5E3C] shadow-md ring-1 ring-[#8B5E3C]/20'
                    : 'bg-[#FCFAF7] border-[#E5E1D8] hover:border-[#8B5E3C]/60 hover:shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${
                        branch.isMain
                          ? 'bg-[#8B5E3C] text-white'
                          : 'bg-[#2D241E]/10 text-[#2D241E]'
                      }`}
                    >
                      {branch.isMain ? '★ Flagship & Main Cafe' : 'Express Branch'}
                    </span>

                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Open Today
                    </span>
                  </div>

                  {/* Branch Title & Tagline */}
                  <div>
                    <h3 className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
                      {branch.city}
                    </h3>
                    <p className="text-xs text-[#8B5E3C] font-medium mt-0.5">
                      {branch.tagline}
                    </p>
                  </div>

                  {/* Address & Hours */}
                  <div className="space-y-2.5 text-xs text-[#7A6C5D] pt-2 border-t border-[#E5E1D8]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                      <span className="text-[#2D241E] font-medium">{branch.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                      <span>{branch.hours}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                      <a
                        href={telUrl}
                        className="font-mono font-bold text-[#2D241E] hover:text-[#8B5E3C] transition-colors"
                      >
                        {branch.hotline}
                      </a>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-1.5 pt-3 border-t border-[#E5E1D8]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A8C73]">
                      Branch Offerings
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#4A3F37]">
                      {branch.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Branch CTAs */}
                <div className="pt-6 mt-6 border-t border-[#E5E1D8] grid grid-cols-2 gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={telUrl}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Shop</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Delivery Note */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#E5E1D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif-bakery text-base sm:text-lg font-bold text-[#2D241E]">
              Need fast doorstep delivery from any branch?
            </h4>
            <p className="text-xs text-[#7A6C5D]">
              We deliver piping hot Thatty Bread, savory bakes, and celebration cakes across Thihariya, Ellalamulla, Kalleliya, Kalagedihena, and surrounding areas.
            </p>
          </div>
          <a
            href="https://wa.me/94757550333?text=Hello%20Tenzo%20Bakery!%20I%20would%20like%20to%20order%20for%20delivery."
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-2xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order Delivery via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
