import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface EditorialSectionProps {
  section?: HomepageSection;
}

export function EditorialSection({ section }: EditorialSectionProps) {
  const label = section?.subtitle || 'GIRLS EDIT';
  const title = section?.title || 'The sweetest little details.';
  const subtitle =
    section?.description ||
    'Adorable styles made for tiny personalities and big little moments.';
  const ctaText = section?.cta_text || 'Shop Girlswear';
  const ctaUrl = section?.cta_url || '/categories/apparels';

  const desktopImage =
    section?.image_url && !section.image_url.includes('unsplash.com')
      ? section.image_url
      : '/images/apparels-banner1.png';

  const mobileImage =
    section?.mobile_image_url && !section.mobile_image_url.includes('unsplash.com')
      ? section.mobile_image_url
      : '/images/Girl-mg-bg.png';

  if (section?.is_active === false) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/*
        Mobile (< sm): full-bleed square image, text + button at the TOP-RIGHT (clear of the girl).
        sm and up: unchanged (background image with right-side overlay).
      */}
      <div className="relative flex flex-col sm:block w-full aspect-square sm:aspect-auto sm:min-h-[360px] md:min-h-0 md:aspect-[1024/384]">

        {/* Content: top-right on mobile, vertically centered on the right from sm up */}
        <div
          className="
            absolute z-10 right-3 top-6 translate-y-0 w-[42%]
            flex flex-col items-start text-left p-0
            sm:w-auto sm:items-start sm:text-left sm:p-0
            sm:top-1/2 sm:-translate-y-1/2
            sm:right-[7%] md:right-[8%] lg:left-[54%] sm:left-auto lg:right-auto
            sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px]
          "
        >
          {/* Label (subtitle from admin) */}
          <span className="max-w-full truncate sm:overflow-visible sm:whitespace-normal text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-bold tracking-[0.2em] sm:tracking-[0.24em] text-slate-800 uppercase mb-1.5 sm:mb-1">
            {label}
          </span>

          {/* Heading — dynamic from admin */}
          <h2 className="font-heading font-bold text-slate-900 text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-tight">
            {title}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-slate-700 font-medium text-xs sm:text-xs md:text-sm lg:text-base mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-2 sm:gap-3 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-900 font-semibold text-xs sm:text-xs md:text-sm lg:text-base px-3.5 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full shadow-xs hover:shadow transition-all"
            >
              <span>{ctaText}</span>
              <span className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-slate-800 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Image: mobile uses Girl-mg-bg.png, desktop uses original desktop banner */}
        <div className="absolute inset-0 w-full h-full">
          {/* Mobile Background Image (< sm) — object-cover fills edge to edge (no side gaps) */}
          <div className="relative w-full h-full sm:hidden overflow-hidden">
            <Image
              src={mobileImage}
              alt="Girls Edit - The sweetest little details"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center scale-[1.04] select-none"
            />
          </div>

          {/* Desktop Background Image (sm+) — unchanged */}
          <div className="hidden sm:block relative w-full h-full">
            <Image
              src={desktopImage}
              alt="Girls Edit - The sweetest little details"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center select-none"
            />
          </div>

          {/* Light wash on the right so the text stays readable (mobile only) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-white/80 via-white/40 to-transparent sm:hidden" />
        </div>
      </div>
    </section>
  );
}