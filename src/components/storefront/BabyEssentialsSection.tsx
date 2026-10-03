import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/database';
import { getEssentialCategories } from '@/lib/homepage-categories';
import { MobileCategoryRow } from './MobileCategoryRow';

// Small SVG cloud for background decoration
function CloudBg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="60"
        cy="52"
        rx="52"
        ry="22"
        fill="#B8DDD4"
        fillOpacity="0.55"
      />
      <ellipse
        cx="38"
        cy="42"
        rx="28"
        ry="22"
        fill="#B8DDD4"
        fillOpacity="0.55"
      />
      <ellipse
        cx="76"
        cy="40"
        rx="30"
        ry="24"
        fill="#B8DDD4"
        fillOpacity="0.55"
      />
      <ellipse
        cx="55"
        cy="34"
        rx="22"
        ry="20"
        fill="#B8DDD4"
        fillOpacity="0.55"
      />
    </svg>
  );
}

interface BabyEssentialsSectionProps {
  categories?: Category[];
}

export function BabyEssentialsSection({ categories = [] }: BabyEssentialsSectionProps) {
  const essentials = getEssentialCategories(categories);

  if (!essentials || essentials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-8 sm:py-10 !bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top row: label + heading left | View All right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-3">
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800/70 mb-2">
              BABY ESSENTIALS
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
              Made for everyday
              <br className="hidden sm:block" /> little moments.
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-900 hover:text-emerald-700 transition-colors group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Horizontal Auto-Scroll Marquee Track */}
        <MobileCategoryRow items={essentials} />

        {/* Desktop Items row — unchanged flex wrap on md+ */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {essentials.map((item) => (
            <Link
              key={item.id || item.slug}
              href={`/categories/${item.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Cloud platform */}
              <div
                className="relative flex items-center justify-center"
                style={{ width: 168, height: 174 }}
              >
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="168px"
                  className="object-contain group-hover:scale-105 group-hover:drop-shadow-md transition-all duration-300 pointer-events-none select-none"
                  aria-hidden
                />

                {/* Product image on top of cloud — object-contain so NO CROPPING */}
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-2">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="112px"
                    className="object-contain object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <span className="font-heading font-semibold text-slate-700 text-xs sm:text-sm mt-2.5 group-hover:text-emerald-800 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}