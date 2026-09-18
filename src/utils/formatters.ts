import { OrderStatus, Order, OrderCustomerInfo } from '../types';

export const formatLKR = (amount: number): string => {
  return `Rs. ${Math.round(amount).toLocaleString('en-US')}`;
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeClass = (status: OrderStatus): string => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Confirmed':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Preparing':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Ready':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Out for Delivery':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-stone-100 text-stone-800 border-stone-200';
  }
};

export const generateWhatsAppMessage = (order: Order, bakeryName: string = 'Tenzo Cafe and Bakers'): string => {
  if (!order) return '';
  const customer: Partial<OrderCustomerInfo> = order.customer || { name: 'Customer', phone: '' };
  const itemsText = (order.items || [])
    .map(item => `• ${item.quantity}x ${item.productName} (${formatLKR(item.price * item.quantity)})`)
    .join('\n');

  const text = `🍰 *${bakeryName} - Order Confirmation*\n` +
    `📋 *Order #:* ${order.orderNumber || ''}\n` +
    `👤 *Customer:* ${customer.name}\n` +
    `📞 *Phone:* ${customer.phone}\n` +
    `🛵 *Type:* ${order.orderType || 'Pickup'}\n` +
    (customer.address ? `📍 *Address:* ${customer.address}\n` : '') +
    `⏰ *Preferred Date/Time:* ${customer.preferredDate || ''} at ${customer.preferredTime || ''}\n\n` +
    `*Items:*\n${itemsText}\n\n` +
    `Subtotal: ${formatLKR(order.subtotal || 0)}\n` +
    (order.deliveryFee && order.deliveryFee > 0 ? `Delivery Fee: ${formatLKR(order.deliveryFee)}\n` : '') +
    `*Total Amount: ${formatLKR(order.total || 0)}*\n` +
    `Payment: ${order.paymentMethod || 'Cash'}\n` +
    (customer.notes ? `\n📝 *Notes:* ${customer.notes}\n` : '') +
    `\nThank you for choosing ${bakeryName}! Freshly baked, made with love. ✨`;

  return encodeURIComponent(text);
};
