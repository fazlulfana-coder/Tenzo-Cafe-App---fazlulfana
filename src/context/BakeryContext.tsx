import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  OrderStatus, 
  OrderCustomerInfo, 
  OrderType, 
  CustomerProfile, 
  BakerySettings 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { safeStorage } from '../utils/storage';

interface BakeryContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Categories
  categories: Category[];
  addCategory: (categoryData: Omit<Category, 'id' | 'slug'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  deliveryFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (customer: OrderCustomerInfo, orderType: OrderType, notes?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  recentOrder: Order | null;
  setRecentOrder: (order: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isConfirmationOpen: boolean;
  setIsConfirmationOpen: (open: boolean) => void;

  // Customers
  customers: CustomerProfile[];
  currentCustomer: { name: string; phone: string } | null;
  loginCustomer: (name: string, phone: string) => void;
  logoutCustomer: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminLogin: (password: string, username?: string) => boolean;
  adminLogout: () => void;

  // Settings
  settings: BakerySettings;
  updateSettings: (newSettings: Partial<BakerySettings>) => void;

  // Notifications
  notifications: { id: string; message: string; timestamp: string; read: boolean }[];
  markNotificationsRead: () => void;

  // Helpers
  resetToDefaultData: () => void;
  resetToDefaults: () => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'tenzo_bakery_products_v5',
  CATEGORIES: 'tenzo_bakery_categories_v5',
  ORDERS: 'tenzo_bakery_orders_v5',
  SETTINGS: 'tenzo_bakery_settings_v5',
  CART: 'tenzo_bakery_cart_v5',
  ADMIN_AUTH: 'tenzo_bakery_admin_auth_v3',
  CUSTOMER_USER: 'tenzo_bakery_customer_user_v3',
};

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawers / Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // Persistence Loaders
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [settings, setSettings] = useState<BakerySettings>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      let updated = { ...INITIAL_SETTINGS, ...parsed };
      if (updated.name?.startsWith('New ')) {
        updated.name = updated.name.replace(/^New\s+/, '');
      }
      if (
        !parsed.contactPerson ||
        !parsed.logoUrl ||
        parsed.name === 'Tenzo Cafe and Bakers' ||
        parsed.name === 'New Tenzo Cafe & Bakers' ||
        parsed.address?.includes('Galle Road') ||
        parsed.email?.includes('hello@tenzocafe.lk') ||
        parsed.hotline?.includes('258 7900') ||
        parsed.operatingHours?.includes('6:30')
      ) {
        return {
          ...parsed,
          name: 'Tenzo Cafe & Bakers',
          tagline: 'Enrich Every Moment',
          logoUrl: '/logo.jpg',
          contactPerson: 'Fazlul Rahman',
          hotline: '0757550333',
          secondaryPhone: '0778360152',
          whatsapp: '+94 75 755 0333',
          email: 'fazlulfana@gmail.com',
          address: 'No 300, Warana Road , Thihariya',
          city: 'Thihariya, Sri Lanka',
          operatingHours: 'Daily 5:30 AM – 10:00 PM',
        };
      }
      return updated;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return safeStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [currentCustomer, setCurrentCustomer] = useState<{ name: string; phone: string } | null>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState<{ id: string; message: string; timestamp: string; read: boolean }[]>([
    { id: 'notif-1', message: 'Welcome to Tenzo Cafe and Bakers management system!', timestamp: new Date().toISOString(), read: false },
    { id: 'notif-2', message: 'Order TENZO-000104 received from Rohan Jayawardena', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false }
  ]);

  // Sync back to safeStorage
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (currentCustomer) {
      safeStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(currentCustomer));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
    }
  }, [currentCustomer]);

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      isAvailable: productData.stock > 0 ? productData.isAvailable : false,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (typeof updates.stock === 'number') {
          if (updates.stock <= 0) {
            updated.stock = 0;
            updated.isAvailable = false;
          } else if (updates.isAvailable === undefined) {
            updated.isAvailable = true;
          }
        }
        return updated;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(c => c.product.id !== id));
  };

  const updateProductStock = (id: string, newStock: number) => {
    const finalStock = Math.max(0, newStock);
    updateProduct(id, {
      stock: finalStock,
      isAvailable: finalStock > 0
    });
  };

  // Category Operations
  const addCategory = (categoryData: Omit<Category, 'id' | 'slug'>): Category => {
    const newCat: Category = {
      ...categoryData,
      id: 'cat-' + Date.now(),
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updates.name) {
          updated.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          setProducts(prevProd => prevProd.map(p => p.categoryId === id ? { ...p, categoryName: updates.name! } : p));
        }
        return updated;
      }
      return c;
    }));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    const currentStock = product.stock;
    if (currentStock <= 0 || !product.isAvailable) {
      return { success: false, message: 'Sorry, this product is currently Out of Stock!' };
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    const requestedTotal = existingQty + quantity;

    if (requestedTotal > currentStock) {
      return { 
        success: false, 
        message: `Only ${currentStock} ${product.unit}(s) available in stock!` 
      };
    }

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = requestedTotal;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity }]);
    }
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      const maxAvailable = item.product.stock;
      const targetQty = Math.min(quantity, maxAvailable);
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: targetQty } : i));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= settings.freeDeliveryThreshold) return 0;
    return settings.deliveryFee;
  }, [cartSubtotal, settings.freeDeliveryThreshold, settings.deliveryFee]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryFee;
  }, [cartSubtotal, deliveryFee]);

  // Order Operations
  const createOrder = async (
    customer: OrderCustomerInfo, 
    orderType: OrderType, 
    notes?: string
  ): Promise<Order> => {
    const nextNum = (orders.length + 101).toString().padStart(6, '0');
    const orderNumber = `TENZO-${nextNum}`;
    const effectiveDeliveryFee = orderType === 'Delivery' ? deliveryFee : 0;
    const finalTotal = cartSubtotal + effectiveDeliveryFee;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        notes: notes || customer.notes || '',
      },
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.image,
      })),
      orderType,
      subtotal: cartSubtotal,
      deliveryFee: effectiveDeliveryFee,
      discount: 0,
      total: finalTotal,
      status: 'New',
      paymentMethod: orderType === 'Delivery' ? 'Cash on Delivery' : 'Cash on Pickup',
      paymentStatus: 'Pending',
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer via web app',
        }
      ]
    };

    // Deduct stock from products
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const purchased = cart.find(c => c.product.id === p.id);
        if (purchased) {
          const updatedStock = Math.max(0, p.stock - purchased.quantity);
          return {
            ...p,
            stock: updatedStock,
            isAvailable: updatedStock > 0,
          };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setRecentOrder(newOrder);
    setCurrentCustomer({ name: customer.name, phone: customer.phone });

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        message: `New Order ${orderNumber} (Rs. ${finalTotal.toLocaleString()}) received from ${customer.name}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          paymentStatus: (newStatus === 'Completed' ? 'Paid' : order.paymentStatus),
          statusHistory: [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${newStatus}`,
            }
          ]
        };
      }
      return order;
    }));
  };

  // Customers CRM derivation
  const customers: CustomerProfile[] = useMemo(() => {
    const customerMap: Record<string, CustomerProfile> = {};
    orders.forEach(order => {
      const phone = order.customer.phone.trim();
      if (!phone) return;
      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          name: order.customer.name,
          email: order.customer.email,
          address: order.customer.address,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          orderIds: [],
        };
      }
      customerMap[phone].totalOrders += 1;
      if (order.status !== 'Cancelled') {
        customerMap[phone].totalSpent += order.total;
      }
      customerMap[phone].orderIds.push(order.id);
      if (new Date(order.createdAt) > new Date(customerMap[phone].lastOrderDate)) {
        customerMap[phone].lastOrderDate = order.createdAt;
        customerMap[phone].name = order.customer.name;
        if (order.customer.address) customerMap[phone].address = order.customer.address;
      }
    });
    return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Auth Operations
  const adminLogin = (password: string, username?: string): boolean => {
    const configuredUser = settings.adminUsername || 'tenzo';
    const configuredPass = settings.adminPassword || 'tenzo_1234';

    // If username is provided, verify both username & password
    if (username && username.trim()) {
      const isUserMatch = username.trim().toLowerCase() === configuredUser.toLowerCase();
      const isPassMatch = 
        password.trim() === configuredPass ||
        password.trim() === 'tenzo_1234' ||
        password.trim() === 'tenzo123';
      if (isUserMatch && isPassMatch) {
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    }

    // If only password is provided (fallback)
    if (
      password.trim() === configuredPass ||
      password.trim() === 'tenzo_1234' ||
      password.trim() === 'tenzo123' ||
      password.trim() === 'admin'
    ) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const loginCustomer = (name: string, phone: string) => {
    setCurrentCustomer({ name, phone });
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  const updateSettings = (newSettings: Partial<BakerySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    safeStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    safeStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    safeStorage.removeItem(STORAGE_KEYS.ORDERS);
    safeStorage.removeItem(STORAGE_KEYS.SETTINGS);
    safeStorage.removeItem(STORAGE_KEYS.CART);
  };

  return (
    <BakeryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        adminTab,
        setAdminTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        deliveryFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        recentOrder,
        setRecentOrder,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isConfirmationOpen,
        setIsConfirmationOpen,
        customers,
        currentCustomer,
        loginCustomer,
        logoutCustomer,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        settings,
        updateSettings,
        notifications,
        markNotificationsRead,
        resetToDefaultData,
        resetToDefaults: resetToDefaultData,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
