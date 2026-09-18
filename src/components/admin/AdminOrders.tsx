import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Order, OrderStatus } from '../../types';
import { formatLKR, formatDateTime, getStatusBadgeClass, generateWhatsAppMessage } from '../../utils/formatters';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Printer, 
  ChevronDown, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Store,
  Calendar,
  X
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesType = typeFilter === 'all' || o.orderType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Printing error', e);
    }
  };

  const getWhatsAppLink = (order: Order) => {
    const rawCustPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawCustPhone.startsWith('94') 
      ? rawCustPhone 
      : rawCustPhone.startsWith('0') 
      ? '94' + rawCustPhone.slice(1) 
      : '94' + rawCustPhone;
    
    const msg = encodeURIComponent(
      `Hello ${order.customer.name}! Greetings from ${settings.name}.\n\n` +
      `Your Order *${order.orderNumber}* is currently: *${order.status.toUpperCase()}*.\n` +
      `Total: ${formatLKR(order.total)}\n` +
      `Fulfillment: ${order.orderType}\n\n` +
      `Thank you for baking with us! If you have any questions, reply to this message.`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-bakery text-2xl sm:text-3xl font-light italic text-[#2D241E] tracking-tight">
            Orders Management
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6C5D]">
            Track, update status, message customers via WhatsApp, and print kitchen slips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] bg-[#FAF7F2] border border-[#E5E1D8] px-3.5 py-1.5 rounded-xl font-mono">
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer name, or phone number..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 pr-8 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-medium text-[#2D241E]"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs py-2 px-3 pr-8 rounded-xl border border-[#E5E1D8] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] font-medium text-[#2D241E]"
            >
              <option value="all">All Types</option>
              <option value="Delivery">🛵 Delivery</option>
              <option value="Pickup">🏪 Store Pickup</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A6C5D]">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.15em] border-b border-[#E5E1D8]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#9A8C73]">
                    No orders matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#2D241E]">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:underline hover:text-[#8B5E3C] cursor-pointer text-left"
                      >
                        {order.orderNumber}
                      </button>
                      <p className="text-[10px] text-[#9A8C73] font-normal">{formatDateTime(order.createdAt)}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-[#2D241E]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#9A8C73] font-mono">{order.customer.phone}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-[#2D241E]">
                        {order.orderType === 'Delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                      </span>
                      <p className="text-[10px] text-[#9A8C73] truncate max-w-[160px]">
                        {order.customer.preferredDate} ({order.customer.preferredTime})
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-[#2D241E]">{order.items.length} items</span>
                      <p className="text-[11px] text-[#9A8C73] truncate max-w-[180px]">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-[#2D241E] text-sm">
                      {formatLKR(order.total)}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-colors cursor-pointer ${getStatusBadgeClass(order.status)}`}
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

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Customer button */}
                        <a
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#25D366] hover:bg-[#E8F5E9] transition-colors"
                          title="WhatsApp Update to Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* View Details modal button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E5E1D8] text-[#2D241E] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details and Printable Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C]">
                  Bakery Order Record
                </span>
                <h3 className="font-mono text-xl font-bold text-[#2D241E]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-[#7A6C5D] hover:text-[#2D241E] hover:bg-[#E5E1D8] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Kitchen Slip Box */}
            <div id="kitchen-slip" className="p-6 space-y-6">
              
              {/* Top summary row */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E1D8] text-xs">
                <div>
                  <p className="text-[#7A6C5D]">Customer Name</p>
                  <p className="font-bold text-[#2D241E] text-sm">{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <p className="text-[#7A6C5D]">Contact Number</p>
                  <p className="font-mono font-bold text-[#2D241E] text-sm">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-[#7A6C5D]">Fulfillment Mode</p>
                  <p className="font-bold text-[#2D241E] flex items-center gap-1">
                    {selectedOrder.orderType === 'Delivery' ? <Truck className="w-3.5 h-3.5 text-[#8B5E3C]" /> : <Store className="w-3.5 h-3.5 text-[#8B5E3C]" />}
                    {selectedOrder.orderType}
                  </p>
                </div>
                <div>
                  <p className="text-[#7A6C5D]">Current Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Delivery / Timing Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1">
                  <span className="font-bold text-[#8B5E3C] uppercase text-[10px] tracking-wider block">
                    Timing &amp; Date
                  </span>
                  <p><strong>Preferred Date:</strong> {selectedOrder.customer.preferredDate}</p>
                  <p><strong>Slot:</strong> {selectedOrder.customer.preferredTime}</p>
                  <p className="text-[11px] text-[#9A8C73]">Submitted: {formatDateTime(selectedOrder.createdAt)}</p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1">
                  <span className="font-bold text-[#8B5E3C] uppercase text-[10px] tracking-wider block">
                    Location &amp; Delivery
                  </span>
                  {selectedOrder.customer.address ? (
                    <p><strong>Address:</strong> {selectedOrder.customer.address}</p>
                  ) : (
                    <p><strong>Store Pickup:</strong> Customer will collect at Tenzo Bakery counter.</p>
                  )}
                  {selectedOrder.customer.notes && (
                    <p className="text-[#C0392B] font-medium pt-1">
                      <strong>Special Note:</strong> {selectedOrder.customer.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-[0.15em] text-[#8B5E3C] text-[10px]">
                  Baking Items List
                </h4>
                <div className="border border-[#E5E1D8] rounded-2xl overflow-hidden divide-y divide-[#F0ECE4]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.productName} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#E5E1D8]" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-[#2D241E]">{item.productName}</p>
                          <p className="text-[#7A6C5D] font-mono">{formatLKR(item.price)} per {item.unit}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <p className="font-bold text-sm text-[#2D241E]">{item.quantity} {item.unit}</p>
                        <p className="text-xs font-semibold text-[#8B5E3C]">{formatLKR(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financials */}
                <div className="pt-2 flex justify-between items-baseline border-t border-[#E5E1D8] text-sm">
                  <span className="font-bold text-[#2D241E]">Total Receivable:</span>
                  <span className="font-mono text-xl font-bold text-[#2D241E]">
                    {formatLKR(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E1D8]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E5E1D8] border border-[#E5E1D8] text-[#2D241E] font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#7A6C5D]" />
                    <span>Print Kitchen Slip</span>
                  </button>

                  <a
                    href={getWhatsAppLink(selectedOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#2D241E] font-bold text-xs flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Notify Customer on WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#2D241E] text-white text-xs font-semibold hover:bg-[#3D332D] cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
