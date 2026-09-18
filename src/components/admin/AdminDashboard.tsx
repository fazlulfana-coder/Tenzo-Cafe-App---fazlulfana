import React, { useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Package, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Store,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { orders, products, setAdminTab, updateOrderStatus } = useBakery();

  // Metrics calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const todayOrders = useMemo(() => {
    return orders.filter(o => o.createdAt.startsWith(todayStr));
  }, [orders, todayStr]);

  const todaySales = useMemo(() => {
    return todayOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [todayOrders]);

  const totalOrdersCount = orders.length;

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing').length;
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'Completed').length;
  }, [orders]);

  const totalSalesAllTime = useMemo(() => {
    return orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  // Chart data: 7 days mock/real sales distribution
  const chartData = useMemo(() => {
    const daysMap: Record<string, { day: string; sales: number; orders: number }> = {};
    const now = new Date();

    // Prepare last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      daysMap[iso] = { day: label, sales: 0, orders: 0 };
    }

    orders.forEach(o => {
      const dateKey = o.createdAt.split('T')[0];
      if (daysMap[dateKey]) {
        if (o.status !== 'Cancelled') {
          daysMap[dateKey].sales += o.total;
        }
        daysMap[dateKey].orders += 1;
      }
    });

    return Object.values(daysMap);
  }, [orders]);

  // Popular products calculation
  const popularProducts = useMemo(() => {
    const productStats: Record<string, { name: string; category: string; count: number; revenue: number; image: string }> = {};

    orders.forEach(o => {
      if (o.status === 'Cancelled') return;
      o.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            name: item.productName,
            category: item.unit,
            count: 0,
            revenue: 0,
            image: item.image,
          };
        }
        productStats[item.productId].count += item.quantity;
        productStats[item.productId].revenue += (item.price * item.quantity);
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Bakery Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D] mt-0.5">
            Welcome back! Here's what's baking and selling at Tenzo Cafe and Bakers today.
          </p>
        </div>
        <button
          onClick={() => setAdminTab('orders')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Manage All Orders</span>
          <ChevronRight className="w-4 h-4 text-[#D4A373]" />
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#8B5E3C]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Today’s Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5E1D8] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#8B5E3C]" />
            </div>
          </div>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {formatLKR(todaySales)}
          </div>
          <p className="text-[11px] text-[#9A8C73] font-mono">
            {todayOrders.length} orders placed today
          </p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#8B5E3C]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Today’s Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5E1D8] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#8B5E3C]" />
            </div>
          </div>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {todayOrders.length}
          </div>
          <p className="text-[11px] text-[#9A8C73]">
            Fresh batch demand
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#8B5E3C]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5E1D8] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#8B5E3C]" />
            </div>
          </div>
          <div className="font-serif-bakery text-2xl font-bold text-[#8B5E3C]">
            {pendingOrdersCount}
          </div>
          <p className="text-[11px] text-[#8B5E3C] font-medium">
            Requires baking/packing
          </p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#2E7D32]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            </div>
          </div>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {completedOrdersCount}
          </div>
          <p className="text-[11px] text-[#9A8C73]">
            Delivered &amp; collected
          </p>
        </div>

        {/* Total Lifetime Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#2D241E]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5E1D8] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#2D241E]" />
            </div>
          </div>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {formatLKR(totalSalesAllTime)}
          </div>
          <p className="text-[11px] text-[#9A8C73]">
            Across {totalOrdersCount} orders
          </p>
        </div>

      </div>

      {/* Charts Section: Sales Trend & Orders volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Revenue Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
                Weekly Sales Trend
              </h3>
              <p className="text-xs text-[#7A6C5D]">
                Daily bakery turnover over the last 7 days (LKR)
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-[#FAF7F2] border border-[#E5E1D8] text-[#8B5E3C] rounded-full">
              Live Tracker
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7A6C5D' }} />
                <YAxis tick={{ fontSize: 11, fill: '#7A6C5D' }} />
                <Tooltip 
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#2D241E', color: '#FAF7F2', borderRadius: '12px', fontSize: '12px', border: '1px solid #3D332D' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8B5E3C" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#salesGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Products Leaderboard (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
              Popular Bakes
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#9A8C73]">Best Sellers</span>
          </div>

          <div className="divide-y divide-[#F0ECE4] space-y-1">
            {popularProducts.length > 0 ? (
              popularProducts.map((p, idx) => (
                <div key={idx} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 font-bold font-mono text-[#8B5E3C] text-center">{idx + 1}</span>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-[#E5E1D8] shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-[#2D241E] truncate font-serif-bakery">{p.name}</p>
                      <p className="text-[11px] text-[#7A6C5D] font-mono">{p.count} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2D241E] shrink-0 font-mono">
                    {formatLKR(p.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#9A8C73] py-6 text-center">
                Popularity data will populate as orders are processed.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E5E1D8] flex items-center justify-between">
          <div>
            <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
              Recent Incoming Orders
            </h3>
            <p className="text-xs text-[#7A6C5D]">
              Showing the latest customer submissions
            </p>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] hover:text-[#2D241E] hover:underline"
          >
            View All ({orders.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A6C5D]">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] border-b border-[#E5E1D8]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D241E]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#2D241E]">{order.customer.name}</p>
                    <p className="text-[11px] text-[#9A8C73] font-mono">{order.customer.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#2D241E]">{order.items.length} items</span>
                    <p className="text-[11px] text-[#9A8C73] truncate max-w-xs">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#2D241E]">
                      {order.orderType === 'Delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                    </span>
                    <p className="text-[11px] text-[#9A8C73]">{order.customer.preferredTime}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#2D241E] font-mono text-sm">
                    {formatLKR(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#E5E1D8] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5E3C] font-medium text-[#2D241E] cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
