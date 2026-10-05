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
}

export function MobileCategoryRow({ items }: MobileCategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    const speed = 0.55; // Pixels per frame for smooth, subtle auto-scroll

    const step = () => {
      if (!isInteractingRef.current && el) {
        el.scrollLeft += speed;

        // Reset scroll seamlessly when reaching the midpoint of duplicated track
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft -= maxScroll;
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
  }, [items]);

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

  // Duplicate items visually ONLY for the seamless infinite loop
  const visualTrack = [...items, ...items];

  return (
    <div
      ref={scrollRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex md:hidden overflow-x-auto no-scrollbar gap-4 sm:gap-5 py-2 px-4 touch-pan-x select-none"
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
            style={{ width: 140, height: 146 }}
          >
            <Image
              src="/images/cloud-shape.png"
              alt=""
              fill
              sizes="140px"
              className="object-contain drop-shadow-xs group-hover:scale-105 transition-all duration-300 pointer-events-none select-none"
              aria-hidden
            />
            {/* Product image centered inside cloud — object-contain so NO cropping */}
            <div className="relative z-10 w-20 h-20 flex items-center justify-center p-1.5">
              <Image
                src={item.image || '/images/babycry-logo.png'}
                alt={item.label}
                fill
                sizes="80px"
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
