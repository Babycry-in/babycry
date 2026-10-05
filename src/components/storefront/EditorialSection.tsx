import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface EditorialSectionProps {
  section?: HomepageSection;
}

export function EditorialSection({ section }: EditorialSectionProps) {
  const label = section?.subtitle || 'APPARELS EDIT';
  const titleLine1 = 'The sweetest';
  const titleLine2 = 'little details.';
  const subtitle =
    section?.description ||
    'Adorable styles made for tiny personalities and big little moments.';
  const ctaText = section?.cta_text || 'Shop Apparels';
  const ctaUrl = section?.cta_url || '/categories/apparels';

  // This section uses a fixed built-in editorial banner — not admin-uploadable
  // Admin can only edit text, subtitle and CTA via the homepage builder
  const imageUrl = '/images/apparels-banner1.png';

  if (section?.is_active === false) return null;

  return (
    <section className="relative w-full overflow-hidden  ">
      {/* Full-bleed banner edge-to-edge (no card, no box, no border) */}
      <div 
        className="relative w-full min-h-[300px] sm:min-h-[360px] md:min-h-0 md:aspect-[1024/384]"
      >
        <Image
          src={imageUrl}
          alt="Apparels Edit - The sweetest little details"
          fill
          sizes="100vw"
          priority
          className="object-cover object-[25%_center] sm:object-center select-none"
        />

        {/* Content: Positioned on the right side with clean natural design */}
        <div
          className="absolute z-10 flex flex-col items-start justify-center right-3 sm:right-[7%] md:right-[8%] lg:left-[54%] left-auto lg:right-auto top-1/2 -translate-y-1/2 max-w-[58%] xs:max-w-[54%] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px]"
        >
          {/* APPARELS EDIT label */}
          <span className="text-[9px] sm:text-[11px] md:text-xs lg:text-sm font-bold tracking-[0.24em] text-slate-800 uppercase mb-0.5 sm:mb-1">
            {label}
          </span>

          {/* Heading */}
          <h2 className="font-heading font-bold text-slate-900 text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-tight">
            {titleLine1}
            <br />
            {titleLine2}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-700 font-medium text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base mt-1 sm:mt-2 leading-relaxed line-clamp-3 lg:line-clamp-none">
            {subtitle}
          </p>

          {/* Shop Apparels Button */}
          <div className="mt-2 sm:mt-4 md:mt-5 lg:mt-6">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-1.5 sm:gap-3 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-900 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base px-3 sm:px-5 md:px-6 py-1.5 sm:py-2.5 md:py-3 rounded-full shadow-xs hover:shadow transition-all"
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
