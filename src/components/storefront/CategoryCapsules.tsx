'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';
import { getTopCategories } from '@/lib/homepage-categories';

interface CategoryCapsulesProps {
  categories: Category[];
}

// Cloud SVG — tiny decorative floating clouds for background
function CloudIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 75"
      fill="none"
      xmlns=""
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
  const displayItems = React.useMemo(() => getTopCategories(categories), [categories]);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  // Duplicate items for a continuous, seamless infinite loop
  const loopTrack = React.useMemo(() => {
    if (!displayItems || displayItems.length === 0) return [];
    // Ensure sufficient items for smooth looping regardless of screen size
    const base = displayItems.length < 5 ? [...displayItems, ...displayItems] : displayItems;
    return [...base, ...base];
  }, [displayItems]);

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

  if (!displayItems || displayItems.length === 0) return null;

  return (
    <section className="relative py-8 sm:py-20 overflow-hidden bg-white select-none">
      {/* ── Decorative floating SVG clouds in background ── */}
      <CloudIcon className="absolute -top-3 left-4 w-28 sm:w-36 opacity-80 pointer-events-none select-none" />
      <CloudIcon className="absolute top-6 right-6 w-24 sm:w-32 opacity-70 scale-x-[-1] pointer-events-none select-none" />
      <CloudIcon className="absolute bottom-6 left-[8%] w-20 opacity-50 pointer-events-none select-none" />
      <CloudIcon className="absolute bottom-4 right-[10%] w-24 opacity-45 scale-x-[-1] pointer-events-none select-none" />
      <CloudIcon className="absolute top-1/2 left-[2%] w-16 opacity-35 pointer-events-none select-none" />
      <CloudIcon className="absolute top-1/3 right-[3%] w-20 opacity-35 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
            Shop the little world
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Thoughtfully picked pieces for every little moment.
          </p>
        </div>
      </div>

      {/* ── Horizontal Moving Category Carousel (Desktop & Mobile) ── */}
      {/* Container: overflow-hidden prevents any whole-page horizontal scroll */}
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
