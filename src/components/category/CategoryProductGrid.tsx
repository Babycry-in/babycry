'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types/database';
import { ProductCard } from '@/components/storefront/ProductCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryProductGridProps {
  products: Product[];
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredAndSortedProducts = useMemo(() => {
    const result = [...products];

    // Sort
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
  }, [products, sortBy]);

  return (
    <div>
      {/* Controls Bar: Count & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-8 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            Showing <span className="font-bold text-emerald-800">{filteredAndSortedProducts.length}</span> {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-600"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

      </div>

      {/* Grid or Empty State */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200 p-8">
          <div className="w-16 h-16 rounded-full bg-[#EBF7F1] text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-800 mb-1">
            No products available yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We are restocking soft, adorable picks for this collection. Please check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
