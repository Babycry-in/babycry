'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, Category, Subcategory } from '@/types/database';
import { ProductCard } from '@/components/storefront/ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

interface CategoryProductGridProps {
  products: Product[];
  categories?: CategoryWithSubs[];
  initialCategoryId?: string;
  initialSubSlug?: string;
}

export function CategoryProductGrid({
  products,
  categories = [],
  initialCategoryId,
  initialSubSlug: propSubSlug = '',
}: CategoryProductGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sortBy, setSortBy] = useState<string>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  // Filter States — category is pinned to the current category page
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategoryId || 'all'
  );
  // Sub = selected subcategory slug (from URL ?sub= or state)
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>(
    propSubSlug || (searchParams?.get('sub') || '')
  );

  useEffect(() => {
    if (propSubSlug !== undefined) {
      setSelectedSubSlug(propSubSlug);
    }
  }, [propSubSlug]);

  // Track which category sections are expanded in the filter
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (initialCategoryId) s.add(initialCategoryId);
    return s;
  });

  const [inStockOnly, setInStockOnly] = useState(false);
  const [isNewOnly, setIsNewOnly] = useState(false);
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under-499' | '500-999' | '1000-plus'>('all');

  // Sync ?sub= URL param when subcategory changes
  const syncSubParam = useCallback((subSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subSlug) {
      params.set('sub', subSlug);
    } else {
      params.delete('sub');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Resolve subcategory ID from slug
  const resolvedSubcategoryId = useMemo(() => {
    if (!selectedSubSlug) return null;
    for (const cat of categories) {
      const sub = cat.subcategories?.find(s => s.slug === selectedSubSlug);
      if (sub) return sub.id;
    }
    return null;
  }, [selectedSubSlug, categories]);

  // Toggle expand a category's subcategories in the filter panel
  const toggleCategoryExpand = (id: string) => {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId && selectedCategoryId !== (initialCategoryId || 'all')) count++;
    if (selectedSubSlug) count++;
    if (inStockOnly) count++;
    if (isNewOnly) count++;
    if (isBestSellerOnly) count++;
    if (priceRange !== 'all') count++;
    return count;
  }, [selectedCategoryId, initialCategoryId, selectedSubSlug, inStockOnly, isNewOnly, isBestSellerOnly, priceRange]);

  const handleResetFilters = () => {
    setSelectedCategoryId(initialCategoryId || 'all');
    setSelectedSubSlug('');
    setInStockOnly(false);
    setIsNewOnly(false);
    setIsBestSellerOnly(false);
    setPriceRange('all');
    syncSubParam('');
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubSlug('');
    syncSubParam('');
  };

  const handleSelectSub = (catId: string, subSlug: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubSlug(subSlug);
    syncSubParam(subSlug);
  };

  // Filter and Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((prod) => {
      // 1. Category Filter
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        if (prod.category_id !== selectedCategoryId) return false;
      }

      // 2. Subcategory filter
      if (resolvedSubcategoryId) {
        if (prod.subcategory_id !== resolvedSubcategoryId) return false;
      }

      const price = prod.sale_price || prod.price;

      // 3. In Stock
      if (inStockOnly && prod.stock <= 0) return false;

      // 4. New Arrivals
      if (isNewOnly && !prod.is_new) return false;

      // 5. Bestsellers
      if (isBestSellerOnly && !prod.is_best_seller) return false;

      // 6. Price Ranges
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
    resolvedSubcategoryId,
    inStockOnly,
    isNewOnly,
    isBestSellerOnly,
    priceRange,
  ]);

  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categories]);

  const selectedSubObj = useMemo(() => {
    if (!selectedSubSlug) return null;
    for (const cat of categories) {
      const sub = cat.subcategories?.find(s => s.slug === selectedSubSlug);
      if (sub) return sub;
    }
    return null;
  }, [selectedSubSlug, categories]);

  // ─── Filter Panel (shared between desktop sidebar + mobile drawer) ────────
  const FilterPanel = () => (
    <div className="space-y-6 divide-y divide-emerald-50/70 text-slate-800">

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
            Categories
          </h3>

          {/* All collections button */}
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-all cursor-pointer mb-1.5 ${
              selectedCategoryId === 'all' && !selectedSubSlug
                ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            All Collections
          </button>

          {categories.map((cat) => {
            const isSelectedCat = selectedCategoryId === cat.id;
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            const isExpanded = expandedCategoryIds.has(cat.id);

            return (
              <div key={cat.id} className="mb-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectCategory(cat.id);
                      if (hasSubs && !isExpanded) {
                        toggleCategoryExpand(cat.id);
                      }
                    }}
                    className={`flex-1 text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-all cursor-pointer truncate ${
                      isSelectedCat && !selectedSubSlug
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    {cat.name}
                  </button>
                  {hasSubs && (
                    <button
                      type="button"
                      onClick={() => toggleCategoryExpand(cat.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        isExpanded
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-slate-400 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                      }`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name}`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-emerald-700' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {hasSubs && (
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'max-h-96 opacity-100 mt-1 mb-1' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-3 space-y-1 border-l-2 border-emerald-200/80 pl-3 py-0.5">
                      {cat.subcategories.map((sub) => {
                        const isSelectedSub = selectedSubSlug === sub.slug && selectedCategoryId === cat.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectSub(cat.id, sub.slug)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              isSelectedSub
                                ? 'bg-emerald-100/90 text-emerald-950 font-bold border border-emerald-200 shadow-2xs'
                                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AVAILABILITY */}
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

      {/* HIGHLIGHTS */}
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

      {/* PRICE RANGE */}
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
  );

  return (
    <div>
      {/* Controls Bar: Count, Filter Trigger & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3.5 mb-4 sm:mb-6 border-b border-emerald-100">
        
        {/* Count Label */}
        <div className="flex items-center justify-between sm:justify-start">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            Showing{' '}
            <span className="font-bold text-emerald-800">
              {filteredAndSortedProducts.length}
            </span>{' '}
            {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Right side controls: Filter Trigger (mobile) & Custom Sort Select */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          
          {/* Filter Button — visible on mobile only */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-600 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Custom Sort Dropdown */}
          <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-600 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <div className="flex items-center gap-1.5 truncate">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                <span className="truncate">
                  {sortBy === 'price-low'
                    ? 'Price: Low to High'
                    : sortBy === 'price-high'
                    ? 'Price: High to Low'
                    : sortBy === 'newest'
                    ? 'Newest Arrivals'
                    : 'Featured Picks'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180 text-emerald-700' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Popover */}
            {isSortOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-52 sm:w-56 bg-white/98 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95"
                role="listbox"
              >
                {[
                  { id: 'featured', label: 'Featured Picks' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'newest', label: 'Newest Arrivals' },
                ].map((opt) => {
                  const isSelected = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pt-1">
          <span className="text-xs text-slate-400 font-medium">Active filters:</span>
          
          {selectedCategoryObj && !selectedSubObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              Category: {selectedCategoryObj.name}
              <button
                type="button"
                onClick={() => handleSelectCategory(initialCategoryId || 'all')}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Reset category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSubObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              {selectedCategoryObj?.name} › {selectedSubObj.name}
              <button
                type="button"
                onClick={() => { setSelectedSubSlug(''); syncSubParam(''); }}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                aria-label="Remove subcategory filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              In Stock
              <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-emerald-950 p-0.5 cursor-pointer" aria-label="Remove in stock filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isNewOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              New Arrivals
              <button type="button" onClick={() => setIsNewOnly(false)} className="hover:text-emerald-950 p-0.5 cursor-pointer" aria-label="Remove new arrivals filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isBestSellerOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              Bestsellers
              <button type="button" onClick={() => setIsBestSellerOnly(false)} className="hover:text-emerald-950 p-0.5 cursor-pointer" aria-label="Remove bestsellers filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
              {priceRange === 'under-499' ? 'Under ₹500' : priceRange === '500-999' ? '₹500 - ₹999' : '₹1,000+'}
              <button type="button" onClick={() => setPriceRange('all')} className="hover:text-emerald-950 p-0.5 cursor-pointer" aria-label="Remove price filter">
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

      {/* Desktop layout: sticky sidebar + product grid */}
      <div className="flex gap-8 items-start">

        {/* Desktop sticky filter sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <h2 className="font-heading text-sm font-bold text-slate-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
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

        {/* Drawer panel */}
        <div
          className={`fixed inset-x-0 bottom-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[400px] bg-white rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-full transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 ${
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
          <div className="p-5 overflow-y-auto">
            <FilterPanel />
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
