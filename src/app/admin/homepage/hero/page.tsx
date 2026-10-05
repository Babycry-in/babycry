import React from 'react';
import { getHeroSlides } from '@/lib/data/db-service';
import { HeroSlideEditor } from '@/components/admin/HeroSlideEditor';

export const revalidate = 0;

export default async function AdminHeroSettingsPage() {
  const slides = await getHeroSlides(false);
  const slide = slides[0] || {
    id: 'hero-1',
    eyebrow: 'LITTLE THINGS FOR',
    title: 'Brighter Little Days',
    description: 'Cute outfits, thoughtful essentials and little toys for your little one.',
    primary_cta_text: 'Shop the Collection',
    primary_cta_url: '/categories/apparels',
    secondary_cta_text: 'Explore New Arrivals',
    secondary_cta_url: '/categories',
    desktop_image: '/uploads/ChatGPT Image Oct 2, 2026, 05_55_15 PM-1790943937695-631678435.webp',
    is_active: true,
    sort_order: 1,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Hero Section Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your main storefront hero banner, title, lifestyle image and call-to-actions.
        </p>
      </div>

      <HeroSlideEditor initialSlide={slide} />
    </div>
  );
}
