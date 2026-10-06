import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface SplitPromoSectionProps {
  sections?: HomepageSection[];
}

interface PromoCardProps {
  section?: HomepageSection;
  image: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackCta: string;
  fallbackUrl: string;
  fallbackAlt: string;
  features?: string[];
  priority?: boolean;
  imageRight?: boolean; // mobile/tablet only: text left, image right
}

function PromoCard({
  section,
  image,
  fallbackTitle,
  fallbackDescription,
  fallbackCta,
  fallbackUrl,
  fallbackAlt,
  features,
  priority,
  imageRight = false,
}: PromoCardProps) {
  return (
    <div
      className="h-full overflow-hidden border border-emerald-100 bg-[#FAF5EE] rounded-[22px] shadow-[0_2px_10px_rgba(6,78,59,0.06)] lg:shadow-none lg:rounded-[30px_30px_4px_30px]"
    >
      {/* Mobile: image LEFT (default) or RIGHT (imageRight). Desktop: 45/55 grid (unchanged) */}
      <div className={`${imageRight ? 'flex-row-reverse' : 'flex-row'} flex lg:grid lg:grid-cols-[45%_55%] items-stretch h-full min-h-[168px] sm:min-h-[180px] lg:min-h-[270px]`}>

        {/* IMAGE */}
        <div
          className={`relative w-[40%] sm:w-[42%] shrink-0 lg:w-auto self-stretch overflow-hidden lg:rounded-[0_42px_0_30px] ${
            imageRight ? 'rounded-r-[21px]' : 'rounded-l-[21px]'
          }`}
        >
          {image && (
            <Image
              src={image}
              alt={section?.title || fallbackAlt}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 21vw, 420px"
              className="object-cover"
              priority={priority}
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between gap-3 px-3.5 py-4 sm:p-5 lg:px-7 lg:py-6 flex-1 min-w-0">
          <div>
            <h3 className="font-heading text-[16px] sm:text-base lg:text-[22px] font-bold text-slate-900 leading-[1.25] lg:leading-tight line-clamp-3">
              {section?.title || fallbackTitle}
            </h3>

            <p className="mt-1.5 lg:mt-3 text-[12.5px] sm:text-xs lg:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
              {section?.description || fallbackDescription}
            </p>

            {/* FEATURES — Desktop only */}
            {features && (
              <div className="hidden lg:block mt-3 space-y-1.5">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-950"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="lg:mt-4">
            <Link
              href={section?.cta_url || fallbackUrl}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.97] px-4 sm:px-5 py-2 sm:py-2.5 min-h-[36px] text-[13px] sm:text-xs lg:text-sm font-semibold text-white transition-all"
            >
              <span>{section?.cta_text || fallbackCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SplitPromoSection({ sections }: SplitPromoSectionProps) {
  const mealtimeSec = sections?.find((s) => s.section_key === 'mealtime');
  const tinyTeethSec = sections?.find((s) => s.section_key === 'tiny_teeth');

  // Only show cards that have an admin-uploaded image
  const mealtimeImage =
    mealtimeSec?.image_url && !mealtimeSec.image_url.includes('unsplash.com')
      ? mealtimeSec.image_url
      : null;
  const tinyTeethImage =
    tinyTeethSec?.image_url && !tinyTeethSec.image_url.includes('unsplash.com')
      ? tinyTeethSec.image_url
      : null;

  // Hide section entirely if neither card has an image
  if (!mealtimeImage && !tinyTeethImage) return null;

  return (
    <section className="py-5 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: stacked full-width cards. Tablet/Desktop: 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6 items-stretch">
          <PromoCard
            section={mealtimeSec}
            image={mealtimeImage}
            fallbackTitle="Mealtime made a little happier."
            fallbackDescription="Give your little one a comfortable space to enjoy every bite."
            fallbackCta="Explore"
            fallbackUrl="/categories/feeding"
            fallbackAlt="Mealtime made happier"
            features={['Comfortable seating', 'Sturdy design', 'Easy to clean']}
            priority
          />

          <PromoCard
            section={tinyTeethSec}
            image={tinyTeethImage}
            fallbackTitle="Tiny teeth. Tiny discoveries."
            fallbackDescription="A little extra comfort for those teething days."
            fallbackCta="Shop"
            fallbackUrl="/categories/toys"
            fallbackAlt="Tiny teeth discoveries"
            imageRight
          />
        </div>
      </div>
    </section>
  );
}