'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/database';
import { getEssentialCategories } from '@/lib/homepage-categories';

interface BabyEssentialsSectionProps {
  categories?: Category[];
}

export function BabyEssentialsSection({ categories = [] }: BabyEssentialsSectionProps) {
  const essentials = useMemo(() => getEssentialCategories(categories), [categories]);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  // Duplicate items for a continuous, seamless infinite loop
  const loopTrack = useMemo(() => {
    if (!essentials || essentials.length === 0) return [];
    const base = essentials.length < 5 ? [...essentials, ...essentials] : essentials;
    return [...base, ...base];
  }, [essentials]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    // If movement is more than 8px, it is a scroll/swipe, not a tap
    if (Math.hypot(dx, dy) > 8) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartPos.current = null;
    // Resume animation cleanly after a short pause
    setTimeout(() => {
      setIsPaused(false);
    }, 400);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSwiping.current) {
      e.preventDefault();
      isSwiping.current = false;
    }
  };

  if (!essentials || essentials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-8 sm:py-14 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top row: centered on mobile, split left/right on desktop */}
        <div className="flex flex-col items-center text-center sm:items-end sm:text-left sm:flex-row justify-between mb-6 sm:mb-10 gap-3">
          <div className="flex flex-col items-center sm:items-start">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800/70 mb-1.5 sm:mb-2 text-center sm:text-left">
              BABY ESSENTIALS
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight text-center sm:text-left">
              Made for everyday
              <br className="hidden sm:block" /> little moments.
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-900 hover:text-emerald-700 transition-colors group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* ── Continuous Horizontal Moving Category Carousel ── */}
      {/* Container: overflow-hidden prevents page-wide horizontal scroll */}
      {/* touch-action: pan-y ensures 100% native vertical page scrolling on touch */}
      <div
        className="relative w-full overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Left & Right subtle edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Animated Marquee Track */}
        <div
          className={`category-marquee-track py-2 px-4 gap-5 sm:gap-8 lg:gap-10 ${
            isPaused ? 'is-paused' : ''
          }`}
          style={{ touchAction: 'pan-y' }}
        >
          {loopTrack.map((item, index) => (
            <Link
              key={`${item.id || item.slug}-${index}`}
              href={`/categories/${item.slug}`}
              onClick={handleCardClick}
              className="group shrink-0 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
            >
              {/* Cloud platform */}
              <div
                className="relative flex items-center justify-center w-[116px] h-[120px] sm:w-[154px] sm:h-[160px] lg:w-[168px] lg:h-[174px]"
              >
                {/* Cloud shape platform */}
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 116px, (max-width: 1024px) 154px, 168px"
                  className="object-contain drop-shadow-2xs group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                  aria-hidden
                />
                {/* Category image inside cloud — object-contain so NO cropping */}
                <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center p-1.5 sm:p-2">
                  <Image
                    src={item.image || '/images/babycry-logo.png'}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 1024px) 96px, 112px"
                    className="object-contain object-center group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Category Label */}
              <span className="font-heading font-semibold text-slate-700 text-xs sm:text-sm lg:text-base mt-2 group-hover:text-emerald-700 transition-colors whitespace-nowrap text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}