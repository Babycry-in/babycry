'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Subcategory } from '@/types/database';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoryWithSubs extends Category {
  subcategories?: Subcategory[];
}

interface MegaMenuProps {
  categories: CategoryWithSubs[];
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({
  categories,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const [hoveredCatId, setHoveredCatId] = React.useState<string | null>(null);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-emerald-100 shadow-2xl py-8 px-6 lg:px-12 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top ${
        isOpen
          ? 'opacity-100 translate-y-0 scale-y-100 visible pointer-events-auto'
          : 'opacity-0 -translate-y-2 scale-y-95 invisible pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-stretch">
        
        {/* Categories columns (8 cols) — Uncropped original images */}
        <div className="col-span-8 grid grid-cols-3 gap-x-6 gap-y-4">
          {categories.slice(0, 12).map((cat) => {
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            const isHovered = hoveredCatId === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCatId(cat.id)}
                onMouseLeave={() => setHoveredCatId(null)}
                className="group p-2 rounded-2xl hover:bg-[#EBF7F1]/70 transition-all flex flex-col justify-start"
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5"
                >
                  {/* Category Thumbnail — object-contain so original image is never cropped */}
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white border border-emerald-100/70 p-1 shrink-0 flex items-center justify-center shadow-2xs group-hover:border-emerald-300 transition-colors">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        sizes="48px"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-emerald-400 text-xl select-none">🧸</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold text-sm text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {cat.short_description || 'Shop adorable little picks'}
                    </p>
                  </div>
                </Link>

                {/* Subcategories directly beneath category on hover */}
                {hasSubs && (
                  <div
                    className={`mt-2 pt-1.5 border-t border-emerald-200/50 flex flex-wrap gap-1 transition-all duration-200 ${
                      isHovered
                        ? 'opacity-100 max-h-36'
                        : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
                    }`}
                  >
                    {cat.subcategories!.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categories/${cat.slug}?sub=${sub.slug}`}
                        onClick={onClose}
                        className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/90 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Featured Box on right side (4 cols) — Background image from /images/navbar-bgimage.png */}
        <div className="col-span-4 relative rounded-3xl overflow-hidden border border-emerald-200/60 p-6 flex flex-col justify-between shadow-xs min-h-[320px]">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/navbar-bgimage.png"
              alt="Special Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover object-bottom"
              priority
            />
            {/* Subtle soft gradient fade so text is crisp & readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/95 via-[#FAF7F2]/65 to-transparent pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 max-w-[280px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-800 mb-3 shadow-2xs border border-emerald-100/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Special Collection</span>
            </div>
            <h4 className="font-heading text-xl font-bold text-slate-900 mb-2 leading-snug">
              Newborn Welcome Hampers &amp; Kits
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Hand-picked organic cotton essentials, soothing rattles &amp; hospital arrivals packed with utmost love.
            </p>
          </div>

          {/* Action CTA */}
          <div className="relative z-10 pt-4">
            <Link
              href="/categories/gift-and-hampers"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-white/95 hover:bg-white backdrop-blur-xs px-4 py-2.5 rounded-full border border-emerald-200/80 shadow-xs transition-all group hover:scale-[1.02]"
            >
              <span>Explore Gift Sets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
