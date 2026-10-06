'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface GiftBoxSectionProps {
  section?: HomepageSection;
}

export function GiftBoxSection({ section }: GiftBoxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If reduced motion is preferred, display immediately without animation
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const node = sectionRef.current;
    if (!node) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const sectionLabel = section?.subtitle || 'BABY SHOWERS & NEWBORNS';
  const rawTitle = section?.title || 'A little love, packed with care.';
  const description =
    section?.description ||
    'Beautifully curated newborn essentials for baby showers, newborn welcomes and special occasions.';
  const ctaText = section?.cta_text || 'Explore Gift Boxes';
  const ctaUrl = section?.cta_url || '/categories/gift-and-hampers';

  const desktopImage =
    section?.image_url && !section.image_url.includes('unsplash.com')
      ? section.image_url
      : '/images/Dreamy-bg(1)copy.png';

  const mobileImage =
    section?.mobile_image_url && !section.mobile_image_url.includes('unsplash.com')
      ? section.mobile_image_url
      : '/images/Gift-bg-mb.png';

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FAF7F2]">
      {/*
        Mobile (< md): text at the TOP, placed over the background image (gift box anchored at the bottom).
        Desktop (md+): original full-bleed banner with text overlay (unchanged).
      */}
      <div
        className={`relative flex flex-col md:block w-full min-h-[400px] sm:min-h-[440px] md:min-h-0 md:aspect-[2157/729] transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-40 translate-y-2 md:opacity-100 md:translate-y-0'
        }`}
      >
        {/* TEXT BLOCK */}
        <div
          className="relative z-10 order-first md:order-none flex flex-col items-start justify-center w-full px-5 sm:px-8 pt-7 sm:pt-9 pb-4 md:p-0 md:w-auto md:absolute md:left-[8%] lg:left-[15%] md:top-1/2 md:-translate-y-1/2 md:max-w-[40%] lg:max-w-[36%]"
        >
          {/* Section Label */}
          <span className="max-w-full truncate md:overflow-visible md:whitespace-normal text-[11px] sm:text-xs md:text-xs lg:text-sm font-semibold tracking-[0.2em] md:tracking-[0.24em] text-slate-700 uppercase mb-1.5 md:mb-1">
            {sectionLabel}
          </span>

          {/* Heading */}
          <h2 className="font-heading font-medium text-slate-900 line-clamp-2 md:line-clamp-none text-[28px] sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-tight">
            {rawTitle === 'A little love, packed with care.' ? (
              <>
                A little love,
                <br />
                packed with care.
              </>
            ) : (
              rawTitle
            )}
          </h2>

          {/* Description */}
          <p className="text-slate-600 line-clamp-2 sm:line-clamp-3 md:line-clamp-none text-sm sm:text-base md:text-sm lg:text-base mt-2 sm:mt-3 leading-relaxed max-w-[34ch] sm:max-w-md md:max-w-none">
            {description}
          </p>

          {/* CTA Button */}
          <div className="mt-4 sm:mt-5 md:mt-5 lg:mt-6">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-3 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-800 font-medium text-sm md:text-sm lg:text-base px-5 md:px-6 py-2.5 md:py-3 rounded-full shadow-xs hover:shadow transition-all"
            >
              <span>{ctaText}</span>
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* IMAGE — mobile uses Gift-bg-mb.png, desktop keeps original background image */}
        <div className="absolute inset-0">
          {/* Mobile Background Image (< md) */}
          <div className="relative w-full h-full md:hidden">
            <Image
              src={mobileImage}
              alt="Baby Showers & Newborns - A little love, packed with care"
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_bottom] select-none"
            />
          </div>

          {/* Desktop Background Image (md+) — unchanged */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src={desktopImage}
              alt="Baby Showers & Newborns - A little love, packed with care"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center select-none"
            />
          </div>

          {/* Soft cream wash behind the text so it stays readable on top of the image (mobile only) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/75 to-transparent md:hidden" />
        </div>
      </div>
    </section>
  );
}