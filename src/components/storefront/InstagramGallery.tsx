import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/SocialIcons';
import { HomepageSection } from '@/types/database';

interface InstagramGalleryProps {
  section?: HomepageSection;
  instagramHandle?: string;
}

export function InstagramGallery({
  section,
  instagramHandle = 'Baby_cry.in',
}: InstagramGalleryProps) {
  if (section && section.is_active === false) {
    return null;
  }

  const title = section?.title || `Little moments @${instagramHandle}`;
  const description =
    section?.description || 'Tag us in your cutest baby moments to get featured!';
  const ctaText = section?.cta_text || 'Follow Along';
  const ctaUrl = section?.cta_url || `https://instagram.com/${instagramHandle}`;

  const defaultImages = [
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&w=400&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&w=400&q=80',
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&w=400&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&w=400&q=80',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&w=400&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&w=400&q=80',
  ];

  const images: string[] =
    Array.isArray(section?.metadata?.images) && section.metadata.images.length > 0
      ? section.metadata.images
      : defaultImages;

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {description}
          </p>
        </div>

        {/* ── MOBILE: Single horizontal swipe row ── */}
        <div className="md:hidden relative">
          <div
            className="flex overflow-x-auto no-scrollbar gap-3 pb-2 touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {images.slice(0, 6).map((src, idx) => (
              <a
                key={idx}
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative shrink-0 w-[140px] h-[140px] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all bg-white"
              >
                <Image
                  src={src}
                  alt={`Baby Cry Instagram moment ${idx + 1}`}
                  fill
                  sizes="140px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <InstagramIcon className="w-5 h-5 drop-shadow-md" />
                </div>
              </a>
            ))}
          </div>

          {/* Swipe hint */}
          <p className="text-center text-[10px] text-slate-400 mt-2 select-none" aria-hidden="true">
            Swipe to see more →
          </p>
        </div>

        {/* ── DESKTOP: 6-column grid (unchanged) ── */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {images.slice(0, 6).map((src, idx) => (
              <a
                key={idx}
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all bg-white"
              >
                <Image
                  src={src}
                  alt={`Baby Cry Instagram moment ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <InstagramIcon className="w-6 h-6 drop-shadow-md" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Floating Pill */}
        <div className="flex justify-center mt-6">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-md inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
