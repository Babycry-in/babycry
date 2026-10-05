'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';

import { getTopCategories } from '@/lib/homepage-categories';
import { MobileCategoryRow } from './MobileCategoryRow';

interface CategoryCapsulesProps {
  categories: Category[];
}

// Cloud SVG — tiny decorative floating clouds for background
function CloudIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="60" cy="52" rx="52" ry="22" fill="#D6EDE4" fillOpacity="0.7" />
      <ellipse cx="38" cy="42" rx="28" ry="22" fill="#D6EDE4" fillOpacity="0.7" />
      <ellipse cx="76" cy="40" rx="30" ry="24" fill="#D6EDE4" fillOpacity="0.7" />
      <ellipse cx="55" cy="34" rx="22" ry="20" fill="#D6EDE4" fillOpacity="0.7" />
    </svg>
  );
}

export function CategoryCapsules({ categories }: CategoryCapsulesProps) {
  const displayItems = getTopCategories(categories);

  return (
    <section className="relative py-10 sm:py-20 overflow-hidden ">

      {/* ── Decorative floating SVG clouds in background ── */}
      <CloudIcon className="absolute -top-3 left-4 w-28 sm:w-36 opacity-80 pointer-events-none select-none" />
      <CloudIcon className="absolute top-6 right-6 w-24 sm:w-32 opacity-70 scale-x-[-1] pointer-events-none select-none" />
      <CloudIcon className="absolute bottom-6 left-[8%] w-20 opacity-50 pointer-events-none select-none" />
      <CloudIcon className="absolute bottom-4 right-[10%] w-24 opacity-45 scale-x-[-1] pointer-events-none select-none" />
      <CloudIcon className="absolute top-1/2 left-[2%] w-16 opacity-35 pointer-events-none select-none" />
      <CloudIcon className="absolute top-1/3 right-[3%] w-20 opacity-35 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header — keep as reference design */}
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
            Shop the little world
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Thoughtfully picked pieces for every little moment.
          </p>
        </div>

        {/* Mobile: 3 category items completely visible in one horizontal row */}
        <MobileCategoryRow items={displayItems} mode="static" />

        {/* Desktop Category items — unchanged flex wrap on md+ */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {displayItems.map((item) => (
            <Link
              key={item.id || item.slug}
              href={`/categories/${item.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Cloud platform — bigger so product image shows clearly inside */}
              <div className="relative flex items-center justify-center" style={{ width: 168, height: 174 }}>
                {/* Cloud shape as platform */}
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="168px"
                  className="object-contain drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                  aria-hidden
                />
                {/* Product image — sits on top of cloud, contained without cropping */}
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-2">
                  <Image
                    src={item.image || '/images/babycry-logo.png'}
                    alt={item.label}
                    fill
                    sizes="112px"
                    className="object-contain object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <span className="font-heading font-semibold text-slate-700 text-xs sm:text-sm mt-2.5 group-hover:text-emerald-700 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
