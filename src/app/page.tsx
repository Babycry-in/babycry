import React from 'react';
import { 
  getHeroSlides, 
  getCategories, 
  getProducts, 
  getHomepageSections, 
  getBusinessSettings 
} from '@/lib/data/db-service';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CategoryCapsules } from '@/components/storefront/CategoryCapsules';
import { NewFavoritesSection } from '@/components/storefront/NewFavoritesSection';
import { EditorialSection } from '@/components/storefront/EditorialSection';
import { PolaroidGallery } from '@/components/storefront/PolaroidGallery';
import { BabyEssentialsSection } from '@/components/storefront/BabyEssentialsSection';
import { SplitPromoSection } from '@/components/storefront/SplitPromoSection';
import { TravelPromoSection } from '@/components/storefront/TravelPromoSection';
import { GiftBoxSection } from '@/components/storefront/GiftBoxSection';
import { UnboxingSection } from '@/components/storefront/UnboxingSection';
import { TrustPillars } from '@/components/storefront/TrustPillars';
import { InstagramGallery } from '@/components/storefront/InstagramGallery';

export const revalidate = 0; // Ensure fresh content on updates

export default async function HomePage() {
  const [heroSlides, categories, products, sections, settings] = await Promise.all([
    getHeroSlides(true),
    getCategories(true),
    getProducts({ onlyActive: true, isFeatured: true }),
    getHomepageSections(),
    getBusinessSettings(),
  ]);

  const activeHero = heroSlides[0] || {
    id: 'hero-default',
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

  const sweetestDetailsSec = sections.find((s) => s.section_key === 'sweetest_details');
  const looksSec = sections.find((s) => s.section_key === 'little_looks');
  const travelSec = sections.find((s) => s.section_key === 'travel');
  const giftSec = sections.find((s) => s.section_key === 'gift_box');
  const instagramSec = sections.find((s) => s.section_key === 'instagram');

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection slide={activeHero} />

      {/* 2. Shop the little world (Category capsules) */}
      <CategoryCapsules categories={categories} />

      {/* 3. New little favorites (Products with NEW badges & Wishlist) */}
      <NewFavoritesSection products={products} />

      {/* 4. Editorial Girlswear Section */}
      <EditorialSection section={sweetestDetailsSec} />

      {/* 5. Polaroid Gallery: Little looks worth saving */}
      <PolaroidGallery section={looksSec} />

      {/* 6. Baby Essentials: Made for everyday moments */}
      <BabyEssentialsSection />

      {/* 7. Split Feature: Mealtime & Tiny Teeth */}
      <SplitPromoSection sections={sections} />

      {/* 8. Travel: Little adventures begin here */}
      <TravelPromoSection section={travelSec} />

      {/* 9. Gift Boxes: A little love, packed with care */}
      <GiftBoxSection section={giftSec} />

      {/* 10. Packaging: Unbox the cuteness */}
      <UnboxingSection />

      {/* 11. Trust / Value Pillars */}
      <TrustPillars />

      {/* 12. Instagram Gallery: @Baby_cry.in */}
      <InstagramGallery section={instagramSec} instagramHandle={settings.instagram_handle} />
    </div>
  );
}
