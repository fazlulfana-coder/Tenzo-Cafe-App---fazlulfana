import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags, 
  Boxes, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Store, 
  Bell, 
  Menu, 
  X,
  CheckCircle2
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    adminTab, 
    setAdminTab, 
    setActiveTab, 
    adminLogout, 
    orders, 
    notifications,
    markNotificationsRead,
    products,
    settings
  } = useBakery();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifsDropdown, setShowNotifsDropdown] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-stone-950'
    },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: Boxes, 
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sales', label: 'Sales & Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setAdminTab(tabId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D241E] flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#2D241E] text-white border-b border-[#3D332D] sticky top-0 z-40 shadow-2xs">
        <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-[#DED9CF] hover:bg-[#3D332D] cursor-pointer"
              aria-label="Toggle admin navigation"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4A373]/50 bg-[#FAF7F2] shadow-2xs shrink-0 flex items-center justify-center">
                <img 
                  src={settings.logoUrl || '/logo.jpg'} 
                  alt={settings.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-serif-bakery text-base font-bold text-[#FAF7F2] tracking-tight leading-none">
                  {settings.name}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4A373] block mt-0.5">
                  Management Console
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifsDropdown(!showNotifsDropdown);
                  if (!showNotifsDropdown) markNotificationsRead();
                }}
                className="relative p-2 rounded-xl text-[#DED9CF] hover:text-white hover:bg-[#3D332D] transition-colors cursor-pointer"
                title="Bakery Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D4A373] animate-pulse" />
                )}
              </button>
              {showNotifsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-[#2D241E] rounded-2xl shadow-xl border border-[#E5E1D8] p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8] text-xs font-bold text-[#2D241E] font-serif-bakery">
                    <span>Recent Order Alerts</span>
                    <button 
                      onClick={() => setShowNotifsDropdown(false)}
                      className="text-[#9A8C73] hover:text-[#2D241E] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#F0ECE4] text-xs py-1">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2 space-y-0.5">
                        <p className="font-medium text-[#2D241E]">{n.message}</p>
                        <p className="text-[10px] text-[#9A8C73] font-mono">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Customer view button */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3D332D] hover:bg-[#4A3F37] text-[#D4A373] text-xs font-bold uppercase tracking-wider border border-[#4A3F37] transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                adminLogout();
                setActiveTab('home');
              }}
              className="p-2 rounded-xl text-[#9A8C73] hover:text-[#C0392B] hover:bg-[#3D332D] transition-colors cursor-pointer"
              title="Log out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main admin body: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-[#FCFAF7] border-r border-[#E5E1D8] p-4 space-y-2 shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
            Bakery Operations
          </div>
          <nav className="space-y-1 text-xs sm:text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#2D241E] text-white font-semibold shadow-2xs' 
                      : 'text-[#7A6C5D] hover:bg-[#FAF7F2] hover:text-[#2D241E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A373]' : 'text-[#8B5E3C]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#D4A373] text-[#2D241E]' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E5E1D8]">
            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Store className="w-4 h-4 text-[#D4A373]" />
              <span>View Storefront</span>
            </button>
          </div>

          <div className="pt-4 px-3 text-xs text-[#9A8C73] space-y-1">
            <p className="font-semibold text-[#7A6C5D] font-serif-bakery">Tenzo Bakery OS v1.0</p>
            <p className="text-[10px] uppercase tracking-wider">Sri Lanka Standard Time</p>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#2D241E]/60 backdrop-blur-xs flex">
            <div className="w-64 bg-[#FCFAF7] h-full p-4 space-y-4 shadow-xl flex flex-col justify-between border-r border-[#E5E1D8]">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-serif-bakery font-bold text-[#2D241E]">Admin Menu</span>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-[#7A6C5D] hover:text-[#2D241E]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs font-medium">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                          isActive 
                            ? 'bg-[#2D241E] text-white font-semibold' 
                            : 'text-[#7A6C5D] hover:bg-[#FAF7F2] hover:text-[#2D241E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E5E1D8]">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#2D241E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#D4A373]" />
                  View Storefront
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Dynamic Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};
