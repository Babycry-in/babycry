'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category } from '@/types/database';
import { ProductCard } from '@/components/storefront/ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';

interface CategoryProductGridProps {
  products: Product[];
  categories?: Category[];
  initialCategoryId?: string;
}

export function CategoryProductGrid({
  products,
  categories = [],
  initialCategoryId,
}: CategoryProductGridProps) {
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  // Filter States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategoryId || 'all'
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isNewOnly, setIsNewOnly] = useState(false);
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under-499' | '500-999' | '1000-plus'>('all');

  // Dynamically resolve category list (use passed categories or derive from product data)
  const categoriesList = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const map = new Map<string, Category>();
    products.forEach((p) => {
      if (p.category) map.set(p.category.id, p.category);
    });
    return Array.from(map.values());
  }, [categories, products]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId && selectedCategoryId !== (initialCategoryId || 'all')) count++;
    if (inStockOnly) count++;
    if (isNewOnly) count++;
    if (isBestSellerOnly) count++;
    if (priceRange !== 'all') count++;
    return count;
  }, [selectedCategoryId, initialCategoryId, inStockOnly, isNewOnly, isBestSellerOnly, priceRange]);

  const handleResetFilters = () => {
    setSelectedCategoryId(initialCategoryId || 'all');
    setInStockOnly(false);
    setIsNewOnly(false);
    setIsBestSellerOnly(false);
    setPriceRange('all');
  };

  // Filter and Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((prod) => {
      // 1. Category Filter
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        if (prod.category_id !== selectedCategoryId) return false;
      }

      const price = prod.sale_price || prod.price;

      // 2. In Stock
      if (inStockOnly && prod.stock <= 0) return false;

      // 3. New Arrivals
      if (isNewOnly && !prod.is_new) return false;

      // 4. Bestsellers
      if (isBestSellerOnly && !prod.is_best_seller) return false;

      // 5. Price Ranges
      if (priceRange === 'under-499' && price >= 500) return false;
      if (priceRange === '500-999' && (price < 500 || price > 999)) return false;
      if (priceRange === '1000-plus' && price < 1000) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortBy === 'newest') {
      result.sort(
        (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    }

    return result;
  }, [
    products,
    sortBy,
    selectedCategoryId,
    inStockOnly,
    isNewOnly,
    isBestSellerOnly,
    priceRange,
  ]);

  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    return categoriesList.find((c) => c.id === selectedCategoryId);
  }, [selectedCategoryId, categoriesList]);

  return (
    <div>
      {/* Controls Bar: Count, Filter Trigger & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-4 mb-4 sm:mb-6 border-b border-emerald-100">
        
        {/* Count Label */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            Showing{' '}
            <span className="font-bold text-emerald-800">
              {filteredAndSortedProducts.length}
            </span>{' '}
            {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Right side controls: Filter Trigger & Sort Select */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          
          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-600 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer active:scale-95"
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pt-1">
          <span className="text-xs text-slate-400 font-medium">Active filters:</span>
          
          {selectedCategoryObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              Category: {selectedCategoryObj.name}
              <button
                type="button"
                onClick={() => setSelectedCategoryId(initialCategoryId || 'all')}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Reset category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              In Stock
              <button
                type="button"
                onClick={() => setInStockOnly(false)}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Remove in stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isNewOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              New Arrivals
              <button
                type="button"
                onClick={() => setIsNewOnly(false)}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Remove new arrivals filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isBestSellerOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              Bestsellers
              <button
                type="button"
                onClick={() => setIsBestSellerOnly(false)}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Remove bestsellers filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              {priceRange === 'under-499'
                ? 'Under ₹500'
                : priceRange === '500-999'
                ? '₹500 - ₹999'
                : '₹1,000+'}
              <button
                type="button"
                onClick={() => setPriceRange('all')}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-dashed border-emerald-200 p-8">
          <div className="w-16 h-16 rounded-full bg-[#EBF7F1] text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-800 mb-1">
            No matching products found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting or resetting your filters to see more baby essentials.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white text-xs font-semibold rounded-full hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Filter Drawer: Mobile Bottom Sheet / Desktop Smooth Slide from RIGHT Side */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
          isFilterOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!isFilterOpen}
      >
        {/* Backdrop Fade */}
        <div
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isFilterOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* Drawer panel: On desktop, slides in from the RIGHT edge */}
        <div
          className={`fixed inset-x-0 bottom-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px] bg-white rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-full transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 ${
            isFilterOpen
              ? 'translate-y-0 sm:translate-x-0'
              : 'translate-y-full sm:translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Filter Products
              </h2>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close filter drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="p-5 overflow-y-auto space-y-6 divide-y divide-emerald-50/70 text-slate-800">
            
            {/* 1. CATEGORIES SECTION (Available on both Mobile & Desktop) */}
            {categoriesList.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      selectedCategoryId === 'all'
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    All Collections
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selectedCategoryId === cat.id
                          ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Availability (Mobile & Desktop) */}
            <div className="pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                />
                <span className="text-sm font-medium text-slate-700">In Stock Only</span>
              </label>
            </div>

            {/* 3. Highlights (Mobile & Desktop) */}
            <div className="pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                Highlights
              </h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNewOnly}
                    onChange={(e) => setIsNewOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-700">New Arrivals</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSellerOnly}
                    onChange={(e) => setIsBestSellerOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Bestsellers</span>
                </label>
              </div>
            </div>

            {/* 4. Price Range (Mobile & Desktop) */}
            <div className="pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                Price Range
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-499', label: 'Under ₹500' },
                  { id: '500-999', label: '₹500 - ₹999' },
                  { id: '1000-plus', label: '₹1,000 & Above' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setPriceRange(tier.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      priceRange === tier.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 sm:p-5 border-t border-emerald-100 bg-[#FAF7F2] shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                Apply Filters ({filteredAndSortedProducts.length} items)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
