import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatLKR, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';
import { 
  X, 
  Receipt, 
  Search, 
  Clock, 
  Package, 
  Truck, 
  Store, 
  ChevronRight, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, currentCustomer } = useBakery();
  const [searchTerm, setSearchTerm] = useState(currentCustomer?.phone || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Filter orders by phone or order number
  const filteredOrders = orders.filter(o => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    if (!cleanSearch) return true; // show recent if blank
    return (
      o.customer.phone.toLowerCase().includes(cleanSearch) ||
      o.orderNumber.toLowerCase().includes(cleanSearch) ||
      o.customer.name.toLowerCase().includes(cleanSearch)
    );
  });

  const STEPS: OrderStatus[] = ['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Completed'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return STEPS.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D241E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E1D8] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D241E] text-[#FAF7F2] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-bakery text-xl font-normal italic text-[#2D241E]">
                Track Bakery Orders
              </h2>
              <p className="text-xs text-[#7A6C5D] font-medium">
                Enter your phone number or Order # to view real-time baking status
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

        {/* Search filter bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E1D8] bg-white shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9A8C73] absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="input-search-my-orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter phone number (e.g. 077 452 8910) or Order # (TENZO-000101)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E1D8] text-xs sm:text-sm bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#8B5E3C] transition-colors"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {selectedOrder ? (
            /* Detailed Order View */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-semibold text-[#8B5E3C] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
              >
                ← Back to all orders
              </button>

              {/* Order Status Tracker */}
              <div className="bg-[#FAF7F2] border border-[#E5E1D8] rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B5E3C]">
                      Live Status Tracker
                    </span>
                    <h3 className="font-mono text-xl font-bold text-[#2D241E]">
                      {selectedOrder.orderNumber}
                    </h3>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {selectedOrder.status === 'Cancelled' ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    This order was cancelled. Please contact bakery hotline for assistance.
                  </div>
                ) : (
                  /* Progress timeline */
                  <div className="pt-2">
                    <div className="grid grid-cols-6 gap-1 relative text-center text-[10px] font-semibold text-[#7A6C5D]">
                      {STEPS.map((step, idx) => {
                        const currentIdx = getStepIndex(selectedOrder.status);
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[11px] font-bold ${
                              isCurrent 
                                ? 'bg-[#2D241E] text-white ring-4 ring-[#E5E1D8]' 
                                : isDone 
                                ? 'bg-emerald-700 text-white' 
                                : 'bg-[#E5E1D8] text-[#9A8C73]'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`line-clamp-1 ${isCurrent ? 'text-[#2D241E] font-bold' : isDone ? 'text-[#2D241E]' : 'text-[#9A8C73]'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Info Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5E1D8] space-y-2">
                  <h4 className="font-bold text-[#8B5E3C] uppercase tracking-[0.15em] text-[10px]">
                    Delivery / Pickup Details
                  </h4>
                  <p><strong className="text-[#2D241E]">Customer:</strong> {selectedOrder.customer.name}</p>
                  <p><strong className="text-[#2D241E]">Contact:</strong> <span className="font-mono">{selectedOrder.customer.phone}</span></p>
                  <p><strong className="text-[#2D241E]">Type:</strong> {selectedOrder.orderType}</p>
                  {selectedOrder.customer.address && (
                    <p><strong className="text-[#2D241E]">Address:</strong> {selectedOrder.customer.address}</p>
                  )}
                  <p><strong className="text-[#2D241E]">Preferred Slot:</strong> <span className="font-mono">{selectedOrder.customer.preferredDate}</span> at {selectedOrder.customer.preferredTime}</p>
                  {selectedOrder.customer.notes && (
                    <p><strong className="text-[#2D241E]">Notes:</strong> {selectedOrder.customer.notes}</p>
                  )}
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5E1D8] space-y-2">
                  <h4 className="font-bold text-[#8B5E3C] uppercase tracking-[0.15em] text-[10px]">
                    Payment Summary
                  </h4>
                  <div className="flex justify-between text-[#7A6C5D]">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-[#2D241E]">{formatLKR(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#7A6C5D]">
                    <span>Delivery Fee</span>
                    <span className="font-mono">{selectedOrder.deliveryFee === 0 ? 'FREE' : formatLKR(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E1D8] flex justify-between font-bold text-[#2D241E] text-sm">
                    <span>Total Paid/Due</span>
                    <span className="font-mono text-base">{formatLKR(selectedOrder.total)}</span>
                  </div>
                  <p className="text-[11px] text-[#9A8C73] pt-1">
                    Method: {selectedOrder.paymentMethod} • Status: <strong className="text-[#2D241E]">{selectedOrder.paymentStatus}</strong>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#8B5E3C] uppercase tracking-[0.15em] text-[10px]">
                  Order Items ({selectedOrder.items.length})
                </h4>
                <div className="border border-[#E5E1D8] rounded-2xl overflow-hidden divide-y divide-[#F0ECE4]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex items-center justify-between text-xs bg-white">
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
                      <div className="text-right">
                        <p className="font-mono font-bold text-[#2D241E]">{item.quantity}x</p>
                        <p className="font-mono font-semibold text-[#8B5E3C]">{formatLKR(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Orders Listing */
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E5E1D8] text-[#9A8C73] flex items-center justify-center mx-auto">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#2D241E]">
                    No matching bakery orders found
                  </p>
                  <p className="text-xs text-[#9A8C73] max-w-sm mx-auto">
                    Try searching with another phone number or Order number like TENZO-000101
                  </p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] hover:border-[#8B5E3C] bg-white hover:bg-[#FAF7F2] transition-all cursor-pointer shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#2D241E]">
                          {order.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6C5D]">
                        {order.items.length} items • {order.orderType === 'Delivery' ? '🛵 Delivery' : '🏪 Pickup'} • <span className="font-mono">{formatDateTime(order.createdAt)}</span>
                      </p>
                      <p className="text-xs text-[#9A8C73] line-clamp-1">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:border-l sm:border-[#E5E1D8] sm:pl-4">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-[#9A8C73] uppercase tracking-[0.15em] block">Total</span>
                        <span className="font-mono font-bold text-base text-[#2D241E]">
                          {formatLKR(order.total)}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#9A8C73]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
