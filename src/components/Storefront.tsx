import React, { useState, useMemo } from 'react';
import { Store, Product, CartItem } from '../types';
import {
  getProductsByStore,
  getCategoriesByStore,
  getCart,
  saveCart
} from '../lib/storage';
import { ProductCard3D } from './ProductCard3D';
import {
  ShoppingBag,
  Search,
  MapPin,
  Mail,
  Phone,
  SlidersHorizontal,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  Home,
  Tag,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface StorefrontProps {
  store: Store;
  onNavigate: (route: string) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({ store, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCart(store.slug));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const products = useMemo(() => getProductsByStore(store.id), [store.id]);
  const categories = useMemo(() => getCategoriesByStore(store.id), [store.id]);

  // Total cart items count and total value
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  const totalCartValue = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [cartItems]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;
      const matchesCategory =
        selectedCategory === 'all' ||
        p.categoryId === selectedCategory ||
        (p.categoryName && p.categoryName.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    const current = getCart(store.slug);
    const existingIndex = current.findIndex(i => i.product.id === product.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex].qty += 1;
    } else {
      updated = [...current, { product, qty: 1 }];
    }

    saveCart(store.slug, updated);
    setCartItems(updated);
    toast.success(`Added "${product.name}" to cart!`);
  };

  const fontClass =
    store.fontFamily === 'Inter'
      ? 'font-sans'
      : store.fontFamily === 'Georgia'
      ? 'font-serif'
      : store.fontFamily === 'Courier'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-24 md:pb-0 ${fontClass}`}
      style={{
        fontFamily:
          store.fontFamily === 'Inter'
            ? 'Inter, sans-serif'
            : store.fontFamily === 'Georgia'
            ? 'Georgia, serif'
            : store.fontFamily === 'Courier'
            ? 'Courier, monospace'
            : 'system-ui, sans-serif'
      }}
    >
      {/* Top Banner Bar - Dynamic Announcement */}
      {store.announcementEnabled !== false && (
        <div
          className="text-[11px] sm:text-xs py-1.5 px-3 text-center font-medium shadow-xs transition-colors"
          style={{
            backgroundColor: store.announcementBgColor || store.primaryColor || '#0f172a',
            color: store.announcementTextColor || '#ffffff'
          }}
        >
          <span>{store.announcementText || '⚡ Free Express Delivery on orders over ₹999 · Cash on Delivery Available'}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 min-w-0"
          >
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl object-cover bg-slate-100 shadow-xs shrink-0"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 block truncate leading-tight">
                {store.name}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate block">
                {store.businessType}
              </span>
            </div>
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${products.length} products...`}
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 text-xs font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Mobile search trigger & Cart Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search icon trigger for mobile */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate(`/admin/${store.slug}`)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Go to Admin Panel"
            >
              <span>Manage Store</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate(`/s/${store.slug}/cart`)}
              style={{ backgroundColor: store.primaryColor || '#0f172a' }}
              className="min-h-[40px] min-w-[40px] relative inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-95 transition-transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span
                  style={{ backgroundColor: store.accentColor || '#f59e0b' }}
                  className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold text-slate-950 min-w-4 text-center tabular-nums"
                >
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU or keyword..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner Section (Optimized for Mobile Height) */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {store.banner ? (
          <div className="absolute inset-0 z-0">
            <img
              src={store.banner}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${store.primaryColor}F2, rgba(15, 23, 42, 0.92))`
              }}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `linear-gradient(135deg, ${store.primaryColor} 0%, #0f172a 100%)`
            }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span
              className="inline-block px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-2 shadow-xs"
              style={{ backgroundColor: store.accentColor || '#f59e0b', color: '#1e1b4b' }}
            >
              {store.businessType}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {store.heroHeadline || store.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              {store.tagline || store.footerText || `Discover handcrafted ${store.businessType.toLowerCase()} with pan-India express delivery.`}
            </p>

            {/* Quick Action Buttons on Hero */}
            <div className="mt-4 flex items-center gap-2.5 flex-wrap">
              <a
                href="#catalog"
                style={{ backgroundColor: store.accentColor || '#f59e0b', color: '#0f172a' }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:opacity-95 transition-opacity"
              >
                {store.heroCtaText || 'Explore Catalog'}
              </a>

              {store.socialWhatsapp && (
                <a
                  href={`https://wa.me/${store.socialWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm browsing your online store ${store.name}!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  <span>💬 WhatsApp Us</span>
                </a>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl text-xs text-white/90 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="line-clamp-1">{store.address || 'Pan-India Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{store.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="relative z-10 bg-black/30 backdrop-blur-xs border-t border-white/10 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] sm:text-xs text-white/90 overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine Products</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span>🚚 Free Express Shipping &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span>💵 Cash On Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span>🔄 {store.returnPolicyNotice || '7 Days Replacement Guarantee'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        {/* Category Filters Bar (Horizontal Touch Swipe on Mobile) */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
              style={{
                backgroundColor: selectedCategory === 'all' ? store.primaryColor : undefined
              }}
            >
              All Items ({products.length})
            </button>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id || selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? store.primaryColor : undefined
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid (2 cols mobile, 4 cols desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard3D
                key={product.id}
                product={product}
                store={store}
                onAddToCart={handleAddToCart}
                onQuickView={prod => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-6">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <h3 className="font-bold text-slate-900 text-base">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No products matched "${searchQuery}". Try another keyword or reset filters.`
                : 'No products listed in this category yet.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* QUICK VIEW BOTTOM SHEET MODAL (Touch Friendly) */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle for Mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {quickViewProduct.categoryName} · {quickViewProduct.sku}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {quickViewProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.comparePrice && quickViewProduct.comparePrice > quickViewProduct.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ₹{quickViewProduct.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
              {quickViewProduct.discountPct && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {quickViewProduct.discountPct}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {quickViewProduct.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Availability:</span>
                <span
                  className={`font-bold ${
                    quickViewProduct.stock === 0
                      ? 'text-red-600'
                      : quickViewProduct.stock < 10
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {quickViewProduct.stock === 0
                    ? 'Out of stock'
                    : `${quickViewProduct.stock} units left`}
                </span>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                disabled={quickViewProduct.stock === 0}
                style={{ backgroundColor: store.primaryColor || '#0f172a' }}
                className="min-h-[44px] px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm hover:opacity-95 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FLOATING CART ACTION BAR (Thumb Zone Natural Reach) */}
      {totalCartCount > 0 && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 p-3 pointer-events-none">
          <div
            onClick={() => onNavigate(`/s/${store.slug}/cart`)}
            style={{ backgroundColor: store.primaryColor || '#0f172a' }}
            className="pointer-events-auto rounded-2xl p-3 shadow-xl text-white flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{ backgroundColor: store.accentColor || '#f59e0b' }}
                className="w-8 h-8 rounded-xl text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs tabular-nums"
              >
                {totalCartCount}
              </div>
              <div>
                <div className="text-[11px] text-white/80">Bag Total</div>
                <div className="text-sm font-extrabold tabular-nums">
                  ₹{totalCartValue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3.5 py-2 rounded-xl">
              <span>View Bag</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (iOS / Android Standard Pattern) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-14 flex items-center justify-around px-2 shadow-lg">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center w-14 h-full text-indigo-600 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Shop</span>
        </button>

        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="flex flex-col items-center justify-center w-14 h-full text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Search</span>
        </button>

        <button
          onClick={() => onNavigate(`/s/${store.slug}/cart`)}
          className="relative flex flex-col items-center justify-center w-14 h-full text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Bag</span>
          {totalCartCount > 0 && (
            <span
              style={{ backgroundColor: store.accentColor || '#f59e0b' }}
              className="absolute top-1 right-2 text-[9px] font-extrabold text-slate-950 px-1 rounded-full min-w-3.5 text-center"
            >
              {totalCartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate(`/admin/${store.slug}`)}
          className="flex flex-col items-center justify-center w-14 h-full text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Admin</span>
        </button>
      </nav>

      {/* Desktop Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-2">
                {store.name}
              </h4>
              <p className="leading-relaxed text-slate-500">
                {store.footerText || 'Official online store powered by Cypher Store Builder.'}
              </p>
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Store Location
              </div>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{store.address}</span>
              </p>
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Contact & Support
              </div>
              <p className="flex items-center gap-2 mb-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{store.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{store.phone}</span>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div>© {new Date().getFullYear()} {store.name}. All rights reserved.</div>
            <div className="font-semibold text-slate-600">Powered by Cypher Store Builder</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
