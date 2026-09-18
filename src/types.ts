export type UnitType = 'Piece' | 'Kg' | '500g' | 'Pack' | 'Loaf' | 'Box' | 'Bottle' | 'Cup';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number; // in LKR (Rs.)
  originalPrice?: number; // for discounts
  stock: number;
  unit: UnitType;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isSpecialOffer?: boolean;
  isVegetarian?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type OrderType = 'Pickup' | 'Delivery';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: UnitType;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. TENZO-000101
  createdAt: string;
  customer: OrderCustomerInfo;
  items: OrderItem[];
  orderType: OrderType;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery' | 'Cash on Pickup' | 'Bank Transfer';
  paymentStatus: 'Pending' | 'Paid';
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface CustomerProfile {
  phone: string;
  name: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orderIds: string[];
}

export interface BakerySettings {
  name: string;
  tagline: string;
  logoUrl?: string;
  contactPerson: string;
  hotline: string;
  secondaryPhone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  operatingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcement: string;
  isOrderingEnabled: boolean;
  currency?: string;
  adminPassword?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
}
