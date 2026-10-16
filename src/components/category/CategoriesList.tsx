'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';
import { ArrowRight } from 'lucide-react';

interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full">
      {/* Exactly 2 cards per row on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-emerald-50 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98]"
          >
            <div>
              {/* Category Image — aspect-[4/3] with object-contain to prevent stretching or cropping */}
              <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F2]/40 mb-2.5 sm:mb-3.5">
                <Image
                  src={cat.image_url || '/images/babycry-logo.png'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500 p-1.5 sm:p-2"
                  priority={idx < 2}
                />
              </div>

              {/* Title & Arrow */}
              <div className="flex items-center justify-between gap-1.5 mt-1">
                <h3 className="font-heading text-xs sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#EBF7F1] group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-800 transition-colors shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Short description */}
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-1.5 line-clamp-2 leading-tight sm:leading-relaxed">
                {cat.short_description || 'Thoughtfully selected pieces for your little one.'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
