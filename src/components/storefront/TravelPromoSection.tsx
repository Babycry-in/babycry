import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/types/database';

interface TravelPromoSectionProps {
  section?: HomepageSection;
}

export function TravelPromoSection({ section }: TravelPromoSectionProps) {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF7F2] to-[#EBF7F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with Organic Cloud Curves */}
        <div className="relative rounded-[48px] bg-gradient-to-r from-[#D8EFE4] to-[#FAF7F2] p-8 sm:p-12 lg:p-16 border border-emerald-100 overflow-hidden shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual: Baby in stroller on adventure */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[16/10] w-full rounded-[36px] overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80"
                  alt="Baby stroller travel adventures"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 space-y-5">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {section?.title || 'Little adventures begin here.'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {section?.description ||
                  'Thoughtful essentials for everyday journeys with your little one. Lightweight strollers, travel bags, and car sunshades.'}
              </p>
              <div className="pt-2">
                <Link
                  href={section?.cta_url || '/categories/baby-gear'}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <span>{section?.cta_text || 'Explore Travel Essentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
