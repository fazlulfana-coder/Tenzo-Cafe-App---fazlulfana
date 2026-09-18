export interface BakeryBranch {
  id: string;
  name: string;
  tagline: string;
  isMain: boolean;
  address: string;
  city: string;
  hotline: string;
  phone?: string;
  whatsapp: string;
  hours: string;
  features: string[];
  googleMapsUrl: string;
}

export const BAKERY_BRANCHES: BakeryBranch[] = [
  {
    id: 'branch-thihariya',
    name: 'Thihariya Branch (Main Cafe & Flagship)',
    tagline: 'Main Oven Hearth, Dine-in Cafe & Celebration Cakes',
    isMain: true,
    address: 'Warana Road, Kandy Road, Thihariya, Sri Lanka',
    city: 'Thihariya',
    hotline: '075 755 0333',
    whatsapp: '94757550333',
    hours: '5:30 AM – 10:30 PM (Daily)',
    features: [
      'Wood-Fired & Hearth Oven Bakes',
      'Fresh Thatty Paan & Maalu Buns Batches',
      'Custom Gateaux & Birthday Cakes',
      'Cozy Dine-in Cafe & Hot Beverages',
      'Curbside Pickup & Doorstep Delivery',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Thihariya+Sri+Lanka',
  },
  {
    id: 'branch-ellalamulla',
    name: 'Ellalamulla Branch',
    tagline: 'Daily Fresh Bakes & Evening Short Eats Counter',
    isMain: false,
    address: 'Ellalamulla Junction, Thihariya / Kalagedihena Road, Sri Lanka',
    city: 'Ellalamulla',
    hotline: '077 836 0152',
    whatsapp: '94778360152',
    hours: '6:00 AM – 10:00 PM (Daily)',
    features: [
      'Hot Morning Bread Batches',
      'Sweet Kimbula Buns & Tea Buns',
      'Spicy Chicken & Mutton Rolls',
      'Express Counter Takeaway',
      'WhatsApp Quick Pickup Orders',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Ellalamulla+Sri+Lanka',
  },
  {
    id: 'branch-kalleliya',
    name: 'Kalleliya Branch',
    tagline: 'Neighborhood Bakery, Tea & Snack Hub',
    isMain: false,
    address: 'Main Street, Kalleliya (Near Station Road), Sri Lanka',
    city: 'Kalleliya',
    hotline: '075 755 0333',
    whatsapp: '94757550333',
    hours: '6:00 AM – 9:30 PM (Daily)',
    features: [
      'Daily Fresh Loaves & Thatty Breads',
      'Crispy Savory Short Eats',
      'Butter Cakes & Tea Cakes',
      'Hot Ceylon Milk Tea & Iced Coffee',
      'Local Counter Pickup',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Kalleliya+Sri+Lanka',
  },
];
