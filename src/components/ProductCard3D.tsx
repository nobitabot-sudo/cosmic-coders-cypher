import React, { useRef, useState } from 'react';
import { Product, Store } from '../types';
import { ShoppingBag, Check, Eye, Heart } from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
  store: Store;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  store,
  onAddToCart,
  onQuickView
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current || isOutOfStock) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotY = ((x - centerX) / centerX) * 14;
    const rotX = -((y - centerY) / centerY) * 14;

    setRotateX(rotY);
    setRotateY(rotX);
  };

  const handleMouseEnter = () => {
    if (!window.matchMedia('(pointer: coarse)').matches) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((l) => !l);
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="group h-full select-none"
    >
      <div
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
                2
              )}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.15s ease-out'
            : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease-out',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `${rotateX * 1.5}px ${-rotateY * 1.5}px 40px rgba(0, 0, 0, 0.12), 0 20px 40px rgba(99, 102, 241, 0.1)`
            : undefined
        }}
        className={`relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
          isHovered ? 'border-indigo-300/70' : 'border-slate-200/90'
        }`}
      >
        {/* Shine/Gloss effect on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0.15) 55%, transparent 70%)`,
            transform: `translateX(${rotateX * 2}px) translateY(${rotateY * 2}px)`
          }}
        />

        {/* Product Image Container */}
        <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
          {!imageError ? (
            <img
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              loading="lazy"
              referrerPolicy="origin"
              crossOrigin="anonymous"
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-3 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-2 opacity-60"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {product.categoryName || 'Item'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {product.name}
              </span>
            </div>
          )}

          {/* Gradient overlay on hover (bottom) */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Stock Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-white bg-red-600/95 backdrop-blur-sm rounded-md shadow-sm">
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-amber-950 bg-amber-400/95 backdrop-blur-sm rounded-md shadow-sm animate-pulse">
                Only {product.stock} left
              </span>
            ) : null}
          </div>

          {/* Discount Badge */}
          {product.discountPct && product.discountPct > 0 && !isOutOfStock && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-100/95 backdrop-blur-sm rounded-md shadow-sm">
                {product.discountPct}% OFF
              </span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleLike}
            aria-label="Wishlist"
            className={`absolute bottom-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
              liked
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-white/90 text-slate-500 hover:bg-white hover:scale-110'
            } ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          {onQuickView && !isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className={`absolute bottom-2 right-2 z-10 px-3 h-8 rounded-full flex items-center gap-1.5 text-[11px] font-semibold bg-white/95 text-slate-800 hover:bg-white backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-sm ${
                isHovered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Quick view
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="truncate max-w-[60%] font-medium">
                {product.categoryName || 'Collection'}
              </span>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                {product.sku}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tabular-nums transition-colors duration-200 group-hover:text-indigo-700">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through tabular-nums">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              style={{
                backgroundColor: isOutOfStock
                  ? '#cbd5e1'
                  : added
                  ? '#16a34a'
                  : store.primaryColor || '#0f172a'
              }}
              className={`w-full sm:w-auto min-h-[40px] sm:min-h-[36px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md cursor-pointer ${
                isOutOfStock
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:brightness-110'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
