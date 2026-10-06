'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle mobile swipe/scroll tracking to update pagination dots
  const handleScroll = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el || el.clientWidth === 0) return;
    const scrollPos = el.scrollLeft;
    const cardWidth = el.clientWidth;
    const newIndex = Math.round(scrollPos / cardWidth);
    if (newIndex >= 0 && newIndex < categories.length) {
      setActiveIndex(newIndex);
    }
  }, [categories.length]);

  const scrollToIndex = (index: number) => {
    const el = mobileTrackRef.current;
    if (!el) return;
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < categories.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  return (
    <div className="w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE VIEW (sm:hidden) — Horizontal Swipe Carousel
          Shows 1 category card at a time with touch swipe & pagination dots
      ────────────────────────────────────────────────────────────── */}
      <div className="sm:hidden relative w-full overflow-hidden">
        {/* Swipeable Track */}
        <div
          ref={mobileTrackRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar w-full py-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="w-full shrink-0 snap-center px-1"
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group flex flex-col bg-white rounded-3xl p-5 border border-emerald-50 shadow-sm transition-all active:scale-[0.99]"
              >
                {/* Category Image — object-contain preserves full image without cropping */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAF7F2]/50 mb-4">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-contain p-2"
                    priority={idx === 0}
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-[#EBF7F1] group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-800 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.short_description || 'Thoughtfully selected pieces for your little one.'}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* Carousel Controls & Pagination Dots */}
        <div className="pt-4 pb-2 flex flex-col items-center justify-center gap-2">
          {/* Subtle Swipe Status */}
          <div className="flex items-center justify-between w-full px-2 text-slate-400 text-[11px] font-medium">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous category"
              className="p-1.5 text-slate-500 disabled:opacity-20 hover:text-emerald-700 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-500 font-medium">
              Swipe to explore • <span className="font-bold text-emerald-800">{activeIndex + 1}</span> of {categories.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === categories.length - 1}
              aria-label="Next category"
              className="p-1.5 text-slate-500 disabled:opacity-20 hover:text-emerald-700 active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[280px]">
            {categories.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Jump to category ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? 'w-5 bg-emerald-700'
                    : 'w-1.5 bg-emerald-200 hover:bg-emerald-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP VIEW (hidden sm:grid) — 4 Collection Cards Per Row
          Maintains existing responsive 4-col grid with uncropped images
      ────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col bg-white rounded-3xl p-4 sm:p-5 border border-emerald-50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all"
          >
            {/* Category Image — object-contain preserves full uncropped image */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAF7F2]/40 mb-3.5">
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                sizes="(max-width: 1024px) 33vw, 25vw"
                className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBF7F1] group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-800 transition-colors shrink-0">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {cat.short_description || 'Thoughtfully selected pieces for your little one.'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
