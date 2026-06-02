import React from 'react';
import { Star, ShieldAlert, ShoppingCart, Eye, ArrowRightLeft } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatCurrency, translations } from '../localization';

interface ProductCardProps {
  key?: any;
  product: Product;
  currency: Currency;
  language: Language;
  onAddToCart: (p: Product, q?: number) => void;
  onBuyNow: (p: Product) => void;
  onSelect: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  isCompared: boolean;
}

export default function ProductCard({
  product,
  currency,
  language,
  onAddToCart,
  onBuyNow,
  onSelect,
  onToggleCompare,
  isCompared
}: ProductCardProps) {
  const t = translations[language];

  // Helper colors for brands
  const brandColor = (brand: string) => {
    switch (brand.toUpperCase()) {
      case 'APPLE': return 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900';
      case 'ASUS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'RAZER': return 'bg-lime-100 text-emerald-950 dark:bg-lime-950/40 dark:text-lime-300';
      case 'DELL': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300';
      case 'LENOVO': return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  return (
    <div id={`product-card-${product.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
      
      {/* BADGES ROW */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isBestSeller && (
          <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase dark:bg-amber-400">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            New
          </span>
        )}
        {product.stock === 0 && (
          <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            <ShieldAlert className="h-3 w-3" /> Out of Stock
          </span>
        )}
      </div>

      {/* ACTION CORNER */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          onClick={() => onToggleCompare(product)}
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors duration-200 ${
            isCompared
              ? 'bg-amber-500 text-neutral-900 hover:bg-amber-600'
              : 'bg-white text-neutral-600 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white'
          }`}
          title="Add to spec comparison"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onSelect(product)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-600 shadow-md transition-colors duration-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          title={t.quickView || 'Quick View'}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* LAPTOP IMAGE CONTAINER */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-48 w-full cursor-pointer overflow-hidden bg-neutral-50 dark:bg-neutral-800/40"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* DETAILS BODY */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${brandColor(product.brand)}`}>
            {product.brand}
          </span>
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        <h3 
          onClick={() => onSelect(product)}
          className="mb-1 cursor-pointer text-base font-bold text-neutral-900 hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400 line-clamp-1"
        >
          {product.name}
        </h3>

        {/* STARS AND REVIEWS count */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 dark:text-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {product.rating} ({product.reviews.length})
          </span>
        </div>

        {/* HIGH-LEVEL SPECS ACCENTS */}
        <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-neutral-100 pt-3 text-[11px] text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          <div className="line-clamp-1"><span className="font-semibold text-neutral-400 block sm:inline">CPU:</span> {product.specs.processor.split('(')[0]}</div>
          <div className="line-clamp-1"><span className="font-semibold text-neutral-400 block sm:inline">RAM:</span> {product.specs.ram.split('(')[0]}</div>
          <div className="line-clamp-1"><span className="font-semibold text-neutral-400 block sm:inline">GPU:</span> {product.specs.graphics.split('(')[0]}</div>
          <div className="line-clamp-1"><span className="font-semibold text-neutral-400 block sm:inline">Disk:</span> {product.specs.storage}</div>
        </div>

        {/* PRICE LABEL */}
        <div className="mt-auto mb-4 flex items-baseline justify-between gap-1">
          <div className="text-lg font-black text-neutral-900 dark:text-white">
            {formatCurrency(product.price, currency)}
          </div>
          <span className="text-xs text-neutral-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* BUY / CART ACTION BUTTONS */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="col-span-2 flex items-center justify-center gap-1 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 text-xs py-2 px-2"
            title={t.addToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
          
          <button
            onClick={() => onBuyNow(product)}
            disabled={product.stock === 0}
            className="buy-now-btn col-span-3 flex items-center justify-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 text-xs py-2 px-2 transition-all"
          >
            {t.buyNow || 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
