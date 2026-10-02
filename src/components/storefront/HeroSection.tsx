import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSlide } from '@/types/database';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  slide: HeroSlide;
}

export function HeroSection({ slide }: HeroSectionProps) {
  const bgImage =
    slide.desktop_image ||
    '/uploads/ChatGPT Image Oct 2, 2026, 05_55_15 PM-1790943937695-631678435.webp';

  const eyebrow = slide.eyebrow || 'LITTLE THINGS FOR';
  const title = slide.title || 'Brighter Little Days';
  const description =
    slide.description ||
    'Cute outfits, thoughtful essentials and little joys for your little one.';
  const primaryCtaText = slide.primary_cta_text || 'Shop the Collection';
  const primaryCtaUrl = slide.primary_cta_url || '/categories/apparels';
  const secondaryCtaText = slide.secondary_cta_text || 'Explore New Arrivals';
  const secondaryCtaUrl = slide.secondary_cta_url || '/categories';

  // Format title into two lines matching the reference design
  const formatTitle = (rawTitle: string) => {
    if (rawTitle.toLowerCase().includes('brighter') && rawTitle.toLowerCase().includes('little days')) {
      return (
        <>
          Brighter
          <br />
          Little Days
        </>
      );
    }
    const words = rawTitle.split(' ');
    if (words.length >= 2) {
      const first = words[0];
      const rest = words.slice(1).join(' ');
      return (
        <>
          {first}
          <br />
          {rest}
        </>
      );
    }
    return rawTitle;
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* 16:9 full banner image container (No black fade, no bottom wave) */}
      <div className="relative w-full h-[460px] sm:h-[520px] md:h-[560px] lg:h-[620px] xl:h-[680px] flex items-center overflow-hidden">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-center select-none"
        />

        {/* Content layer: Left side typography matching the reference graphic */}
        <div
          className="absolute z-10 flex flex-col items-start justify-center left-6 sm:left-[8%] md:left-[9%] lg:left-[18%] top-[45%] sm:top-[48%] -translate-y-1/2 max-w-[310px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[500px]"
        >
          {/* Eyebrow: LITTLE THINGS FOR with wide tracking */}
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.28em] text-slate-700 uppercase mb-1 sm:mb-2 select-none">
            {eyebrow}
          </span>

          {/* Main Heading: Rounded Fredoka typography in two lines */}
          <h1 className="font-heading font-medium text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] tracking-tight">
            {formatTitle(title)}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg mt-2.5 sm:mt-3.5 md:mt-4 leading-relaxed max-w-sm sm:max-w-md">
            {description}
          </p>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-5 sm:mt-6 md:mt-7 lg:mt-8">
            {/* Primary Pill Button with dark arrow circle */}
            <Link
              href={primaryCtaUrl}
              className="group inline-flex items-center gap-2.5 sm:gap-3 bg-[#A7D6BA] hover:bg-[#93c7a7] active:scale-95 text-[#183B2B] font-semibold text-xs sm:text-sm md:text-base px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-full shadow-xs hover:shadow transition-all"
            >
              <span>{primaryCtaText}</span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#183B2B] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </span>
            </Link>

            {/* Subtle Divider */}
            <span className="hidden sm:inline-block w-[1px] h-5 sm:h-6 bg-slate-300" />

            {/* Secondary text link */}
            <Link
              href={secondaryCtaUrl}
              className="text-slate-700 hover:text-emerald-900 font-medium text-xs sm:text-sm md:text-base transition-colors"
            >
              {secondaryCtaText}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
