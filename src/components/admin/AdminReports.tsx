import React, { useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR } from '../../utils/formatters';
import { TrendingUp, DollarSign, ShoppingBag, BarChart3, PieChart as PieIcon, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

export const AdminReports: React.FC = () => {
  const { orders, products } = useBakery();

  // Metrics
  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  const deliveryOrdersCount = validOrders.filter(o => o.orderType === 'Delivery').length;
  const pickupOrdersCount = validOrders.filter(o => o.orderType === 'Pickup').length;

  // Category revenue split
  const categorySplit = useMemo(() => {
    const catMap: Record<string, number> = {};

    validOrders.forEach(o => {
      o.items.forEach(item => {
        // Find product category
        const prod = products.find(p => p.id === item.productId);
        const catName = prod ? prod.categoryName : 'Bakery';
        catMap[catName] = (catMap[catName] || 0) + (item.price * item.quantity);
      });
    });

    const COLORS = ['#D4A373', '#2D241E', '#8B5E3C', '#E5E1D8', '#4A3F37', '#7A6C5D'];
    return Object.entries(catMap).map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length]
    }));
  }, [validOrders, products]);

  // Daily volume bar chart
  const dailyBarData = useMemo(() => {
    const daysMap: Record<string, { day: string; revenue: number }> = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysMap[iso] = { day: label, revenue: 0 };
    }

    validOrders.forEach(o => {
      const dateKey = o.createdAt.split('T')[0];
      if (daysMap[dateKey]) {
        daysMap[dateKey].revenue += o.total;
      }
    });

    return Object.values(daysMap);
  }, [validOrders]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
          Sales &amp; Financial Reports
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6C5D]">
          Revenue analytics, average basket value, category revenue share, and fulfillment channels
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Total Net Sales</span>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {formatLKR(totalRevenue)}
          </div>
          <p className="text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" /> All successful orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Average Order Value</span>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {formatLKR(avgOrderValue)}
          </div>
          <p className="text-[11px] text-[#7A6C5D]">Per customer transaction</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Delivery Share</span>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {deliveryOrdersCount} <span className="text-xs text-[#9A8C73]">({validOrders.length > 0 ? Math.round((deliveryOrdersCount / validOrders.length) * 100) : 0}%)</span>
          </div>
          <p className="text-[11px] text-[#7A6C5D]">Doorstep motorcycle courier</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Counter Pickup</span>
          <div className="font-serif-bakery text-2xl font-bold text-[#2D241E]">
            {pickupOrdersCount} <span className="text-xs text-[#9A8C73]">({validOrders.length > 0 ? Math.round((pickupOrdersCount / validOrders.length) * 100) : 0}%)</span>
          </div>
          <p className="text-[11px] text-[#7A6C5D]">Collected at bakery shop</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Revenue Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
                Daily Revenue Comparison
              </h3>
              <p className="text-xs text-[#7A6C5D]">Last 7 days daily bakery earnings (LKR)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#8B5E3C]" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7A6C5D' }} />
                <YAxis tick={{ fontSize: 11, fill: '#7A6C5D' }} />
                <Tooltip 
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#2D241E', color: '#FAF7F2', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-bakery text-lg font-bold text-[#2D241E]">
                Revenue by Category
              </h3>
              <p className="text-xs text-[#7A6C5D]">Share of product category sales</p>
            </div>
            <PieIcon className="w-5 h-5 text-[#8B5E3C]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#2D241E', color: '#FAF7F2', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-[11px] text-[#2D241E] font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
