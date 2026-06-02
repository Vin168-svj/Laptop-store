import React from 'react';
import { X, ArrowRightLeft, Percent, Scale, ClipboardList } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatCurrency, translations } from '../localization';

interface CompareDrawerProps {
  comparedProducts: Product[];
  onRemove: (p: Product) => void;
  onClear: () => void;
  currency: Currency;
  language: Language;
  onSelect: (p: Product) => void;
  isVisible: boolean;
  onToggleVisible: () => void;
}

export default function CompareDrawer({
  comparedProducts,
  onRemove,
  onClear,
  currency,
  language,
  onSelect,
  isVisible,
  onToggleVisible
}: CompareDrawerProps) {
  const t = translations[language];

  if (comparedProducts.length === 0) return null;

  return (
    <div id="compare-drawer-container" className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl border-t border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300">
      
      {/* HEADER TAB BAR */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-orange-500 animate-pulse" />
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            {t.compareTitle} ({comparedProducts.length} chosen)
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Clear All
          </button>
          <button
            onClick={onToggleVisible}
            className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            {isVisible ? 'Collapse' : 'Expand Compare'}
          </button>
        </div>
      </div>

      {/* COMPARISON SPEC TABLE */}
      {isVisible && (
        <div className="max-h-[350px] overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            
            {/* LABELS COLUMN (HIDDEN ON VERTICAL LAYOUTS OR REPLICATED) */}
            <div className="hidden md:flex flex-col gap-6 text-[11px] font-bold tracking-wider text-neutral-400 uppercase pt-[140px]">
              <div>BRAND</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">PROCESSOR</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">MEMORY (RAM)</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">STORAGE DRIVE</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">GRAPHICS ENGINE</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">SCREEN PANEL</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">BATTERY SPEED</div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">RETAIL PRICE</div>
            </div>

            {/* PRODUCT SPEC COLS */}
            {comparedProducts.map(product => (
              <div key={product.id} className="relative rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
                <button
                  onClick={() => onRemove(product)}
                  className="absolute top-2 right-2 rounded-full bg-neutral-200/60 p-1 text-neutral-500 hover:bg-red-500 hover:text-white dark:bg-neutral-700/60 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* SMALL TOP ROW CARD SUMMARY */}
                <div className="flex gap-2.5 items-center mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-12 w-16 object-cover rounded-md"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 
                      onClick={() => onSelect(product)}
                      className="text-xs font-black text-neutral-800 hover:text-blue-500 dark:text-neutral-200 cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h5>
                    <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 mt-0.5">
                      ★ {product.rating} ({(product.reviews || []).length} reviews)
                    </p>
                  </div>
                </div>

                {/* VALUES STACKED OR LABELED */}
                <div className="flex flex-col gap-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">BRAND:</span>
                    <span className="font-semibold">{product.brand}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">CPU:</span>
                    <span>{product.specs.processor}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">RAM:</span>
                    <span>{product.specs.ram}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">STORAGE:</span>
                    <span>{product.specs.storage}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">GPU:</span>
                    <span>{product.specs.graphics}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">DISPLAY SIZE:</span>
                    <span>{product.specs.display}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">BATTERY:</span>
                    <span>{product.specs.battery}</span>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex items-center justify-between md:block">
                    <span className="md:hidden font-bold text-neutral-400 text-[10px] tracking-wider block">PRICE:</span>
                    <span className="font-extrabold text-neutral-900 dark:text-white text-sm">
                      {formatCurrency(product.price, currency)}
                    </span>
                  </div>
                </div>

              </div>
            ))}

            {/* PLACEHOLDER CARD IF LESS THAN 3 LAPTOPS */}
            {comparedProducts.length < 3 && [...Array(3 - comparedProducts.length)].map((_, idx) => (
              <div key={idx} className="hidden md:flex h-full items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/20 px-6 py-12 text-center text-xs text-neutral-400 dark:border-neutral-800">
                <div className="flex flex-col items-center gap-1.5">
                  <ClipboardList className="h-6 w-6 text-neutral-300" />
                  <p>Choose an additional model to compare details.</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}
