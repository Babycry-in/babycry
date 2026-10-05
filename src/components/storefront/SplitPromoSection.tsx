import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface SplitPromoSectionProps {
  sections?: HomepageSection[];
}

export function SplitPromoSection({ sections }: SplitPromoSectionProps) {
  const mealtimeSec = sections?.find(
    (s) => s.section_key === 'mealtime'
  );

  const tinyTeethSec = sections?.find(
    (s) => s.section_key === 'tiny_teeth'
  );

  // Only show cards that have an admin-uploaded image
  const mealtimeImage = mealtimeSec?.image_url && !mealtimeSec.image_url.includes('unsplash.com')
    ? mealtimeSec.image_url
    : null;
  const tinyTeethImage = tinyTeethSec?.image_url && !tinyTeethSec.image_url.includes('unsplash.com')
    ? tinyTeethSec.image_url
    : null;

  // Hide section entirely if neither card has an image
  if (!mealtimeImage && !tinyTeethImage) return null;

  return (
    <section className="py-8 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 items-stretch">

          {/* =========================
              MEALTIME CARD
          ========================== */}
          <div
            className="h-full overflow-hidden border border-emerald-100 bg-[#FAF5EE] rounded-[20px] lg:rounded-none"
            style={{
              borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '30px 30px 4px 30px' : undefined,
            }}
          >
            {/* Mobile: image LEFT, content RIGHT. Desktop: image TOP or grid */}
            <div className="flex flex-row lg:grid lg:grid-cols-[45%_55%] items-stretch h-full lg:min-h-[270px]">

              {/* IMAGE */}
              <div
                className="relative w-[42%] shrink-0 lg:w-auto aspect-square lg:aspect-auto lg:h-full lg:min-h-[270px] overflow-hidden rounded-l-[19px] lg:rounded-none"
                style={{
                  borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '0 42px 0 30px' : undefined,
                }}
              >
                {mealtimeImage && (
                  <Image
                    src={mealtimeImage}
                    alt={mealtimeSec?.title || 'Mealtime made happier'}
                    fill
                    sizes="(max-width: 1024px) 42vw, 420px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-between p-2.5 sm:p-5 lg:px-7 lg:py-6 flex-1 min-w-0">
                <div>
                  <h3 className="font-heading text-[10px] xs:text-xs sm:text-lg lg:text-[22px] font-bold text-slate-900 leading-snug lg:leading-tight line-clamp-3">
                    {mealtimeSec?.title || 'Mealtime made a little happier.'}
                  </h3>

                  <p className="mt-1 lg:mt-3 text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-relaxed line-clamp-3 lg:line-clamp-none hidden xs:block">
                    {mealtimeSec?.description || 'Give your little one a comfortable space to enjoy every bite.'}
                  </p>

                  {/* FEATURES — Desktop only */}
                  <div className="hidden lg:block mt-3 space-y-1.5">
                    {['Comfortable seating', 'Sturdy design', 'Easy to clean'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUTTON */}
                <div className="mt-2 sm:mt-4">
                  <Link
                    href={mealtimeSec?.cta_url || '/categories/feeding'}
                    className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-[9px] sm:text-xs lg:text-sm font-medium text-white transition-colors"
                  >
                    <span>{mealtimeSec?.cta_text || 'Explore'}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              TINY TEETH CARD
          ========================== */}
          <div
            className="h-full overflow-hidden border border-emerald-100 bg-[#FAF5EE] rounded-[20px] lg:rounded-none"
            style={{
              borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '30px 30px 4px 30px' : undefined,
            }}
          >
            {/* Mobile: image LEFT, content RIGHT. Desktop: image TOP or grid */}
            <div className="flex flex-row lg:grid lg:grid-cols-[45%_55%] items-stretch h-full lg:min-h-[270px]">

              {/* IMAGE */}
              <div
                className="relative w-[42%] shrink-0 lg:w-auto aspect-square lg:aspect-auto lg:h-full lg:min-h-[270px] overflow-hidden rounded-l-[19px] lg:rounded-none"
                style={{
                  borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '0 42px 0 30px' : undefined,
                }}
              >
                {tinyTeethImage && (
                  <Image
                    src={tinyTeethImage}
                    alt={tinyTeethSec?.title || 'Tiny teeth discoveries'}
                    fill
                    sizes="(max-width: 1024px) 42vw, 420px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-between p-2.5 sm:p-5 lg:px-7 lg:py-6 flex-1 min-w-0">
                <div>
                  <h3 className="font-heading text-[10px] xs:text-xs sm:text-lg lg:text-[22px] font-bold text-slate-900 leading-snug lg:leading-tight line-clamp-3">
                    {tinyTeethSec?.title || 'Tiny teeth. Tiny discoveries.'}
                  </h3>

                  <p className="mt-1 lg:mt-3 text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-relaxed line-clamp-3 lg:line-clamp-none hidden xs:block">
                    {tinyTeethSec?.description || 'A little extra comfort for those teething days.'}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-2 sm:mt-4">
                  <Link
                    href={tinyTeethSec?.cta_url || '/categories/toys'}
                    className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-[9px] sm:text-xs lg:text-sm font-medium text-white transition-colors"
                  >
                    <span>{tinyTeethSec?.cta_text || 'Shop'}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}