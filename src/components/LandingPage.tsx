import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Store as StoreIcon,
  ShoppingBag,
  Zap,
  FileSpreadsheet,
  Globe,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 grain">

      {/* ================= NAV ================= */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-900/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 bg-stone-900 flex items-center justify-center">
              <StoreIcon className="w-4 h-4 text-[#faf9f6]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight text-[15px]">
              Cypher<span className="text-stone-400">/</span>Store
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-stone-600">
            <button onClick={() => onNavigate('/s/cypher-urban')} className="link-underline hover:text-stone-900 transition-colors cursor-pointer">
              Demo store
            </button>
            <a href="#features" className="link-underline hover:text-stone-900 transition-colors cursor-pointer">
              Features
            </a>
            <a href="#pricing" className="link-underline hover:text-stone-900 transition-colors cursor-pointer">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="hidden sm:inline-block text-[13px] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-[#faf9f6] text-[13px] font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Start free
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative border-b border-stone-900/10">
        <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-32">

          {/* Top row - labels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 text-stone-500 reveal">
            <div className="label-mono">01 / NO-CODE</div>
            <div className="label-mono hidden md:block">02 / MULTI-TENANT</div>
            <div className="label-mono hidden md:block">03 / AI-POWERED</div>
            <div className="label-mono text-right md:text-left">EST. 2025</div>
          </div>

          {/* Main headline */}
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8 reveal reveal-delay-1">
              <h1 className="headline text-[3.25rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8rem]">
                Launch your<br />
                <em>online store</em><br />
                in minutes.
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pb-8 reveal reveal-delay-2">
              <p className="text-stone-600 text-[15px] leading-relaxed max-w-sm">
                A guided 5-step builder that turns any small business into a live e-commerce storefront — with isolated data, custom themes, and an AI assistant.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="group inline-flex items-center gap-2 px-5 py-3 bg-stone-900 text-[#faf9f6] text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('/s/cypher-urban')}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-stone-900/20 text-sm font-medium text-stone-900 hover:bg-stone-900/5 transition-colors cursor-pointer"
                >
                  View demo
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-stone-900/10 pt-6 reveal reveal-delay-3">
            {[
              { k: '12,400', v: 'Stores launched' },
              { k: '340K', v: 'Products listed' },
              { k: '3 min', v: 'Avg launch time' },
              { k: '99.9%', v: 'Uptime' },
            ].map((s) => (
              <div key={s.v} className="py-4">
                <div className="font-serif text-4xl lg:text-5xl tracking-tight">{s.k}</div>
                <div className="label-mono mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HERO VISUAL — EDITORIAL CARD ================= */}
      <section className="relative border-b border-stone-900/10 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left caption */}
            <div className="lg:col-span-3 reveal">
              <div className="label-mono mb-4">LIVE PREVIEW</div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Every store gets its own public URL with isolated inventory, orders, and analytics — no configuration needed.
              </p>
            </div>

            {/* Right: fake screenshot */}
            <div className="lg:col-span-9 reveal reveal-delay-1">
              <div className="border border-stone-900/15 bg-[#faf9f6]">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-900/10 bg-white">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-stone-100 text-[11px] font-mono text-stone-500 px-3 py-1 max-w-md">
                      cypher.store/s/cypher-urban
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                        C
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Cypher Urban Apparel</div>
                        <div className="label-mono mt-0.5">EST. 2025</div>
                      </div>
                    </div>
                    <div className="label-mono">LIVE ●</div>
                  </div>

                  <div className="headline text-3xl lg:text-4xl mb-2">
                    Urban Summer<br />
                    <em>Collection 2025</em>
                  </div>
                  <p className="text-sm text-stone-500 mb-8 max-w-md">
                    Heavyweight cotton, boxy cuts, and earth tones. Made for the everyday.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { n: 'Boxy Cotton Tee', p: '₹1,299', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80', tag: '6 LEFT' },
                      { n: 'Court Sneakers', p: '₹4,999', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80', tag: 'IN STOCK' },
                      { n: 'Linen Overshirt', p: '₹2,799', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80', tag: '3 LEFT' },
                    ].map((p) => (
                      <div key={p.n} className="group cursor-pointer">
                        <div className="aspect-square bg-stone-100 overflow-hidden mb-3">
                          <img
                            src={p.img}
                            alt={p.n}
                            referrerPolicy="origin"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-medium">{p.n}</div>
                          <div className="label-mono text-stone-400 shrink-0">{p.tag}</div>
                        </div>
                        <div className="font-mono text-xs text-stone-500 mt-1">{p.p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES — BENTO ================= */}
      <section id="features" className="border-b border-stone-900/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">

          <div className="mb-16 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 reveal">
              <div className="label-mono mb-4">FEATURES</div>
              <h2 className="headline text-5xl lg:text-6xl text-balance">
                Everything you need.<br />
                <em>Nothing you don't.</em>
              </h2>
            </div>
            <div className="lg:col-span-6 lg:pt-20 reveal reveal-delay-1">
              <p className="text-stone-600 text-[15px] leading-relaxed max-w-md">
                Every feature was built around a real friction point in small-business retail — from catalog import to checkout, no code required.
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900/10 border border-stone-900/10">

            {/* Card 1 - Wide */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#faf9f6] p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 border border-stone-900/20 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="label-mono pt-2">01 / ONBOARDING</div>
              </div>
              <h3 className="headline text-3xl lg:text-4xl mb-3">
                Five steps to live.
              </h3>
              <p className="text-sm text-stone-600 max-w-md leading-relaxed">
                Store info, categories, catalog, theme, launch. Each step has inline validation, live preview, and a clean back-button flow. No dead ends.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#faf9f6] p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 border border-stone-900/20 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="label-mono pt-2">02 / IMPORT</div>
              </div>
              <h3 className="headline text-2xl lg:text-3xl mb-3">
                Your catalog, one click.
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Upload CSV or XLSX with error diagnostics, or seed with realistic demo products per category.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#faf9f6] p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 border border-stone-900/20 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="label-mono pt-2">03 / LIVE URL</div>
              </div>
              <h3 className="headline text-2xl lg:text-3xl mb-3">
                Your address, instantly.
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Every store gets an isolated storefront at /s/[slug] — publicly accessible, mobile-ready.
              </p>
            </div>

            {/* Card 4 - Wide */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#faf9f6] p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 border border-stone-900/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="label-mono pt-2">04 / AI ASSISTANT</div>
              </div>
              <h3 className="headline text-3xl lg:text-4xl mb-3">
                Ask your store anything.
              </h3>
              <p className="text-sm text-stone-600 max-w-md leading-relaxed">
                Built-in assistant answers from real data — top products, low stock, revenue. Read-only. Verified per tenant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <section className="border-b border-stone-900/10 py-8 overflow-hidden bg-white">
        <div className="flex whitespace-nowrap marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {[
                'ZERO CODING',
                '·',
                'MULTI-TENANT ISOLATION',
                '·',
                'CSV IMPORT',
                '·',
                'AI ASSISTANT',
                '·',
                'LIVE URL',
                '·',
                'CUSTOM THEMES',
                '·',
                'ADMIN DASHBOARD',
                '·',
              ].map((t, j) => (
                <span key={j} className={t === '·' ? 'text-stone-300' : 'label-mono'}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="border-b border-stone-900/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="mb-16 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 reveal">
              <div className="label-mono mb-4">PRICING</div>
              <h2 className="headline text-5xl lg:text-6xl">
                Simple. Free.<br />
                <em>Always.</em>
              </h2>
            </div>
          </div>

          <div className="border border-stone-900/10 grid lg:grid-cols-2">
            <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-stone-900/10">
              <div className="label-mono mb-4">FREE FOREVER</div>
              <div className="font-serif text-7xl lg:text-8xl tracking-tight mb-6">
                ₹0
              </div>
              <p className="text-stone-600 text-sm mb-8 leading-relaxed">
                Everything you need to launch and run your first store. No credit card. No trial period.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  'Unlimited stores per account',
                  'Unlimited products per store',
                  'Live public URL per store',
                  'AI assistant (read-only)',
                  'CSV / Excel import',
                  'Custom themes & colors',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-stone-700">
                    <span className="w-1 h-1 bg-stone-900" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('/signup')}
                className="group mt-10 inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-[#faf9f6] text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Start building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="p-10 lg:p-14 bg-stone-900 text-[#faf9f6]">
              <div className="label-mono !text-stone-400 mb-4">TRY IT NOW</div>
              <div className="font-serif text-7xl lg:text-8xl tracking-tight mb-6">
                Demo
              </div>
              <p className="text-stone-300 text-sm mb-8 leading-relaxed">
                Log in as a demo store owner and explore the full admin panel — no signup required.
              </p>
              <div className="bg-stone-800 p-4 mb-8 font-mono text-xs">
                <div className="text-stone-500 mb-1">// credentials</div>
                <div className="text-stone-100">owner@demo.com</div>
                <div className="text-stone-100">demo123</div>
              </div>
              <button
                onClick={() => onNavigate('/login')}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#faf9f6] text-stone-900 text-sm font-medium hover:bg-white transition-colors cursor-pointer"
              >
                Try demo login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-stone-900 text-[#faf9f6]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="label-mono !text-stone-400 mb-6">GET STARTED</div>
              <h2 className="headline text-6xl lg:text-8xl xl:text-9xl">
                Build your<br />
                <em className="text-amber-400">store today.</em>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:pb-6">
              <p className="text-stone-400 text-sm mb-8 leading-relaxed max-w-xs">
                Three minutes from signup to live URL. Free forever.
              </p>
              <button
                onClick={() => onNavigate('/signup')}
                className="group w-full inline-flex items-center justify-between gap-4 px-6 py-4 bg-[#faf9f6] text-stone-900 text-sm font-medium hover:bg-white transition-colors cursor-pointer"
              >
                <span>Start free</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#faf9f6] flex items-center justify-center">
                <StoreIcon className="w-3.5 h-3.5 text-stone-900" strokeWidth={2.5} />
              </div>
              <span className="font-medium tracking-tight text-[#faf9f6] text-sm">
                Cypher/Store
              </span>
            </div>

            <div className="flex items-center gap-6 label-mono">
              <span>© 2025</span>
              <span>·</span>
              <span>MULTI-TENANT NO-CODE COMMERCE</span>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors cursor-pointer">
                Sign in
              </button>
              <button onClick={() => onNavigate('/signup')} className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
                Start free →
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
