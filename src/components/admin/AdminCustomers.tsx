import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR, formatDateTime } from '../../utils/formatters';
import { Users, Search, Phone, ShoppingBag, DollarSign, Calendar, MessageCircle } from 'lucide-react';

interface CustomerSummary {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastAddress?: string;
}

export const AdminCustomers: React.FC = () => {
  const { orders, settings } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');

  // Group orders by customer phone number
  const customersList = useMemo(() => {
    const custMap: Record<string, CustomerSummary> = {};

    orders.forEach(o => {
      const p = o.customer.phone;
      if (!custMap[p]) {
        custMap[p] = {
          phone: p,
          name: o.customer.name,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          lastAddress: o.customer.address,
        };
      }
      custMap[p].totalOrders += 1;
      if (o.status !== 'Cancelled') {
        custMap[p].totalSpent += o.total;
      }
      if (new Date(o.createdAt) > new Date(custMap[p].lastOrderDate)) {
        custMap[p].lastOrderDate = o.createdAt;
        if (o.customer.address) custMap[p].lastAddress = o.customer.address;
      }
    });

    return Object.values(custMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customersList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Registered buyers, order frequency, lifetime spend, and direct contact
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-[#8B5E3C] bg-[#FAF7F2] border border-[#E5E1D8] px-3.5 py-1.5 rounded-xl">
          {customersList.length} unique customers
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name or Sri Lankan phone number..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A6C5D]">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] border-b border-[#E5E1D8]">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Delivery Address</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Order</th>
                <th className="py-3.5 px-4 text-right">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#9A8C73]">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const rawPhone = c.phone.replace(/[^0-9]/g, '');
                  const cleanPhone = rawPhone.startsWith('94') ? rawPhone : rawPhone.startsWith('0') ? '94' + rawPhone.slice(1) : '94' + rawPhone;
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${c.name}! Thank you for your continued support for ${settings.name}. Let us know if you would like today's fresh baking special!`)}`;

                  return (
                    <tr key={c.phone} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#2D241E] text-sm font-serif-bakery">
                        {c.name}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-[#2D241E]">
                        {c.phone}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#7A6C5D] max-w-xs truncate">
                        {c.lastAddress || 'Pickup Counter'}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2D241E]">
                        {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#2D241E]">
                        {formatLKR(c.totalSpent)}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#9A8C73] font-mono">
                        {formatDateTime(c.lastOrderDate)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] font-semibold text-xs transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
