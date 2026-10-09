import React, { useState } from 'react';
import {
  signup,
  login,
  getCurrentUser,
  logout,
  getStoresForUser,
  getProductsByStore,
  getOrdersByStore
} from '../lib/storage';
import { Store, User } from '../types';
import {
  Store as StoreIcon,
  Plus,
  ExternalLink,
  ArrowRight,
  Shield,
  LogIn,
  UserPlus,
  Package,
  ShoppingCart,
  TrendingUp,
  LogOut,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthPageProps {
  onNavigate: (route: string) => void;
  onAuthSuccess?: (user: User) => void;
}

/* ================= LOGIN PAGE ================= */
export const LoginPage: React.FC<AuthPageProps> = ({ onNavigate, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      onAuthSuccess?.(user);
      onNavigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    try {
      const user = login('owner@demo.com', 'demo123');
      toast.success(`Signed in as demo owner: ${user.name}!`);
      onAuthSuccess?.(user);
      onNavigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 cursor-pointer mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <StoreIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Cypher Store Builder
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Or{' '}
          <button
            onClick={() => onNavigate('/signup')}
            className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            create a new store builder account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl space-y-6">
          {/* Quick Demo Login Preset Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>1-Click Demo Login (owner@demo.com / demo123)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 absolute">
              or use credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= SIGNUP PAGE ================= */
export const SignupPage: React.FC<AuthPageProps> = ({ onNavigate, onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const user = signup(name, email, password);
      toast.success(`Account created! Welcome, ${user.name}`);
      onAuthSuccess?.(user);
      onNavigate('/onboarding');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 cursor-pointer mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <StoreIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Cypher Store Builder
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aarav@business.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Creating Account...' : 'Continue to Onboarding Wizard'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= DASHBOARD PAGE (/dashboard) ================= */
export const DashboardPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const stores = currentUser ? getStoresForUser(currentUser.id) : [];

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    toast.success('Signed out safely.');
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <StoreIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              Cypher Store Builder
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-900">{currentUser?.name || 'Store Owner'}</div>
              <div className="text-[11px] text-slate-400">{currentUser?.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner with "+ New Store" CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Stores
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-tenant architecture: each store has completely isolated products, orders, and live URLs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/onboarding')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Store</span>
          </button>
        </div>

        {/* Stores List */}
        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => {
              const storeProducts = getProductsByStore(store.id);
              const storeOrders = getOrdersByStore(store.id);
              const storeRevenue = storeOrders
                .filter(o => o.status !== 'CANCELLED')
                .reduce((s, o) => s + o.total, 0);

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Store Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {store.logo ? (
                          <img
                            src={store.logo}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-lg shadow-xs"
                            style={{ backgroundColor: store.primaryColor || '#4f46e5' }}
                          >
                            {store.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">
                            {store.name}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /s/{store.slug}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{
                          backgroundColor: `${store.primaryColor}1A`,
                          color: store.primaryColor
                        }}
                      >
                        {store.businessType}
                      </span>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-4 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Products</span>
                        <span className="font-bold text-slate-900 text-sm tabular-nums">
                          {storeProducts.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Orders</span>
                        <span className="font-bold text-slate-900 text-sm tabular-nums">
                          {storeOrders.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Revenue</span>
                        <span className="font-bold text-emerald-600 text-sm tabular-nums">
                          ₹{storeRevenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onNavigate(`/admin/${store.slug}`)}
                      className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer"
                    >
                      Manage Store
                    </button>

                    <button
                      onClick={() => onNavigate(`/s/${store.slug}`)}
                      className="p-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Open Live Public Storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state: "No stores yet. Create your first store in 2 minutes." */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <StoreIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No stores yet</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Create your first online store in 2 minutes with our 5-step wizard, instant dummy catalog, and live URL.
            </p>
            <button
              onClick={() => onNavigate('/onboarding')}
              className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Store</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
