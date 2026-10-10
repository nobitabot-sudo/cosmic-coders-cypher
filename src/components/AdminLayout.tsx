import React, { useState } from 'react';
import { Store, Product, Order, OrderStatus } from '../types';
import { ShareLinkButton } from './ShareLinkButton';
import {
  getProductsByStore,
  getOrdersByStore,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  updateStore,
  getCategoriesByStore
} from '../lib/storage';
import { AIChatbot } from './AIChatbot';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Palette,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Menu,
  X,
  Store as StoreIcon,
  Search,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  store: Store;
  activeTab: 'dashboard' | 'products' | 'orders' | 'content';
  onNavigate: (route: string) => void;
  onStoreUpdate: (updated: Store) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  store,
  activeTab,
  onNavigate,
  onStoreUpdate
}) => {
  const [products, setProducts] = useState<Product[]>(() => getProductsByStore(store.id));
  const [orders, setOrders] = useState<Order[]>(() => getOrdersByStore(store.id));
  const categories = getCategoriesByStore(store.id);

  // Refresh lists
  const reloadData = () => {
    setProducts(getProductsByStore(store.id));
    setOrders(getOrdersByStore(store.id));
  };

  // Products state for add/edit modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: 999,
    comparePrice: 1299,
    stock: 20,
    sku: '',
    image: '',
    description: ''
  });

  // Content form state with rich branding & trust settings
  const [contentForm, setContentForm] = useState({
    name: store.name,
    tagline: store.tagline || 'Crafted with premium materials for everyday excellence.',
    businessType: store.businessType,
    logo: store.logo,
    banner: store.banner,
    email: store.email,
    phone: store.phone,
    address: store.address,
    openingHours: store.openingHours || 'Mon - Sat: 10:00 AM - 8:30 PM',
    returnPolicyNotice: store.returnPolicyNotice || '7 Days easy replacement & instant refund guarantee',
    socialInstagram: store.socialInstagram || '@' + store.slug,
    socialWhatsapp: store.socialWhatsapp || store.phone,
    announcementText: store.announcementText || '⚡ Special Offer: Free express delivery across India on orders over ₹999!',
    announcementEnabled: store.announcementEnabled !== false,
    footerText: store.footerText,
    primaryColor: store.primaryColor || '#4f46e5',
    accentColor: store.accentColor || '#f59e0b',
    fontFamily: store.fontFamily || 'Inter'
  });

  const [productSearch, setProductSearch] = useState('');

  // Dashboard metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: categories[0]?.id || '',
      price: 999,
      comparePrice: 1499,
      stock: 25,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'Crafted with premium materials for everyday use.'
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      categoryId: prod.categoryId,
      price: prod.price,
      comparePrice: prod.comparePrice || prod.price,
      stock: prod.stock,
      sku: prod.sku,
      image: prod.image,
      description: prod.description
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, {
          name: productForm.name,
          categoryId: productForm.categoryId,
          price: Number(productForm.price),
          comparePrice: Number(productForm.comparePrice),
          stock: Number(productForm.stock),
          sku: productForm.sku,
          image: productForm.image,
          description: productForm.description
        });
        toast.success(`Product "${productForm.name}" updated successfully!`);
      } else {
        createProduct(store.id, {
          name: productForm.name,
          categoryId: productForm.categoryId,
          price: Number(productForm.price),
          comparePrice: Number(productForm.comparePrice),
          stock: Number(productForm.stock),
          sku: productForm.sku,
          image: productForm.image,
          description: productForm.description
        });
        toast.success(`Product "${productForm.name}" added to catalog!`);
      }

      setIsProductModalOpen(false);
      reloadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  // Delete Product
  const handleDeleteProduct = (prod: Product) => {
    if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      deleteProduct(prod.id);
      toast.success(`Deleted "${prod.name}"`);
      reloadData();
    }
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    try {
      updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status changed to ${newStatus}`);
      reloadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  // Quick Restock Product
  const handleQuickRestock = (productId: string) => {
    updateProduct(productId, { stock: 30 });
    toast.success('Restocked 30 units!');
    reloadData();
  };

  // Save Content & Branding
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = updateStore(store.id, {
        name: contentForm.name,
        tagline: contentForm.tagline,
        businessType: contentForm.businessType,
        logo: contentForm.logo,
        banner: contentForm.banner,
        email: contentForm.email,
        phone: contentForm.phone,
        address: contentForm.address,
        openingHours: contentForm.openingHours,
        returnPolicyNotice: contentForm.returnPolicyNotice,
        socialInstagram: contentForm.socialInstagram,
        socialWhatsapp: contentForm.socialWhatsapp,
        announcementText: contentForm.announcementText,
        announcementEnabled: contentForm.announcementEnabled,
        footerText: contentForm.footerText,
        primaryColor: contentForm.primaryColor,
        accentColor: contentForm.accentColor,
        fontFamily: contentForm.fontFamily as any
      });
      onStoreUpdate(updated);
      toast.success('Store branding & content saved! Storefront updated.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update store content');
    }
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/admin/${store.slug}` },
    { id: 'products', label: 'Products', icon: Package, path: `/admin/${store.slug}/products` },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: `/admin/${store.slug}/orders` },
    { id: 'content', label: 'Content', icon: Palette, path: `/admin/${store.slug}/content` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
              {store.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-white truncate">{store.name}</h2>
              <span className="text-[10px] text-slate-400 block font-mono truncate">/s/{store.slug}</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-indigo-900/50"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full py-2 px-3 text-slate-400 hover:text-slate-200 text-[11px] transition-colors text-center cursor-pointer"
          >
            Switch Store / All Stores
          </button>
        </div>
      </aside>

      {/* MOBILE COMPACT TOP APP BAR (52px height) */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {store.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-white truncate max-w-[170px]">{store.name}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">Admin · {activeTab}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="min-h-[36px] px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="View Live Store"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-[11px] text-slate-400 p-1.5 hover:text-white"
            title="Switch store"
          >
            Stores
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 capitalize tracking-tight">
              {activeTab === 'content' ? 'Store Content & Branding' : activeTab}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin controls for <span className="font-semibold text-slate-800">{store.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(`/s/${store.slug}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer border border-indigo-200/60"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <main className="p-3 sm:p-6 lg:p-8 flex-1">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
                    <span>Revenue</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-emerald-600 font-medium block mt-0.5">
                    Total sales
                  </span>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
                    <span>Orders</span>
                    <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                    {orders.length}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5">
                    {orders.filter(o => o.status === 'PLACED').length} new placed
                  </span>
                </div>

                {/* Products */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
                    <span>Catalog</span>
                    <Package className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                    {products.filter(p => p.isActive).length}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5">
                    Active listings
                  </span>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
                    <span>Low Stock</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-amber-600 tabular-nums">
                    {lowStockCount}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-amber-600 font-medium block mt-0.5">
                    Units &lt; 10
                  </span>
                </div>
              </div>

              {/* 2 Grid Columns: Recent Orders + Low Stock Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Orders List */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Recent Orders</h3>
                    <button
                      onClick={() => onNavigate(`/admin/${store.slug}/orders`)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {orders.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-slate-900 truncate">
                              #{o.orderNumber} · {o.customerName}
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              {o.items.length} item(s) · {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-slate-900 tabular-nums">
                              ₹{o.total.toLocaleString('en-IN')}
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                                o.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : o.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No orders recorded yet.
                    </div>
                  )}
                </div>

                {/* Low Stock Alerts List */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Low Stock Alerts</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">threshold: &le;10</span>
                  </div>

                  {products.filter(p => p.stock <= 10).length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {products
                        .filter(p => p.stock <= 10)
                        .slice(0, 5)
                        .map(p => (
                          <div key={p.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.image}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold tabular-nums ${
                                  p.stock === 0
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.stock === 0 ? '0' : `${p.stock} left`}
                              </span>
                              <button
                                onClick={() => handleQuickRestock(p.id)}
                                className="min-h-[32px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                +30
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-emerald-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>All products have healthy inventory!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS PAGE (Mobile Responsive Cards + Desktop Table) */}
          {activeTab === 'products' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search by name or SKU..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Product</span>
                </button>
              </div>

              {/* MOBILE CARDS VIEW (< md screens) */}
              <div className="md:hidden space-y-3">
                {products
                  .filter(p =>
                    productSearch === '' ||
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.sku.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map(p => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex items-center gap-3 justify-between"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.categoryName || 'General'} · <span className="font-mono">{p.sku}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-extrabold text-slate-900 text-xs tabular-nums">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold tabular-nums ${
                              p.stock === 0
                                ? 'bg-red-100 text-red-700'
                                : p.stock < 10
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </div>
                      </div>

                      {/* Touch Friendly Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* DESKTOP TABLE VIEW (>= md screens) */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (INR)</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter(p =>
                          productSearch === '' ||
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img
                                src={p.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{p.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{p.sku}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-600">
                              {p.categoryName || 'General'}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                              ₹{p.price.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold tabular-nums ${
                                  p.stock === 0
                                    ? 'bg-red-100 text-red-700'
                                    : p.stock < 10
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {p.stock} units
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p)}
                                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS PAGE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Total {orders.length} orders received. Update statuses with 1 tap.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {orders.map(order => {
                  const statuses: OrderStatus[] = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-extrabold text-xs sm:text-sm text-indigo-600">
                              #{order.orderNumber}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                            {order.customerPhone} · {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums">
                            ₹{order.total.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-slate-500">{order.items.length} item(s)</span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="bg-slate-50 rounded-xl p-2.5 divide-y divide-slate-200/60">
                        {order.items.map(item => (
                          <div key={item.id} className="py-1.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              {item.image && (
                                <img src={item.image} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                              )}
                              <span className="font-medium text-slate-800 truncate">{item.name}</span>
                            </div>
                            <div className="font-mono text-slate-600 tabular-nums shrink-0 ml-2">
                              {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 leading-snug">
                        <span className="font-semibold text-slate-700">Ship to: </span>
                        {order.shippingAddress}
                      </div>

                      {/* 5 Status Buttons (Minimum 44px tap target height) */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Fulfillment Status:
                        </span>
                        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
                          {statuses.map(st => {
                            const isActive = order.status === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleUpdateOrderStatus(order.id, st)}
                                className={`min-h-[36px] px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                                  isActive
                                    ? st === 'DELIVERED'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'CANCELLED'
                                      ? 'bg-red-600 text-white shadow-xs'
                                      : 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: RICH CONTENT, THEME & BRANDING DESIGNER */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveContent} className="max-w-4xl space-y-6 sm:space-y-8">
              {/* 1. REAL-TIME INTERACTIVE LIVE PREVIEW CARD */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Live Storefront Preview</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">/s/{store.slug}</span>
                </div>

                <div
                  className="p-4 sm:p-6 bg-slate-50 transition-all"
                  style={{
                    fontFamily:
                      contentForm.fontFamily === 'Inter'
                        ? 'Inter, sans-serif'
                        : contentForm.fontFamily === 'Georgia'
                        ? 'Georgia, serif'
                        : contentForm.fontFamily === 'Courier'
                        ? 'Courier, monospace'
                        : 'system-ui, sans-serif'
                  }}
                >
                  {/* Top Announcement Bar Preview */}
                  {contentForm.announcementEnabled && contentForm.announcementText && (
                    <div
                      className="text-white text-[10px] sm:text-xs py-1.5 px-3 text-center font-bold rounded-lg mb-3 shadow-xs transition-colors"
                      style={{ backgroundColor: contentForm.primaryColor }}
                    >
                      {contentForm.announcementText}
                    </div>
                  )}

                  {/* Header Preview */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      {contentForm.logo ? (
                        <img
                          src={contentForm.logo}
                          alt=""
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover bg-slate-100 shadow-xs"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-white font-extrabold flex items-center justify-center text-sm shadow-xs"
                          style={{ backgroundColor: contentForm.primaryColor }}
                        >
                          {contentForm.name ? contentForm.name.charAt(0) : 'S'}
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {contentForm.name || 'Store Name'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {contentForm.businessType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white"
                        style={{ backgroundColor: contentForm.primaryColor }}
                      >
                        Bag (2)
                      </span>
                    </div>
                  </div>

                  {/* Hero Banner Preview */}
                  <div
                    className="rounded-2xl p-4 sm:p-6 text-white mb-4 shadow-sm relative overflow-hidden"
                    style={{
                      background: contentForm.banner
                        ? `linear-gradient(to right, ${contentForm.primaryColor}F0, rgba(15, 23, 42, 0.9)), url(${contentForm.banner}) center/cover`
                        : `linear-gradient(135deg, ${contentForm.primaryColor} 0%, #0f172a 100%)`
                    }}
                  >
                    <span
                      className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs inline-block"
                      style={{ backgroundColor: contentForm.accentColor, color: '#1e1b4b' }}
                    >
                      {contentForm.businessType}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold mt-2 tracking-tight">
                      {contentForm.name || 'Your Store Name'}
                    </h3>
                    <p className="text-xs text-white/90 mt-1 max-w-md">
                      {contentForm.tagline || contentForm.footerText || 'Discover curated collections crafted with attention to detail.'}
                    </p>
                  </div>

                  {/* Mini Product Card Preview */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 max-w-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                        Item
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Sample Catalog Item</div>
                        <div className="text-[10px] text-slate-400">₹1,299</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{ backgroundColor: contentForm.primaryColor }}
                      className="px-3 py-1 text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. 1-CLICK CURATED DESIGNER PALETTES */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    🎨 Curated Designer Palettes
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any palette to instantly apply matching primary & accent brand colors.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Indigo Horizon', primary: '#4f46e5', accent: '#f59e0b', desc: 'Punchy modern retail' },
                    { name: 'Emerald Luxe', primary: '#065f46', accent: '#d97706', desc: 'Artisanal organic luxury' },
                    { name: 'Midnight Obsidian', primary: '#0f172a', accent: '#64748b', desc: 'Minimalist monochrome' },
                    { name: 'Sunset Terracotta', primary: '#9a3412', accent: '#f97316', desc: 'Warm lifestyle brand' },
                    { name: 'Cyber Teal', primary: '#0e7490', accent: '#06b6d4', desc: 'Tech & gadgets vibe' },
                    { name: 'Royal Amethyst', primary: '#581c87', accent: '#ec4899', desc: 'High fashion & beauty' }
                  ].map(pal => {
                    const isSelected =
                      contentForm.primaryColor.toLowerCase() === pal.primary.toLowerCase() &&
                      contentForm.accentColor.toLowerCase() === pal.accent.toLowerCase();
                    return (
                      <div
                        key={pal.name}
                        onClick={() =>
                          setContentForm({
                            ...contentForm,
                            primaryColor: pal.primary,
                            accentColor: pal.accent
                          })
                        }
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: pal.accent }}
                          />
                        </div>
                        <div className="font-bold text-xs text-slate-900">{pal.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{pal.desc}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Color Pickers */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Custom Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={contentForm.primaryColor}
                        onChange={e => setContentForm({ ...contentForm, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={contentForm.primaryColor}
                        onChange={e => setContentForm({ ...contentForm, primaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Custom Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={contentForm.accentColor}
                        onChange={e => setContentForm({ ...contentForm, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={contentForm.accentColor}
                        onChange={e => setContentForm({ ...contentForm, accentColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. STORE IDENTITY & ANNOUNCEMENT BAR */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  📢 Identity & Header Announcements
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contentForm.name}
                      onChange={e => setContentForm({ ...contentForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Type
                    </label>
                    <select
                      value={contentForm.businessType}
                      onChange={e => setContentForm({ ...contentForm, businessType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                      <option value="Food & Beverages">Food & Beverages</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Books & Stationery">Books & Stationery</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                      <option value="Toys & Games">Toys & Games</option>
                      <option value="General Merchandise">General Merchandise</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Catchphrase / Tagline
                    </label>
                    <input
                      type="text"
                      value={contentForm.tagline}
                      onChange={e => setContentForm({ ...contentForm, tagline: e.target.value })}
                      placeholder="e.g. Crafted with premium organic cotton for modern everyday style."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  {/* Announcement Bar Toggle & Message */}
                  <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Top Announcement Bar
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Highlighted strip at the very top of your storefront
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contentForm.announcementEnabled}
                          onChange={e =>
                            setContentForm({ ...contentForm, announcementEnabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {contentForm.announcementEnabled && (
                      <input
                        type="text"
                        value={contentForm.announcementText}
                        onChange={e =>
                          setContentForm({ ...contentForm, announcementText: e.target.value })
                        }
                        placeholder="e.g. ⚡ Limited Time Offer: Free express shipping across India!"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 4. VISUAL MEDIA & BANNER PRESETS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  🖼️ Visual Media & Banners
                </h3>

                <div className="space-y-4">
                  {/* Logo */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Logo Image URL
                    </label>
                    <div className="flex items-center gap-3">
                      {contentForm.logo && (
                        <img
                          src={contentForm.logo}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <input
                        type="text"
                        value={contentForm.logo}
                        onChange={e => setContentForm({ ...contentForm, logo: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Banner Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Banner Presets (Click to use)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                      {[
                        { name: 'Urban Apparel', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Minimal Tech', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Artisan Studio', url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Luxury Goods', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1400&q=80' }
                      ].map(b => (
                        <div
                          key={b.name}
                          onClick={() => setContentForm({ ...contentForm, banner: b.url })}
                          className={`relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            contentForm.banner === b.url
                              ? 'border-indigo-600 ring-2 ring-indigo-600 shadow-xs'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img src={b.url} alt="" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            {b.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={contentForm.banner}
                      onChange={e => setContentForm({ ...contentForm, banner: e.target.value })}
                      placeholder="Or enter custom banner URL: https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 5. TYPOGRAPHY */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  ✍️ Typography Font Family
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Inter', 'system-ui', 'Georgia', 'Courier'] as const).map(font => (
                    <label
                      key={font}
                      className={`min-h-[50px] p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        contentForm.fontFamily === font
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fontFamily"
                        value={font}
                        checked={contentForm.fontFamily === font}
                        onChange={() => setContentForm({ ...contentForm, fontFamily: font })}
                        className="sr-only"
                      />
                      <span
                        className="font-bold text-xs sm:text-sm block"
                        style={{
                          fontFamily:
                            font === 'Georgia'
                              ? 'Georgia, serif'
                              : font === 'Courier'
                              ? 'Courier, monospace'
                              : 'inherit'
                        }}
                      >
                        {font}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {font === 'Inter' ? 'Modern Clean' : font === 'Georgia' ? 'Luxury Editorial' : font === 'Courier' ? 'Retro Monospace' : 'Native High Speed'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. TRUST, OPERATING HOURS & CONTACT */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  🛡️ Trust, Support & Store Hours
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Support Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contentForm.email}
                      onChange={e => setContentForm({ ...contentForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Support Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={contentForm.phone}
                      onChange={e => setContentForm({ ...contentForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Support Number
                    </label>
                    <input
                      type="text"
                      value={contentForm.socialWhatsapp}
                      onChange={e => setContentForm({ ...contentForm, socialWhatsapp: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={contentForm.socialInstagram}
                      onChange={e => setContentForm({ ...contentForm, socialInstagram: e.target.value })}
                      placeholder="@yourbrand"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Operating Hours
                    </label>
                    <input
                      type="text"
                      value={contentForm.openingHours}
                      onChange={e => setContentForm({ ...contentForm, openingHours: e.target.value })}
                      placeholder="Mon - Sat: 10:00 AM - 8:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Return & Guarantee Policy Notice
                    </label>
                    <input
                      type="text"
                      value={contentForm.returnPolicyNotice}
                      onChange={e => setContentForm({ ...contentForm, returnPolicyNotice: e.target.value })}
                      placeholder="7 Days easy return and instant replacement guarantee"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Physical Address
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.address}
                      onChange={e => setContentForm({ ...contentForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Footer Text / Copyright Disclaimer
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.footerText}
                      onChange={e => setContentForm({ ...contentForm, footerText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="sticky bottom-16 md:bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
                <div className="hidden sm:block text-xs text-slate-500 font-medium">
                  Changes will instantly update your live storefront at <span className="font-mono text-indigo-600 font-bold">/s/{store.slug}</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes & Refresh Storefront</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR FOR ADMIN */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 text-white border-t border-slate-800 h-16 flex items-center justify-around px-2 shadow-xl">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.path)}
              className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {link.label}
              </span>
            </button>
          );
        })}

        {/* 5th button: Live Store */}
        <button
          onClick={() => onNavigate(`/s/${store.slug}`)}
          className="flex flex-col items-center justify-center w-14 h-full text-amber-400 hover:text-amber-300 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-1">Live Store</span>
        </button>
      </nav>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Heavyweight Cotton Hoodie"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-2.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Compare (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.comparePrice}
                    onChange={e => setProductForm({ ...productForm, comparePrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-2.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI ASSISTANT FLOATING WIDGET (Optimized for Mobile Bottom Drawer) */}
      <AIChatbot storeId={store.id} storeName={store.name} />
    </div>
  );
};
