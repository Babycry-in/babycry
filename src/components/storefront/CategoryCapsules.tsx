'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPosRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  // Duplicate items 3 times for a continuous, seamless infinite loop in both directions
  const baseTrack = React.useMemo(() => {
    if (!displayItems || displayItems.length === 0) return [];
    return displayItems.length < 5 ? [...displayItems, ...displayItems] : displayItems;
  }, [displayItems]);

  const loopTrack = React.useMemo(() => {
    if (baseTrack.length === 0) return [];
    return [...baseTrack, ...baseTrack, ...baseTrack];
  }, [baseTrack]);

  const halfCount = baseTrack.length;

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    lastTimeRef.current = performance.now();
  };

  // Pause carousel during vertical page scroll for completely smooth native touch scrolling
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout | null = null;
    const onWindowScroll = () => {
      isInteractingRef.current = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isInteractingRef.current = false;
        lastTimeRef.current = performance.now();
      }, 200);
    };
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || loopTrack.length === 0) return;

    // Check if desktop screen (>= 1024px) or user prefers reduced motion
    const isDesktop = () => window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isDesktop() || prefersReducedMotion) {
      // Desktop: completely stationary, no autoplay!
      return;
    }

    // Measure exact repetition distance between first item and clone
    const getLoopWidth = (): number => {
      if (!el) return 0;
      const children = el.children;
      if (children.length >= halfCount * 2) {
        const first = children[0] as HTMLElement;
        const clone = children[halfCount] as HTMLElement;
        if (first && clone) {
          const dist = clone.offsetLeft - first.offsetLeft;
          if (dist > 0) return dist;
        }
      }
      return el.scrollWidth / 3;
    };

    // Initial position in the middle set for seamless backward/forward swiping
    const initialLoopWidth = getLoopWidth();
    if (initialLoopWidth > 0 && el.scrollLeft === 0) {
      el.scrollLeft = initialLoopWidth;
      scrollPosRef.current = initialLoopWidth;
    } else {
      scrollPosRef.current = el.scrollLeft;
    }

    const SPEED = 28; // Gentle 28px/s crawl on mobile
    lastTimeRef.current = performance.now();
    let isMounted = true;

    const step = (now: number) => {
      if (!isMounted) return;

      // Stop moving when hovered or user is touching / interacting
      if (!isInteractingRef.current && !isHoveredRef.current && el) {
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
        scrollPosRef.current += SPEED * dt;

        const loopWidth = getLoopWidth();
        if (loopWidth > 0) {
          if (scrollPosRef.current >= loopWidth * 2) {
            scrollPosRef.current -= loopWidth;
          } else if (scrollPosRef.current <= 0) {
            scrollPosRef.current += loopWidth;
          }
        }

        el.scrollLeft = scrollPosRef.current;
      }

      lastTimeRef.current = now;
      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);

    const handleResize = () => {
      if (isDesktop()) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      } else if (rafIdRef.current === null) {
        lastTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(step);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [loopTrack, halfCount]);

  const handleTouchStart = (e: React.TouchEvent) => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - touchStartPos.current.x;
    const dy = e.touches[0].clientY - touchStartPos.current.y;
    // Only flag swiping if horizontal motion dominates
    if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartPos.current = null;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    // Resume auto-movement cleanly 800ms after interaction ends if not hovered
    resumeTimeoutRef.current = setTimeout(() => {
      const el = scrollRef.current;
      if (el) {
        scrollPosRef.current = el.scrollLeft;
      }
      lastTimeRef.current = performance.now();
      isInteractingRef.current = false;
    }, 800);
  };

  // Sync scroll position when user manually scrolls / swipes
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (isInteractingRef.current) {
      scrollPosRef.current = el.scrollLeft;
      const children = el.children;
      if (children.length >= halfCount * 2) {
        const first = children[0] as HTMLElement;
        const clone = children[halfCount] as HTMLElement;
        const loopWidth = first && clone ? clone.offsetLeft - first.offsetLeft : el.scrollWidth / 3;
        if (loopWidth > 0) {
          if (scrollPosRef.current < 5) {
            scrollPosRef.current += loopWidth;
            el.scrollLeft = scrollPosRef.current;
          } else if (scrollPosRef.current >= loopWidth * 2) {
            scrollPosRef.current -= loopWidth;
            el.scrollLeft = scrollPosRef.current;
          }
        }
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSwiping.current) {
      e.preventDefault();
      isSwiping.current = false;
    }
  };

  // Desktop items: exactly 5 unique categories, no duplicates, stationary, no scroll
  const desktopItems = React.useMemo(() => {
    return (displayItems || []).slice(0, 5);
  }, [displayItems]);

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

      {/* ── Desktop: Exactly 5 unique categories, stationary, centered, no scroll, no duplicates ── */}
      <div className="hidden lg:flex items-start justify-center gap-8 xl:gap-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {desktopItems.map((item) => (
          <Link
            key={item.id || item.slug}
            href={`/categories/${item.slug}`}
            className="group shrink-0 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform w-[168px]"
          >
            {/* Cloud platform */}
            <div className="relative flex items-center justify-center w-[168px] h-[174px]">
              <Image
                src="/images/cloud-shape.png"
                alt=""
                fill
                sizes="168px"
                className="object-contain drop-shadow-2xs group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                aria-hidden
              />
              <div className="relative z-10 w-28 h-28 flex items-center justify-center p-2">
                <Image
                  src={item.image || '/images/babycry-logo.png'}
                  alt={item.label}
                  fill
                  sizes="112px"
                  className="object-contain object-center group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none"
                />
              </div>
            </div>

            {/* Category Label */}
            <span className="font-heading font-semibold text-slate-700 text-sm lg:text-base mt-2 group-hover:text-emerald-700 transition-colors whitespace-nowrap block w-full text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Mobile: Moving carousel with manual touch swipe & vertical page scroll (strictly preserved) ── */}
      <div
        className="lg:hidden relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left & Right subtle edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Scrollable Track container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex overflow-x-auto no-scrollbar py-2 px-4 gap-5 sm:gap-8 w-full"
          style={{
            touchAction: 'pan-y pinch-zoom',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loopTrack.map((item, index) => (
            <Link
              key={`${item.id || item.slug}-${index}`}
              href={`/categories/${item.slug}`}
              onClick={handleCardClick}
              className="group shrink-0 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform w-[116px] sm:w-[154px]"
            >
              {/* Cloud platform */}
              <div
                className="relative flex items-center justify-center w-[116px] h-[120px] sm:w-[154px] sm:h-[160px]"
              >
                {/* Cloud shape platform */}
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 116px, 154px"
                  className="object-contain drop-shadow-2xs group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                  aria-hidden
                />
                {/* Category image inside cloud — object-contain so NO cropping */}
                <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center p-1.5 sm:p-2">
                  <Image
                    src={item.image || '/images/babycry-logo.png'}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 64px, 96px"
                    className="object-contain object-center group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none"
                  />
                </div>
              </div>

              {/* Category Label: centered horizontally beneath image */}
              <span className="font-heading font-semibold text-slate-700 text-xs sm:text-sm mt-2 group-hover:text-emerald-700 transition-colors whitespace-nowrap block w-full text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
