import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface SplitPromoSectionProps {
  sections?: HomepageSection[];
}

export function SplitPromoSection({ sections }: SplitPromoSectionProps) {
  const mealtimeSec = sections?.find((s) => s.section_key === 'mealtime');
  const tinyTeethSec = sections?.find((s) => s.section_key === 'tiny_teeth');

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Mealtime Made a Little Happier */}
          <div className="rounded-[40px] bg-gradient-to-br from-[#E4F5EC] to-white p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square w-full rounded-[30px] overflow-hidden shadow-md">
                <Image
                  src={
                    mealtimeSec?.image_url ||
                    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80'
                  }
                  alt="Mealtime made happier"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-slate-900 leading-snug">
                  {mealtimeSec?.title || 'Mealtime made a little happier.'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {mealtimeSec?.description ||
                    'Give your little one a comfortable space to enjoy every bite.'}
                </p>

                {/* Feature checklist */}
                <div className="space-y-2 pt-1">
                  {['Comfortable seating', 'Sturdy design', 'Easy to clean'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-medium text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={mealtimeSec?.cta_url || '/categories/feeding'}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs"
                  >
                    <span>{mealtimeSec?.cta_text || 'Explore Feeding'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tiny Teeth, Tiny Discoveries */}
          <div className="rounded-[40px] bg-gradient-to-br from-[#FAF5EE] to-[#EBF7F1] p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square w-full rounded-[30px] overflow-hidden shadow-md">
                <Image
                  src={
                    tinyTeethSec?.image_url ||
                    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=700&q=80'
                  }
                  alt="Tiny teeth discoveries"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-slate-900 leading-snug">
                  {tinyTeethSec?.title || 'Tiny teeth. Tiny discoveries.'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tinyTeethSec?.description ||
                    'A little extra comfort for those teething days. Soft, certified safe silicone and natural beechwood.'}
                </p>

                <div className="pt-4">
                  <Link
                    href={tinyTeethSec?.cta_url || '/categories/toys'}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs"
                  >
                    <span>{tinyTeethSec?.cta_text || 'Shop Baby Essentials'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
