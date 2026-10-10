import React, { useState } from 'react';
import {
  Store as StoreIcon,
  Sparkles,
  ArrowRight,
  Zap,
  FileSpreadsheet,
  Globe,
  TrendingUp,
  Check,
  Star,
  ShoppingBag
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    setHeroTilt({ x, y });
  };

  const handleHeroMouseLeave = () => setHeroTilt({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div onClick={() => onNavigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform">
              <StoreIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              Cypher Store Builder
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/s/cypher-urban')}
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Demo Store
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-4 py-2 btn-gradient text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/30 hover:scale-[1.05] transition-transform active:scale-95 cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-25 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }} />
        </div>

        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-7 text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>✨ No-code store builder · Live in minutes</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.02]">
              Launch your{' '}
              <span className="gradient-text">online store</span>
              <br />
              in minutes
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A 5-step guided wizard, AI-powered catalog import, custom themes, and a live URL for every store.
              Built for small businesses — no code, no hosting hassles.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/onboarding')}
                className="group min-h-[52px] px-7 py-4 btn-gradient text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Your Store Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/s/cypher-urban')}
                className="min-h-[52px] px-7 py-4 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-800 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Live Demo</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
              {['Zero coding', 'Instant /s/[slug] URL', 'AI assistant'].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={3} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] blur-3xl opacity-30 scale-95" />

            <div
              style={{ perspective: '1200px' }}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              className="relative w-full max-w-md animate-float"
            >
              <div
                style={{
                  transform: `rotateY(${heroTilt.x}deg) rotateX(${-heroTilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease-out',
                }}
                className="w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-white/70 p-5 shadow-[0_40px_80px_-20px_rgba(99,102,241,0.35)] relative"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
                  style={{
                    background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 45%, transparent 60%)`,
                    transform: `translateX(${heroTilt.x * 1.5}px)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                />

                <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-extrabold rounded-full shadow-lg shadow-emerald-500/40 animate-float-slow uppercase tracking-wider">
                  ● Live
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-500/30">
                      C
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Cypher Urban Apparel</div>
                      <div className="text-[10px] text-slate-400 font-mono">/s/cypher-urban</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-2xl" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest relative z-10">
                    ✦ Urban Summer Drop
                  </span>
                  <div className="text-sm font-bold mt-1.5 relative z-10">Oversized Heavyweight Tees</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 relative z-10">₹1,499 · Express Shipping</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-between group">
                    <div className="aspect-[4/3] rounded-xl bg-slate-200 overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="origin"
                      />
                    </div>
                    <div className="font-semibold text-[11px] text-slate-900 truncate">Boxy Cotton Tee</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-xs tabular-nums">₹1,299</span>
                      <span className="text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md font-bold">6 left</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-between group">
                    <div className="aspect-[4/3] rounded-xl bg-slate-200 overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80"
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="origin"
                      />
                    </div>
                    <div className="font-semibold text-[11px] text-slate-900 truncate">Court Sneakers</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-xs tabular-nums">₹4,999</span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md font-bold">In stock</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                    <strong className="text-slate-900 tabular-nums">₹27,890</strong>
                    <span>today</span>
                  </span>
                  <span className="font-mono text-indigo-600 font-bold text-[10px]">3D TILT ACTIVE</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 px-4 py-3 bg-white rounded-2xl shadow-2xl border border-indigo-100 animate-float-slow hidden sm:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">This week</div>
                    <div className="text-sm font-extrabold text-slate-900">+42% ↗</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 px-3 py-2 bg-white rounded-xl shadow-xl border border-pink-100 animate-float-slow hidden sm:flex items-center gap-2" style={{ animationDelay: '2s' }}>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
                </div>
                <div className="text-[10px] font-bold text-slate-700">1.2k users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-10 border-y border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Stores launched', value: '12k+', icon: StoreIcon },
              { label: 'Products added', value: '340k', icon: ShoppingBag },
              { label: 'Avg launch time', value: '3 min', icon: Zap },
              { label: 'Uptime', value: '99.9%', icon: Star },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <s.icon className="w-5 h-5 text-indigo-500 mb-2" />
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" />
            Features
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineered for{' '}
            <span className="gradient-text">high-converting</span>
            <br />
            online stores
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-4">
            Everything small retailers and digital brands need — without complex setup or hosting hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              gradient: 'from-indigo-500 to-blue-500',
              bg: 'bg-indigo-50',
              color: 'text-indigo-600',
              title: '5-Step Onboarding',
              desc: 'Guided wizard with progress tracking: store info, categories, catalog, theme preview, and one-click launch.',
            },
            {
              icon: FileSpreadsheet,
              gradient: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-50',
              color: 'text-emerald-600',
              title: 'CSV + Dummy Import',
              desc: 'Upload spreadsheets with SheetJS mapping and error diagnostics — or populate realistic dummy products in 1 click.',
            },
            {
              icon: Globe,
              gradient: 'from-purple-500 to-pink-500',
              bg: 'bg-purple-50',
              color: 'text-purple-600',
              title: 'Live URL + AI Chat',
              desc: 'Every store gets an isolated storefront at /s/[slug] with an embedded Gemini AI assistant that answers from real data.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${f.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              <div className={`relative w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                <f.icon className="w-7 h-7" />
              </div>

              <h3 className="relative text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="relative text-xs text-slate-600 leading-relaxed">{f.desc}</p>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-10 sm:p-16 text-center">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl opacity-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              Start free today
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Your store.
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Live in 3 minutes.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8">
              No credit card. No setup. Just fill a form, pick a theme, and go live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('/signup')}
                className="min-h-[52px] px-8 py-4 bg-white text-slate-900 rounded-2xl text-sm font-extrabold hover:scale-[1.03] active:scale-95 transition-transform shadow-2xl cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="min-h-[52px] px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl text-sm font-bold hover:bg-white/20 transition-all cursor-pointer"
              >
                Try demo login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/30">
              C
            </div>
            <span className="font-bold text-white">Cypher Store Builder</span>
            <span className="hidden sm:inline">· Multi-tenant no-code commerce</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/login')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sign in (owner@demo.com)
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
