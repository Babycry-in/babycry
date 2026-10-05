import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface PolaroidGalleryProps {
  section?: HomepageSection;
}

export function PolaroidGallery({ section }: PolaroidGalleryProps) {
  if (section && section.is_active === false) {
    return null;
  }

  const title = section?.title || 'Little looks worth saving.';
  const description = section?.description || 'Cute, dreamy and effortlessly stylish.';
  const ctaText = section?.cta_text || 'Explore Looks';
  const ctaUrl = section?.cta_url || '/categories/apparels';

  const desktopPositionClasses = [
    'left-[0%] top-[4%] w-[28%] z-10 -rotate-2',
    'left-[24%] top-[8%] w-[28%] z-20 rotate-2',
    'left-[48%] top-[14%] w-[28%] z-30 -rotate-1',
    'left-[72%] top-[6%] w-[28%] z-20 rotate-3',
  ];

  const adminLooks = section?.metadata?.looks;
  const looks = (Array.isArray(adminLooks) ? adminLooks : [])
    .filter((l: any) => typeof l?.image === 'string' && l.image.trim().length > 0 && !l.image.includes('unsplash.com'))
    .map((item: any, idx: number) => ({
      id: item.id || idx + 1,
      image: item.image,
      alt: item.alt || 'Little look',
      aspectRatio: item.aspectRatio || (idx === 0 ? '800 / 1067' : '800 / 533'),
      caption: item.caption || '',
      desktopClasses: desktopPositionClasses[idx % desktopPositionClasses.length],
    }));

  // Only show section if admin has uploaded at least one look photograph
  if (looks.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-16 overflow-hidden">
      {/* Background Image: Dreamy-bg (2).png */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        <Image
          src="/images/Dreamy-bg (2).png"
          alt="Dreamy background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Heading, description, and Explore Looks button (32–35% width) */}
          <div className="lg:col-span-4 flex flex-col items-start text-left space-y-4 sm:space-y-5">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-semibold text-slate-900 leading-[1.12] tracking-tight">
              {title}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-3 bg-[#A3D2B8] hover:bg-[#8ec2a6] active:scale-95 text-slate-800 font-medium text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs hover:shadow"
              >
                <span>{ctaText}</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Four layered editorial photographs (65–68% width) */}
          <div className="lg:col-span-8 w-full">
            
            {/* Desktop Layout (lg+): Layered editorial arrangement with subtle 8-12% overlap */}
           <div className="hidden lg:block relative w-full h-[280px] xl:h-[320px] pt-12">
              {looks.map((item) => (
                <div
                  key={item.id}
                  className={`absolute ${item.desktopClasses} transition-transform duration-300 hover:scale-105 hover:z-40`}
                >
                  {/* Physical printed photograph frame */}
                  <div className="bg-white rounded-[4px] p-3 sm:p-3.5 pb-5 sm:pb-6 border border-black/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col items-center">
                    {/* Natural aspect-ratio container with object-fit: contain (NEVER cropped) */}
                    <div
                      className="relative w-full overflow-hidden bg-slate-50/50 flex items-center justify-center rounded-[2px]"
                      style={{ aspectRatio: item.aspectRatio }}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1280px) 25vw, 300px"
                        className="object-contain object-center select-none"
                        priority={item.id <= 2}
                      />
                    </div>

                    {/* Script note if present */}
                    {item.caption ? (
                      <p className="font-heading text-[10px] xl:text-[11px] text-slate-700 text-center mt-2 font-medium tracking-tight select-none">
                        {item.caption}
                      </p>
                    ) : (
                      <div className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile / Tablet Layout (< lg): Controlled 2-column collage (No cropped images) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:hidden w-full pt-4">
              {looks.map((item, idx) => (
                <div
                  key={item.id}
                  className={`transform ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'} transition-transform duration-300`}
                >
                  {/* Physical printed photograph frame */}
                  <div className="bg-white rounded-[4px] p-2.5 sm:p-3 pb-4 sm:pb-5 border border-black/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col items-center">
                    <div
                      className="relative w-full overflow-hidden bg-slate-50/50 flex items-center justify-center rounded-[2px]"
                      style={{ aspectRatio: item.aspectRatio }}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 45vw, 250px"
                        className="object-contain object-center select-none"
                      />
                    </div>

                    {item.caption && (
                      <p className="font-heading text-[9px] sm:text-[10px] text-slate-700 text-center mt-2 font-medium tracking-tight">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
