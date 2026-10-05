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

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FAF7F2]">
      {/* Full-bleed banner edge-to-edge with mobile subtle fade-in */}
      <div
        className={`relative w-full min-h-[300px] sm:min-h-[380px] md:min-h-0 md:aspect-[2157/729] transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-40 translate-y-2 md:opacity-100 md:translate-y-0'
        }`}
      >
        <Image
          src={
            (section?.image_url && !section.image_url.includes('unsplash.com'))
              ? section.image_url
              : '/images/Dreamy-bg(1)copy.png'
          }
          alt="Baby Showers & Newborns - A little love, packed with care"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center select-none"
        />

        {/* Text Overlay: Placed on the left over the cloud area */}
        <div
          className="absolute z-10 flex flex-col items-start justify-center left-[6%] sm:left-[8%] lg:left-[15%] top-1/2 -translate-y-1/2 max-w-[70%] sm:max-w-[45%] md:max-w-[40%] lg:max-w-[36%]"
        >
          {/* Section Label */}
          <span className="text-[9px] sm:text-[11px] md:text-xs lg:text-sm font-semibold tracking-[0.24em] text-slate-700 uppercase mb-0.5 sm:mb-1">
            {sectionLabel}
          </span>

          {/* Heading */}
          <h2 className="font-heading font-medium text-slate-900 text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-tight">
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
          <p className="text-slate-600 text-[9px] sm:text-xs md:text-sm lg:text-base mt-1 sm:mt-2 md:mt-3 leading-relaxed">
            {description}
          </p>

          {/* CTA Button */}
          <div className="mt-2 sm:mt-4 md:mt-5 lg:mt-6">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-2 sm:gap-3 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-800 font-medium text-[10px] sm:text-xs md:text-sm lg:text-base px-3 sm:px-5 md:px-6 py-1.5 sm:py-2.5 md:py-3 rounded-full shadow-xs hover:shadow transition-all"
            >
              <span>{ctaText}</span>
              <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-slate-800 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}