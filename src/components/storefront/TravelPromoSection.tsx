import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface TravelPromoSectionProps {
  section?: HomepageSection;
}

export function TravelPromoSection({ section }: TravelPromoSectionProps) {
  const sectionLabel = section?.subtitle || 'BABY GEAR';
  const rawTitle = section?.title || 'Gear for little adventures.';
  const description = section?.description || 'Comfortable essentials made for growing, moving and exploring.';
  const ctaText = section?.cta_text || 'Explore Travel Essentials';
  const ctaUrl = section?.cta_url || '/categories/baby-gear';

  // Admin-managed image — only show section if image is set
  const imageUrl =
    section?.image_url && !section.image_url.includes('unsplash.com')
      ? section.image_url
      : null;

  if (!imageUrl) return null;


  return (
    <section className="py-6 sm:py-10 lg:py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            FULL BACKGROUND IMAGE BANNER
        ====================================================== */}
        <div
          className="
            relative
            w-full
            overflow-hidden
            rounded-[24px]
            sm:rounded-[36px]
            border
            border-emerald-100
            shadow-xs

            min-h-[220px]
            sm:min-h-[320px]
            md:min-h-[390px]
            lg:min-h-[420px]
          "
        >

          {/* ===================================================
              ADMIN IMAGE — FULL BACKGROUND
          ==================================================== */}
          <Image
            src={imageUrl}
            alt={rawTitle}
            fill
            priority
            sizes="100vw"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
            "
          />


          {/* ===================================================
              RIGHT-SIDE READABILITY GRADIENT
              Keeps image visible while making text readable without solid box
          ==================================================== */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
              bg-gradient-to-l
              from-[#FAF7F2]/80
              via-[#FAF7F2]/30
              to-transparent
              sm:from-transparent
            "
          />


          {/* ===================================================
              TEXT + BUTTON — RIGHT SIDE
          ==================================================== */}
          <div
            className="
              relative
              z-10

              min-h-[220px]
              sm:min-h-[320px]
              md:min-h-[390px]
              lg:min-h-[420px]

              flex
              items-center

              justify-end

              px-3
              xs:px-5
              sm:px-10
              md:px-14
              lg:px-16
              xl:px-20

              py-4
              sm:py-10
            "
          >

            <div
              className="
                w-full
                max-w-[54%]
                xs:max-w-[52%]
                sm:max-w-[480px]
                lg:max-w-[500px]

                flex
                flex-col
                items-start

                mr-0
                lg:px-3
                xl:px-30
              "
            >

              {/* LABEL */}
              <span
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  tracking-[0.2em]
                  text-emerald-900
                  uppercase
                "
              >
                {sectionLabel}
              </span>


              {/* HEADING */}
              <h2
                className="
                  mt-1
                  sm:mt-2.5

                  font-heading
                  text-base
                  xs:text-lg
                  sm:text-3xl
                  md:text-4xl
                  lg:text-[42px]

                  font-bold
                  text-slate-900

                  leading-[1.12]
                  sm:leading-[1.1]
                  tracking-tight
                "
              >
                {rawTitle}
              </h2>


              {/* DESCRIPTION */}
              <p
                className="
                  mt-1.5
                  sm:mt-4

                  text-[10px]
                  xs:text-[11px]
                  sm:text-sm
                  lg:text-[15px]

                  text-slate-700
                  font-medium

                  leading-relaxed
                  line-clamp-3
                  lg:line-clamp-none

                  max-w-[440px]
                "
              >
                {description}
              </p>


              {/* BUTTON */}
              <div className="mt-3 sm:mt-6">
                <Link
                  href={ctaUrl}
                  className="
                    group

                    inline-flex
                    items-center
                    gap-2
                    sm:gap-2.5

                    bg-[#A3D2B8]
                    hover:bg-[#8ec2a6]

                    active:scale-95

                    text-slate-800
                    font-medium

                    text-[11px]
                    sm:text-sm

                    px-3.5
                    sm:px-6

                    py-1.5
                    sm:py-3

                    rounded-full

                    shadow-xs
                    hover:shadow

                    transition-all
                  "
                >
                  <span>{ctaText}</span>

                  <span
                    className="
                      w-5
                      h-5

                      rounded-full

                      bg-slate-800
                      text-white

                      flex
                      items-center
                      justify-center

                      group-hover:translate-x-0.5
                      transition-transform
                    "
                  >
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}