import React, { useRef, useState } from 'react';
import { Product, Store } from '../types';
import { ShoppingBag, Check } from 'lucide-react';

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

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only calculate tilt on devices with hover/pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current || isOutOfStock) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotY = ((x - centerX) / centerX) * 10;
    const rotX = -((y - centerY) / centerY) * 10;

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

  return (
    <div
      style={{ perspective: '900px' }}
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
            ? `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={`relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
          isHovered ? 'shadow-xl border-slate-300' : 'shadow-xs border-slate-200/90'
        }`}
      >
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center';
                fallback.innerHTML = `<span class="text-[11px] font-medium uppercase tracking-wider text-slate-500">${product.categoryName || 'Item'}</span><span class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">${product.name}</span>`;
                parent.appendChild(fallback);
              }
            }}
          />

          {/* Stock Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-white bg-red-600/95 backdrop-blur-xs rounded-md shadow-xs">
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-amber-950 bg-amber-400/95 backdrop-blur-xs rounded-md shadow-xs">
                Only {product.stock} left
              </span>
            ) : null}
          </div>

          {/* Discount Badge */}
          {product.discountPct && product.discountPct > 0 && !isOutOfStock && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-100/95 backdrop-blur-xs rounded-md shadow-xs">
                {product.discountPct}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="truncate max-w-[60%]">{product.categoryName || 'Collection'}</span>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">{product.sku}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row (Touch target >= 44px on mobile) */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tabular-nums">
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
                  : store.primaryColor || '#0f172a',
              }}
              className={`w-full sm:w-auto min-h-[40px] sm:min-h-[36px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl transition-all duration-150 active:scale-95 shadow-xs cursor-pointer ${
                isOutOfStock ? 'cursor-not-allowed opacity-60' : ''
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
