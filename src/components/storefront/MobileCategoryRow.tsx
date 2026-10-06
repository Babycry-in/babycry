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

  // If mode is explicitly 'static' or items <= 3 (and mode is not forced marquee)
  const isStatic = mode === 'static' || (mode !== 'marquee' && items.length <= 3);

  useEffect(() => {
    if (isStatic) return;

    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    const speed = 0.6; // Pixels per frame for smooth, subtle auto-scroll

    const step = () => {
      if (!isInteractingRef.current && el) {
        el.scrollLeft += speed;

        // Reset scroll seamlessly when reaching the midpoint of duplicated track
        const maxScroll = el.scrollWidth / 2;
        if (maxScroll > 0) {
          if (el.scrollLeft >= maxScroll) {
            el.scrollLeft -= maxScroll;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += maxScroll;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [items, isStatic]);

  // Pause on hover
  const handleMouseEnter = () => {
    isInteractingRef.current = true;
  };

  const handleMouseLeave = () => {
    isInteractingRef.current = false;
  };

  // Pause on touch so user can swipe naturally without fighting auto-scroll
  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    // Resume auto-scrolling 1.5s after touch ends to respect swipe momentum
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  if (!items || items.length === 0) return null;

  // 1. STATIC 3-COLUMN ROW (for "Shop the little world")
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
  // Duplicate items visually for infinite continuous loop
  const baseTrack = items.length < 5 ? [...items, ...items] : items;
  const visualTrack = [...baseTrack, ...baseTrack];

  return (
    <div
      ref={scrollRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handleTouchStart}
      onPointerUp={handleTouchEnd}
      className="flex md:hidden overflow-x-auto no-scrollbar gap-4 sm:gap-5 py-2 px-4 touch-pan-x select-none cursor-grab active:cursor-grabbing"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {visualTrack.map((item, index) => (
        <Link
          key={`${item.id || item.slug}-${index}`}
          href={`/categories/${item.slug}`}
          className="group shrink-0 flex flex-col items-center text-center transition-transform active:scale-95"
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
