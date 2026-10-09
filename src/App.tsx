import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { LoginPage, SignupPage, DashboardPage } from './components/AuthPages';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Storefront } from './components/Storefront';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { AdminLayout } from './components/AdminLayout';
import {
  getCurrentUser,
  getStoreBySlug,
  requireStore,
  getStoresForUser
} from './lib/storage';
import { Store, User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) return hash.startsWith('/') ? hash : `/${hash}`;
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Track active store in state
  const [activeStore, setActiveStore] = useState<Store | null>(null);

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash ? (hash.startsWith('/') ? hash : `/${hash}`) : window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation function
  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      window.location.hash = path;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route parser
  const renderRoute = () => {
    const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

    // 1. Landing Page
    if (cleanPath === '/' || cleanPath === '') {
      return <LandingPage onNavigate={navigate} />;
    }

    // 2. Auth Pages
    if (cleanPath === '/login') {
      return (
        <LoginPage
          onNavigate={navigate}
          onAuthSuccess={user => setCurrentUser(user)}
        />
      );
    }

    if (cleanPath === '/signup') {
      return (
        <SignupPage
          onNavigate={navigate}
          onAuthSuccess={user => setCurrentUser(user)}
        />
      );
    }

    if (cleanPath === '/dashboard') {
      if (!currentUser) {
        toast.error('Please sign in to view your stores');
        return (
          <LoginPage
            onNavigate={navigate}
            onAuthSuccess={user => setCurrentUser(user)}
          />
        );
      }
      return <DashboardPage onNavigate={navigate} />;
    }

    // 3. Onboarding Wizard
    if (cleanPath === '/onboarding') {
      if (!currentUser) {
        toast.info('Please sign in or create an account to start building your store');
        return (
          <LoginPage
            onNavigate={navigate}
            onAuthSuccess={user => setCurrentUser(user)}
          />
        );
      }
      return (
        <OnboardingWizard
          onComplete={slug => navigate(`/admin/${slug}`)}
          onCancel={() => navigate('/dashboard')}
        />
      );
    }

    // 4. Public Storefront Routes: /s/:slug, /s/:slug/cart, /s/:slug/checkout
    if (cleanPath.startsWith('/s/')) {
      const parts = cleanPath.split('/').filter(Boolean); // ['s', slug, ...]
      const slug = parts[1];
      const subpage = parts[2]; // 'cart' | 'checkout' | undefined

      if (!slug) {
        return <LandingPage onNavigate={navigate} />;
      }

      const store = getStoreBySlug(slug);
      if (!store) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Store Not Found</h2>
            <p className="text-xs text-slate-500 mt-2">
              No store exists at /s/{slug}. Check the link or create your own store.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Go to Home
            </button>
          </div>
        );
      }

      if (subpage === 'cart') {
        return <CartPage store={store} onNavigate={navigate} />;
      }

      if (subpage === 'checkout') {
        return <CheckoutPage store={store} onNavigate={navigate} />;
      }

      return <Storefront store={store} onNavigate={navigate} />;
    }

    // 5. Admin Routes: /admin/:slug, /admin/:slug/products, /admin/:slug/orders, /admin/:slug/content
    if (cleanPath.startsWith('/admin/')) {
      const parts = cleanPath.split('/').filter(Boolean); // ['admin', slug, ...]
      const slug = parts[1];
      const subpage = (parts[2] as 'products' | 'orders' | 'content') || 'dashboard';

      if (!slug) {
        return <DashboardPage onNavigate={navigate} />;
      }

      // Authorization guard
      if (!currentUser) {
        return (
          <LoginPage
            onNavigate={navigate}
            onAuthSuccess={user => setCurrentUser(user)}
          />
        );
      }

      try {
        const { store } = requireStore(slug, currentUser.id);

        return (
          <AdminLayout
            store={activeStore?.id === store.id ? activeStore : store}
            activeTab={subpage}
            onNavigate={navigate}
            onStoreUpdate={updated => setActiveStore(updated)}
          />
        );
      } catch (err: any) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm">
              {err.message || 'You do not have permissions for this store.'}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Go to My Stores
              </button>
              <button
                onClick={() => navigate(`/s/${slug}`)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                View Public Storefront
              </button>
            </div>
          </div>
        );
      }
    }

    // Default fallback to LandingPage
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {renderRoute()}
    </>
  );
}
