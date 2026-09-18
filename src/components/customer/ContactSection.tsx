import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Navigation,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useBakery();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    // Construct formatted WhatsApp message for Tenzo Cafe & Bakers
    const primaryPhone = (settings.whatsapp || settings.hotline || '94757550333').replace(/[^0-9]/g, '');
    const cleanTargetNumber = primaryPhone.startsWith('94') ? primaryPhone : (primaryPhone.startsWith('0') ? '94' + primaryPhone.slice(1) : '94' + primaryPhone);

    const messageText = 
      `*🍰 SPECIAL REQUEST / INQUIRY - ${settings.name.toUpperCase()}*\n\n` +
      `👤 *Customer Name:* ${inquiryName.trim()}\n` +
      `📞 *Customer Phone:* ${inquiryPhone.trim()}\n` +
      `📝 *Requirement / Notes:*\n${inquiryMsg.trim() || 'General inquiry / custom order consultation'}\n\n` +
      `📍 *Location:* Thihariya, Sri Lanka\n` +
      `⏰ *Sent At:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`;

    const encodedMsg = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanTargetNumber}?text=${encodedMsg}`;

    // Trigger WhatsApp in a new tab/app
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Show in-UI confirmation and clear form
    setSentSuccess(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMsg('');
      setSentSuccess(false);
    }, 6000);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C] font-bold bg-[#FAF7F2] border border-[#E5E1D8] px-3.5 py-1.5 rounded-full inline-block">
            Visit &amp; Connect
          </span>
          <h2 className="font-serif-bakery text-3xl sm:text-4xl font-light italic text-[#2D241E] tracking-tight">
            Come Taste Fresh Ceylon Bakes
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D] max-w-lg mx-auto">
            Conveniently located along Warana Road in Thihariya. Drop by for hot savory buns, artisanal espresso, or custom celebration cake consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Location Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D8] shadow-2xs space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                    Tenzo Cafe and Bakers
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold">
                    Fresh Oven • Coffee Bar • Pastry Counter • Thihariya
                  </p>
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Open Daily
                </span>
              </div>

              {/* Contact Person Highlight */}
              <div className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2D241E] text-[#FAF7F2] font-serif-bakery font-bold text-lg flex items-center justify-center shrink-0">
                    FR
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8B5E3C] font-bold block">
                      Primary Contact &amp; Bakery In-Charge
                    </span>
                    <strong className="text-sm font-serif-bakery text-[#2D241E]">
                      {settings.contactPerson || 'Fazlul Rahman'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${settings.hotline}`}
                    className="px-3 py-1.5 rounded-lg bg-[#2D241E] text-[#FAF7F2] hover:bg-[#8B5E3C] font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>{settings.hotline}</span>
                  </a>
                  {settings.secondaryPhone && (
                    <a
                      href={`tel:${settings.secondaryPhone}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E1D8] text-[#2D241E] hover:border-[#8B5E3C] font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>{settings.secondaryPhone}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#7A6C5D]">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8]">
                  <MapPin className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D241E] font-serif-bakery font-bold mb-0.5">Address:</strong>
                    <span className="leading-relaxed font-medium text-[#2D241E]">{settings.address}</span>
                    <p className="text-[11px] text-[#9A8C73] mt-0.5">Warana Road, Thihariya</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8]">
                  <Clock className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D241E] font-serif-bakery font-bold mb-0.5">Operating Hours:</strong>
                    <span className="leading-relaxed">{settings.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8]">
                  <Phone className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D241E] font-serif-bakery font-bold mb-0.5">Contact Numbers:</strong>
                    <div className="flex flex-col gap-1 font-mono font-medium text-[#2D241E] mt-0.5">
                      <a href={`tel:${settings.hotline}`} className="hover:text-[#8B5E3C] flex items-center gap-1.5">
                        <span className="text-[10px] text-[#8B5E3C] uppercase font-sans font-bold">Primary:</span>
                        <span>{settings.hotline}</span>
                      </a>
                      {settings.secondaryPhone && (
                        <a href={`tel:${settings.secondaryPhone}`} className="hover:text-[#8B5E3C] flex items-center gap-1.5">
                          <span className="text-[10px] text-[#8B5E3C] uppercase font-sans font-bold">Secondary:</span>
                          <span>{settings.secondaryPhone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8]">
                  <Mail className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2D241E] font-serif-bakery font-bold mb-0.5">Official Email:</strong>
                    <a 
                      href={`mailto:${settings.email}`} 
                      className="text-[#2D241E] hover:text-[#8B5E3C] font-mono break-all hover:underline"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link Bar */}
              <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#2E7D32]">
                  <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">Order via WhatsApp directly with Fazlul Rahman</span>
                    <span className="text-[11px] text-[#2E7D32]/80 font-mono">Chat on 0757550333 or 0778360152</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://wa.me/94757550333"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#2D241E] font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>075 755 0333</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://wa.me/94778360152"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#C8E6C9] hover:bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>077 836 0152</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Styled interactive map graphic / placeholder */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E1D8] aspect-16/7 bg-[#2D241E]/5 flex items-center justify-center p-6 text-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-multiply"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')`
                  }}
                />
                <div className="relative z-10 space-y-2 bg-white/95 p-5 rounded-2xl shadow-sm border border-[#E5E1D8] backdrop-blur-xs max-w-sm">
                  <div className="flex items-center justify-center gap-1.5 text-[#8B5E3C] font-bold text-xs uppercase tracking-wider">
                    <Navigation className="w-4 h-4 text-[#8B5E3C]" />
                    <span>No 300, Warana Road, Thihariya</span>
                  </div>
                  <p className="text-[11px] text-[#7A6C5D] leading-relaxed">
                    Easy access along Warana Road in Thihariya. Customer parking available in front for rapid order counter pickup.
                  </p>
                  <a
                    href="https://maps.google.com/?q=No+300+Warana+Road+Thihariya+Sri+Lanka"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B5E3C] hover:text-[#2D241E] hover:underline uppercase tracking-wider"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Inquiry / Cake Order Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D8] shadow-2xs space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C] font-bold">
                Special Requests
              </span>
              <h3 className="font-serif-bakery text-xl font-bold text-[#2D241E]">
                Custom Cake or Catering Query
              </h3>
              <p className="text-xs text-[#7A6C5D] leading-relaxed">
                Planning a birthday, office tea party, or wedding? Send us your requirement and our head baker will call you back.
              </p>
            </div>

            {sentSuccess ? (
              <div className="p-5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl text-center space-y-2 text-[#2E7D32]">
                <CheckCircle2 className="w-8 h-8 text-[#2E7D32] mx-auto" />
                <h4 className="font-bold text-sm">Opening WhatsApp Chat...</h4>
                <p className="text-xs text-[#2E7D32]">
                  Your request has been prepared and redirected to WhatsApp with Fazlul Rahman (075 755 0333).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                    Your Name <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Dilhani Samarasinghe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] text-xs sm:text-sm bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                    Contact Phone (Sri Lanka) <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] text-xs sm:text-sm bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] text-[#2D241E] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                    Your Requirement / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="e.g. 2kg Chocolate Gateau for Saturday evening, 30 fish cutlets for company tea..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1D8] text-xs sm:text-sm bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] text-[#2D241E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#1E293B] hover:text-black text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-black" />
                  <span>Send Request via WhatsApp</span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-[#E5E1D8] flex items-center justify-between text-[11px] text-[#9A8C73]">
              <span>Quick response within 1 hour</span>
              <span>Direct WhatsApp Available</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
