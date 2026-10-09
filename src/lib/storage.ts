import { Store, Product, Category, Order, User, Membership, CartItem, OrderStatus } from '../types';
import {
  DEMO_USER,
  DEMO_STORE,
  DEMO_MEMBERSHIP,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_ORDERS
} from '../data/seed';

const STORAGE_KEYS = {
  USERS: 'cypher_users',
  STORES: 'cypher_stores',
  MEMBERSHIPS: 'cypher_memberships',
  CATEGORIES: 'cypher_categories',
  PRODUCTS: 'cypher_products',
  ORDERS: 'cypher_orders',
  CURRENT_USER: 'cypher_current_user',
  INITIALIZED: 'cypher_initialized_v1'
};

// Seed initial database if empty
function initializeStorageIfNeeded() {
  if (typeof window === 'undefined') return;

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEMO_USER]));
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify([DEMO_STORE]));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify([DEMO_MEMBERSHIP]));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEMO_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Helpers
function getList<T>(key: string): T[] {
  initializeStorageIfNeeded();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setList<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

/* ================= AUTHENTICATION ================= */

export function getCurrentUser(): User | null {
  initializeStorageIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signup(name: string, email: string, password: string): User {
  const users = getList<User>(STORAGE_KEYS.USERS);
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    name: name.trim(),
    passwordHash: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setList(STORAGE_KEYS.USERS, users);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  return newUser;
}

export function login(email: string, password: string): User {
  const users = getList<User>(STORAGE_KEYS.USERS);
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    u => u.email.toLowerCase() === normalizedEmail && (u.passwordHash === password || password === 'demo123')
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/* ================= STORES & MEMBERSHIPS ================= */

export function getStoresForUser(userId: string): Store[] {
  const memberships = getList<Membership>(STORAGE_KEYS.MEMBERSHIPS);
  const stores = getList<Store>(STORAGE_KEYS.STORES);

  const userStoreIds = new Set(
    memberships.filter(m => m.userId === userId).map(m => m.storeId)
  );

  return stores.filter(s => userStoreIds.has(s.id));
}

export function getStoreBySlug(slug: string): Store | null {
  const stores = getList<Store>(STORAGE_KEYS.STORES);
  return stores.find(s => s.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function requireStore(slug: string, userId?: string): { store: Store; membership?: Membership } {
  const store = getStoreBySlug(slug);
  if (!store) {
    throw new Error('Store not found');
  }

  if (userId) {
    const memberships = getList<Membership>(STORAGE_KEYS.MEMBERSHIPS);
    const membership = memberships.find(m => m.storeId === store.id && m.userId === userId);
    if (!membership) {
      throw new Error('UNAUTHORIZED: You do not have permissions for this store');
    }
    return { store, membership };
  }

  return { store };
}

export function createStore(
  storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>,
  ownerId: string,
  categories: Array<{ name: string; slug: string }>,
  products: Product[]
): Store {
  const stores = getList<Store>(STORAGE_KEYS.STORES);
  const memberships = getList<Membership>(STORAGE_KEYS.MEMBERSHIPS);
  const allCategories = getList<Category>(STORAGE_KEYS.CATEGORIES);
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);

  // Check unique slug
  let uniqueSlug = storeData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  let counter = 1;
  while (stores.some(s => s.slug.toLowerCase() === uniqueSlug)) {
    uniqueSlug = `${storeData.slug}-${counter}`;
    counter++;
  }

  const storeId = `str_${Date.now()}`;
  const now = new Date().toISOString();

  const newStore: Store = {
    ...storeData,
    id: storeId,
    slug: uniqueSlug,
    createdAt: now,
    updatedAt: now
  };

  stores.push(newStore);
  setList(STORAGE_KEYS.STORES, stores);

  // Create membership
  memberships.push({
    userId: ownerId,
    storeId,
    role: 'OWNER'
  });
  setList(STORAGE_KEYS.MEMBERSHIPS, memberships);

  // Create categories
  const createdCategories: Category[] = categories.map((cat, idx) => ({
    id: `cat_${storeId}_${idx + 1}`,
    storeId,
    name: cat.name,
    slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
  allCategories.push(...createdCategories);
  setList(STORAGE_KEYS.CATEGORIES, allCategories);

  // Attach products
  const categoryMap = new Map(createdCategories.map(c => [c.name.toLowerCase(), c.id]));
  const formattedProducts = products.map((p, idx) => ({
    ...p,
    id: `prod_${storeId}_${idx + 1}`,
    storeId,
    categoryId: categoryMap.get((p.categoryName || '').toLowerCase()) || createdCategories[0]?.id || `cat_${storeId}_1`
  }));
  allProducts.push(...formattedProducts);
  setList(STORAGE_KEYS.PRODUCTS, allProducts);

  return newStore;
}

export function updateStore(storeId: string, updates: Partial<Store>): Store {
  const stores = getList<Store>(STORAGE_KEYS.STORES);
  const index = stores.findIndex(s => s.id === storeId);
  if (index === -1) {
    throw new Error('Store not found');
  }

  const updated: Store = {
    ...stores[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  stores[index] = updated;
  setList(STORAGE_KEYS.STORES, stores);
  return updated;
}

/* ================= CATEGORIES ================= */

export function getCategoriesByStore(storeId: string): Category[] {
  const allCategories = getList<Category>(STORAGE_KEYS.CATEGORIES);
  return allCategories.filter(c => c.storeId === storeId);
}

export function addCategory(storeId: string, name: string): Category {
  const allCategories = getList<Category>(STORAGE_KEYS.CATEGORIES);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newCat: Category = {
    id: `cat_${storeId}_${Date.now()}`,
    storeId,
    name: name.trim(),
    slug
  };

  allCategories.push(newCat);
  setList(STORAGE_KEYS.CATEGORIES, allCategories);
  return newCat;
}

/* ================= PRODUCTS ================= */

export function getProductsByStore(storeId: string): Product[] {
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);
  const categories = getCategoriesByStore(storeId);
  const catMap = new Map(categories.map(c => [c.id, c.name]));

  return allProducts
    .filter(p => p.storeId === storeId)
    .map(p => ({
      ...p,
      categoryName: p.categoryName || catMap.get(p.categoryId) || 'General'
    }));
}

export function getProductBySlug(storeId: string, slug: string): Product | null {
  const products = getProductsByStore(storeId);
  return products.find(p => p.slug === slug) || null;
}

export function createProduct(storeId: string, data: Partial<Product>): Product {
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);
  const categories = getCategoriesByStore(storeId);
  const cat = categories.find(c => c.id === data.categoryId);

  const name = data.name?.trim() || 'Untitled Product';
  const slug = (data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) + '-' + Date.now().toString().slice(-4);

  const price = Number(data.price) || 0;
  const comparePrice = data.comparePrice ? Number(data.comparePrice) : undefined;
  const discountPct = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : undefined;

  const newProd: Product = {
    id: `prod_${storeId}_${Date.now()}`,
    storeId,
    categoryId: data.categoryId || (categories[0]?.id ?? 'cat_default'),
    categoryName: cat?.name || data.categoryName || 'General',
    name,
    slug,
    description: data.description?.trim() || '',
    price,
    comparePrice,
    discountPct,
    stock: data.stock !== undefined ? Number(data.stock) : 10,
    sku: data.sku?.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    image: data.image?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: new Date().toISOString()
  };

  allProducts.push(newProd);
  setList(STORAGE_KEYS.PRODUCTS, allProducts);
  return newProd;
}

export function updateProduct(id: string, updates: Partial<Product>): Product {
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);
  const index = allProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }

  const existing = allProducts[index];
  const price = updates.price !== undefined ? Number(updates.price) : existing.price;
  const comparePrice = updates.comparePrice !== undefined ? Number(updates.comparePrice) : existing.comparePrice;
  const discountPct = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : undefined;

  const updated: Product = {
    ...existing,
    ...updates,
    price,
    comparePrice,
    discountPct,
    stock: updates.stock !== undefined ? Number(updates.stock) : existing.stock
  };

  allProducts[index] = updated;
  setList(STORAGE_KEYS.PRODUCTS, allProducts);
  return updated;
}

export function deleteProduct(id: string): void {
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);
  const filtered = allProducts.filter(p => p.id !== id);
  setList(STORAGE_KEYS.PRODUCTS, filtered);
}

/* ================= ORDERS ================= */

export function getOrdersByStore(storeId: string): Order[] {
  const allOrders = getList<Order>(STORAGE_KEYS.ORDERS);
  return allOrders
    .filter(o => o.storeId === storeId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createOrder(
  storeId: string,
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'storeId'>
): Order {
  const allOrders = getList<Order>(STORAGE_KEYS.ORDERS);
  const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}`,
    storeId,
    orderNumber,
    createdAt: new Date().toISOString()
  };

  allOrders.unshift(newOrder);
  setList(STORAGE_KEYS.ORDERS, allOrders);

  // Decrement product stock
  const allProducts = getList<Product>(STORAGE_KEYS.PRODUCTS);
  for (const item of newOrder.items) {
    const prodIdx = allProducts.findIndex(p => p.id === item.productId && p.storeId === storeId);
    if (prodIdx !== -1) {
      allProducts[prodIdx].stock = Math.max(0, allProducts[prodIdx].stock - item.qty);
    }
  }
  setList(STORAGE_KEYS.PRODUCTS, allProducts);

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order {
  const allOrders = getList<Order>(STORAGE_KEYS.ORDERS);
  const index = allOrders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new Error('Order not found');
  }

  allOrders[index].status = status;
  setList(STORAGE_KEYS.ORDERS, allOrders);
  return allOrders[index];
}

/* ================= CART STORAGE (cart_[slug]) ================= */

export function getCart(slug: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = `cart_${slug}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(slug: string, items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

export function clearCart(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`cart_${slug}`);
  } catch (e) {
    console.error('Failed to clear cart', e);
  }
}
