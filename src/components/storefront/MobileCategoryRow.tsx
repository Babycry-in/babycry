'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface MobileCategoryItem {
  id: string;
  slug: string;
  label: string;
  image: string;
}

interface MobileCategoryRowProps {
  items: MobileCategoryItem[];
  mode?: 'static' | 'marquee';
}

export function MobileCategoryRow({ items, mode }: MobileCategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPosRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // If mode is explicitly 'static' or items <= 3 (and mode is not forced marquee)
  const isStatic = mode === 'static' || (mode !== 'marquee' && items.length <= 3);

  // Stable dependency key so effect doesn't re-run on parent re-renders with identical items
  const itemsKey = items?.map((i) => i.id || i.slug).join(',') ?? '';

  // Duplicate items visually for infinite continuous loop
  const baseTrack = items.length < 5 ? [...items, ...items] : items;
  const visualTrack = [...baseTrack, ...baseTrack];
  const halfCount = baseTrack.length;

  useEffect(() => {
    if (isStatic) return;

    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Speed in pixels per second: ~28px/s provides a gentle, slow, smooth, consistent crawl
    // across both 60Hz and 120Hz (ProMotion iOS) screens
    const SPEED_PIXELS_PER_SEC = 28;
    lastTimeRef.current = performance.now();
    scrollPosRef.current = el.scrollLeft;

    let isMounted = true;

    // Measure exact repetition distance between first item and its duplicate clone
    const getLoopWidth = (): number => {
      if (!el) return 0;
      const children = el.children;
      if (children.length > halfCount) {
        const first = children[0] as HTMLElement;
        const clone = children[halfCount] as HTMLElement;
        if (first && clone) {
          const dist = clone.offsetLeft - first.offsetLeft;
          if (dist > 0) return dist;
        }
      }
      return el.scrollWidth / 2;
    };

    const step = (currentTime: number) => {
      if (!isMounted) return;

      if (!isInteractingRef.current && el) {
        // Delta time in seconds, clamped to max 50ms (0.05s) to avoid jumps after tab switch / sleep
        const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05);
        scrollPosRef.current += SPEED_PIXELS_PER_SEC * dt;

        const loopWidth = getLoopWidth();
        if (loopWidth > 0) {
          // Seamless infinite reset: subtract loopWidth when reaching the second set
          if (scrollPosRef.current >= loopWidth) {
            scrollPosRef.current -= loopWidth;
          }
        }

        // Apply position to DOM scroll
        el.scrollLeft = scrollPosRef.current;
      }

      lastTimeRef.current = currentTime;
      rafIdRef.current = requestAnimationFrame(step);
    };

    // Pause autoplay when browser tab is inactive, resume cleanly without sudden jumps
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isInteractingRef.current = true;
      } else {
        lastTimeRef.current = performance.now();
        if (el) {
          scrollPosRef.current = el.scrollLeft;
        }
        isInteractingRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafIdRef.current = requestAnimationFrame(step);

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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [itemsKey, isStatic, halfCount, items.length]);

  // Pause autoplay immediately on user touch / hover / pointer interaction
  const handleInteractionStart = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // Resume autoplay cleanly 1.2s after user interaction ends
  const handleInteractionEnd = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      const el = scrollRef.current;
      if (el) {
        scrollPosRef.current = el.scrollLeft;
      }
      lastTimeRef.current = performance.now();
      isInteractingRef.current = false;
    }, 1200);
  };

  // Sync scroll position during manual swipe / momentum scrolling
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (isInteractingRef.current) {
      scrollPosRef.current = el.scrollLeft;
      // Wrap if swiped backwards past start
      if (el.children.length > halfCount) {
        const first = el.children[0] as HTMLElement;
        const clone = el.children[halfCount] as HTMLElement;
        const loopWidth = first && clone ? clone.offsetLeft - first.offsetLeft : el.scrollWidth / 2;
        if (loopWidth > 0) {
          if (scrollPosRef.current < 0) {
            scrollPosRef.current += loopWidth;
            el.scrollLeft = scrollPosRef.current;
          } else if (scrollPosRef.current >= loopWidth * 1.8) {
            scrollPosRef.current -= loopWidth;
            el.scrollLeft = scrollPosRef.current;
          }
        }
      }
      // Reset resume timer while user is still scrolling or momentum is rolling
      handleInteractionEnd();
    }
  };

  if (!items || items.length === 0) return null;

  // 1. STATIC 3-COLUMN ROW (for "Shop the little world" when static mode requested)
  // All 3 items are completely visible within ONE mobile screen/row without scrolling or cropping
  if (isStatic) {
    const display3 = items.slice(0, 3);
    return (
      <div className="flex md:hidden justify-center items-start w-full px-1 py-2 max-w-[390px] mx-auto">
        <div className="grid grid-cols-3 gap-2 xs:gap-3 w-full">
          {display3.map((item) => (
            <Link
              key={item.id || item.slug}
              href={`/categories/${item.slug}`}
              className="group flex flex-col items-center text-center w-full"
            >
              {/* Cloud platform — perfectly sized for 3-col mobile */}
              <div className="relative flex items-center justify-center w-[88px] h-[92px] xs:w-[100px] xs:h-[104px]">
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="100px"
                  className="object-contain drop-shadow-xs group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                  aria-hidden
                />
                {/* Product image inside cloud — object-contain ensures NO CROPPING */}
                <div className="relative z-10 w-12 h-12 xs:w-14 xs:h-14 flex items-center justify-center p-1">
                  <Image
                    src={item.image || '/images/babycry-logo.png'}
                    alt={item.label}
                    fill
                    sizes="56px"
                    className="object-contain object-center transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="font-heading font-semibold text-slate-700 text-[10px] xs:text-[11px] mt-1.5 group-hover:text-emerald-700 transition-colors leading-tight text-center px-0.5 line-clamp-1">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // 2. MARQUEE AUTO-SCROLL
  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      onPointerDown={handleInteractionStart}
      onPointerUp={handleInteractionEnd}
      onPointerCancel={handleInteractionEnd}
      className="flex md:hidden overflow-x-auto no-scrollbar gap-4 sm:gap-5 py-2 px-4 touch-pan-x select-none cursor-grab active:cursor-grabbing w-full"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        overscrollBehaviorX: 'contain',
      }}
    >
      {visualTrack.map((item, index) => (
        <Link
          key={`${item.id || item.slug}-${index}`}
          href={`/categories/${item.slug}`}
          className="group shrink-0 flex flex-col items-center text-center transition-transform"
        >
          {/* Cloud platform */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 120, height: 124 }}
          >
            <Image
              src="/images/cloud-shape.png"
              alt=""
              fill
              sizes="120px"
              className="object-contain drop-shadow-xs group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
              aria-hidden
            />
            {/* Product image centered inside cloud — object-contain so NO cropping */}
            <div className="relative z-10 w-16 h-16 flex items-center justify-center p-1.5">
              <Image
                src={item.image || '/images/babycry-logo.png'}
                alt={item.label}
                fill
                sizes="64px"
                className="object-contain object-center transition-transform duration-300"
              />
            </div>
          </div>

          <span className="font-heading font-semibold text-slate-700 text-xs mt-2 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
