import React from 'react';
import { getCategories } from '@/lib/data/db-service';
import { CategoriesList } from '@/components/category/CategoriesList';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Shop All Categories | Baby Cry.in',
  description: 'Explore all 12 baby & kids categories: Apparels, Footwear, Accessories, Hospital Kits, Toys, Diapering & Gift Hampers.',
};

export default async function CategoriesPage() {
  const categories = await getCategories(true);

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>EXPLORE OUR CURATION</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900">
            All Collections
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Pure organic cotton, thoughtful hospital maternity kits, cozy pre-walkers, and handpicked baby gift hampers.
          </p>
        </div>

        {/* Categories Grid (4 cards per row on desktop, swipeable/scrollable vertically on mobile) */}
        <CategoriesList categories={categories} />

      </div>
    </div>
  );
}
