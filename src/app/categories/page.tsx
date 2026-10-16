import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/data/db-service';
import { CategoriesList } from '@/components/category/CategoriesList';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop All Categories | Baby Cry.in',
  description: 'Explore all baby & kids categories: Apparels, Footwear, Accessories, Hospital Kits, Toys, Diapering & Gift Hampers.',
  alternates: {
    canonical: 'https://www.babycry.in/categories',
  },
  openGraph: {
    title: 'Shop All Categories | Baby Cry.in',
    description: 'Explore our complete collection of organic cotton wear, newborn kits, baby accessories, and gift hampers.',
    url: 'https://www.babycry.in/categories',
    type: 'website',
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories(true);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.babycry.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://www.babycry.in/categories',
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>EXPLORE OUR CURATION</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900">
            All Collections
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 sm:mt-3">
            Pure organic cotton, thoughtful hospital maternity kits, cozy pre-walkers, and handpicked baby gift hampers.
          </p>
        </div>

        {/* Categories Grid (Exactly 2 cards per row on mobile, 4 on desktop) */}
        <CategoriesList categories={categories} />

        {/* View All Products CTA Link */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-all active:scale-98 group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
