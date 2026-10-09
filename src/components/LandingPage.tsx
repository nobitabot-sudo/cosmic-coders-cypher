import React, { useState } from 'react';
import {
  Store as StoreIcon,
  Sparkles,
  ArrowRight,
  Zap,
  FileSpreadsheet,
  Globe,
  ShoppingBag,
  TrendingUp,
  Layers,
  ShieldCheck,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 16;
    const y = (clientY / window.innerHeight - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white"
    >
      {/* STICKY NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <StoreIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              Cypher Store Builder
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/s/cypher-urban')}
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Demo Storefront
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>✨ No-code store builder</span>
            </div>

            {/* Big Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
              Launch your online store in{' '}
              <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                minutes
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Empower your small business with a 5-step guided wizard, automated dummy catalog,
              Excel import, custom themes, and a unique live storefront URL. Multi-tenant and isolated by design.
            </p>

            {/* Two CTAs: Solid + Outline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/onboarding')}
                className="min-h-[48px] px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Your Store Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/s/cypher-urban')}
                className="min-h-[48px] px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-sm font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Live Demo Store</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Coding Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant /s/[slug] URL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Store Assistant</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Floating Store Mockup Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Gradient Blur Backdrop */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10" />

            {/* Floating Card with Parallax Mouse Transform */}
            <div
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xl relative"
            >
              {/* Mockup Store Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    C
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Cypher Urban Apparel</div>
                    <div className="text-[10px] text-slate-400 font-mono">cypher.store/s/cypher-urban</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  LIVE
                </span>
              </div>

              {/* Mockup Hero Banner */}
              <div className="mt-3 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Urban Summer Drop
                </span>
                <div className="text-sm font-bold mt-1">Oversized Heavyweight Tees</div>
                <div className="text-[11px] text-slate-300 mt-0.5">₹1,499 · Express Shipping</div>
              </div>

              {/* Mockup 2-Col Product Cards */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-lg bg-slate-200 overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-[11px] text-slate-900 truncate">Boxy Cotton Tee</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-xs tabular-nums">₹1,299</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                      Only 6 left
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-lg bg-slate-200 overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-[11px] text-slate-900 truncate">Leather Court Shoes</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-xs tabular-nums">₹4,999</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock Live Stats Bar */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <strong className="text-slate-800">₹27,890</strong> today
                </span>
                <span className="font-mono text-indigo-600 font-semibold">
                  3D Tilt Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 FEATURE CARDS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Engineered for high-converting stores
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Everything small retailers and digital brands need without complex setup or hosting hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: 5-step wizard */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              5-Step Onboarding Wizard
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step-by-step progress tracking for store info, 14 predefined categories, catalog setup, live theme preview, and one-click launch with confetti.
            </p>
          </div>

          {/* Card 2: CSV or dummy import */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              CSV or Dummy Catalog Import
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload spreadsheets via SheetJS with instant column mapping and error diagnostics, or populate realistic dummy products with 1 click.
            </p>
          </div>

          {/* Card 3: Live URL instantly */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Instant Live URL & AI Assistant
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every store gets its own isolated storefront at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">/s/[slug]</code> and an embedded AI Chatbot that answers questions strictly using your store's data.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              C
            </div>
            <span className="font-bold text-white">Cypher Store Builder</span>
            <span>· Multi-tenant no-code commerce</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/login')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sign In (owner@demo.com)
            </button>
            <button
              onClick={() => onNavigate('/onboarding')}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Start 5-Step Wizard →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
