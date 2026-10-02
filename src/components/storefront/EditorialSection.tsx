import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface EditorialSectionProps {
  section?: HomepageSection;
}

export function EditorialSection({ section }: EditorialSectionProps) {
  const label = 'APPARELS EDIT';
  const titleLine1 = 'The sweetest';
  const titleLine2 = 'little details.';
  const subtitle =
    section?.description ||
    'Adorable styles made for tiny personalities and big little moments.';
  const ctaText = 'Shop Apparels';
  const ctaUrl = section?.cta_url || '/categories/apparels';

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
      {/* Full-bleed banner edge-to-edge (no card, no box, no border) */}
      <div 
        className="relative w-full min-h-[280px] sm:min-h-[360px] md:min-h-0 md:aspect-[1024/384]"
      >
        <Image
          src="/images/apparels-banner11.png"
          alt="Apparels Edit - The sweetest little details"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center select-none"
        />

        {/* Center Content: Placed directly over the banner */}
        <div
          className="absolute z-10 flex flex-col items-start justify-center"
          style={{
            left: '52.5%',
            top: '52%',
            transform: 'translateY(-50%)',
            maxWidth: '30%',
          }}
        >
          {/* APPARELS EDIT label */}
          <span className="text-[9px] sm:text-[11px] md:text-xs lg:text-sm font-semibold tracking-[0.26em] text-slate-700 uppercase mb-0.5 sm:mb-1">
            {label}
          </span>

          {/* Heading */}
          <h2 className="font-heading font-medium text-slate-900 text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.12] tracking-tight">
            {titleLine1}
            <br />
            {titleLine2}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-[9px] sm:text-xs md:text-sm lg:text-base mt-1 sm:mt-2 leading-relaxed max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[420px]">
            {subtitle}
          </p>

          {/* Shop Apparels Button */}
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

        {/* Polaroid caption under photo on right */}
        <div
          className="absolute z-10 pointer-events-none text-center"
          style={{
            left: '83.5%',
            top: '71%',
          }}
        >
          <p className="font-heading text-slate-700 text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium leading-tight -rotate-3 select-none">
            Made for
            <br />
            little
            <br />
            moments ♡
          </p>
        </div>
      </div>
    </section>
  );
}
