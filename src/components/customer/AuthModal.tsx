import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  Phone, 
  Key, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'admin' | 'customer';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'admin'
}) => {
  const { 
    adminLogin, 
    isAdminLoggedIn, 
    setActiveTab, 
    loginCustomer,
    currentCustomer 
  } = useBakery();

  const [tab, setTab] = useState<'admin' | 'customer'>(defaultTab);

  React.useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setAdminError(null);
    }
  }, [isOpen, defaultTab]);

  // Admin states
  const [adminUsername, setAdminUsername] = useState('tenzo');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Customer states
  const [custName, setCustName] = useState(currentCustomer?.name || '');
  const [custPhone, setCustPhone] = useState(currentCustomer?.phone || '');
  const [custSuccess, setCustSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    const success = adminLogin(adminPassword.trim(), adminUsername.trim());
    if (success) {
      onClose();
      setActiveTab('admin');
    } else {
      setAdminError('Invalid credentials. Use Username: tenzo | Password: tenzo_1234');
    }
  };

  const handleAutoFillAdmin = () => {
    setAdminUsername('tenzo');
    setAdminPassword('tenzo_1234');
    setAdminError(null);
    adminLogin('tenzo_1234', 'tenzo');
    setTimeout(() => {
      onClose();
      setActiveTab('admin');
    }, 300);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;
    loginCustomer(custName.trim(), custPhone.trim());
    setCustSuccess(true);
    setTimeout(() => {
      setCustSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D241E] text-[#FAF7F2] flex items-center justify-center font-normal text-lg shadow-xs font-serif-bakery">
              T
            </div>
            <div>
              <h2 className="font-serif-bakery text-xl font-normal italic text-[#2D241E]">
                Tenzo Portal
              </h2>
              <p className="text-xs text-[#7A6C5D]">
                Bakery Management &amp; Customer Orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#F0ECE4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 p-2 bg-[#FAF7F2] gap-1 text-xs font-bold border-b border-[#E5E1D8]">
          <button
            id="tab-btn-admin"
            type="button"
            onClick={() => setTab('admin')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'admin'
                ? 'bg-white text-[#2D241E] shadow-xs border border-[#E5E1D8]'
                : 'text-[#7A6C5D] hover:text-[#2D241E]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
            <span>Admin / Staff</span>
          </button>

          <button
            id="tab-btn-customer"
            type="button"
            onClick={() => setTab('customer')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'customer'
                ? 'bg-white text-[#2D241E] shadow-xs border border-[#E5E1D8]'
                : 'text-[#7A6C5D] hover:text-[#2D241E]'
            }`}
          >
            <User className="w-4 h-4 text-[#8B5E3C]" />
            <span>Customer Profile</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {tab === 'admin' ? (
            /* Admin Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#2D241E]">
                  Bakery Owner &amp; Staff Login
                </h3>
                <p className="text-xs text-[#7A6C5D]">
                  Access live order management, product catalog, sales reports, and inventory control.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="input-admin-username"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter admin username (tenzo)"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    id="input-admin-password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password (tenzo_1234)"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
                {adminError && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{adminError}</p>
                )}
              </div>

              {/* Quick Demo Credentials Info */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E1D8] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-[#2D241E] font-medium space-y-0.5">
                  <div>User: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5E1D8] font-mono font-bold text-[#8B5E3C]">tenzo</code></div>
                  <div>Pass: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5E1D8] font-mono font-bold text-[#8B5E3C]">tenzo_1234</code></div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillAdmin}
                  className="px-3 py-1.5 bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2] rounded-lg text-[11px] font-bold shadow-2xs cursor-pointer transition-colors"
                >
                  1-Click Auto Fill
                </button>
              </div>

              <button
                type="submit"
                id="btn-admin-login-submit"
                className="w-full py-3 rounded-xl bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Enter Management Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Customer Profile Form */
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#2D241E]">
                  Customer Fast Checkout Setup
                </h3>
                <p className="text-xs text-[#7A6C5D]">
                  Save your name and Sri Lanka mobile number for faster ordering and order history tracking.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D241E] mb-1">
                  Mobile Number (Sri Lanka)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              {custSuccess && (
                <p className="text-xs text-emerald-700 font-medium text-center">
                  Profile saved successfully!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2D241E] hover:bg-[#8B5E3C] text-[#FAF7F2] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Save Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
