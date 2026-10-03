import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface UnboxingSectionProps {
  section?: HomepageSection;
}

export function UnboxingSection({ section }: UnboxingSectionProps) {
  const title = section?.title || 'Unbox the cuteness.';
  const description =
    section?.description ||
    'A little love packed into every order. Eco-friendly kraft boxes with custom baby tissue and heartfelt notes.';
  const ctaText = section?.cta_text || 'Our Packaging ♥';
  const ctaUrl = section?.cta_url || '/about';
  const imageUrl = section?.image_url || '/images/packaging-banner.png';

  return (
    <section className="py-8 sm:py-12 lg:py-14 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-width Banner with Rounded Corners */}
        <div className="relative w-full min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] rounded-[28px] sm:rounded-[36px] overflow-hidden flex items-center shadow-xs">
          
          {/* Admin-Managed Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="object-cover object-center select-none"
            />
          </div>

          {/* Subtle readability gradient (transparent towards right, gentle soft wash on left) */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF7F2]/80 via-[#FAF7F2]/30 to-transparent sm:w-2/3"
            aria-hidden="true" 
          />

          {/* Content Overlay on Left Side */}
          <div className="relative z-10 w-full sm:max-w-md lg:max-w-lg px-6 sm:px-10 lg:px-14 py-8 sm:py-10 flex flex-col justify-center">
            <h2 className="font-heading text-xl sm:text-3xl lg:text-[38px] font-bold text-slate-900 leading-[1.14] tracking-tight">
              {title}
            </h2>

            <p className="mt-2 sm:mt-3 text-slate-700 text-[10px] sm:text-sm lg:text-[15px] leading-relaxed max-w-[460px] font-medium">
              {description}
            </p>

            <div className="mt-4 sm:mt-5 lg:mt-6">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-2 sm:gap-2.5 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-800 font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow transition-all"
              >
                <span>{ctaText}</span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
