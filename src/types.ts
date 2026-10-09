export type Role = 'OWNER' | 'STAFF';

export type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  image?: string;
  createdAt: string;
}

export interface Membership {
  userId: string;
  storeId: string;
  role: Role;
}

export interface StoreTheme {
  id: 'minimal' | 'bold' | 'elegant' | 'fresh';
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'system-ui' | 'Georgia' | 'Courier';
  cardStyle: 'flat' | 'elevated' | 'bordered';
  bannerBg: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  currency: string; // default INR
  themeId: 'minimal' | 'bold' | 'elegant' | 'fresh';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'system-ui' | 'Georgia' | 'Courier';
  footerText: string;
  tagline?: string;
  heroHeadline?: string;
  heroCtaText?: string;
  announcementText?: string;
  announcementEnabled?: boolean;
  announcementBgColor?: string;
  announcementTextColor?: string;
  socialInstagram?: string;
  socialWhatsapp?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  openingHours?: string;
  returnPolicyNotice?: string;
  shippingPolicyNotice?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Decimal in INR
  comparePrice?: number;
  discountPct?: number;
  stock: number;
  sku: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}
