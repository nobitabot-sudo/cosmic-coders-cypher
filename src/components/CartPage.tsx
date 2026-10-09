import React, { useState } from 'react';
import { Store, CartItem } from '../types';
import { getCart, saveCart } from '../lib/storage';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CartPageProps {
  store: Store;
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ store, onNavigate }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCart(store.slug));

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cartItems.map(item => {
      if (item.product.id === productId) {
        const clamped = Math.min(newQty, item.product.stock || 99);
        return { ...item, qty: clamped };
      }
      return item;
    });

    setCartItems(updated);
    saveCart(store.slug, updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updated);
    saveCart(store.slug, updated);
    toast.success('Item removed from cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-28 lg:pb-12"
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>

          <div
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="font-extrabold text-slate-900 text-sm sm:text-base cursor-pointer truncate max-w-[150px] sm:max-w-none"
          >
            {store.name}
          </div>

          <div className="text-xs font-bold text-slate-500 tabular-nums">
            Bag ({cartItems.reduce((s, i) => s + i.qty, 0)})
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review items in your order before checkout.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Items List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {cartItems.map(({ product, qty }) => (
                <div key={product.id} className="p-3.5 sm:p-6 flex gap-3 sm:gap-6 items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs text-slate-400 font-mono mb-0.5">
                      {product.sku}
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base truncate">
                      {product.name}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {product.categoryName || 'Item'}
                    </div>

                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm tabular-nums mt-1.5">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        disabled={qty >= product.stock}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right sm:min-w-20">
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm tabular-nums">
                        ₹{(product.price * qty).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-0.5 mt-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 sticky top-20">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-extrabold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium">
                    ✓ You unlocked Free Standard Shipping!
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate(`/s/${store.slug}/checkout`)}
                style={{ backgroundColor: store.primaryColor || '#0f172a' }}
                className="hidden lg:flex w-full min-h-[48px] py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cash on delivery · Express dispatch</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your bag is empty</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Explore our collections and add items to your cart to get started.
            </p>
            <button
              onClick={() => onNavigate(`/s/${store.slug}`)}
              style={{ backgroundColor: store.primaryColor || '#0f172a' }}
              className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse Products</span>
            </button>
          </div>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM CHECKOUT DOCK (Natural Thumb Zone) */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Amount</div>
            <div className="text-base font-extrabold text-slate-900 tabular-nums">
              ₹{total.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={() => onNavigate(`/s/${store.slug}/checkout`)}
            style={{ backgroundColor: store.primaryColor || '#0f172a' }}
            className="flex-1 min-h-[46px] max-w-[240px] px-4 py-2.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
