import React, { useState } from 'react';
import { Store, CartItem } from '../types';
import { getCart, clearCart, createOrder } from '../lib/storage';
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutPageProps {
  store: Store;
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ store, onNavigate }) => {
  const [cartItems] = useState<CartItem[]>(() => getCart(store.slug));

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    orderNumber: string;
    total: number;
    itemsCount: number;
  } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      toast.error('Please fill in all contact and shipping address details.');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map(item => ({
        id: `item_${Date.now()}_${item.product.id}`,
        orderId: 'pending',
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
        image: item.product.image
      }));

      const newOrder = createOrder(store.id, {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        subtotal,
        total,
        status: 'PLACED',
        items: orderItems
      });

      clearCart(store.slug);

      setPlacedOrder({
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        itemsCount: cartItems.reduce((s, i) => s + i.qty, 0)
      });

      toast.success(`🎉 Order ${newOrder.orderNumber} successfully placed!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-24 lg:pb-12"
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
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate(`/s/${store.slug}/cart`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bag</span>
          </button>

          <div
            onClick={() => onNavigate(`/s/${store.slug}`)}
            className="font-extrabold text-slate-900 text-sm sm:text-base cursor-pointer truncate max-w-[140px] sm:max-w-none"
          >
            {store.name}
          </div>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        {placedOrder ? (
          /* SUCCESS SCREEN */
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              🎉 Order Placed!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for ordering with {store.name}.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-5 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Order Number</span>
                <span className="font-mono font-bold text-indigo-600">
                  #{placedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total (Pay on Delivery)</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{placedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Items Ordered</span>
                <span className="font-medium text-slate-700">
                  {placedOrder.itemsCount} item(s)
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-medium text-slate-900">
                  3–5 Business Days
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => onNavigate(`/s/${store.slug}`)}
                style={{ backgroundColor: store.primaryColor || '#0f172a' }}
                className="min-h-[44px] px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
              >
                Return to Store
              </button>

              <button
                onClick={() => onNavigate(`/admin/${store.slug}`)}
                className="min-h-[44px] px-6 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Admin Orders
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Shipping Contact Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-3.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-600" />
                  <span>Customer & Shipping Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="off"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Shipping Address (with PIN Code) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      autoComplete="off"
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      placeholder="House / Flat No., Street, Area, City, State, PIN code"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <span>Payment Options</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[56px] ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Pay cash or UPI at your doorstep
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[56px] ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Instant UPI on Delivery
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Scan QR via Google Pay or PhonePe
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Desktop Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                style={{ backgroundColor: store.primaryColor || '#0f172a' }}
                className="hidden lg:flex w-full min-h-[48px] py-3.5 px-6 rounded-xl text-white font-extrabold text-sm uppercase tracking-wider items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>Place Order (₹{total.toLocaleString('en-IN')})</span>
                )}
              </button>
            </form>

            {/* Sidebar Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Items in Order</span>
                <span className="text-xs font-normal text-slate-500">
                  {cartItems.length} items
                </span>
              </h2>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="py-2 flex items-center gap-2.5">
                    <img
                      src={product.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Qty: {qty}</div>
                    </div>
                    <div className="font-bold text-slate-900 text-xs tabular-nums">
                      ₹{(product.price * qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM SUBMIT DOCK (Thumb Zone Natural Reach) */}
      {!placedOrder && cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Due</div>
            <div className="text-base font-extrabold text-slate-900 tabular-nums">
              ₹{total.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            style={{ backgroundColor: store.primaryColor || '#0f172a' }}
            className="flex-1 min-h-[46px] max-w-[240px] px-4 py-2.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  );
};
