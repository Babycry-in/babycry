import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface GiftBoxSectionProps {
  section?: HomepageSection;
}

export function GiftBoxSection({ section }: GiftBoxSectionProps) {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[48px] bg-gradient-to-r from-[#FAF6EE] via-[#EAF6F0] to-[#DCF0E7] p-8 sm:p-12 lg:p-16 border border-emerald-100 shadow-md overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-emerald-100 text-xs font-bold uppercase tracking-wider text-emerald-900 shadow-2xs">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>BABY SHOWERS & NEWBORNS</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {section?.title || 'A little love, packed with care.'}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {section?.description ||
                  'Beautifully curated newborn essentials for baby showers, newborn welcomes and special occasions.'}
              </p>

              <div>
                <Link
                  href={section?.cta_url || '/categories/gift-and-hampers'}
                  className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <span>{section?.cta_text || 'Explore Gift Boxes'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Deluxe Mint Hamper Visual */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[16/10] w-full rounded-[36px] overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80"
                  alt="Baby Cry Deluxe Gift Hampers"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />

                {/* Hand-drawn badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border border-emerald-100 text-right">
                  <p className="font-heading text-xs font-bold text-emerald-900">
                    For little
                  </p>
                  <p className="font-heading text-xs font-bold text-emerald-700">
                    new beginnings ♡
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
