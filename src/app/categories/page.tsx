import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/data/db-service';
import { Sparkles, ArrowRight } from 'lucide-react';

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
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col bg-white rounded-3xl p-5 border border-emerald-50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-50 mb-4">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-[#EBF7F1] group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-800 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">
                {cat.short_description || 'Thoughtfully selected pieces for your little one.'}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
