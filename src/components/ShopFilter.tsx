import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { translations } from '../localization';
import { Language } from '../types';

interface ShopFilterProps {
  language: Language;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  selectedRam: string;
  setSelectedRam: (r: string) => void;
  selectedStorage: string;
  setSelectedStorage: (s: string) => void;
  selectedProcessor: string;
  setSelectedProcessor: (p: string) => void;
  selectedGraphics: string;
  setSelectedGraphics: (g: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  onReset: () => void;
}

export default function ShopFilter({
  language,
  selectedBrand,
  setSelectedBrand,
  maxPrice,
  setMaxPrice,
  selectedRam,
  setSelectedRam,
  selectedStorage,
  setSelectedStorage,
  selectedProcessor,
  setSelectedProcessor,
  selectedGraphics,
  setSelectedGraphics,
  sortBy,
  setSortBy,
  onReset
}: ShopFilterProps) {
  const t = translations[language];

  // Fixed ranges for items
  const brands = ['All', 'ASUS', 'Razer', 'Apple', 'Lenovo', 'Dell', 'Acer', 'HP'];
  const processors = ['All', 'Intel Core i9', 'Intel Core i7', 'Apple M3 Max', 'AMD Ryzen 7', 'AMD Ryzen 5'];
  const ramOptions = ['All', '16GB', '32GB', '48GB'];
  const storageOptions = ['All', '512GB', '1TB', '2TB'];
  const graphicsOptions = ['All', 'NVIDIA GeForce RTX 4080', 'NVIDIA GeForce RTX 4070', 'NVIDIA GeForce RTX 4060', 'NVIDIA GeForce RTX 4050', 'AMD Radeon', 'Intel Iris Xe', 'Apple 40-Core'];

  return (
    <div id="shop-advanced-filer-panel" className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-850 dark:bg-neutral-900/40">
      
      {/* FILTER PANEL HEADER */}
      <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-orange-600" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            {t.filterTitle || 'Filter Products'}
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="flex flex-col gap-6">

        {/* SORT BY */}
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {t.sortBy || 'Sort By'}
          </label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option value="newest">Newest Launch</option>
            <option value="bestsellers">Best SellersFirst</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* BRAND SELECTION */}
        <div>
          <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Laptop Brands
          </label>
          <div className="flex flex-wrap gap-1.5">
            {brands.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  (b === 'All' && selectedBrand === '') || selectedBrand === b
                    ? 'bg-orange-600 text-white'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE LIMIT INTEGRATED SLIDER */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <span>Maximum Price</span>
            <span className="font-extrabold text-neutral-950 dark:text-white">${maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-lg bg-neutral-200 accent-orange-600 dark:bg-neutral-850"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-neutral-400">
            <span>$500</span>
            <span>$4,000</span>
          </div>
        </div>

        {/* PROCESSOR BRAND GRID */}
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Processor (CPU)
          </label>
          <select
            value={selectedProcessor === '' ? 'All' : selectedProcessor}
            onChange={e => setSelectedProcessor(e.target.value === 'All' ? '' : e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {processors.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* MEMORY RAM OPTIONS */}
        <div>
          <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Memory Capacity (RAM)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {ramOptions.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRam(r === 'All' ? '' : r)}
                className={`rounded-xl border py-2 text-xs font-semibold text-center transition-colors ${
                  (r === 'All' && selectedRam === '') || selectedRam === r
                    ? 'border-orange-600 bg-orange-50/40 text-orange-600 dark:bg-orange-950/20'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-400'
                }`}
              >
                {r === 'All' ? 'Any RAM' : r}
              </button>
            ))}
          </div>
        </div>

        {/* STORAGE DRIVE BOXES */}
        <div>
          <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Storage Space
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {storageOptions.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStorage(s === 'All' ? '' : s)}
                className={`rounded-xl border py-2 text-xs font-semibold text-center transition-colors ${
                  (s === 'All' && selectedStorage === '') || selectedStorage === s
                    ? 'border-orange-600 bg-orange-50/40 text-orange-600 dark:bg-orange-950/20'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-400'
                }`}
              >
                {s === 'All' ? 'Any Storage' : s}
              </button>
            ))}
          </div>
        </div>

        {/* GRAPHICS UNIT SELECT */}
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Graphics Unit (GPU)
          </label>
          <select
            value={selectedGraphics === '' ? 'All' : selectedGraphics}
            onChange={e => setSelectedGraphics(e.target.value === 'All' ? '' : e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {graphicsOptions.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
