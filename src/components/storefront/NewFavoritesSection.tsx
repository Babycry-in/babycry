import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface NewFavoritesSectionProps {
  products: Product[];
}

export function NewFavoritesSection({ products }: NewFavoritesSectionProps) {
  return (
    <section className="py-8 sm:py-20 bg-gradient-to-b from-[#FAF7F2] to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: centered on mobile, split on desktop */}
        <div className="flex flex-col items-center text-center sm:items-end sm:text-left sm:flex-row justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-center sm:text-left">
              New little favorites
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 text-center sm:text-left">
              Fresh styles and everyday essentials, chosen for little ones.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid: Exactly 4 products, 2 per row on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
